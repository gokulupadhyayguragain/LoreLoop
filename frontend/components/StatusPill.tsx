import type { AgentStatus } from "@/lib/types";
import { scheduleLabel } from "@/lib/format";

export function StatusPill({ status }: { status?: AgentStatus | null }) {
  const online = status?.status === "ONLINE";
  return <div className="status-pill" title={status?.schedule ? scheduleLabel(status.schedule) : undefined}><span className={`status-dot ${status ? "" : "offline"}`} />{online ? "Agent online" : status ? "Agent waiting" : "Archive unconfigured"}</div>;
}

