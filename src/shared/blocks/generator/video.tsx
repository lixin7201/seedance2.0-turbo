'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Download,
  Loader2,
  Sparkles,
  User,
  Video,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Link } from '@/core/i18n/navigation';
import { AIMediaType, AITaskStatus } from '@/extensions/ai/types';
import { ImageUploader, ImageUploaderValue } from '@/shared/blocks/common';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Progress } from '@/shared/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Textarea } from '@/shared/components/ui/textarea';
import { useAppContext } from '@/shared/contexts/app';

interface VideoGeneratorProps {
  maxSizeMB?: number;
  srOnlyTitle?: string;
}

interface GeneratedVideo {
  id: string;
  url: string;
  provider?: string;
  model?: string;
  prompt?: string;
}

interface BackendTask {
  id: string;
  status: string;
  provider: string;
  model: string;
  prompt: string | null;
  taskInfo: string | null;
  taskResult: string | null;
}

type VideoGeneratorTab = 'text-to-video' | 'image-to-video' | 'video-to-video';

const POLL_INTERVAL = 15000;
const GENERATION_TIMEOUT = 600000; // 10 minutes for video
const MAX_PROMPT_LENGTH = 2000;

const textToVideoCredits = 6;
const imageToVideoCredits = 8;
const videoToVideoCredits = 10;

// Model config from API
interface ModelConfig {
  id: string;
  displayName: string;
  description: string | null;
  currentProvider: string;
  providerModelId: string;
  enabled: boolean;
  supportedModes: string[];
  parameters: {
    resolutions?: string[];
    durations?: number[];
  } | null;
  creditsCost: Record<string, number> | null;
  tags: string[] | null;
  priority: number;
}

// Default models when database is empty or API fails
const DEFAULT_MODELS: ModelConfig[] = [
  {
    id: 'seedance-2.0',
    displayName: 'Seedance 2.0',
    description: 'Latest multi-modal AI video model',
    currentProvider: 'evolink',
    providerModelId: 'seedance-2.0',
    enabled: true,
    supportedModes: ['text-to-video', 'image-to-video', 'video-to-video'],
    parameters: { resolutions: ['480p', '720p'], durations: [5, 10] },
    creditsCost: { 'text-to-video': 6, 'image-to-video': 8, 'video-to-video': 10 },
    tags: ['Multi-Modal', 'With Audio'],
    priority: 100,
  },
  {
    id: 'seedance-1.5-pro',
    displayName: 'Seedance 1.5 Pro',
    description: 'Fast and efficient video generation',
    currentProvider: 'evolink',
    providerModelId: 'seedance-1.5-pro',
    enabled: true,
    supportedModes: ['text-to-video', 'image-to-video'],
    parameters: { resolutions: ['480p', '720p'], durations: [5, 10] },
    creditsCost: { 'text-to-video': 4, 'image-to-video': 6 },
    tags: ['Fast'],
    priority: 90,
  },
];

const RESOLUTION_OPTIONS = [
  { value: '480p', label: '480p' },
  { value: '720p', label: '720p (HD)' },
  { value: '1080p', label: '1080p (Full HD)' },
];

const DURATION_OPTIONS = [
  { value: 5, label: '5s' },
  { value: 10, label: '10s' },
  { value: 15, label: '15s' },
];

function parseTaskResult(taskResult: string | null): any {
  if (!taskResult) {
    return null;
  }

  try {
    return JSON.parse(taskResult);
  } catch (error) {
    console.warn('Failed to parse taskResult:', error);
    return null;
  }
}

