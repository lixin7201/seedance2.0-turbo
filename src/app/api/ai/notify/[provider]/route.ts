import { AITaskStatus } from '@/extensions/ai';
import { respData, respErr } from '@/shared/lib/resp';
import {
  findAITaskByProviderTaskId,
  updateAITaskById,
  UpdateAITask,
} from '@/shared/models/ai_task';
import { createNotification, NotificationType } from '@/shared/models/notification';
import { getStorageService } from '@/shared/services/storage';

/**
 * Webhook endpoint for AI providers to notify task completion
 * POST /api/ai/notify/[provider]
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const { provider } = await params;
    const body = await request.json();

    console.log(`[AI Webhook] Provider: ${provider}, body:`, JSON.stringify(body).slice(0, 500));

    // Extract task ID from webhook payload (provider-specific)
    let providerTaskId: string | undefined;
    let taskStatus: AITaskStatus = AITaskStatus.PROCESSING;
    let videoUrl: string | undefined;
    let thumbnailUrl: string | undefined;
    let errorMessage: string | undefined;
    let progress: number | undefined;

    if (provider === 'evolink') {
      // Evolink webhook format
      providerTaskId = body.task_id || body.taskId;
      const status = body.status;
      if (status === 'succeed' || status === 'success') {
        taskStatus = AITaskStatus.SUCCESS;
        videoUrl = body.video_url || body.output?.video_url;
        thumbnailUrl = body.cover_url || body.output?.cover_url;
      } else if (status === 'failed') {
        taskStatus = AITaskStatus.FAILED;
        errorMessage = body.error || body.message;
      } else {
        taskStatus = AITaskStatus.PROCESSING;
        progress = body.progress;
      }
    } else if (provider === 'fal') {
      // Fal webhook format
      providerTaskId = body.request_id;
      if (body.status === 'OK' || body.status === 'COMPLETED') {
        taskStatus = AITaskStatus.SUCCESS;
        videoUrl = body.payload?.video?.url;
      } else if (body.status === 'ERROR') {
        taskStatus = AITaskStatus.FAILED;
        errorMessage = body.error;
      }
    }

    if (!providerTaskId) {
      return respErr('missing task id in webhook payload');
    }

    // Find task by provider task ID
    const task = await findAITaskByProviderTaskId(providerTaskId);

    if (!task) {
      console.log(`[AI Webhook] Task not found for provider task ID: ${providerTaskId}`);
      return respData({ received: true, message: 'task not found' });
    }

    // Skip if already in terminal state
    if (
      task.status === AITaskStatus.SUCCESS ||
      task.status === AITaskStatus.FAILED
    ) {
      return respData({ received: true, message: 'already completed' });
    }

    const taskInfoObj: any = {
      status: taskStatus,
    };
    if (progress !== undefined) {
      taskInfoObj.progress = progress;
    }
    if (taskStatus === AITaskStatus.SUCCESS && videoUrl) {
      taskInfoObj.videos = [
        {
          videoUrl,
          thumbnailUrl,
        },
      ];
    }
    if (taskStatus === AITaskStatus.FAILED) {
      taskInfoObj.errorMessage =
        errorMessage || 'Your generation task has failed.';
      taskInfoObj.videos = [];
    }

    const updateData: UpdateAITask = {
      status: taskStatus,
      creditId: task.creditId,
      progress:
        taskStatus === AITaskStatus.SUCCESS ? 100 : (progress ?? undefined),
      taskInfo: JSON.stringify(taskInfoObj),
      taskResult: JSON.stringify(body),
    };

    // On success: save to R2 and set expiration
    if (taskStatus === AITaskStatus.SUCCESS && videoUrl) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      updateData.expiresAt = expiresAt;

      try {
        const storage = await getStorageService();
        const videoKey = `videos/${task.userId}/${task.id}/0.mp4`;
        const uploadResult = await storage.downloadAndUpload({
          url: videoUrl,
          key: videoKey,
          contentType: 'video/mp4',
        });

        if (!uploadResult.success) {
          throw new Error(`R2 video upload failed: ${uploadResult.error}`);
        }

        let posterKey: string | undefined;
        if (thumbnailUrl) {
          const pKey = `posters/${task.userId}/${task.id}/0.jpg`;
          const posterUpload = await storage.downloadAndUpload({
            url: thumbnailUrl,
            key: pKey,
            contentType: 'image/jpeg',
          });
          if (posterUpload.success) {
            posterKey = pKey;
          }
        }

        updateData.resultAssets = JSON.stringify([
          {
            type: 'video',
            url: uploadResult.url || videoUrl,
            key: videoKey,
            posterKey,
          },
        ]);

        // Update taskInfo.videos with persistent R2 URL
        if (taskInfoObj.videos && taskInfoObj.videos[0]) {
          taskInfoObj.videos[0].videoUrl = uploadResult.url || videoUrl;
          if (posterKey) {
            taskInfoObj.videos[0].storageKey = videoKey;
            taskInfoObj.videos[0].posterKey = posterKey;
          }
        }
        updateData.taskInfo = JSON.stringify(taskInfoObj);
      } catch (e) {
        console.error('[AI Webhook] R2 upload failed, marking task as failed:', e);
        // PRD §17.3: R2 upload failure = task failure
        updateData.status = AITaskStatus.FAILED;
        updateData.progress = undefined;
        updateData.expiresAt = undefined;
        errorMessage =
          errorMessage ||
          'Video upload to storage failed. Credits have been refunded.';
        taskInfoObj.errorMessage = errorMessage;
        taskInfoObj.videos = [];
        updateData.taskInfo = JSON.stringify(taskInfoObj);
      }
    }

    // Create notifications based on FINAL status (after R2 upload attempt)
    if (updateData.status === AITaskStatus.SUCCESS) {
      await createNotification({
        userId: task.userId,
        type: NotificationType.TASK_SUCCESS,
        title: 'Video generation completed',
        content: `Your ${task.mediaType} generation task has completed successfully.`,
        taskId: task.id,
      });
    }

    if (updateData.status === AITaskStatus.FAILED) {
      await createNotification({
        userId: task.userId,
        type: NotificationType.TASK_FAILED,
        title: 'Video generation failed',
        content:
          errorMessage ||
          'Your generation task has failed. Credits have been refunded.',
        taskId: task.id,
      });
    }

    // Update the task
    await updateAITaskById(task.id, updateData);

    return respData({ received: true });
  } catch (e: any) {
    console.error('[AI Webhook] Error:', e);
    return respErr(e.message);
  }
}
