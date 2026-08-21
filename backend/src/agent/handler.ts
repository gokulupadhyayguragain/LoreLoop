import type { Handler } from "aws-lambda";
import { randomUUID } from "node:crypto";
import { getConfig } from "../shared/config";
import { getRun, putLore, putRun, putWorldState } from "../shared/dynamodb";
import { logEvent } from "../shared/logger";
import type { AgentEvent, AgentRun, GenerationTrigger, LoreEntity } from "../shared/types";
import { activity } from "./activityLogger";
import { validateCanon } from "./canonValidator";
import { generateArtwork } from "./imageGenerator";
import { loadWorldMemory } from "./memoryLoader";
import { applyLoreToWorldState } from "./memoryWriter";
import { generateLore, getConfiguredTextModel } from "./loreGenerator";
import { resolveConnections } from "./relationBuilder";

function getTrigger(event: AgentEvent): GenerationTrigger {
  return event.trigger ?? event.detail?.trigger ?? (event.source === "development" ? "DEVELOPMENT_TEST" : "AUTONOMOUS_SCHEDULE");
}

function runIdFor(event: AgentEvent, now: Date): string {
  const eventId = event.id?.replace(/[^a-zA-Z0-9_-]/g, "").slice(-10);
  const stamp = now.toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  return `run_${stamp}_${eventId || randomUUID().replace(/-/g, "").slice(0, 6)}`;
}

function slugify(value: string): string {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export interface AgentResult {
  runId: string;
  status: AgentRun["status"];
  loreId?: string;
  title?: string;
}

export const handler: Handler<AgentEvent, AgentResult> = async (event) => {
  const config = getConfig();
  const started = new Date();
  const trigger = getTrigger(event);
  const runId = runIdFor(event, started);
  const existing = await getRun(runId);
  if (existing && existing.status !== "RUNNING") {
    logEvent("AGENT_RUN_IDEMPOTENT_REPLAY", { runId, status: existing.status });
    return { runId, status: existing.status, loreId: existing.generatedLoreId };
  }

  const run: AgentRun = {
    runId,
    startedAt: started.toISOString(),
    trigger,
    previousLoreCount: 0,
    imageGenerated: false,
    status: "RUNNING",
    modelId: getConfiguredTextModel(),
  };
  await putRun(run);
  await activity(runId, "AGENT_RUN_STARTED", "The scheduler awakened LoreLoop.");

  try {
    const memory = await loadWorldMemory();
    run.previousLoreCount = memory.state.generationCount;
    await putRun(run);
    await activity(runId, "WORLD_MEMORY_LOADED", `${memory.recentLore.length} recent canon entries loaded.`);

    const firstDraft = await generateLore(memory.state, memory.recentLore);
    run.selectedEntityType = firstDraft.entityType;
    await activity(runId, "WORLD_ANALYZED", "LoreLoop assessed the world's gaps and recent rhythm.", { entityType: firstDraft.entityType });
    await activity(runId, "ENTITY_TYPE_SELECTED", `${firstDraft.entityType} selected for the next evolution.`, { entityType: firstDraft.entityType });

    let draft = firstDraft;
    let canon = await validateCanon(memory.state, memory.recentLore, draft);
    await activity(runId, "CANON_VALIDATION_COMPLETE", `Canon validation returned ${canon.severity}.`, { status: canon.severity });
    if (canon.severity === "MAJOR") {
      draft = await generateLore(memory.state, memory.recentLore, canon.conflicts.join("; "));
      canon = await validateCanon(memory.state, memory.recentLore, draft);
      await activity(runId, "CANON_RETRY_COMPLETE", `Canon retry returned ${canon.severity}.`, { status: canon.severity });
      if (canon.severity === "MAJOR") throw new Error("The proposed lore could not be reconciled with established canon.");
    }

    const generatedAt = new Date().toISOString();
    const loreId = `lore_${String(memory.state.generationCount + 1).padStart(3, "0")}_${randomUUID().replace(/-/g, "").slice(0, 6)}`;
    await activity(runId, "LORE_GENERATED", draft.title, { title: draft.title, entityType: draft.entityType });
    const lore: LoreEntity = {
      id: loreId,
      worldId: config.worldId,
      title: draft.title,
      slug: slugify(draft.title),
      entityType: draft.entityType,
      summary: draft.summary,
      content: draft.content,
      region: draft.region,
      era: draft.era || memory.state.currentEra,
      mood: draft.mood,
      importance: draft.importance,
      connections: resolveConnections(draft.connections, memory.recentLore),
      introducedMysteries: draft.introducedMysteries,
      resolvedMysteries: draft.resolvedMysteries,
      canonFacts: draft.canonFacts,
      imagePrompt: draft.imagePrompt,
      visualStyle: draft.visualStyle,
      worldImpact: draft.worldImpact,
      trigger,
      runId,
      generatedAt,
      generationNumber: memory.state.generationCount + 1,
      status: "COMPLETE",
      modelId: run.modelId,
    };

    let artworkFailed = false;
    if (config.enableImageGeneration) {
      try {
        const artwork = await generateArtwork(loreId, generatedAt, draft.imagePrompt || `${draft.title}, ${draft.summary}`);
        lore.imageKey = artwork.imageKey;
        lore.imageUrl = artwork.imageUrl;
        run.imageGenerated = Boolean(artwork.imageKey);
        await activity(runId, "ARTWORK_GENERATED", "Matching artwork stored in the world archive.", { status: run.imageGenerated ? "COMPLETE" : "DISABLED" });
      } catch (error) {
        artworkFailed = true;
        lore.status = "PARTIAL";
        logEvent("ARTWORK_GENERATION_FAILED", { runId, message: error instanceof Error ? error.message : "unknown" });
      }
    }

    await putLore(lore);
    const nextState = applyLoreToWorldState(memory.state, lore);
    await putWorldState(nextState);
    run.generatedLoreId = loreId;
    run.completedAt = new Date().toISOString();
    run.durationMs = new Date(run.completedAt).getTime() - started.getTime();
    run.status = artworkFailed ? "PARTIAL" : "COMPLETE";
    await putRun(run);
    await activity(runId, "LORE_PUBLISHED", `${draft.title} is now part of the permanent canon.`, { title: draft.title, status: lore.status });
    await activity(runId, "AGENT_RUN_COMPLETED", `Generation ${lore.generationNumber} completed.`, { status: run.status });
    return { runId, status: run.status, loreId, title: lore.title };
  } catch (error) {
    run.completedAt = new Date().toISOString();
    run.durationMs = new Date(run.completedAt).getTime() - started.getTime();
    run.status = "FAILED";
    run.error = error instanceof Error ? error.message : "Unknown agent failure.";
    await putRun(run);
    await activity(runId, "AGENT_RUN_FAILED", "LoreLoop could not complete this awakening.", { status: "FAILED" });
    throw error;
  }
};

