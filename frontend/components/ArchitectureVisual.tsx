import { Archive, BrainCircuit, Cloud, Database, Image, Laptop, Radio, Timer, Waypoints } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const nodes: Array<{ icon: LucideIcon; title: string; copy: string }> = [
  { icon: Timer, title: "EventBridge Scheduler", copy: "Wakes the agent on a configurable 15-minute or 3-hour cadence." },
  { icon: Waypoints, title: "LoreLoop Lambda", copy: "Orchestrates memory, creative generation, validation, and publication." },
  { icon: Database, title: "DynamoDB", copy: "Holds world state, canon entities, run records, and public activity." },
  { icon: BrainCircuit, title: "Amazon Bedrock", copy: "Nova chooses the next meaningful creation and checks canon." },
  { icon: Image, title: "Nova Canvas", copy: "Creates artwork when image generation is enabled." },
  { icon: Cloud, title: "Private S3", copy: "Stores artwork behind a non-public bucket boundary." },
  { icon: Radio, title: "CloudWatch", copy: "Records structured evidence from every autonomous awakening." },
  { icon: Laptop, title: "Next.js archive", copy: "Presents the living world through read-only API routes." },
];

export function ArchitectureVisual() {
  return <><div className="architecture">{nodes.map(({ icon: Component, title, copy }) => <div className="architecture-node" key={title}><Component className="architecture-icon" size={19} strokeWidth={1.5} /><h3>{title}</h3><p>{copy}</p></div>)}</div><div className="architecture-note"><Archive size={18} className="architecture-icon" /> <strong>One persistent canon.</strong> The scheduled Lambda reads the compact world state and recent lore before creating anything new. It is not a prompt box with a gallery attached; it is a small publishing system with memory.</div></>;
}
