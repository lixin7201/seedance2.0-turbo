import { respData, respErr } from '@/shared/lib/resp';
import { 
  getAllModelConfigs, 
  updateModelConfigById,
  getModelConfigById
} from '@/shared/models/ai_model_config';
import { getUserInfo } from '@/shared/models/user';

/**
 * GET /api/admin/model-config
 * Get all model configurations (requires login)
 */
export async function GET(request: Request) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return respErr('Unauthorized');
    }

    // TODO: Add proper admin role check when needed
    // For now, any logged-in user can view model configs

    // Default: only show verified models. Pass ?showAll=true to see all.
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('showAll') === 'true';

    const models = await getAllModelConfigs(showAll);
    return respData(models);
  } catch (e: any) {
    console.error('Failed to get model configs:', e);
    return respErr(e.message);
  }
}

/**
 * PUT /api/admin/model-config
 * Update model configuration (requires login)
 */
  export async function PUT(request: Request) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return respErr('Unauthorized');
    }

    // TODO: Add proper admin role check when needed

    const { id, ...updateData } = await request.json();

    if (!id) {
      return respErr('Model ID is required');
    }

    // 1. Get existing config to validate changes
    const existingConfig = await getModelConfigById(id);
    if (!existingConfig) {
      return respErr('Model not found');
    }

    // 2. Determine target state
    const targetProvider = updateData.currentProvider || existingConfig.currentProvider;
    const targetMap = updateData.providerModelMap || existingConfig.providerModelMap || {};
    // Use fallback if not in map
    const targetModelId = targetMap[targetProvider] || (targetProvider === existingConfig.currentProvider ? existingConfig.providerModelId : '');
    
    // 3. Validate Provider API Key
    // Only validate if provider changed or enabled status changed to true (or is already true)
    // But requirement says "Switching currentProvider must validate".
    if (updateData.currentProvider && updateData.currentProvider !== existingConfig.currentProvider) {
      const { getAllConfigs } = await import('@/shared/models/config');
      const configs = await getAllConfigs();
      
      let apiKey = '';
      switch (targetProvider) {
        case 'fal':
          apiKey = configs['fal_api_key'] || '';
          break;
        case 'replicate':
          apiKey = configs['replicate_api_token'] || '';
          break;
        case 'evolink':
          apiKey = configs['evolink_api_key'] || '';
          break;
        case 'kie':
          apiKey = configs['kie_api_key'] || '';
          break;
        case 'gemini':
          apiKey = configs['gemini_api_key'] || '';
          break;
        default:
          // Unknown provider
          apiKey = 'unknown'; // Bypass check for unknown providers
          break;
      }

      // If we know the provider key name and it's missing (and it's not unknown)
      if (apiKey === '') {
        return respErr(`Provider ${targetProvider} is not configured with API Key`);
      }

      // 4. Validate Model Mapping
      if (!targetModelId && targetProvider !== existingConfig.currentProvider) {
         // If switching to a new provider, and no mapping exists (and not falling back to legacy ID correctly), reject.
         // Actually, if distinct, we need a mapping.
         // If targetProvider != existingConfig.currentProvider, then legacy `providerModelId` (which belongs to old provider) is invalid for new provider UNLESS explicitly set? 
         // Wait, `providerModelId` is just a string. 
         // If we switch provider, we should ensure we have a valid model ID for that provider.
         // `targetModelId` logic above tries to find it.
         return respErr(`Model ${id} does not have a configured Model ID for platform ${targetProvider}`);
      }
    }

    // Serialize JSON fields if provided as objects
    const serializedData: any = { ...updateData };
    if (updateData.supportedModes && Array.isArray(updateData.supportedModes)) {
      serializedData.supportedModes = JSON.stringify(updateData.supportedModes);
    }
    if (updateData.parameters && typeof updateData.parameters === 'object') {
      serializedData.parameters = JSON.stringify(updateData.parameters);
    }
    if (updateData.creditsCost && typeof updateData.creditsCost === 'object') {
      serializedData.creditsCost = JSON.stringify(updateData.creditsCost);
    }
    if (updateData.tags && Array.isArray(updateData.tags)) {
      serializedData.tags = JSON.stringify(updateData.tags);
    }
    if (updateData.providerModelMap && typeof updateData.providerModelMap === 'object') {
      serializedData.providerModelMap = JSON.stringify(updateData.providerModelMap);
    }

    const updated = await updateModelConfigById(id, serializedData);

    if (!updated) {
      return respErr('Model not found');
    }

    return respData(updated);
  } catch (e: any) {
    console.error('Failed to update model config:', e);
    return respErr(e.message);
  }
}

