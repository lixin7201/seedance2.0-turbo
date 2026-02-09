import { getAllEnabledModelConfigs } from '@/shared/models/ai_model_config';
import { respData, respErr } from '@/shared/lib/resp';

export async function GET() {
  try {
    const models = await getAllEnabledModelConfigs();
    return respData(models);
  } catch (e: any) {
    console.error('Failed to get model configs:', e);
    return respErr(e.message);
  }
}
