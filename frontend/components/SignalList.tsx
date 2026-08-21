import type { WorldSignal } from "@/lib/types";
import { formatDate } from "@/lib/format";

export function SignalList({ signals }: { signals: WorldSignal[] }) {
  if (!signals.length) return <p className="signal-empty">No reader signals have entered the archive yet.</p>;
  return <div className="signal-list">{signals.slice(0, 8).map((signal) => <div className="signal-item" key={signal.id}><div className="signal-item-meta"><span>{signal.type}</span><span>{formatDate(signal.createdAt, { month: "short", day: "numeric" })}</span></div><p>{signal.text}</p><span className="signal-status">{signal.status === "CONSIDERED" ? "Considered by LoreLoop" : "Waiting for an awakening"}</span></div>)}</div>;
}
