import type { EntityType, LoreEntity, WorldState } from "../shared/types";

export interface WorldAnalysis {
  guidance: string;
  preferredTypes: EntityType[];
}

const foundationTypes: EntityType[] = ["LOCATION", "EVENT", "PHENOMENON", "MYSTERY"];
const developmentTypes: EntityType[] = ["CHARACTER", "ARTIFACT", "FACTION", "DISCOVERY", "DOCUMENT", "CULTURE"];
const consequenceTypes: EntityType[] = ["CONFLICT", "DISCOVERY", "EVENT", "CULTURE", "TECHNOLOGY", "LEGEND"];

export function analyzeWorld(state: WorldState, recentLore: LoreEntity[]): WorldAnalysis {
  const recentTypes = recentLore.slice(0, 5).map((item) => item.entityType);
  const counts = recentTypes.reduce<Record<string, number>>((result, type) => {
    result[type] = (result[type] ?? 0) + 1;
    return result;
  }, {});
  const pool = state.generationCount < 5 ? foundationTypes : state.generationCount < 16 ? developmentTypes : consequenceTypes;
  const preferredTypes = pool.filter((type) => (counts[type] ?? 0) < 2);
  const types = preferredTypes.length > 0 ? preferredTypes : pool;
  const recentSummary = recentTypes.length ? `Recent rhythm: ${recentTypes.join(", ")}.` : "This is the foundation of the world.";
  const mysteryGuidance = state.unresolvedMysteries.length
    ? `There are open questions worth developing without resolving: ${state.unresolvedMysteries.slice(0, 3).join("; ")}.`
    : "Establish at most one durable mystery if it adds depth.";
  return {
    preferredTypes: types,
    guidance: `Prefer one of ${types.join(", ")}. ${recentSummary} ${mysteryGuidance} Build on earlier locations, people, or events when the link feels earned. Keep the next creation distinct in scale and mood from the last few entries.`,
  };
}