function extractVideoUrls(result: any): string[] {
  if (!result) {
    return [];
  }

  // check videos array first
  const videos = result.videos;
  if (videos && Array.isArray(videos)) {
    return videos
      .map((item: any) => {
        if (!item) return null;
        if (typeof item === 'string') return item;
        if (typeof item === 'object') {
          return (
            item.url ?? item.uri ?? item.video ?? item.src ?? item.videoUrl
          );
        }
        return null;
      })
      .filter(Boolean);
  }

  // check output
  const output = result.output ?? result.video ?? result.data;

  if (!output) {
    return [];
  }

  if (typeof output === 'string') {
    return [output];
  }

  if (Array.isArray(output)) {
    return output
      .flatMap((item) => {
        if (!item) return [];
        if (typeof item === 'string') return [item];
        if (typeof item === 'object') {
          const candidate =
            item.url ?? item.uri ?? item.video ?? item.src ?? item.videoUrl;
          return typeof candidate === 'string' ? [candidate] : [];
        }
        return [];
      })
      .filter(Boolean);
  }

  if (typeof output === 'object') {
    const candidate =
      output.url ?? output.uri ?? output.video ?? output.src ?? output.videoUrl;
    if (typeof candidate === 'string') {
      return [candidate];
    }
  }

  return [];
}

// Example videos for carousel preview
const EXAMPLE_VIDEOS = [
  { id: 'example-1', src: '/videos/example-1.mp4' },
  { id: 'example-2', src: '/videos/example-2.mp4' },
];

// Carousel component for example videos
function ExampleVideoCarousel({
  isGenerating,
  t,
}: {
  isGenerating: boolean;
  t: ReturnType<typeof useTranslations>;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? EXAMPLE_VIDEOS.length - 1 : prev - 1));
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === EXAMPLE_VIDEOS.length - 1 ? 0 : prev + 1));
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  const currentVideo = EXAMPLE_VIDEOS[currentIndex];

  return (
    <div className="space-y-4">
      {/* Video Player with Navigation */}
      <div className="relative overflow-hidden rounded-lg bg-black">
        {/* Preview Example Badge */}
        <div className="absolute top-3 left-3 z-20">
          <span className="flex items-center gap-1.5 rounded-full bg-purple-600/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <Sparkles className="h-3 w-3" />
            Preview Example
          </span>
        </div>

        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70"
          aria-label="Previous video"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Video */}
        <div className="relative aspect-video w-full">
          <video
            ref={videoRef}
            key={currentVideo.id}
            src={currentVideo.src}
            controls
            className="h-full w-full object-contain"
            preload="metadata"
          />
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70"
          aria-label="Next video"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2">
        {EXAMPLE_VIDEOS.map((video, index) => (
          <button
            key={video.id}
            onClick={() => {
              setCurrentIndex(index);
              if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
              }
            }}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-primary w-4'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            aria-label={`Go to video ${index + 1}`}
          />
        ))}
      </div>

      {/* Hint Text */}
      <p className="text-muted-foreground text-center text-sm">
        {isGenerating ? t('ready_to_generate') : t('preview_examples_hint')}
      </p>
    </div>
  );
}

