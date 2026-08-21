import { z } from "zod";
import { ENTITY_TYPES, RELATIONSHIPS } from "./types";
import type { BedrockLoreDraft, CanonCheck } from "./types";

const boundedText = (max: number) => z.string().trim().min(1).max(max);

export const loreDraftSchema = z.object({
  title: boundedText(120),
  entityType: z.enum(ENTITY_TYPES),
  summary: boundedText(500),
  content: z.string().trim().min(80).max(6000),
  region: z.string().trim().max(120).optional().default(""),
  era: z.string().trim().max(120).optional().default(""),
  mood: z.string().trim().max(80).optional().default(""),
  importance: z.coerce.number().int().min(1).max(100),
  connections: z.array(z.object({
    targetTitle: boundedText(120),
    relationship: z.enum(RELATIONSHIPS),
    description: z.string().trim().max(400).optional(),
  })).max(4).default([]),
  introducedMysteries: z.array(boundedText(240)).max(5).default([]),
  resolvedMysteries: z.array(boundedText(240)).max(5).default([]),
  canonFacts: z.array(boundedText(300)).max(8).default([]),
  visualStyle: z.string().trim().max(500).optional().default(""),
  imagePrompt: z.string().trim().max(1800).optional().default(""),
  worldImpact: boundedText(500),
});

export const canonCheckSchema = z.object({
  valid: z.boolean(),
  conflicts: z.array(z.string().trim().max(400)).max(5).default([]),
  severity: z.enum(["NONE", "MINOR", "MAJOR"]),
});

export const signalSchema = z.object({
  type: z.enum(["QUESTION", "THREAD", "MOOD"]),
  text: z.string().trim().min(3).max(280),
});

export function parseLoreDraft(value: unknown): BedrockLoreDraft {
  return loreDraftSchema.parse(value);
}

export function parseCanonCheck(value: unknown): CanonCheck {
  return canonCheckSchema.parse(value);
}

export function parseSignal(value: unknown): { type: "QUESTION" | "THREAD" | "MOOD"; text: string } {
  return signalSchema.parse(value);
}

export function safeJsonParse(value: string): unknown {
  const trimmed = value.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(trimmed.slice(start, end + 1));
    throw new Error("Bedrock returned malformed JSON.");
  }
}
