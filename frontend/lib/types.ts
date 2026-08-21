export const ENTITY_TYPES = [
  "CHARACTER", "LOCATION", "EVENT", "ARTIFACT", "CREATURE", "FACTION", "MYSTERY",
  "DISCOVERY", "CONFLICT", "LEGEND", "PROPHECY", "DOCUMENT", "PHENOMENON", "CULTURE", "TECHNOLOGY",
] as const;

export type EntityType = (typeof ENTITY_TYPES)[number];

export interface LoreConnection {
  targetId?: string;
  targetTitle: string;
  relationship: string;
  description?: string;
}

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
  trigger: "AUTONOMOUS_SCHEDULE" | "DEVELOPMENT_TEST";
  runId: string;
  generatedAt: string;
  generationNumber: number;
  status: "COMPLETE" | "PARTIAL" | "FAILED";
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

export interface AgentStatus {
  status: "ONLINE" | "WAITING" | "OFFLINE";
  worldName: string;
  totalGenerations: number;
  lastRunAt: string | null;
  lastRunStatus: string;
  lastLoreTitle: string | null;
  schedule: string;
  generationMode: "AUTONOMOUS";
}

export interface AgentRun {
  runId: string;
  startedAt: string;
  completedAt?: string;
  trigger: "AUTONOMOUS_SCHEDULE" | "DEVELOPMENT_TEST";
  previousLoreCount: number;
  selectedEntityType?: EntityType;
  generatedLoreId?: string;
  modelId?: string;
  imageGenerated: boolean;
  status: "RUNNING" | "COMPLETE" | "PARTIAL" | "FAILED";
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

export interface WorldStats {
  totalLore: number;
  characters: number;
  locations: number;
  events: number;
  artifacts: number;
  mysteries: number;
  factions: number;
  creatures: number;
  byType?: Record<string, number>;
}

export interface ApiEnvelope<T> {
  data: T | null;
  error: { message: string } | null;
}

