import Link from "next/link";
import type { AgentStatus as Status } from "@/lib/types";
import { formatRelative, scheduleLabel } from "@/lib/format";

export function AgentStatus({ status }: { status?: Status | null }) {
  if (!status) return <div className="hero-note"><strong>Autonomy needs a home.</strong>The frontend is ready, but it is not connected to a deployed API yet. Add <span className="mono">NEXT_PUBLIC_API_BASE_URL</span> to open the live archive.</div>;
  return <div className="hero-note"><strong><span className="status-dot" /> &nbsp;Agent {status.status === "ONLINE" ? "online" : "waiting"}</strong>LoreLoop is running in autonomous mode. It wakes on <span className="mono">{scheduleLabel(status.schedule)}</span>, reads the canon, and publishes one meaningful evolution at a time.<div className="signal-line">Last evolution {formatRelative(status.lastRunAt)} <Link href="/agent">View activity →</Link></div></div>;
}

