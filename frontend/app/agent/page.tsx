"use client";

import { useEffect, useState } from "react";
import { ActivityList } from "@/components/ActivityList";
import { InfluenceForm } from "@/components/InfluenceForm";
import { SignalList } from "@/components/SignalList";
import { ErrorState } from "@/components/ErrorState";
import { PageIntro } from "@/components/PageIntro";
import { api } from "@/lib/api";
import { formatDate, scheduleLabel } from "@/lib/format";
import type { ActivityEntry, AgentStatus as Status, WorldSignal } from "@/lib/types";

export default function AgentPage() {
  const [activity, setActivity] = useState<ActivityEntry[]>([]); const [signals, setSignals] = useState<WorldSignal[]>([]); const [status, setStatus] = useState<Status | null>(); const [error, setError] = useState<string>();
  useEffect(() => { void Promise.all([api.activity(), api.status(), api.influence()]).then(([activityResult, statusResult, signalResult]) => { setActivity(activityResult.data ?? []); setStatus(statusResult.data ?? null); setSignals(signalResult.data ?? []); setError(activityResult.error?.message || statusResult.error?.message); }); }, []);
  return <><div className="container"><PageIntro eyebrow="Autonomous agent" title="While nobody is watching." copy="This is the proof layer. Every line below is derived from a scheduled Lambda run, not a simulated loading sequence." /></div><section className="section"><div className="container">{status ? <div className="stat-strip"><div className="stat"><span className="stat-value">{status.status}</span><span className="stat-label">Agent state</span></div><div className="stat"><span className="stat-value">{status.totalGenerations}</span><span className="stat-label">Generations</span></div><div className="stat"><span className="stat-value">{scheduleLabel(status.schedule)}</span><span className="stat-label">Schedule</span></div><div className="stat"><span className="stat-value">{status.lastRunAt ? formatDate(status.lastRunAt, { month: "short", day: "numeric" }) : "Not yet"}</span><span className="stat-label">Last evolution</span></div></div> : <ErrorState message={error || "Agent status is not available yet."} />}<div style={{ height: 64 }} /><div className="eyebrow">Public run record</div><h2 className="section-title">Agent activity.</h2><div style={{ height: 28 }} />{error && !activity.length ? <ErrorState message={error} /> : <ActivityList activity={activity} />}<div style={{ height: 70 }} /><div className="eyebrow">Reader influence</div><h2 className="section-title">Signals in the memory.</h2><p className="lede">These signals are inputs to the autonomous system. They do not create a story immediately. LoreLoop chooses what deserves to become canon.</p><div style={{ height: 26 }} /><SignalList signals={signals} /><div style={{ height: 36 }} /><InfluenceForm onSent={(signal) => setSignals((current) => [signal, ...current])} /></div></section></>;
}
