import { getUuid } from '@/shared/lib/hash';

import { saveFiles } from '.';
import {
  AIConfigs,
  AIFile,
  AIGenerateParams,
  AIMediaType,
  AIProvider,
  AITaskResult,
  AITaskStatus,
  AIVideo,
} from './types';

/**
 * EvoLink configs
 * @docs https://docs.evolink.ai
 */
export interface EvolinkConfigs extends AIConfigs {
  apiKey: string;
  customStorage?: boolean;
}

/**
 * EvoLink provider for video generation
 * @docs https://docs.evolink.ai/en/api-manual/video-series/seedance1.5/seedance-1.5-pro-video-generate
 */
export class EvolinkProvider implements AIProvider {
  readonly name = 'evolink';
  configs: EvolinkConfigs;

  private baseUrl = 'https://api.evolink.ai/v1';

  constructor(configs: EvolinkConfigs) {
    this.configs = configs;
  }

  /**
   * Generate video task
   * @docs https://docs.evolink.ai/en/api-manual/video-series/seedance1.5/seedance-1.5-pro-video-generate
   * 
   * API endpoint: POST https://api.evolink.ai/v1/videos/generations
   * 
   * Request body:
   * - model: "seedance-1.5-pro"
   * - prompt: text prompt (max 2000 tokens)
   * - image_urls: array of image URLs (0=text-to-video, 1=image-to-video, 2=first-last-frame)
   * - duration: 4-12 seconds (default 5)
   * - quality: "480p" | "720p" | "1080p" (default 720p)
   * - aspect_ratio: "16:9" | "9:16" | "1:1" | etc (default 16:9)
   * - generate_audio: boolean (default true)
   * - callback_url: HTTPS URL for webhook
   */
  async generate({
    params,
  }: {
    params: AIGenerateParams;
  }): Promise<AITaskResult> {
    if (params.mediaType !== AIMediaType.VIDEO) {
      throw new Error(`EvoLink only supports video generation, got: ${params.mediaType}`);
    }

    const model = params.model || 'seedance-1.5-pro';
    
    // EvoLink uses a single endpoint for all video generation modes
    // Mode is determined by the number of images in image_urls
    const endpoint = '/videos/generations';

    const apiUrl = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.configs.apiKey}`,
    };

    // Build request payload according to EvoLink API spec
    const payload: any = {
      model,
      prompt: params.prompt,
    };
    
    // Map options
    if (params.options) {
        // Handle images - EvoLink uses image_urls (plural)
        // 0 images = text-to-video
        // 1 image = image-to-video
        // 2 images = first-last-frame
        if (params.options.image_input && Array.isArray(params.options.image_input) && params.options.image_input.length > 0) {
             payload.image_urls = params.options.image_input;
        }
        
        // Map resolution to quality (EvoLink uses "quality" parameter)
        if (params.options.resolution) {
            payload.quality = params.options.resolution;
        }
        
        // Map duration
        if (params.options.duration) {
            payload.duration = params.options.duration;
        }
        
        // Map callback URL
        if (params.callbackUrl) {
            payload.callback_url = params.callbackUrl;
        }
    }

    console.log('evolink generate request:', apiUrl, payload);

    const resp = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error('EvoLink generate error:', errorText);
      throw new Error(`EvoLink request failed with status: ${resp.status}, endpoint: ${endpoint}`);
    }

    const data = await resp.json();

    if (!data || !data.id) {
       // Check for task_id alias
       if (data.task_id) {
           data.id = data.task_id;
       } else if (data.request_id) { // Fal uses request_id
           data.id = data.request_id;
       } else {
           throw new Error(`EvoLink generate failed: no task id returned. Response: ${JSON.stringify(data)}`);
       }
    }

    return {
      taskStatus: this.mapStatus(data.status || 'pending'),
      taskId: data.id,
      taskInfo: {},
      taskResult: data,
    };
  }

  /**
   * Query task status
   */
  async query({
    taskId,
    mediaType,
  }: {
    taskId: string;
    mediaType?: AIMediaType;
  }): Promise<AITaskResult> {
    const apiUrl = `${this.baseUrl}/tasks/${taskId}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.configs.apiKey}`,
    };

    console.log('evolink query request:', apiUrl);

    const resp = await fetch(apiUrl, {
      method: 'GET',
      headers,
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error('EvoLink query error:', errorText);
      throw new Error(`EvoLink query failed with status: ${resp.status}`);
    }

    const data = await resp.json();

    if (!data || !data.status) {
      throw new Error('EvoLink query failed: invalid response');
    }

    const taskStatus = this.mapStatus(data.status);
    let videos: AIVideo[] | undefined = undefined;

    // Extract video URLs from results when completed
    if (data.results && Array.isArray(data.results)) {
      videos = data.results.map((url: string, index: number) => ({
        id: `${taskId}-${index}`,
        createTime: new Date(data.created * 1000),
        videoUrl: url,
      }));
    }

    // Save to custom storage if enabled
    if (
      taskStatus === AITaskStatus.SUCCESS &&
      videos &&
      videos.length > 0 &&
      this.configs.customStorage
    ) {
      const filesToSave: AIFile[] = [];
      videos.forEach((video, index) => {
        if (video.videoUrl) {
          filesToSave.push({
            url: video.videoUrl,
            contentType: 'video/mp4',
            key: `evolink/video/${getUuid()}.mp4`,
            index: index,
            type: 'video',
          });
        }
      });

      if (filesToSave.length > 0) {
        const uploadedFiles = await saveFiles(filesToSave);
        if (uploadedFiles) {
          uploadedFiles.forEach((file: AIFile) => {
            if (file && file.url && videos && file.index !== undefined) {
              const video = videos[file.index];
              if (video) {
                video.videoUrl = file.url;
              }
            }
          });
        }
      }
    }

    return {
      taskId,
      taskStatus,
      taskInfo: {
        videos,
        status: data.status,
        errorMessage: data.error?.message,
        createTime: data.created ? new Date(data.created * 1000) : undefined,
      },
      taskResult: data,
    };
  }

  /**
   * Map EvoLink status to AITaskStatus
   * EvoLink statuses: pending, processing, completed, failed
   */
  private mapStatus(status: string): AITaskStatus {
    switch (status) {
      case 'pending':
        return AITaskStatus.PENDING;
      case 'processing':
        return AITaskStatus.PROCESSING;
      case 'completed':
        return AITaskStatus.SUCCESS;
      case 'failed':
        return AITaskStatus.FAILED;
      default:
        console.warn(`Unknown EvoLink status: ${status}, treating as pending`);
        return AITaskStatus.PENDING;
    }
  }
}
