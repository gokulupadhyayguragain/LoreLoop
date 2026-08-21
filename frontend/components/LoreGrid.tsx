import type { LoreEntity } from "@/lib/types";
import { LoreCard } from "./LoreCard";
import { EmptyState } from "./EmptyState";

export function LoreGrid({ lore }: { lore: LoreEntity[] }) {
  if (!lore.length) return <EmptyState />;
  return <div className="cards-grid">{lore.map((item) => <LoreCard key={item.id} lore={item} />)}</div>;
}