export function VideoGenerator({
  maxSizeMB = 50,
  srOnlyTitle,
}: VideoGeneratorProps) {
  const t = useTranslations('ai.video.generator');

  const [activeTab, setActiveTab] =
    useState<VideoGeneratorTab>('text-to-video');

  const [costCredits, setCostCredits] = useState<number>(textToVideoCredits);
  const [modelConfigs, setModelConfigs] = useState<ModelConfig[]>(DEFAULT_MODELS);
  const [model, setModel] = useState(DEFAULT_MODELS[0]?.id ?? '');
  const [resolution, setResolution] = useState('720p');
  const [duration, setDuration] = useState(5);
  const [prompt, setPrompt] = useState('');
  const [referenceImageItems, setReferenceImageItems] = useState<
    ImageUploaderValue[]
  >([]);
  const [referenceImageUrls, setReferenceImageUrls] = useState<string[]>([]);
  const [referenceVideoUrl, setReferenceVideoUrl] = useState<string>('');
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [generationStartTime, setGenerationStartTime] = useState<number | null>(
    null
  );
  const [taskStatus, setTaskStatus] = useState<AITaskStatus | null>(null);
  const [downloadingVideoId, setDownloadingVideoId] = useState<string | null>(
    null
  );
  const [isMounted, setIsMounted] = useState(false);

  const { user, isCheckSign, setIsShowSignModal, fetchUserCredits } =
    useAppContext();

  // Initialize with default models, then try to fetch from API
  useEffect(() => {
    setIsMounted(true);
    
    // Try to fetch models from API
    fetch('/api/models')
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 0 && data.data && data.data.length > 0) {
          setModelConfigs(data.data);
          // Set default model from API data
          const defaultModel = data.data.find((m: ModelConfig) => 
            m.supportedModes.includes('text-to-video')
          );
          if (defaultModel) {
            setModel(defaultModel.id);
          }
        } else {
          // Use default models if API returns empty
          setModelConfigs(DEFAULT_MODELS);
          setModel(DEFAULT_MODELS[0].id);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch models:', err);
        // Use default models on error
        setModelConfigs(DEFAULT_MODELS);
        setModel(DEFAULT_MODELS[0].id);
      });
  }, []);

  const promptLength = prompt.trim().length;
  const remainingCredits = user?.credits?.remainingCredits ?? 0;
  const isPromptTooLong = promptLength > MAX_PROMPT_LENGTH;
  const isTextToVideoMode = activeTab === 'text-to-video';
  const isImageToVideoMode = activeTab === 'image-to-video';
  const isVideoToVideoMode = activeTab === 'video-to-video';
  const isSeedance2ComingSoon = model === 'seedance-2.0';

  const handleTabChange = (value: string) => {
    const tab = value as VideoGeneratorTab;
    setActiveTab(tab);

    // Find first model that supports this tab
    const availableModels = modelConfigs.filter((m) =>
      m.supportedModes.includes(tab)
    );

    if (availableModels.length > 0) {
      setModel(availableModels[0].id);
      // Update credits cost based on model config
      const cost = availableModels[0].creditsCost?.[tab];
      if (cost) {
        setCostCredits(cost);
      } else {
        // Fallback to defaults
        if (tab === 'text-to-video') {
          setCostCredits(textToVideoCredits);
        } else if (tab === 'image-to-video') {
          setCostCredits(imageToVideoCredits);
        } else if (tab === 'video-to-video') {
          setCostCredits(videoToVideoCredits);
        }
      }
    } else {
      setModel('');
    }
  };

  // Handle model change - update credits cost
  const handleModelChange = (value: string) => {
    setModel(value);
    const config = modelConfigs.find((m) => m.id === value);
    if (config?.creditsCost?.[activeTab]) {
      setCostCredits(config.creditsCost[activeTab]);
    }
  };

  // Check if current model supports video-to-video
  const selectedModelConfig = modelConfigs.find((m) => m.id === model);
  const showVideoToVideoTab = selectedModelConfig?.supportedModes.includes('video-to-video') ?? false;

  const taskStatusLabel = useMemo(() => {
    if (!taskStatus) {
      return '';
    }

    switch (taskStatus) {
      case AITaskStatus.PENDING:
        return 'Waiting for the model to start';
      case AITaskStatus.PROCESSING:
        return 'Generating your video...';
      case AITaskStatus.SUCCESS:
        return 'Video generation completed';
      case AITaskStatus.FAILED:
        return 'Generation failed';
      default:
        return '';
    }
  }, [taskStatus]);

  const handleReferenceImagesChange = useCallback(
    (items: ImageUploaderValue[]) => {
      setReferenceImageItems(items);
      const uploadedUrls = items
        .filter((item) => item.status === 'uploaded' && item.url)
        .map((item) => item.url as string);
      setReferenceImageUrls(uploadedUrls);
    },
    []
  );

  const isReferenceUploading = useMemo(
    () => referenceImageItems.some((item) => item.status === 'uploading'),
    [referenceImageItems]
  );

  const hasReferenceUploadError = useMemo(
    () => referenceImageItems.some((item) => item.status === 'error'),
    [referenceImageItems]
  );

  const resetTaskState = useCallback(() => {
    setIsGenerating(false);
    setProgress(0);
    setTaskId(null);
    setGenerationStartTime(null);
    setTaskStatus(null);
  }, []);

  const pollTaskStatus = useCallback(
    async (id: string) => {
      try {
        if (
          generationStartTime &&
          Date.now() - generationStartTime > GENERATION_TIMEOUT
        ) {
          resetTaskState();
          toast.error('Video generation timed out. Please try again.');
          return true;
        }

        const resp = await fetch('/api/ai/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ taskId: id }),
        });

        if (!resp.ok) {
          throw new Error(`request failed with status: ${resp.status}`);
        }

        const { code, message, data } = await resp.json();
        if (code !== 0) {
          throw new Error(message || 'Query task failed');
        }

        const task = data as BackendTask;
        const currentStatus = task.status as AITaskStatus;
        setTaskStatus(currentStatus);

        const parsedResult = parseTaskResult(task.taskInfo);
        const videoUrls = extractVideoUrls(parsedResult);

        if (currentStatus === AITaskStatus.PENDING) {
          setProgress((prev) => Math.max(prev, 20));
          return false;
        }

        if (currentStatus === AITaskStatus.PROCESSING) {
          if (videoUrls.length > 0) {
            setGeneratedVideos(
              videoUrls.map((url, index) => ({
                id: `${task.id}-${index}`,
                url,
                provider: task.provider,
                model: task.model,
                prompt: task.prompt ?? undefined,
              }))
            );
            setProgress((prev) => Math.max(prev, 85));
          } else {
            setProgress((prev) => Math.min(prev + 5, 80));
          }
          return false;
        }

        if (currentStatus === AITaskStatus.SUCCESS) {
          if (videoUrls.length === 0) {
            toast.error('The provider returned no videos. Please retry.');
          } else {
            setGeneratedVideos(
              videoUrls.map((url, index) => ({
                id: `${task.id}-${index}`,
                url,
                provider: task.provider,
                model: task.model,
                prompt: task.prompt ?? undefined,
              }))
            );
            toast.success('Video generated successfully');
          }

          setProgress(100);
          resetTaskState();
          return true;
        }

        if (currentStatus === AITaskStatus.FAILED) {
          const errorMessage =
            parsedResult?.errorMessage || 'Generate video failed';
          toast.error(errorMessage);
          resetTaskState();

          fetchUserCredits();

          return true;
        }

        setProgress((prev) => Math.min(prev + 3, 95));
        return false;
      } catch (error: any) {
        console.error('Error polling video task:', error);
        toast.error(`Query task failed: ${error.message}`);
        resetTaskState();

        fetchUserCredits();

        return true;
      }
    },
    [generationStartTime, resetTaskState]
  );

  useEffect(() => {
    if (!taskId || !isGenerating) {
      return;
    }

    let cancelled = false;

    const tick = async () => {
      if (!taskId) {
        return;
      }
      const completed = await pollTaskStatus(taskId);
      if (completed) {
        cancelled = true;
      }
    };

    tick();

    const interval = setInterval(async () => {
      if (cancelled || !taskId) {
        clearInterval(interval);
        return;
      }
      const completed = await pollTaskStatus(taskId);
      if (completed) {
        clearInterval(interval);
      }
    }, POLL_INTERVAL);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [taskId, isGenerating, pollTaskStatus]);

  const handleGenerate = async () => {
    if (!user) {
      setIsShowSignModal(true);
      return;
    }

    if (remainingCredits < costCredits) {
      toast.error('Insufficient credits. Please top up to keep creating.');
      return;
    }

    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt && isTextToVideoMode) {
      toast.error('Please enter a prompt before generating.');
      return;
    }

    if (!model) {
      toast.error('Please select a model before generating.');
      return;
    }

    if (isImageToVideoMode && referenceImageUrls.length === 0) {
      toast.error('Please upload a reference image before generating.');
      return;
    }

    if (isVideoToVideoMode && !referenceVideoUrl) {
      toast.error('Please provide a reference video URL before generating.');
      return;
    }

    setIsGenerating(true);
    setProgress(15);
    setTaskStatus(AITaskStatus.PENDING);
    setGeneratedVideos([]);
    setGenerationStartTime(Date.now());

    try {
      const options: any = {};

      if (isImageToVideoMode) {
        options.image_input = referenceImageUrls;
      }

      if (isVideoToVideoMode) {
        options.video_input = [referenceVideoUrl];
      }

      const resp = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mediaType: AIMediaType.VIDEO,
          scene: activeTab,
          model,
          prompt: trimmedPrompt,
          resolution,
          duration,
          options,
        }),
      });

      if (!resp.ok) {
        throw new Error(`request failed with status: ${resp.status}`);
      }

      const { code, message, data } = await resp.json();
      if (code !== 0) {
        throw new Error(message || 'Failed to create a video task');
      }

      const newTaskId = data?.id;
      if (!newTaskId) {
        throw new Error('Task id missing in response');
      }

      if (data.status === AITaskStatus.SUCCESS && data.taskInfo) {
        const parsedResult = parseTaskResult(data.taskInfo);
        const videoUrls = extractVideoUrls(parsedResult);

        if (videoUrls.length > 0) {
          setGeneratedVideos(
            videoUrls.map((url, index) => ({
              id: `${newTaskId}-${index}`,
              url,
              model,
              prompt: trimmedPrompt,
            }))
          );
          toast.success('Video generated successfully');
          setProgress(100);
          resetTaskState();
          await fetchUserCredits();
          return;
        }
      }

      setTaskId(newTaskId);
      setProgress(25);

      await fetchUserCredits();
    } catch (error: any) {
      console.error('Failed to generate video:', error);
      toast.error(`Failed to generate video: ${error.message}`);
      resetTaskState();
    }
  };

  const handleDownloadVideo = async (video: GeneratedVideo) => {
    if (!video.url) {
      return;
    }

    try {
      setDownloadingVideoId(video.id);
      // fetch video via proxy
      const resp = await fetch(
        `/api/proxy/file?url=${encodeURIComponent(video.url)}`
      );
      if (!resp.ok) {
        throw new Error('Failed to fetch video');
      }

      const blob = await resp.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${video.id}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 200);
      toast.success('Video downloaded');
    } catch (error) {
      console.error('Failed to download video:', error);
      toast.error('Failed to download video');
    } finally {
      setDownloadingVideoId(null);
    }
  };

  return (
    <section className="py-8 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <Card>
              <CardHeader>
                {srOnlyTitle && <h2 className="sr-only">{srOnlyTitle}</h2>}
                <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                  {t('title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pb-8">
                <Tabs value={activeTab} onValueChange={handleTabChange}>
                  <TabsList className="bg-primary/10 grid w-full grid-cols-1 sm:grid-cols-3">
                    <TabsTrigger value="text-to-video" className="text-xs sm:text-sm">
                      {t('tabs.text-to-video')}
                    </TabsTrigger>
                    <TabsTrigger value="image-to-video" className="text-xs sm:text-sm">
                      {t('tabs.image-to-video')}
                    </TabsTrigger>
                    <TabsTrigger value="video-to-video" className="text-xs sm:text-sm">
                      {t('tabs.video-to-video')}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('form.model')}</Label>
                    <Select value={model} onValueChange={handleModelChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('form.select_model')} />
                      </SelectTrigger>
                      <SelectContent>
                        {modelConfigs
                          .filter((m) => m.supportedModes.includes(activeTab))
                          .map((m) => (
                            <SelectItem key={m.id} value={m.id}>
                              {m.displayName}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('form.resolution') || 'Resolution'}</Label>
                    <Select
                      value={resolution}
                      onValueChange={setResolution}
                      disabled={isSeedance2ComingSoon}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RESOLUTION_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {isSeedance2ComingSoon && (
                  <div className="rounded-lg border border-dashed bg-muted/40 p-4 text-center text-sm text-muted-foreground">
                    {t('seedance2_coming_soon')}
                  </div>
                )}

                <div
                  className={isSeedance2ComingSoon ? 'opacity-50' : ''}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t('form.duration') || 'Duration'}</Label>
                      <Select
                        value={String(duration)}
                        onValueChange={(v) => setDuration(Number(v))}
                        disabled={isSeedance2ComingSoon}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DURATION_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={String(opt.value)}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {isImageToVideoMode && (
                    <div
                      className={
                        isSeedance2ComingSoon
                          ? 'pointer-events-none space-y-4'
                          : 'space-y-4'
                      }
                    >
                      <ImageUploader
                        title={t('form.reference_image')}
                        allowMultiple={true}
                        maxImages={3}
                        maxSizeMB={maxSizeMB}
                        onChange={handleReferenceImagesChange}
                        emptyHint={t('form.reference_image_placeholder')}
                      />

                      {hasReferenceUploadError && (
                        <p className="text-destructive text-xs">
                          {t('form.some_images_failed_to_upload')}
                        </p>
                      )}
                    </div>
                  )}

                  {isVideoToVideoMode && (
                    <div className="space-y-2">
                      <Label htmlFor="video-url">
                        {t('form.reference_video')}
                      </Label>
                      <Textarea
                        id="video-url"
                        value={referenceVideoUrl}
                        onChange={(e) => setReferenceVideoUrl(e.target.value)}
                        placeholder={t('form.reference_video_placeholder')}
                        className="min-h-20"
                        disabled={isSeedance2ComingSoon}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="video-prompt">{t('form.prompt')}</Label>
                    <Textarea
                      id="video-prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder={t('form.prompt_placeholder')}
                      className="min-h-32"
                      disabled={isSeedance2ComingSoon}
                    />
                    <div className="text-muted-foreground flex items-center justify-between text-xs">
                      <span>
                        {promptLength} / {MAX_PROMPT_LENGTH}
                      </span>
                      {isPromptTooLong && (
                        <span className="text-destructive">
                          {t('form.prompt_too_long')}
                        </span>
                      )}
                    </div>
                  </div>

                  {!isMounted ? (
                    <Button className="w-full" disabled size="lg">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('loading')}
                    </Button>
                  ) : isCheckSign ? (
                    <Button className="w-full" disabled size="lg">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('checking_account')}
                    </Button>
                  ) : user ? (
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={handleGenerate}
                      disabled={
                        isSeedance2ComingSoon ||
                        isGenerating ||
                        (isTextToVideoMode && !prompt.trim()) ||
                        isPromptTooLong ||
                        isReferenceUploading ||
                        hasReferenceUploadError ||
                        (isImageToVideoMode && referenceImageUrls.length === 0) ||
                        (isVideoToVideoMode && !referenceVideoUrl)
                      }
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('generating')}
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          {t('generate')}
                        </>
                      )}
                    </Button>
                ) : (
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => setIsShowSignModal(true)}
                    disabled={isSeedance2ComingSoon}
                  >
                    <User className="mr-2 h-4 w-4" />
                    {t('sign_in_to_generate')}
                    </Button>
                  )}
                </div>

                {!isMounted ? (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary">
                      {t('credits_cost', { credits: costCredits })}
                    </span>
                    <span>{t('credits_remaining', { credits: 0 })}</span>
                  </div>
                ) : user && remainingCredits > 0 ? (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary">
                      {t('credits_cost', { credits: costCredits })}
                    </span>
                    <span>
                      {t('credits_remaining', { credits: remainingCredits })}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-primary">
                        {t('credits_cost', { credits: costCredits })}
                      </span>
                      <span>
                        {t('credits_remaining', { credits: remainingCredits })}
                      </span>
                    </div>
                    <Link href="/pricing">
                      <Button variant="outline" className="w-full" size="lg">
                        <CreditCard className="mr-2 h-4 w-4" />
                        {t('buy_credits')}
                      </Button>
                    </Link>
                  </div>
                )}

                {isGenerating && (
                  <div className="space-y-2 rounded-lg border p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>{t('progress')}</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                    {taskStatusLabel && (
                      <p className="text-muted-foreground text-center text-xs">
                        {taskStatusLabel}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                  <Video className="h-5 w-5" />
                  {t('generated_videos')}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-8">
                {generatedVideos.length > 0 ? (
                  <div className="space-y-6">
                    {generatedVideos.map((video) => (
                      <div key={video.id} className="space-y-3">
                        <div className="relative overflow-hidden rounded-lg border">
                          <video
                            src={video.url}
                            controls
                            className="h-auto w-full"
                            preload="metadata"
                          />

                          <div className="absolute right-2 bottom-2 flex justify-end text-sm">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="ml-auto"
                              onClick={() => handleDownloadVideo(video)}
                              disabled={downloadingVideoId === video.id}
                            >
                              {downloadingVideoId === video.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                </>
                              ) : (
                                <>
                                  <Download className="h-4 w-4" />
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ExampleVideoCarousel isGenerating={isGenerating} t={t} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
