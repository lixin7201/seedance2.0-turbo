import { getTranslations } from 'next-intl/server';

import { AITaskStatus } from '@/extensions/ai';
import { Empty } from '@/shared/blocks/common';
import { AITask, getAITasks, getAITasksCount } from '@/shared/models/ai_task';
import { getUserInfo } from '@/shared/models/user';
import { getStorageService } from '@/shared/services/storage';
import { Tab } from '@/shared/types/blocks/common';

import { AITaskList } from './components/ai-task-list';

export default async function AiTasksPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: number; pageSize?: number; type?: string }>;
}) {
  const { page: pageNum, pageSize, type } = await searchParams;
  const page = pageNum ? Number(pageNum) : 1;
  const limit = pageSize ? Number(pageSize) : 20;

  const user = await getUserInfo();
  if (!user) {
    return <Empty message="no auth" />;
  }

  const t = await getTranslations('activity.ai-tasks');

  const aiTasks = await getAITasks({
    userId: user.id,
    mediaType: type,
    page,
    limit,
  });

  const total = await getAITasksCount({
    userId: user.id,
    mediaType: type,
  });

  // Pre-generate signed URLs for tasks with R2 result assets
  const signedUrlMap = new Map<string, { videoUrl: string; posterUrl?: string }>();
  try {
    const storage = await getStorageService();
    for (const task of aiTasks) {
      if (task.resultAssets && task.status === AITaskStatus.SUCCESS) {
        try {
          const assets = JSON.parse(task.resultAssets);
          const assetList = Array.isArray(assets) ? assets : [assets];
          const firstVideo = assetList.find((a: any) => a.type === 'video' && a.key);
          if (firstVideo) {
            const videoUrl = await storage.getSignedUrl({ key: firstVideo.key, expiresIn: 3600 });
            let posterUrl: string | undefined;
            if (firstVideo.posterKey) {
              posterUrl = await storage.getSignedUrl({ key: firstVideo.posterKey, expiresIn: 3600 });
            }
            signedUrlMap.set(task.id, { videoUrl, posterUrl });
          }
        } catch {}
      }
    }
  } catch {}
  
  const signedUrlObject: Record<string, { videoUrl: string; posterUrl?: string }> = {};
  signedUrlMap.forEach((value, key) => {
    signedUrlObject[key] = value;
  });

  const tabs: Tab[] = [
    {
      name: 'all',
      title: t('list.tabs.all'),
      url: '/activity/ai-tasks',
      is_active: !type || type === 'all',
    },
    {
      name: 'music',
      title: t('list.tabs.music'),
      url: '/activity/ai-tasks?type=music',
      is_active: type === 'music',
    },
    {
      name: 'image',
      title: t('list.tabs.image'),
      url: '/activity/ai-tasks?type=image',
      is_active: type === 'image',
    },
    {
      name: 'video',
      title: t('list.tabs.video'),
      url: '/activity/ai-tasks?type=video',
      is_active: type === 'video',
    },
    {
      name: 'audio',
      title: t('list.tabs.audio'),
      url: '/activity/ai-tasks?type=audio',
      is_active: type === 'audio',
    },
    {
      name: 'text',
      title: t('list.tabs.text'),
      url: '/activity/ai-tasks?type=text',
      is_active: type === 'text',
    },
  ];

  return (
    <div className="space-y-8">
      <AITaskList 
        tasks={aiTasks} 
        signedUrls={signedUrlObject}
        tabs={tabs}
        pagination={{
            total,
            page,
            limit,
        }}
      />
    </div>
  );
}
