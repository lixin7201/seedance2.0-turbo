import { envConfigs } from '@/config';
import { AIMediaType } from '@/extensions/ai';
import { getUuid } from '@/shared/lib/hash';
import { respData, respErr } from '@/shared/lib/resp';
import { createAITask, NewAITask } from '@/shared/models/ai_task';
import { getModelConfigById, getModelCreditsCost, getModelProviderId } from '@/shared/models/ai_model_config';
import { getRemainingCredits } from '@/shared/models/credit';
import { getUserInfo } from '@/shared/models/user';
import { getAIService } from '@/shared/services/ai';

export async function POST(request: Request) {
  try {
    // Support both old format (with provider) and new format (without provider)
    let { provider, mediaType, model, prompt, options, scene, resolution, duration } =
      await request.json();

    if (!mediaType || !model) {
      throw new Error('invalid params: mediaType and model are required');
    }

    if (!prompt && !options) {
      throw new Error('prompt or options is required');
    }

    const aiService = await getAIService();

    // check generate type
    if (!aiService.getMediaTypes().includes(mediaType)) {
      throw new Error('invalid mediaType');
    }

    // If provider not specified, resolve from model config (new flow)
    let providerModelId = model;
    if (!provider) {
      const modelConfig = await getModelConfigById(model);
      if (!modelConfig) {
        throw new Error(`model not found: ${model}`);
      }
      if (!modelConfig.enabled) {
        throw new Error(`model is disabled: ${model}`);
      }
      // Check if the model supports the requested scene
      if (!modelConfig.supportedModes.includes(scene)) {
        throw new Error(`model ${model} does not support ${scene}`);
      }
      provider = modelConfig.currentProvider;
      providerModelId = getModelProviderId(modelConfig, provider);
    }

    // check ai provider
    const aiProvider = aiService.getProvider(provider);
    if (!aiProvider) {
      throw new Error('invalid provider');
    }

    // get current user
    const user = await getUserInfo();
    if (!user) {
      throw new Error('no auth, please sign in');
    }

    // Get cost credits from model config or use defaults
    let costCredits = 2;

    if (mediaType === AIMediaType.IMAGE) {
      // generate image
      if (scene === 'image-to-image') {
        costCredits = 4;
      } else if (scene === 'text-to-image') {
        costCredits = 2;
      } else {
        throw new Error('invalid scene');
      }
    } else if (mediaType === AIMediaType.VIDEO) {
      // Get credits cost from model config
      costCredits = await getModelCreditsCost(model, scene);
    } else if (mediaType === AIMediaType.MUSIC) {
      // generate music
      costCredits = 10;
      scene = 'text-to-music';
    } else {
      throw new Error('invalid mediaType');
    }

    // check credits
    const remainingCredits = await getRemainingCredits(user.id);
    if (remainingCredits < costCredits) {
      throw new Error('insufficient credits');
    }

    const callbackUrl = `${envConfigs.app_url}/api/ai/notify/${provider}`;

    // Build options with resolution and duration if provided
    const finalOptions = {
      ...options,
      ...(resolution && { resolution }),
      ...(duration && { duration }),
    };

    const params: any = {
      mediaType,
      model: providerModelId, // Use the provider-specific model ID
      prompt,
      callbackUrl,
      options: finalOptions,
    };

    // generate content
    const result = await aiProvider.generate({ params });
    if (!result?.taskId) {
      throw new Error(
        `ai generate failed, mediaType: ${mediaType}, provider: ${provider}, model: ${model}`
      );
    }

    // create ai task
    const newAITask: NewAITask = {
      id: getUuid(),
      userId: user.id,
      mediaType,
      provider,
      model,
      prompt,
      scene,
      options: finalOptions ? JSON.stringify(finalOptions) : null,
      status: result.taskStatus,
      costCredits,
      taskId: result.taskId,
      taskInfo: result.taskInfo ? JSON.stringify(result.taskInfo) : null,
      taskResult: result.taskResult ? JSON.stringify(result.taskResult) : null,
      providerModelIdSnapshot: providerModelId, // Save the actual provider model ID used
    };
    await createAITask(newAITask);

    return respData(newAITask);
  } catch (e: any) {
    console.log('generate failed', e);
    return respErr(e.message);
  }
}
