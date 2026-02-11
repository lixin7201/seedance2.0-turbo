'use client';

import { useTranslations } from 'next-intl';

import { Empty } from '@/shared/blocks/common';
import { Pagination } from '@/shared/blocks/common/pagination';
import { Tabs } from '@/shared/blocks/common/tabs';
import { type AITask } from '@/shared/models/ai_task';
import { Pagination as PaginationType, Tab } from '@/shared/types/blocks/common';

import { AITaskItem } from './ai-task-item';

interface AITaskListProps {
  tasks: AITask[];
  signedUrls: Record<string, { videoUrl: string; posterUrl?: string }>;
  pagination?: PaginationType;
  tabs?: Tab[];
}

export function AITaskList({
  tasks,
  signedUrls,
  pagination,
  tabs,
}: AITaskListProps) {
  const t = useTranslations('activity.ai-tasks');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {t('list.title')}
          </h2>
        </div>

        {tabs && tabs.length > 0 && (
          <div className="overflow-x-auto pb-2">
            <Tabs tabs={tabs} />
          </div>
        )}
      </div>

      <div className="grid gap-6">
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <AITaskItem
              key={task.id}
              task={task}
              signedUrls={signedUrls[task.id]}
            />
          ))
        ) : (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
            <Empty message={t('list.empty_message')} />
          </div>
        )}
      </div>

      {pagination && (
        <div className="mt-8 flex justify-center border-t pt-8">
          <Pagination {...pagination} />
        </div>
      )}
    </div>
  );
}
