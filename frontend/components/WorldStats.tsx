import type { WorldStats as Stats } from "@/lib/types";

export function WorldStats({ stats }: { stats?: Stats | null }) {
  const values = [
    [stats?.totalLore ?? 0, "Total lore"],
    [stats?.characters ?? 0, "Characters"],
    [stats?.locations ?? 0, "Locations"],
    [stats?.mysteries ?? 0, "Open mysteries"],
  ];
  return <div className="stat-strip">{values.map(([value, label]) => <div className="stat" key={String(label)}><span className="stat-value">{value}</span><span className="stat-label">{label}</span></div>)}</div>;
}

