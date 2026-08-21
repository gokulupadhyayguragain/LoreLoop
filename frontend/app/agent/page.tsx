"use client";

import { useEffect, useState } from "react";
import { ActivityList } from "@/components/ActivityList";
import { ErrorState } from "@/components/ErrorState";
import { PageIntro } from "@/components/PageIntro";
import { api } from "@/lib/api";
import { formatDate, scheduleLabel } from "@/lib/format";
import type { ActivityEntry, AgentStatus as Status } from "@/lib/types";

export default function AgentPage() {
  const [activity, setActivity] = useState<ActivityEntry[]>([]); const [status, setStatus] = useState<Status | null>(); const [error, setError] = useState<string>();
  useEffect(() => { void Promise.all([api.activity(), api.status()]).then(([activityResult, statusResult]) => { setActivity(activityResult.data ?? []); setStatus(statusResult.data ?? null); setError(activityResult.error?.message || statusResult.error?.message); }); }, []);
  return <><div className="container"><PageIntro eyebrow="Autonomous agent" title="While nobody is watching." copy="This is the proof layer. Every line below is derived from a scheduled Lambda run, not a simulated loading sequence." /></div><section className="section"><div className="container">{status ? <div className="stat-strip"><div className="stat"><span className="stat-value">{status.status}</span><span className="stat-label">Agent state</span></div><div className="stat"><span className="stat-value">{status.totalGenerations}</span><span className="stat-label">Generations</span></div><div className="stat"><span className="stat-value">{scheduleLabel(status.schedule)}</span><span className="stat-label">Schedule</span></div><div className="stat"><span className="stat-value">{status.lastRunAt ? formatDate(status.lastRunAt, { month: "short", day: "numeric" }) : "Not yet"}</span><span className="stat-label">Last evolution</span></div></div> : <ErrorState message={error || "Agent status is not available yet."} />}<div style={{ height: 64 }} /><div className="eyebrow">Public run record</div><h2 className="section-title">Agent activity.</h2><div style={{ height: 28 }} />{error && !activity.length ? <ErrorState message={error} /> : <ActivityList activity={activity} />}</div></section></>;
}

