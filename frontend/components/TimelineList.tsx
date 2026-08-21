import Link from "next/link";
import type { LoreEntity } from "@/lib/types";
import { formatDate, formatEntityType } from "@/lib/format";
import { EmptyState } from "./EmptyState";

export function TimelineList({ lore }: { lore: LoreEntity[] }) {
  if (!lore.length) return <EmptyState />;
  return <div className="timeline">{lore.map((item) => <div className="timeline-item" key={item.id}><div className="timeline-date">{formatDate(item.generatedAt, { month: "short", day: "numeric" })}</div><div className="timeline-content"><div><div className="eyebrow">Generation {String(item.generationNumber).padStart(3, "0")}</div><h3><Link href={`/lore?id=${encodeURIComponent(item.id)}`}>{item.title}</Link></h3><p>{item.summary}</p></div><div className="timeline-aside">{formatEntityType(item.entityType)}<br />{item.region || "Uncharted region"}<br /><br /><span className="autonomous-badge">Autonomous</span></div></div></div>)}</div>;
}
