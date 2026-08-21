export const ENTITY_TYPES = [
  "CHARACTER",
  "LOCATION",
  "EVENT",
  "ARTIFACT",
  "CREATURE",
  "FACTION",
  "MYSTERY",
  "DISCOVERY",
  "CONFLICT",
  "LEGEND",
  "PROPHECY",
  "DOCUMENT",
  "PHENOMENON",
  "CULTURE",
  "TECHNOLOGY",
] as const;

export type EntityType = (typeof ENTITY_TYPES)[number];

export const RELATIONSHIPS = [
  "LOCATED_IN",
  "KNOWS",
  "CREATED_BY",
  "DISCOVERED_BY",
  "CONNECTED_TO",
  "MEMBER_OF",
  "ENEMY_OF",
  "ALLY_OF",
  "OWNS",
  "PROTECTS",
  "CAUSED",
  "PRECEDED",
  "FOLLOWED",
  "REFERENCES",
  "ORIGINATED_FROM",
] as const;

export type Relationship = (typeof RELATIONSHIPS)[number];

export interface LoreConnection {
  targetId?: string;
  targetTitle: string;
  relationship: Relationship;
  description?: string;
}

export type GenerationTrigger = "AUTONOMOUS_SCHEDULE" | "DEVELOPMENT_TEST";
export type LoreStatus = "COMPLETE" | "PARTIAL" | "FAILED";

export interface LoreEntity {
  id: string;
  worldId: string;
  title: string;
  slug: string;
  entityType: EntityType;
  summary: string;
  content: string;
  region?: string;
  era?: string;
  mood?: string;
  importance: number;
  connections: LoreConnection[];
  introducedMysteries: string[];
  resolvedMysteries: string[];
  canonFacts: string[];
  imagePrompt?: string;
  imageKey?: string;
  imageUrl?: string;
  visualStyle?: string;
  worldImpact: string;
  trigger: GenerationTrigger;
  runId: string;
  generatedAt: string;
  generationNumber: number;
  status: LoreStatus;
  modelId?: string;
}

export interface WorldState {
  worldId: string;
  worldName: string;
  generationCount: number;
  currentEra: string;
  dominantThemes: string[];
  unresolvedMysteries: string[];
  majorCharacters: string[];
  majorLocations: string[];
  majorFactions: string[];
  recentEvents: string[];
  lastGenerationAt?: string;
  lastRunId?: string;
}

export type AgentRunStatus = "RUNNING" | "COMPLETE" | "PARTIAL" | "FAILED";

export interface AgentRun {
  runId: string;
  startedAt: string;
  completedAt?: string;
  trigger: GenerationTrigger;
  previousLoreCount: number;
  selectedEntityType?: EntityType;
  generatedLoreId?: string;
  modelId?: string;
  imageGenerated: boolean;
  status: AgentRunStatus;
  durationMs?: number;
  error?: string;
}

export interface ActivityEntry {
  id: string;
  runId: string;
  event: string;
  message: string;
  createdAt: string;
  entityType?: EntityType;
  title?: string;
  status?: string;
}

export interface BedrockLoreDraft {
  title: string;
  entityType: EntityType;
  summary: string;
  content: string;
  region?: string;
  era?: string;
  mood?: string;
  importance: number;
  connections: Array<Omit<LoreConnection, "targetId">>;
  introducedMysteries: string[];
  resolvedMysteries: string[];
  canonFacts: string[];
  visualStyle?: string;
  imagePrompt?: string;
  worldImpact: string;
}

export interface CanonCheck {
  valid: boolean;
  conflicts: string[];
  severity: "NONE" | "MINOR" | "MAJOR";
}

export interface AgentEvent {
  source?: string;
  trigger?: GenerationTrigger;
  id?: string;
  "detail-type"?: string;
  detail?: { trigger?: GenerationTrigger };
}

export interface ApiResponse<T> {
  data: T | null;
  error: { message: string } | null;
}

