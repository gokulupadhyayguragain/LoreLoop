import type { ActivityEntry } from "@/lib/types";
import { EmptyState } from "./EmptyState";
import { formatDate } from "@/lib/format";

export function ActivityList({ activity }: { activity: ActivityEntry[] }) {
  if (!activity.length) return <EmptyState title="No awakenings recorded yet." message="When the scheduler wakes LoreLoop, each step will appear here as public generation evidence." />;
  return <div className="activity-list">{activity.map((item) => <div className="activity-item" key={item.id}><span className="activity-time">{formatDate(item.createdAt, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span><span><span className="activity-event">{item.event.replaceAll("_", " ")}</span><br /><span className="activity-message">{item.message}</span></span><span className="activity-status">{item.status || item.entityType || "Recorded"}</span></div>)}</div>;
}

