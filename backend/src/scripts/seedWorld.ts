import { putWorldState } from "../shared/dynamodb";
import { getConfig } from "../shared/config";

async function main(): Promise<void> {
  const config = getConfig();
  await putWorldState({
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
  });
  console.log(`Seeded ${config.worldName} world state.`);
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});

