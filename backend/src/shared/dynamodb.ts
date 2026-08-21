import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { getConfig } from "./config";
import type { ActivityEntry, AgentRun, LoreEntity, WorldState } from "./types";

const config = getConfig();
const client = new DynamoDBClient({ region: config.region });
export const documentClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

const worldPk = () => `WORLD#${config.worldId.toUpperCase()}`;

export async function getWorldState(): Promise<WorldState | null> {
  const result = await documentClient.send(new GetCommand({
    TableName: config.tableName,
    Key: { PK: worldPk(), SK: "STATE" },
  }));
  return (result.Item?.data as WorldState | undefined) ?? null;
}

export async function putWorldState(state: WorldState): Promise<void> {
  await documentClient.send(new PutCommand({
    TableName: config.tableName,
    Item: { PK: worldPk(), SK: "STATE", type: "WORLD_STATE", data: state },
  }));
}

export async function getRecentLore(limit = config.recentLoreLimit): Promise<LoreEntity[]> {
  const result = await documentClient.send(new QueryCommand({
    TableName: config.tableName,
    KeyConditionExpression: "PK = :pk AND begins_with(SK, :lore)",
    ExpressionAttributeValues: { ":pk": worldPk(), ":lore": "LORE#" },
    ScanIndexForward: false,
    Limit: Math.max(1, Math.min(limit, 50)),
  }));
  return (result.Items ?? []).map((item) => item.data as LoreEntity);
}

export async function getLoreById(id: string): Promise<LoreEntity | null> {
  const result = await documentClient.send(new GetCommand({
    TableName: config.tableName,
    Key: { PK: `LORE#ID#${id}`, SK: "META" },
  }));
  return (result.Item?.data as LoreEntity | undefined) ?? null;
}

export async function putLore(lore: LoreEntity): Promise<void> {
  await documentClient.send(new PutCommand({
    TableName: config.tableName,
    Item: {
      PK: worldPk(),
      SK: `LORE#${lore.generatedAt}#${lore.id}`,
      type: "LORE",
      data: lore,
      GSI1PK: `ENTITY#${lore.entityType}`,
      GSI1SK: lore.generatedAt,
    },
  }));
  await documentClient.send(new PutCommand({
    TableName: config.tableName,
    Item: { PK: `LORE#ID#${lore.id}`, SK: "META", type: "LORE_LOOKUP", data: lore },
  }));
}

export async function getRun(runId: string): Promise<AgentRun | null> {
  const result = await documentClient.send(new GetCommand({
    TableName: config.tableName,
    Key: { PK: `RUN#${runId}`, SK: "META" },
  }));
  return (result.Item?.data as AgentRun | undefined) ?? null;
}

export async function putRun(run: AgentRun): Promise<void> {
  await documentClient.send(new PutCommand({
    TableName: config.tableName,
    Item: {
      PK: `RUN#${run.runId}`,
      SK: "META",
      type: "AGENT_RUN",
      data: run,
      GSI1PK: worldPk(),
      GSI1SK: `RUN#${run.startedAt}#${run.runId}`,
    },
  }));
}

export async function listRuns(limit = 30): Promise<AgentRun[]> {
  const result = await documentClient.send(new QueryCommand({
    TableName: config.tableName,
    IndexName: "GSI1",
    KeyConditionExpression: "GSI1PK = :pk AND begins_with(GSI1SK, :run)",
    ExpressionAttributeValues: { ":pk": worldPk(), ":run": "RUN#" },
    ScanIndexForward: false,
    Limit: Math.max(1, Math.min(limit, 100)),
  }));
  return (result.Items ?? []).map((item) => item.data as AgentRun);
}

export async function recordActivity(activity: ActivityEntry): Promise<void> {
  await documentClient.send(new PutCommand({
    TableName: config.tableName,
    Item: {
      PK: `RUN#${activity.runId}`,
      SK: `ACTIVITY#${activity.createdAt}#${activity.id}`,
      type: "ACTIVITY",
      data: activity,
      GSI1PK: worldPk(),
      GSI1SK: `ACTIVITY#${activity.createdAt}#${activity.id}`,
    },
  }));
}

export async function listActivity(limit = 40): Promise<ActivityEntry[]> {
  const result = await documentClient.send(new QueryCommand({
    TableName: config.tableName,
    IndexName: "GSI1",
    KeyConditionExpression: "GSI1PK = :pk AND begins_with(GSI1SK, :activity)",
    ExpressionAttributeValues: { ":pk": worldPk(), ":activity": "ACTIVITY#" },
    ScanIndexForward: false,
    Limit: Math.max(1, Math.min(limit, 100)),
  }));
  return (result.Items ?? []).map((item) => item.data as ActivityEntry);
}

export async function getEntityCounts(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  let exclusiveStartKey: Record<string, unknown> | undefined;
  do {
    const result = await documentClient.send(new QueryCommand({
      TableName: config.tableName,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :lore)",
      ExpressionAttributeValues: { ":pk": worldPk(), ":lore": "LORE#" },
      ExclusiveStartKey: exclusiveStartKey,
    }));
    for (const item of result.Items ?? []) {
      if (item.type !== "LORE") continue;
      const entityType = (item.data as LoreEntity).entityType;
      counts[entityType] = (counts[entityType] ?? 0) + 1;
    }
    exclusiveStartKey = result.LastEvaluatedKey;
  } while (exclusiveStartKey);
  return counts;
}

export async function deleteWorldData(): Promise<void> {
  const result = await documentClient.send(new ScanCommand({
    TableName: config.tableName,
    FilterExpression: "begins_with(PK, :world) OR begins_with(PK, :run)",
    ExpressionAttributeValues: { ":world": "WORLD#", ":run": "RUN#" },
    ProjectionExpression: "PK, SK",
  }));
  await Promise.all((result.Items ?? []).map((item) => documentClient.send(new DeleteCommand({
    TableName: config.tableName,
    Key: { PK: item.PK, SK: item.SK },
  }))));
}
