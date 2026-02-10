import { AITaskStatus } from '@/extensions/ai';
import { respData, respErr } from '@/shared/lib/resp';
import {
  findAITaskById,
  UpdateAITask,
  updateAITaskById,
} from '@/shared/models/ai_task';
import { getUserInfo } from '@/shared/models/user';
import { getAIService } from '@/shared/services/ai';
import { createNotification, NotificationType } from '@/shared/models/notification';
import { getStorageService } from '@/shared/services/storage';

export async function POST(req: Request) {
  try {
    const { taskId } = await req.json();
    if (!taskId) {
      return respErr('invalid params');
    }

    const user = await getUserInfo();
    if (!user) {
      return respErr('no auth, please sign in');
    }

    const task = await findAITaskById(taskId);
    if (!task || !task.taskId) {
      return respErr('task not found');
    }

    if (task.userId !== user.id) {
      return respErr('no permission');
    }

    const aiService = await getAIService();
    const aiProvider = aiService.getProvider(task.provider);
    if (!aiProvider) {
      return respErr('invalid ai provider');
    }

    // Resolve provider specific model ID
    // Resolve provider specific model ID
    let providerModelId = task.model;
    
    // 1. Try to use snapshot if available
    if (task.providerModelIdSnapshot) {
      providerModelId = task.providerModelIdSnapshot;
    } else if (task.model) {
      // 2. Fallback to current config (legacy behavior)
      const { getModelConfigById, getModelProviderId } = await import('@/shared/models/ai_model_config');
      const modelConfig = await getModelConfigById(task.model);
      if (modelConfig) {
        // Resolve using the provider record in the task
        providerModelId = getModelProviderId(modelConfig, task.provider);
      }
    }

    const result = await aiProvider?.query?.({
      taskId: task.taskId,
      mediaType: task.mediaType,
      model: providerModelId, // Use provider model ID
      scene: task.scene,
    });

    if (!result?.taskStatus) {
      return respErr('query ai task failed');
    }

    const previousStatus = task.status;

    const taskInfoObj: any = result.taskInfo ? { ...result.taskInfo } : {};

    // update ai task
    const updateData: UpdateAITask = {
      status: result.taskStatus,
      taskInfo: result.taskInfo ? JSON.stringify(result.taskInfo) : null,
      taskResult: result.taskResult ? JSON.stringify(result.taskResult) : null,
      creditId: task.creditId, // credit consumption record id
      progress: result.progress ?? result.taskInfo?.progress ?? undefined,
    };

    if (result.taskStatus === AITaskStatus.FAILED && !taskInfoObj.errorMessage) {
      taskInfoObj.errorMessage =
        result.taskInfo?.errorMessage || 'Your generation task has failed.';
      updateData.taskInfo = JSON.stringify(taskInfoObj);
    }

    // On success: save video to R2 and set expiration
    if (
      result.taskStatus === AITaskStatus.SUCCESS &&
      previousStatus !== AITaskStatus.SUCCESS
    ) {
      updateData.progress = 100;
      // Set 30-day expiration
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      updateData.expiresAt = expiresAt;

      // Save video to R2 (PRD §17.3: R2 upload failure = task failure)
      const videos = result.taskInfo?.videos;
      if (videos && videos.length > 0) {
        try {
          const storage = await getStorageService();
          const resultAssets: any[] = [];

          for (let i = 0; i < videos.length; i++) {
            const video = videos[i];
            const videoUrl = video.videoUrl;
            if (!videoUrl) continue;

            const videoKey = `videos/${task.userId}/${task.id}/${i}.mp4`;
            const uploadResult = await storage.downloadAndUpload({
              url: videoUrl,
              key: videoKey,
              contentType: 'video/mp4',
            });

            if (!uploadResult.success) {
              throw new Error(`R2 video upload failed: ${uploadResult.error}`);
            }

            let posterKey: string | undefined;
            if (video.thumbnailUrl) {
              const pKey = `posters/${task.userId}/${task.id}/${i}.jpg`;
              const posterUpload = await storage.downloadAndUpload({
                url: video.thumbnailUrl,
                key: pKey,
                contentType: 'image/jpeg',
              });
              if (posterUpload.success) {
                posterKey = pKey;
              }
            }

            resultAssets.push({
              type: 'video',
              url: uploadResult.url || videoUrl,
              key: videoKey,
              posterKey,
            });

            // Update taskInfo.videos with persistent R2 URL
            if (taskInfoObj.videos && taskInfoObj.videos[i]) {
              taskInfoObj.videos[i].videoUrl = uploadResult.url || videoUrl;
              if (posterKey) {
                taskInfoObj.videos[i].storageKey = videoKey;
                taskInfoObj.videos[i].posterKey = posterKey;
              }
            }
          }

          if (resultAssets.length > 0) {
            updateData.resultAssets = JSON.stringify(resultAssets);
            updateData.taskInfo = JSON.stringify(taskInfoObj);
          }
        } catch (e) {
          console.error('Failed to save video to R2, marking task as failed:', e);
          // PRD §17.3: R2 upload failure = task failure
          updateData.status = AITaskStatus.FAILED;
          updateData.progress = undefined;
          updateData.expiresAt = undefined;
          taskInfoObj.errorMessage =
            taskInfoObj.errorMessage || 'Video upload to storage failed.';
          taskInfoObj.videos = [];
        }
      }
    }

    // Create notifications based on FINAL status (after R2 upload attempt)
    if (
      updateData.status === AITaskStatus.SUCCESS &&
      previousStatus !== AITaskStatus.SUCCESS
    ) {
      await createNotification({
        userId: task.userId,
        type: NotificationType.TASK_SUCCESS,
        title: 'Video generation completed',
        content: `Your ${task.mediaType} generation task has completed successfully.`,
        taskId: task.id,
      });
    }

    if (
      updateData.status === AITaskStatus.FAILED &&
      previousStatus !== AITaskStatus.FAILED
    ) {
      if (!taskInfoObj.errorMessage) {
        taskInfoObj.errorMessage =
          result.taskInfo?.errorMessage || 'Your generation task has failed.';
      }
      updateData.taskInfo = JSON.stringify(taskInfoObj);
      await createNotification({
        userId: task.userId,
        type: NotificationType.TASK_FAILED,
        title: 'Video generation failed',
        content:
          taskInfoObj.errorMessage ||
          'Your generation task has failed. Credits have been refunded.',
        taskId: task.id,
      });
    }

    if (updateData.status === AITaskStatus.FAILED && taskInfoObj.errorMessage) {
      updateData.taskInfo = JSON.stringify(taskInfoObj);
    }

    // Always save when status, taskInfo, or progress changes
    if (
      updateData.taskInfo !== task.taskInfo ||
      updateData.status !== task.status ||
      (updateData.progress !== undefined && updateData.progress !== task.progress)
    ) {
      await updateAITaskById(task.id, updateData);
    }

    task.status = updateData.status || '';
    task.taskInfo = updateData.taskInfo || null;
    task.taskResult = updateData.taskResult || null;
    task.progress = updateData.progress ?? task.progress;
    task.resultAssets = updateData.resultAssets ?? task.resultAssets;

    return respData(task);
  } catch (e: any) {
    console.log('ai query failed', e);
    return respErr(e.message);
  }
}
