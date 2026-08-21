export interface AppConfig {
  region: string;
  worldId: string;
  worldName: string;
  tableName: string;
  artworkBucketName?: string;
  textModelId?: string;
  imageModelId?: string;
  generationSchedule: string;
  recentLoreLimit: number;
  enableImageGeneration: boolean;
  artworkUrlBase?: string;
}

export function getConfig(): AppConfig {
  return {
    region: process.env.AWS_REGION ?? "us-east-1",
    worldId: process.env.WORLD_ID ?? "main",
    worldName: process.env.WORLD_NAME ?? "Aethra",
    tableName: process.env.LORE_TABLE_NAME ?? "LoreLoopWorld",
    artworkBucketName: process.env.ARTWORK_BUCKET_NAME,
    textModelId: process.env.NOVA_TEXT_MODEL_ID,
    imageModelId: process.env.NOVA_IMAGE_MODEL_ID,
    generationSchedule: process.env.GENERATION_SCHEDULE ?? "rate(3 hours)",
    recentLoreLimit: Number(process.env.RECENT_LORE_LIMIT ?? "20"),
    enableImageGeneration: process.env.ENABLE_IMAGE_GENERATION !== "false",
    artworkUrlBase: process.env.ARTWORK_URL_BASE,
  };
}

export function requireTextModel(config: AppConfig): string {
  if (!config.textModelId) {
    throw new Error("NOVA_TEXT_MODEL_ID is required for autonomous generation.");
  }
  return config.textModelId;
}

