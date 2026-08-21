import Link from "next/link";
import { Artwork } from "./Artwork";
import type { LoreEntity } from "@/lib/types";
import { formatDate, formatEntityType } from "@/lib/format";

export function LoreCard({ lore }: { lore: LoreEntity }) {
  return <Link href={`/lore/${lore.id}`} className="lore-card"><Artwork lore={lore} /><div className="lore-card-copy"><div className="meta-row"><span>{formatEntityType(lore.entityType)}</span><span>Gen. {String(lore.generationNumber).padStart(3, "0")}</span></div><h3>{lore.title}</h3><p>{lore.summary}</p><div className="card-foot"><span className="autonomous-badge">Autonomous</span><span>{formatDate(lore.generatedAt, { month: "short", day: "numeric" })}</span></div></div></Link>;
}

