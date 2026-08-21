import type { APIGatewayProxyHandler } from "aws-lambda";
import { randomUUID } from "node:crypto";
import { getConfig } from "../shared/config";
import { getEntityCounts, getLoreById, getRecentLore, getRecentSignals, getWorldState, listActivity, listRuns, putSignal } from "../shared/dynamodb";
import { parseSignal } from "../shared/validation";
import { failure, ok } from "./response";

const config = getConfig();

export const handler: APIGatewayProxyHandler = async (event) => {
  if (event.httpMethod === "OPTIONS") return ok({});
  const path = event.path || event.requestContext?.resourcePath || "/";
  try {
    if (path === "/lore" && event.httpMethod === "GET") {
      const limit = Number(event.queryStringParameters?.limit ?? "20");
      return ok(await getRecentLore(Number.isFinite(limit) ? limit : 20));
    }
    if (path.startsWith("/lore/") && event.httpMethod === "GET") {
      const id = event.pathParameters?.id ?? path.split("/").pop();
      if (!id) return failure(400, "Lore id is required.");
      const lore = await getLoreById(id);
      return lore ? ok(lore) : failure(404, "Lore entry not found.");
    }
    if (path === "/timeline" && event.httpMethod === "GET") return ok(await getRecentLore(100));
    if (path === "/world/memory" && event.httpMethod === "GET") {
      const state = await getWorldState();
      return ok(state ?? {
        worldId: config.worldId,
        worldName: config.worldName,
        generationCount: 0,
        currentEra: "The Third Age",
        dominantThemes: ["discovery", "memory", "technology", "civilization"],
        unresolvedMysteries: [], majorCharacters: [], majorLocations: [], majorFactions: [], recentEvents: [],
      });
    }
    if (path === "/world/stats" && event.httpMethod === "GET") {
      const counts = await getEntityCounts();
      return ok({
        totalLore: Object.values(counts).reduce((sum, value) => sum + value, 0),
        characters: counts.CHARACTER ?? 0,
        locations: counts.LOCATION ?? 0,
        events: counts.EVENT ?? 0,
        artifacts: counts.ARTIFACT ?? 0,
        mysteries: counts.MYSTERY ?? 0,
        factions: counts.FACTION ?? 0,
        creatures: counts.CREATURE ?? 0,
        byType: counts,
      });
    }
    if (path === "/agent/status" && event.httpMethod === "GET") {
      const [state, lore, runs] = await Promise.all([getWorldState(), getRecentLore(1), listRuns(1)]);
      const lastRun = runs[0];
      return ok({
        status: "ONLINE",
        worldName: state?.worldName ?? config.worldName,
        totalGenerations: state?.generationCount ?? 0,
        lastRunAt: state?.lastGenerationAt ?? null,
        lastRunStatus: lastRun?.status ?? "WAITING",
        lastLoreTitle: lore[0]?.title ?? null,
        schedule: config.generationSchedule,
        generationMode: "AUTONOMOUS",
      });
    }
    if (path === "/agent/activity" && event.httpMethod === "GET") return ok(await listActivity(60));
    if (path === "/influence" && event.httpMethod === "GET") return ok(await getRecentSignals(20));
    if (path === "/influence" && event.httpMethod === "POST") {
      const rawBody = event.isBase64Encoded ? Buffer.from(event.body ?? "", "base64").toString("utf8") : event.body ?? "{}";
      const input = parseSignal(JSON.parse(rawBody));
      const signal = {
        id: `signal_${randomUUID().replace(/-/g, "").slice(0, 10)}`,
        worldId: config.worldId,
        type: input.type,
        text: input.text,
        createdAt: new Date().toISOString(),
        status: "OPEN" as const,
      };
      await putSignal(signal);
      return ok(signal);
    }
    return failure(404, "Archive route not found.");
  } catch (error) {
    console.error(JSON.stringify({ event: "API_REQUEST_FAILED", path, message: error instanceof Error ? error.message : "unknown" }));
    return failure(503, "The world archive is temporarily unavailable.");
  }
};
