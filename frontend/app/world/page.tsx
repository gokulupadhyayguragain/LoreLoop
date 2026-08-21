"use client";

import { useEffect, useMemo, useState } from "react";
import { ErrorState } from "@/components/ErrorState";
import { LoreGrid } from "@/components/LoreGrid";
import { PageIntro } from "@/components/PageIntro";
import { WorldMemory } from "@/components/WorldMemory";
import { WorldStats } from "@/components/WorldStats";
import { api } from "@/lib/api";
import { entityFilters } from "@/lib/constants";
import type { LoreEntity, WorldState, WorldStats as Stats } from "@/lib/types";

export default function WorldPage() {
  const [lore, setLore] = useState<LoreEntity[]>([]); const [memory, setMemory] = useState<WorldState | null>(); const [stats, setStats] = useState<Stats | null>(); const [filter, setFilter] = useState<string>("ALL"); const [error, setError] = useState<string>();
  useEffect(() => { void Promise.all([api.lore(50), api.memory(), api.stats()]).then(([loreResult, memoryResult, statsResult]) => { setLore(loreResult.data ?? []); setMemory(memoryResult.data ?? null); setStats(statsResult.data ?? null); setError(loreResult.error?.message); }); }, []);
  const filtered = useMemo(() => filter === "ALL" ? lore : lore.filter((item) => item.entityType === filter), [filter, lore]);
  return <><div className="container"><PageIntro eyebrow="World archive" title="A living canon." copy="LoreLoop keeps one fictional universe in motion. Explore what it has remembered so far — and the questions it has chosen to leave open." /></div><section className="section"><div className="container"><WorldStats stats={stats} /><div style={{ height: 48 }} /><div className="filter-row" role="group" aria-label="Filter lore by type">{entityFilters.map((item) => <button key={item} className={`filter-button ${filter === item ? "selected" : ""}`} onClick={() => setFilter(item)}>{item === "ALL" ? "All" : item.charAt(0) + item.slice(1).toLowerCase()}</button>)}</div>{error ? <ErrorState message={error} /> : <LoreGrid lore={filtered} />}</div></section><section className="section"><div className="container"><div className="eyebrow">Memory layer</div><h2 className="section-title">What the agent carries forward.</h2><div style={{ height: 28 }} />{memory ? <WorldMemory memory={memory} /> : <ErrorState message={error || "The world memory is not available yet."} />}</div></section></>;
}

