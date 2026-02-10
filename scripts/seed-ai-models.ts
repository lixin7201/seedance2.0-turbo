/**
 * Seed script for AI Model Configurations
 * Run with: npx ts-node scripts/seed-ai-models.ts
 */

import { db } from '@/core/db';
import { aiModelConfig } from '@/config/db/schema';
import { eq } from 'drizzle-orm';

const seedData = [
  {
    id: 'seedance-2.0',
    displayName: 'Seedance 2.0',
    description: 'Latest multi-modal AI video model with text, image, and video-to-video support',
    currentProvider: 'evolink',
    providerModelId: 'seedance-2.0',
    enabled: true,
    supportedModes: JSON.stringify(['text-to-video', 'image-to-video', 'video-to-video']),
    parameters: JSON.stringify({
      resolutions: ['480p', '720p'],
      durations: [5, 10],
      aspectRatios: ['16:9', '9:16', '1:1'],
    }),
    creditsCost: JSON.stringify({
      'text-to-video': 6,
      'image-to-video': 8,
      'video-to-video': 10,
    }),
    tags: JSON.stringify(['Multi-Modal', 'With Audio']),
    priority: 100,
    verified: true,
    providerModelMap: JSON.stringify({ evolink: 'seedance-2.0' }),
    updatedAt: new Date(),
  },
  {
    id: 'seedance-1.5-pro',
    displayName: 'Seedance 1.5 Pro',
    description: 'Professional AI video model with audio support',
    currentProvider: 'fal',
    providerModelId: 'fal-ai/bytedance/seedance/v1.5/pro',
    enabled: true,
    verified: true,
    providerModelMap: JSON.stringify({ fal: 'fal-ai/bytedance/seedance/v1.5/pro' }),
    supportedModes: JSON.stringify(['text-to-video', 'image-to-video']),
    parameters: JSON.stringify({
      resolutions: ['480p', '720p'],
      durations: [5, 10],
    }),
    creditsCost: JSON.stringify({
      'text-to-video': 6,
      'image-to-video': 8,
    }),
    tags: JSON.stringify(['With Audio']),
    priority: 90,
    updatedAt: new Date(),
  },
  {
    id: 'kling-3.0',
    displayName: 'Kling 3.0',
    description: 'Kling 3.0 video model',
    currentProvider: 'fal',
    providerModelId: 'fal-ai/kling-video/o3/standard/image-to-video',
    enabled: true,
    verified: false,
    providerModelMap: JSON.stringify({
      fal: 'fal-ai/kling-video/o3/standard/image-to-video',
    }),
    supportedModes: JSON.stringify(['image-to-video']),
    parameters: JSON.stringify({}),
    creditsCost: null,
    tags: JSON.stringify([]),
    priority: 85,
    updatedAt: new Date(),
  },
  {
    id: 'veo-3',
    displayName: 'Veo 3',
    description: 'Google Veo 3 text-to-video model',
    currentProvider: 'fal',
    providerModelId: 'fal-ai/veo3',
    enabled: true,
    verified: false,
    providerModelMap: JSON.stringify({ fal: 'fal-ai/veo3' }),
    supportedModes: JSON.stringify(['text-to-video']),
    parameters: JSON.stringify({
      resolutions: ['720p', '1080p'],
      durations: [5, 10],
    }),
    creditsCost: JSON.stringify({
      'text-to-video': 8,
    }),
    tags: JSON.stringify(['High Quality']),
    priority: 80,
    updatedAt: new Date(),
  },
  {
    id: 'sora-2-pro',
    displayName: 'Sora 2 Pro',
    description: 'OpenAI Sora 2 Pro video generation model',
    currentProvider: 'kie',
    providerModelId: 'sora-2-pro-text-to-video',
    enabled: true,
    verified: false,
    providerModelMap: JSON.stringify({ kie: 'sora-2-pro-text-to-video' }),
    supportedModes: JSON.stringify(['text-to-video', 'image-to-video']),
    parameters: JSON.stringify({
      resolutions: ['480p', '720p', '1080p'],
      durations: [5, 10, 15],
    }),
    creditsCost: JSON.stringify({
      'text-to-video': 10,
      'image-to-video': 12,
    }),
    tags: JSON.stringify(['Premium']),
    priority: 70,
    updatedAt: new Date(),
  },
];

async function seedAIModels() {
  console.log('Seeding AI model configurations...');
  
  try {
    for (const model of seedData) {
      // Check if model already exists
      const existing = await db()
        .select()
        .from(aiModelConfig)
        .where(eq(aiModelConfig.id, model.id));
      
      if (existing.length > 0) {
        console.log(`Model ${model.id} already exists, updating configuration...`);
        await db()
          .update(aiModelConfig)
          .set({
            displayName: model.displayName,
            description: model.description,
            currentProvider: model.currentProvider,
            providerModelId: model.providerModelId,
            enabled: model.enabled,
            supportedModes: model.supportedModes,
            parameters: model.parameters,
            creditsCost: model.creditsCost,
            tags: model.tags,
            priority: model.priority,
            verified: model.verified,
            providerModelMap: model.providerModelMap,
            updatedAt: new Date(),
          })
          .where(eq(aiModelConfig.id, model.id));
        continue;
      }
      
      await db().insert(aiModelConfig).values(model);
      console.log(`Created model: ${model.displayName}`);
    }
    
    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedAIModels();
}

export { seedData, seedAIModels };
