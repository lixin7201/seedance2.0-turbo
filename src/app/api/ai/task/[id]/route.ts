import { respData, respErr } from '@/shared/lib/resp';
import { findAITaskById, softDeleteAITask } from '@/shared/models/ai_task';
import { getUserInfo } from '@/shared/models/user';
import { getStorageService } from '@/shared/services/storage';

export async function DELETE(
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

    // Find the task to get result assets for R2 cleanup
    const task = await findAITaskById(id);
    if (!task || task.userId !== user.id) {
      return respErr('task not found or no permission');
    }

    // Clean up R2 objects (best-effort, don't block delete)
    if (task.resultAssets) {
      try {
        const storage = await getStorageService();
        const assets = JSON.parse(task.resultAssets);
        const assetList = Array.isArray(assets) ? assets : [assets];
        for (const asset of assetList) {
          if (asset.key || asset.videoKey) {
            await storage.deleteFile({ key: asset.key || asset.videoKey });
          }
          if (asset.posterKey) {
            await storage.deleteFile({ key: asset.posterKey });
          }
        }
      } catch (e) {
        console.error('Failed to clean up R2 objects during delete:', e);
        // Continue with soft-delete even if R2 cleanup fails
      }
    }

    const result = await softDeleteAITask(id, user.id);
    if (!result) {
      return respErr('task not found or no permission');
    }

    return respData({ success: true });
  } catch (e: any) {
    console.log('delete ai task failed', e);
    return respErr(e.message);
  }
}
