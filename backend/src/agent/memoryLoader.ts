import { getConfig } from "../shared/config";
import { getRecentLore, getRecentSignals, getWorldState, putWorldState } from "../shared/dynamodb";
import type { LoreEntity, WorldSignal, WorldState } from "../shared/types";

export async function loadWorldMemory(): Promise<{ state: WorldState; recentLore: LoreEntity[]; recentSignals: WorldSignal[] }> {
  const config = getConfig();
  let state = await getWorldState();
  if (!state) {
    state = {
      worldId: config.worldId,
      worldName: config.worldName,
      generationCount: 0,
      currentEra: "The Third Age",
      dominantThemes: ["discovery", "memory", "technology", "civilization"],
      unresolvedMysteries: [],
      majorCharacters: [],
      majorLocations: [],
      majorFactions: [],
      recentEvents: [],
    };
    await putWorldState(state);
  }
  return { state, recentLore: await getRecentLore(config.recentLoreLimit), recentSignals: await getRecentSignals() };
}
