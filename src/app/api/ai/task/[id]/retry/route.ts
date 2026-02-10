import { envConfigs } from '@/config';
import { AITaskStatus } from '@/extensions/ai';
import { getUuid } from '@/shared/lib/hash';
import { respData, respErr } from '@/shared/lib/resp';
import { createAITask, findAITaskById, getActiveAITasksCount, NewAITask } from '@/shared/models/ai_task';
import { getModelConfigById, getModelCreditsCost, getModelProviderId } from '@/shared/models/ai_model_config';
import { getRemainingCredits } from '@/shared/models/credit';
import { getCurrentSubscription, SubscriptionStatus } from '@/shared/models/subscription';
import { getUserInfo } from '@/shared/models/user';
import { getAIService } from '@/shared/services/ai';

/**
 * Retry a failed AI task
 * POST /api/ai/task/[id]/retry
 * Creates a new task with the same params, deducts credits again (PRD §8.3)
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return respErr('invalid params');
    }

    const user = await getUserInfo();
    if (!user) {
      return respErr('no auth, please sign in');
    }

    // Find original task
    const originalTask = await findAITaskById(id);
    if (!originalTask || originalTask.userId !== user.id) {
      return respErr('task not found or no permission');
    }

    if (originalTask.status !== AITaskStatus.FAILED) {
      return respErr('only failed tasks can be retried');
    }

    // Check concurrency limits
    const activeTasksCount = await getActiveAITasksCount(user.id);
    const subscription = await getCurrentSubscription(user.id);
    const isPaid = subscription && subscription.status === SubscriptionStatus.ACTIVE;
    const maxConcurrent = isPaid ? 3 : 1;
    if (activeTasksCount >= maxConcurrent) {
      return respErr(
        `concurrent task limit reached (${maxConcurrent}). Please wait for current tasks to complete.`
      );
    }

    // Re-calculate credits cost from model config
    let costCredits = originalTask.costCredits;
    if (originalTask.model && originalTask.scene) {
      try {
        costCredits = await getModelCreditsCost(originalTask.model, originalTask.scene);
      } catch {
        // fallback to original cost
      }
    }

    // Check credits
    const remainingCredits = await getRemainingCredits(user.id);
    if (remainingCredits < costCredits) {
      return respErr('insufficient credits');
    }

    // Resolve provider and model
    const aiService = await getAIService();
    let provider = originalTask.provider;
    let providerModelId = originalTask.model;

    // Try to resolve from model config for latest provider mapping
    const modelConfig = await getModelConfigById(originalTask.model);
    if (modelConfig) {
      provider = modelConfig.currentProvider;
      providerModelId = getModelProviderId(modelConfig, provider);
    }

    const aiProvider = aiService.getProvider(provider);
    if (!aiProvider) {
      return respErr('invalid ai provider');
    }

    const callbackUrl = `${envConfigs.app_url}/api/ai/notify/${provider}`;

    const options = originalTask.options ? JSON.parse(originalTask.options) : {};

    const generateParams: any = {
      mediaType: originalTask.mediaType,
      model: providerModelId,
      prompt: originalTask.prompt,
      callbackUrl,
      options,
    };

    // Generate content
    const result = await aiProvider.generate({ params: generateParams });
    if (!result?.taskId) {
      return respErr('ai generate failed');
    }

    // Create new task
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const newAITask: NewAITask = {
      id: getUuid(),
      userId: user.id,
      mediaType: originalTask.mediaType,
      provider,
      model: originalTask.model,
      prompt: originalTask.prompt,
      scene: originalTask.scene,
      options: originalTask.options,
      status: result.taskStatus,
      costCredits,
      taskId: result.taskId,
      taskInfo: result.taskInfo ? JSON.stringify(result.taskInfo) : null,
      taskResult: result.taskResult ? JSON.stringify(result.taskResult) : null,
      providerModelIdSnapshot: providerModelId,
      expiresAt,
    };
    await createAITask(newAITask);

    return respData(newAITask);
  } catch (e: any) {
    console.log('retry ai task failed', e);
    return respErr(e.message);
  }
}
