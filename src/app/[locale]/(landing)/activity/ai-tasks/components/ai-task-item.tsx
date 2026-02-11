'use client';

import moment from 'moment';
import { Download, RefreshCw, Trash2, AlertCircle, Copy as CopyIcon, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'sonner';

import { AITaskStatus } from '@/extensions/ai/types';
import { AudioPlayer, LazyImage } from '@/shared/blocks/common';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
} from '@/shared/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { type AITask } from '@/shared/models/ai_task';
import { cn } from '@/shared/lib/utils';

interface AITaskItemProps {
  task: AITask;
  signedUrls?: { videoUrl?: string; posterUrl?: string };
  onDelete?: (id: string) => void;
}

export function AITaskItem({ task, signedUrls }: AITaskItemProps) {
  const t = useTranslations('activity.ai-tasks');
  const [isExpanded, setIsExpanded] = useState(false);

  const statusColors: Record<string, string> = {
    pending: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    processing: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    success: 'text-green-500 bg-green-500/10 border-green-500/20',
    failed: 'text-red-500 bg-red-500/10 border-red-500/20',
    expired: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
  };

  const getStatusLabel = (status: string) => {
    return t.has(`status.${status}`) ? t(`status.${status}` as any) : status;
  };

  const renderMedia = () => {
    if (task.status === AITaskStatus.EXPIRED) {
      return (
        <div className="flex h-full min-h-[160px] w-full items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-muted/80">
          <div className="flex flex-col items-center gap-2 text-center">
            <AlertCircle className="h-8 w-8 opacity-50" />
            <span className="text-sm font-medium">{t('status.expired')}</span>
          </div>
        </div>
      );
    }

    // Processing/Pending state
    if (
      task.status === AITaskStatus.PENDING ||
      task.status === AITaskStatus.PROCESSING
    ) {
      const progress = task.progress || 0;
      return (
        <div className="flex h-full min-h-[160px] w-full flex-col items-center justify-center gap-4 rounded-lg bg-muted/30 p-4 transition-colors">
          <div className="relative h-16 w-16">
            <svg className="h-full w-full rotate-[-90deg]" viewBox="0 0 36 36">
              <path
                className="stroke-muted text-muted-foreground/20"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="stroke-primary transition-all duration-500 ease-in-out"
                strokeDasharray={`${progress}, 100`}
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
              {progress}%
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
            </span>
            {getStatusLabel(task.status)}
          </div>
        </div>
      );
    }

    // Success state - Try R2 signed URLs first
    if (signedUrls?.videoUrl) {
      return (
        <div className="group relative h-full min-h-[160px] w-full overflow-hidden rounded-lg bg-black/5 shadow-sm ring-1 ring-border/50">
          <video
            src={signedUrls.videoUrl}
            controls
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-contain"
            poster={signedUrls.posterUrl}
          />
        </div>
      );
    }

    // Fallback to taskInfo
    if (task.taskInfo) {
      try {
        const taskInfo = JSON.parse(task.taskInfo);
        
        if (taskInfo.errorMessage) {
          return (
            <div className="flex h-full min-h-[160px] w-full items-center justify-center rounded-lg bg-red-50 text-red-500 dark:bg-red-950/20">
              <div className="flex flex-col items-center gap-2 p-4 text-center">
                <AlertCircle className="h-6 w-6" />
                <span className="text-xs line-clamp-3">{taskInfo.errorMessage}</span>
              </div>
            </div>
          );
        }

        if (taskInfo.videos && taskInfo.videos.length > 0) {
           const video = taskInfo.videos[0];
           if (video.videoUrl) {
             return (
               <div className="group relative h-full min-h-[160px] w-full overflow-hidden rounded-lg bg-black/5 shadow-sm ring-1 ring-border/50">
                 <video
                   src={video.videoUrl}
                   controls
                   autoPlay
                   muted
                   loop
                   playsInline
                   className="h-full w-full object-contain"
                   poster={video.thumbnailUrl}
                 />
               </div>
             );
           }
        }

        if (taskInfo.images && taskInfo.images.length > 0) {
            return (
                <div className="grid h-full w-full gap-2">
                    {taskInfo.images.map((image: any, idx: number) => (
                         <div key={idx} className="relative aspect-square w-full overflow-hidden rounded-lg">
                             <LazyImage
                                src={image.imageUrl}
                                alt={`Generated image ${idx + 1}`}
                                className="h-full w-full object-cover"
                             />
                         </div>
                    ))}
                </div>
            )
        }

        if (taskInfo.songs && taskInfo.songs.length > 0) {
            return (
                <div className="flex flex-col gap-2 p-2">
                     {taskInfo.songs.map((song: any, idx: number) => (
                         <AudioPlayer
                            key={idx}
                            src={song.audioUrl}
                            title={song.title}
                            className="w-full"
                         />
                     ))}
                </div>
            )
        }
      } catch (e) {
        console.error('Failed to parse task info', e);
      }
    }
    
    // Default fallback
    return (
        <div className="flex h-full min-h-[160px] w-full items-center justify-center rounded-lg bg-muted text-muted-foreground">
             <span className="text-sm">No Preview Available</span>
        </div>
    )
  };

  const renderProgress = () => {
      if (task.status === AITaskStatus.SUCCESS) {
         return (
             <div className="flex items-center gap-1.5 text-green-500">
                 <CheckCircle2 className="h-3.5 w-3.5" />
                 <span className="text-xs font-medium">100%</span>
             </div>
         );
      }
      if (task.status === AITaskStatus.PENDING || task.status === AITaskStatus.PROCESSING) {
          const progress = task.progress || 0;
          return (
             <div className="flex w-full items-center gap-2">
                 <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                     <div 
                        className="h-full rounded-full bg-primary transition-all duration-500 ease-out" 
                        style={{ width: `${progress}%` }}
                     />
                 </div>
                 <span className="text-xs font-medium text-muted-foreground w-8 text-right">{progress}%</span>
             </div>
          );
      }
      return <span className="text-xs text-muted-foreground">-</span>;
  };

  return (
    <Card className="overflow-hidden bg-card/50 transition-all hover:bg-card hover:shadow-sm">
      <div className="flex flex-col gap-4 p-4 md:flex-row md:gap-6">
        {/* Left: Media Preview - Fixed width on desktop, full width on mobile */}
        <div className="w-full shrink-0 md:w-[320px] lg:w-[400px]">
          {renderMedia()}
        </div>

        {/* Right: Content details */}
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {/* Header: ID, Time, Status */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
             <div className="flex items-center gap-2">
                <span className="font-mono opacity-70">#{task.id.slice(-8)}</span>
                <span className="h-1 w-1 rounded-full bg-border"></span>
                <time dateTime={task.createdAt ? new Date(task.createdAt).toISOString() : ''}>
                  {task.createdAt ? moment(task.createdAt).format('YYYY-MM-DD HH:mm') : '-'}
                </time>
             </div>
             <div className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium uppercase border", statusColors[task.status as string] || 'text-gray-500 border-gray-200')}>
                {getStatusLabel(task.status)}
             </div>
          </div>
          
          {/* Prompt */}
          <div className="group relative rounded-md bg-muted/30 p-3 transition-colors hover:bg-muted/50">
             <div className="flex items-center justify-between mb-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider opacity-70">
                    {t('fields.prompt')}
                </div>
                <CopyToClipboard
                  text={task.prompt}
                  onCopy={() => toast.success('Copied to clipboard')}
                >
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                    title="Copy prompt"
                  >
                    <CopyIcon className="h-3 w-3 text-muted-foreground" />
                    <span className="sr-only">Copy</span>
                  </Button>
                </CopyToClipboard>
             </div>
             <div 
                className={cn(
                    "text-sm leading-relaxed whitespace-pre-wrap break-words select-text",
                    !isExpanded && "line-clamp-3 max-h-[4.5rem] overflow-hidden"
                )}
             >
                {task.prompt}
             </div>
             {task.prompt && task.prompt.length > 150 && (
                 <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-1 text-xs font-medium text-primary hover:underline focus:outline-none"
                 >
                    {isExpanded ? 'Show less' : 'Show more'}
                 </button>
             )}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3 lg:grid-cols-4">
             <div className="flex flex-col gap-1 rounded bg-muted/20 p-2">
                 <span className="text-[10px] uppercase text-muted-foreground">{t('fields.model')}</span>
                 <span className="font-medium">{task.model || '-'}</span>
             </div>
             <div className="flex flex-col gap-1 rounded bg-muted/20 p-2">
                 <span className="text-[10px] uppercase text-muted-foreground">{t('fields.cost_credits')}</span>
                 <span className="font-medium">{task.costCredits || 0}</span>
             </div>
             <div className="flex flex-col gap-1 rounded bg-muted/20 p-2">
                 <span className="text-[10px] uppercase text-muted-foreground">{t('fields.media_type')}</span>
                 <span className="font-medium capitalize">{task.mediaType || '-'}</span>
             </div>
             <div className="flex flex-col gap-1 rounded bg-muted/20 p-2">
                 <span className="text-[10px] uppercase text-muted-foreground">{t('fields.progress')}</span>
                 <div className="h-5 flex items-center">
                    {renderProgress()}
                 </div>
             </div>
          </div>

          {/* Actions - Pushed to bottom */}
          <div className="mt-auto flex flex-wrap items-center justify-end gap-2 pt-2">
             {/* Download Button */}
             {(signedUrls?.videoUrl || (task.status === AITaskStatus.SUCCESS && task.taskInfo)) && (
                <Button variant="outline" size="sm" asChild className="h-8 gap-1.5 text-xs">
                    <a href={signedUrls?.videoUrl || ''} download target="_blank" rel="noopener noreferrer">
                        <Download className="h-3.5 w-3.5" />
                        {t('list.buttons.download')}
                    </a>
                </Button>
             )}

             {/* Retry Button */}
             {task.status === AITaskStatus.FAILED && (
                 <form action={`/api/ai/task/${task.id}/retry`} method="POST">
                    <Button variant="secondary" size="sm" className="h-8 gap-1.5 text-xs">
                        <RefreshCw className="h-3.5 w-3.5" />
                        {t('list.buttons.retry')}
                    </Button>
                 </form>
             )}

             {/* Delete Button */}
             <form action={`/api/ai/task/${task.id}`} method="DELETE">
                  <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-red-50 hover:text-red-500">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">{t('list.buttons.delete')}</span>
                             </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{t('list.buttons.delete')}</p>
                        </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
             </form>
          </div>
        </div>
      </div>
    </Card>
  );
}
