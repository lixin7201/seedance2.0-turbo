import { AITaskStatus } from '@/extensions/ai';
import { respData, respErr } from '@/shared/lib/resp';
import { getStorageService } from '@/shared/services/storage';
import { db } from '@/core/db';
import { aiTask } from '@/config/db/schema';
import { and, eq, lt } from 'drizzle-orm';

/**
 * Cron job to clean up expired AI task videos from R2
 * Runs daily to find tasks past their expiresAt date and clean up storage
 */
export async function GET(request: Request) {
  try {
    // Verify cron secret (Vercel cron jobs send this header)
    const authHeader = request.headers.get('authorization');
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return respErr('unauthorized');
    }

    const now = new Date();

    // Find expired tasks with result assets
    const expiredTasks = await db()
      .select()
      .from(aiTask)
      .where(
        and(
          eq(aiTask.status, AITaskStatus.SUCCESS),
          lt(aiTask.expiresAt, now)
        )
      )
      .limit(100);

    let cleanedCount = 0;
    const storage = await getStorageService();

    for (const task of expiredTasks) {
      try {
        // Delete R2 files if result assets exist
        if (task.resultAssets) {
          const assets = JSON.parse(task.resultAssets);
          // Handle both array format (new) and object format (legacy)
          const assetList = Array.isArray(assets) ? assets : [assets];
          for (const asset of assetList) {
            if (asset.key || asset.videoKey) {
              await storage.deleteFile({ key: asset.key || asset.videoKey });
            }
            if (asset.posterKey) {
              await storage.deleteFile({ key: asset.posterKey });
            }
          }
        }

        // Update task status to expired
        await db()
          .update(aiTask)
          .set({
            status: AITaskStatus.EXPIRED,
            resultAssets: null,
          })
          .where(eq(aiTask.id, task.id));

        cleanedCount++;
      } catch (e) {
        console.error(`Failed to clean up task ${task.id}:`, e);
      }
    }

    console.log(`[Cron] Cleaned up ${cleanedCount} expired AI tasks`);
    return respData({ cleaned: cleanedCount, total: expiredTasks.length });
  } catch (e: any) {
    console.error('[Cron] AI task cleanup failed:', e);
    return respErr(e.message);
  }
}
