"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AgentStatus } from "@/components/AgentStatus";
import { Artwork } from "@/components/Artwork";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { HowItWorks } from "@/components/HowItWorks";
import { LoreGrid } from "@/components/LoreGrid";
import { SectionHeading } from "@/components/SectionHeading";
import { WorldMemory } from "@/components/WorldMemory";
import { WorldStats } from "@/components/WorldStats";
import { api } from "@/lib/api";
import { formatDate, formatEntityType } from "@/lib/format";
import type { AgentStatus as AgentStatusData, LoreEntity, WorldState, WorldStats as Stats } from "@/lib/types";

export default function HomePage() {
  const [status, setStatus] = useState<AgentStatusData | null>();
  const [lore, setLore] = useState<LoreEntity[]>([]);
  const [stats, setStats] = useState<Stats | null>();
  const [memory, setMemory] = useState<WorldState | null>();
  const [error, setError] = useState<string>();
  useEffect(() => { void Promise.all([api.status(), api.lore(6), api.stats(), api.memory()]).then(([statusResult, loreResult, statsResult, memoryResult]) => { setStatus(statusResult.data ?? null); setLore(loreResult.data ?? []); setStats(statsResult.data ?? null); setMemory(memoryResult.data ?? null); setError(statusResult.error?.message || loreResult.error?.message); }); }, []);
  const latest = lore[0];
  return <>
    <section className="hero"><div className="container hero-grid"><div><div className="eyebrow">Weekend Creative Agent Challenge · 01</div><h1 className="display">A world that keeps <em>writing itself.</em></h1><p className="lede">LoreLoop is an autonomous creative agent powered by AWS. It remembers the world it has already created, decides what should happen next, and keeps expanding the story while nobody is watching.</p><div className="hero-actions"><Link href="/world" className="button-link primary">Enter the world <span aria-hidden="true">↗</span></Link><Link href="/architecture" className="button-link">See the system</Link></div></div><AgentStatus status={status} /></div></section>
    <section className="section"><div className="container"><SectionHeading eyebrow="The world so far" title="Latest evolution." copy="Every entry is born from the canon that came before it. This archive is the visible edge of an autonomous process." link={{ href: "/timeline", label: "View timeline" }} />{latest ? <div className="feature-lore"><Artwork lore={latest} large /><div className="feature-copy"><div className="meta-row"><span>{formatEntityType(latest.entityType)}</span><span>{latest.region || "Uncharted region"}</span><span>{latest.era || "The Third Age"}</span></div><h3>{latest.title}</h3><p>{latest.summary}</p><div className="feature-foot"><span className="autonomous-badge">Generation {String(latest.generationNumber).padStart(3, "0")} · Autonomous</span><span>{formatDate(latest.generatedAt)}</span></div><Link href={`/lore/${latest.id}`} className="button-link" style={{ marginTop: 25, alignSelf: "flex-start" }}>Read the entry →</Link></div></div> : error ? <ErrorState message={error} /> : <EmptyState />}</div></section>
    <section className="section"><div className="container"><WorldStats stats={stats} /></div></section>
    <section className="section"><div className="container"><SectionHeading eyebrow="The archive" title="The world so far." copy="A growing collection of characters, places, events, and questions — kept in one persistent memory." link={{ href: "/world", label: "Explore all lore" }} />{lore.length ? <LoreGrid lore={lore.slice(0, 6)} /> : error ? <ErrorState message={error} /> : <EmptyState />}</div></section>
    <section className="section"><div className="container"><SectionHeading eyebrow="Persistent memory" title="LoreLoop remembers." copy="The agent does not start from a blank prompt. It carries a compact, evolving record of the world's people, places, factions, and open mysteries." />{memory ? <WorldMemory memory={memory} /> : error ? <ErrorState message={error} /> : <EmptyState />}</div></section>
    <section className="section"><div className="container"><SectionHeading eyebrow="The rhythm" title="How the world evolves." copy="A small autonomous loop, repeated until a fictional universe starts to feel like it has a history." /><HowItWorks /></div></section>
  </>;
}

