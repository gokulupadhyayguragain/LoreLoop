import type { ActivityEntry, AgentStatus, ApiEnvelope, LoreEntity, WorldState, WorldStats, AgentRun } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

export const apiConfigured = Boolean(API_BASE_URL);

async function request<T>(path: string): Promise<ApiEnvelope<T>> {
  if (!API_BASE_URL) return { data: null, error: { message: "Connect the deployed API with NEXT_PUBLIC_API_BASE_URL to open the archive." } };
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store" });
    const payload = (await response.json()) as ApiEnvelope<T>;
    if (!response.ok) return { data: null, error: payload.error ?? { message: "The world archive is temporarily unavailable." } };
    return payload;
  } catch {
    return { data: null, error: { message: "The world archive is temporarily unavailable." } };
  }
}

export const api = {
  lore: (limit = 20) => request<LoreEntity[]>(`/lore?limit=${limit}`),
  timeline: () => request<LoreEntity[]>("/timeline"),
  loreById: (id: string) => request<LoreEntity>(`/lore/${encodeURIComponent(id)}`),
  stats: () => request<WorldStats>("/world/stats"),
  memory: () => request<WorldState>("/world/memory"),
  status: () => request<AgentStatus>("/agent/status"),
  activity: () => request<ActivityEntry[]>("/agent/activity"),
  runs: () => request<AgentRun[]>("/agent/activity"),
};
