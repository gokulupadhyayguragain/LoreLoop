import type { LoreEntity, WorldState } from "../shared/types";

export function applyLoreToWorldState(state: WorldState, lore: LoreEntity): WorldState {
  const addUnique = (items: string[], value: string, limit = 8): string[] => [value, ...items.filter((item) => item !== value)].slice(0, limit);
  const next: WorldState = {
    ...state,
    generationCount: state.generationCount + 1,
    lastGenerationAt: lore.generatedAt,
    lastRunId: lore.runId,
    unresolvedMysteries: [...state.unresolvedMysteries, ...lore.introducedMysteries]
      .filter((mystery) => !lore.resolvedMysteries.includes(mystery))
      .filter((item, index, all) => all.indexOf(item) === index)
      .slice(-12),
    recentEvents: [lore.title, ...state.recentEvents].slice(0, 8),
  };

  if (lore.entityType === "CHARACTER") next.majorCharacters = addUnique(state.majorCharacters, lore.title);
  if (lore.entityType === "LOCATION") next.majorLocations = addUnique(state.majorLocations, lore.title);
  if (lore.entityType === "FACTION") next.majorFactions = addUnique(state.majorFactions, lore.title);
  if (lore.resolvedMysteries.length) {
    next.unresolvedMysteries = next.unresolvedMysteries.filter((item) => !lore.resolvedMysteries.includes(item));
  }
  return next;
}

