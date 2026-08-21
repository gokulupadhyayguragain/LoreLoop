import { invokeImage } from "../shared/bedrock";
import { getConfig } from "../shared/config";
import { storeArtwork } from "../shared/s3";

export async function generateArtwork(
  id: string,
  generatedAt: string,
  imagePrompt: string,
): Promise<{ imageKey?: string; imageUrl?: string }> {
  const config = getConfig();
  if (!config.enableImageGeneration || !config.imageModelId || !config.artworkBucketName) return {};
  const fullPrompt = `${imagePrompt} Cinematic editorial concept art, sophisticated worldbuilding illustration, rich environmental detail. No typography. No captions. No letters. No logos. No watermark.`;
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const image = await invokeImage(fullPrompt);
      const stored = await storeArtwork(id, generatedAt, image);
      return { imageKey: stored.key, imageUrl: stored.url };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Artwork generation failed.");
}
