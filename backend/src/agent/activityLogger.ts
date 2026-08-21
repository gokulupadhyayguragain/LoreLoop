import { randomUUID } from "node:crypto";
import { recordActivity } from "../shared/dynamodb";
import { logEvent } from "../shared/logger";
import type { ActivityEntry, EntityType } from "../shared/types";

export async function activity(
  runId: string,
  event: string,
  message: string,
  details: { entityType?: EntityType; title?: string; status?: string } = {},
): Promise<void> {
  const entry: ActivityEntry = { id: randomUUID(), runId, event, message, createdAt: new Date().toISOString(), ...details };
  logEvent(event, { runId, ...details });
  await recordActivity(entry);
}

