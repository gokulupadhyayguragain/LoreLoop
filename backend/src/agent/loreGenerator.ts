import { invokeJson } from "../shared/bedrock";
import { getConfig } from "../shared/config";
import type { BedrockLoreDraft, LoreEntity, WorldState } from "../shared/types";
import { buildLorePrompt, buildRepairPrompt } from "./prompts";
import { analyzeWorld } from "./worldAnalyzer";
import { parseLoreDraft } from "../shared/validation";

export async function generateLore(
  state: WorldState,
  recentLore: LoreEntity[],
  correction?: string,
): Promise<BedrockLoreDraft> {
  const analysis = analyzeWorld(state, recentLore);
  const prompt = buildLorePrompt(state, recentLore, analysis.guidance, correction);
  try {
    return parseLoreDraft(await invokeJson(prompt));
  } catch (firstError) {
    const repaired = await invokeJson(buildRepairPrompt(String(firstError)))
      .catch(() => invokeJson(buildRepairPrompt(prompt)));
    return parseLoreDraft(repaired);
  }
}

export function getConfiguredTextModel(): string | undefined {
  return getConfig().textModelId;
}

