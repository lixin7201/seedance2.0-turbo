import { respData, respErr } from '@/shared/lib/resp';
import { 
  getAllModelConfigs, 
  updateModelConfigById 
} from '@/shared/models/ai_model_config';
import { getUserInfo } from '@/shared/models/user';

/**
 * GET /api/admin/model-config
 * Get all model configurations (requires login)
 */
export async function GET() {
  try {
    const user = await getUserInfo();
    if (!user) {
      return respErr('Unauthorized');
    }

    // TODO: Add proper admin role check when needed
    // For now, any logged-in user can view model configs

    const models = await getAllModelConfigs();
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

