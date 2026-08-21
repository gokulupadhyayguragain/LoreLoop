import { invokeJson } from "../shared/bedrock";
import type { BedrockLoreDraft, CanonCheck, LoreEntity, WorldState } from "../shared/types";
import { buildCanonPrompt } from "./prompts";
import { parseCanonCheck } from "../shared/validation";

export async function validateCanon(
  state: WorldState,
  recentLore: LoreEntity[],
  draft: BedrockLoreDraft,
): Promise<CanonCheck> {
  try {
    return parseCanonCheck(await invokeJson(buildCanonPrompt(state, recentLore, draft), 500));
  } catch {
    return { valid: true, conflicts: [], severity: "NONE" };
  }
}

