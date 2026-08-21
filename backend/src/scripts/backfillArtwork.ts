import { generateArtwork } from "../agent/imageGenerator";
import { getRecentLore, putLore } from "../shared/dynamodb";

async function main(): Promise<void> {
  const lore = (await getRecentLore(100)).filter((entry) => !entry.imageKey);
  console.log(`Artwork backfill candidates: ${lore.length}`);
  for (const entry of lore) {
    const artwork = await generateArtwork(entry.id, entry.generatedAt, entry.imagePrompt || `${entry.title}, ${entry.summary}`);
    if (!artwork.imageKey) throw new Error(`No artwork key returned for ${entry.id}.`);
    await putLore({ ...entry, imageKey: artwork.imageKey, status: "COMPLETE" });
    console.log(JSON.stringify({ id: entry.id, title: entry.title, imageKey: artwork.imageKey }));
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
