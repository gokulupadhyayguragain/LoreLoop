import { describe, expect, it } from "vitest";
import { applyLoreToWorldState } from "../src/agent/memoryWriter";
import type { LoreEntity, WorldState } from "../src/shared/types";

const state: WorldState = {
  worldId: "main", worldName: "Aethra", generationCount: 2, currentEra: "The Third Age",
  dominantThemes: [], unresolvedMysteries: ["The bell beneath the lake"], majorCharacters: [], majorLocations: [], majorFactions: [], recentEvents: [],
};

const lore: LoreEntity = {
  id: "lore_003", worldId: "main", title: "Lake Wardens", slug: "lake-wardens", entityType: "FACTION", summary: "A patient order.", content: "A finished piece of lore that is long enough for the model schema and describes a meaningful part of the world in a few sentences.", importance: 55, connections: [], introducedMysteries: ["Why do the wardens count the bell's silences?"] , resolvedMysteries: [], canonFacts: ["The wardens guard the lake."], worldImpact: "The lake now has a visible custodial culture.", trigger: "DEVELOPMENT_TEST", runId: "run_test", generatedAt: "2026-08-21T00:00:00.000Z", generationNumber: 3, status: "COMPLETE",
};

describe("world memory writer", () => {
  it("increments generations and remembers factions and mysteries", () => {
    const next = applyLoreToWorldState(state, lore);
    expect(next.generationCount).toBe(3);
    expect(next.majorFactions).toContain("Lake Wardens");
    expect(next.unresolvedMysteries).toContain("Why do the wardens count the bell's silences?");
  });
});

