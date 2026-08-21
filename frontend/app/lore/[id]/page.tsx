"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Artwork } from "@/components/Artwork";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { api } from "@/lib/api";
import { formatDate, formatEntityType } from "@/lib/format";
import type { LoreEntity } from "@/lib/types";

export default function LoreDetailPage() {
  const params = useParams<{ id: string }>(); const [lore, setLore] = useState<LoreEntity | null>(); const [error, setError] = useState<string>();
  useEffect(() => { if (params.id) void api.loreById(params.id).then((result) => { setLore(result.data); setError(result.error?.message); }); }, [params.id]);
  if (error) return <div className="container"><div style={{ padding: "100px 0" }}><ErrorState message={error} /></div></div>;
  if (!lore) return <div className="container"><div style={{ padding: "100px 0" }}><EmptyState title="The archive is still finding this page." message="This lore entry may not have been published yet." /></div></div>;
  return <div className="container"><div style={{ padding: "55px 0 25px" }}><Link className="button-link" href="/world"><ArrowLeft size={15} /> Back to world</Link></div><article><div className="detail-grid"><Artwork lore={lore} large /><div className="detail-copy"><div className="meta-row"><span>{formatEntityType(lore.entityType)}</span><span>Generation {String(lore.generationNumber).padStart(3, "0")}</span></div><h1>{lore.title}</h1><p className="summary">{lore.summary}</p><div className="detail-metadata"><span>{lore.region || "Uncharted region"}</span><span>{lore.era || "The Third Age"}</span><span>{formatDate(lore.generatedAt)}</span></div><div className="detail-content">{lore.content}</div></div></div><div className="detail-section"><h2>World impact</h2><div className="impact-box">{lore.worldImpact}</div></div><div className="detail-section"><h2>Connected lore</h2>{lore.connections.length ? <ul>{lore.connections.map((connection) => <li key={`${connection.targetTitle}-${connection.relationship}`}>{connection.targetId ? <Link className="connection-link" href={`/lore/${connection.targetId}`}>{connection.targetTitle}</Link> : <span>{connection.targetTitle}</span>} <span className="mono"> · {connection.relationship.replaceAll("_", " ")}</span>{connection.description ? ` — ${connection.description}` : ""}</li>)}</ul> : <p style={{ color: "var(--paper-muted)" }}>This entry stands on its own for now.</p>}</div><div className="detail-section"><h2>Canon notes</h2><ul>{lore.canonFacts.map((fact) => <li key={fact}>{fact}</li>)}</ul></div>{lore.introducedMysteries.length ? <div className="detail-section"><h2>Questions left open</h2><ul>{lore.introducedMysteries.map((mystery) => <li key={mystery}>{mystery}</li>)}</ul></div> : null}<div className="detail-section"><div className="autonomous-badge">Generated autonomously</div><p className="mono" style={{ color: "var(--paper-muted)", fontSize: 11, lineHeight: 1.8 }}>Run ID · {lore.runId}<br />Published · {formatDate(lore.generatedAt, { dateStyle: "full", timeStyle: "short" })}<br />Status · {lore.status}</p></div></article></div>;
}

