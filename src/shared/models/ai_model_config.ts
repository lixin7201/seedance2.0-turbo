import { and, desc, eq } from 'drizzle-orm';

import { db } from '@/core/db';
import { aiModelConfig } from '@/config/db/schema';

export type AIModelConfig = typeof aiModelConfig.$inferSelect;
export type NewAIModelConfig = typeof aiModelConfig.$inferInsert;
export type UpdateAIModelConfig = Partial<Omit<NewAIModelConfig, 'id' | 'createdAt'>>;

// Parsed model config with JSON fields deserialized
export interface ParsedAIModelConfig extends Omit<AIModelConfig, 'supportedModes' | 'parameters' | 'creditsCost' | 'tags' | 'providerModelMap'> {
  supportedModes: string[];
  parameters: {
    resolutions?: string[];
    durations?: number[];
    aspectRatios?: string[];
  } | null;
  creditsCost: Record<string, number> | null;
  tags: string[] | null;
  providerModelMap: Record<string, string> | null;
}

/**
 * Parse JSON fields in model config
 */
function parseModelConfig(config: AIModelConfig): ParsedAIModelConfig {
  return {
    ...config,
    supportedModes: JSON.parse(config.supportedModes || '[]'),
    parameters: config.parameters ? JSON.parse(config.parameters) : null,
    creditsCost: config.creditsCost ? JSON.parse(config.creditsCost) : null,
    tags: config.tags ? JSON.parse(config.tags) : null,
    providerModelMap: config.providerModelMap ? JSON.parse(config.providerModelMap) : null,
  };
}

/**
 * Get all enabled model configs ordered by priority
 */
export async function getAllEnabledModelConfigs(): Promise<ParsedAIModelConfig[]> {
  const results = await db()
    .select()
    .from(aiModelConfig)
    .where(and(eq(aiModelConfig.enabled, true), eq(aiModelConfig.verified, true)))
    .orderBy(desc(aiModelConfig.priority));

  return results.map(parseModelConfig);
}

/**
 * Get all model configs (for admin panel)
 * @param showAll - if true, return ALL models including unverified; defaults to false (verified only)
 */
export async function getAllModelConfigs(showAll = false): Promise<ParsedAIModelConfig[]> {
  const query = db()
    .select()
    .from(aiModelConfig);

  const results = showAll
    ? await query.orderBy(desc(aiModelConfig.priority))
    : await query.where(eq(aiModelConfig.verified, true)).orderBy(desc(aiModelConfig.priority));

  return results.map(parseModelConfig);
}

/**
 * Get model config by ID
 */
export async function getModelConfigById(id: string): Promise<ParsedAIModelConfig | null> {
  const [result] = await db()
    .select()
    .from(aiModelConfig)
    .where(eq(aiModelConfig.id, id));

  return result ? parseModelConfig(result) : null;
}

/**
 * Create a new model config
 */
export async function createModelConfig(data: NewAIModelConfig): Promise<AIModelConfig> {
  const [result] = await db()
    .insert(aiModelConfig)
    .values({
      ...data,
      updatedAt: new Date(),
    })
    .returning();

  return result;
}

/**
 * Update model config by ID
 */
export async function updateModelConfigById(
  id: string,
  data: UpdateAIModelConfig
): Promise<AIModelConfig | null> {
  const [result] = await db()
    .update(aiModelConfig)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(aiModelConfig.id, id))
    .returning();

  return result || null;
}

/**
 * Delete model config by ID
 */
export async function deleteModelConfigById(id: string): Promise<boolean> {
  const result = await db()
    .delete(aiModelConfig)
    .where(eq(aiModelConfig.id, id));

  return true;
}

/**
 * Get credits cost for a specific model and scene
 */
export async function getModelCreditsCost(
  modelId: string,
  scene: string
): Promise<number> {
  const config = await getModelConfigById(modelId);
  
  if (!config || !config.creditsCost) {
    // Default credits cost
    const defaultCosts: Record<string, number> = {
      'text-to-video': 6,
      'image-to-video': 8,
      'video-to-video': 10,
    };
    return defaultCosts[scene] || 6;
  }

  return config.creditsCost[scene] || 6;
}

/**
 * Get provider model ID based on provider preference
 */
export function getModelProviderId(
  config: ParsedAIModelConfig,
  provider: string
): string {
  // 1. Try to find in mapping
  if (config.providerModelMap && config.providerModelMap[provider]) {
    return config.providerModelMap[provider];
  }

  // 2. Fallback to legacy field if provider matches
  if (config.currentProvider === provider) {
    return config.providerModelId;
  }

  // 3. Fallback to legacy field (careful with this, but maybe safer than crashing?)
  // For now, let's return providerModelId as last resort or empty string?
  // Requirements say: "Unmapped model... keep old logic". 
  // Old logic is just using providerModelId.
  return config.providerModelId;
}
