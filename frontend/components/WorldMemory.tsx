import type { WorldState } from "@/lib/types";

function MemoryList({ title, items }: { title: string; items?: string[] }) {
  return <div className="memory-card"><div className="eyebrow">{title}</div><h3>{items?.length ? `${items.length} remembered` : "No entries yet"}</h3><ul className={`memory-list ${items?.length ? "" : "empty"}`}>{items?.length ? items.map((item) => <li key={item}>{item}</li>) : <li>Waiting for the world’s first detail.</li>}</ul></div>;
}

export function WorldMemory({ memory }: { memory?: WorldState | null }) {
  return <div className="memory-panel"><MemoryList title="Major locations" items={memory?.majorLocations} /><MemoryList title="Major characters" items={memory?.majorCharacters} /><MemoryList title="Open mysteries" items={memory?.unresolvedMysteries} /><p className="memory-note">LoreLoop reads this evolving memory before deciding what the world should become next. The archive is intentionally concise; individual stories hold the richer canon.</p></div>;
}

