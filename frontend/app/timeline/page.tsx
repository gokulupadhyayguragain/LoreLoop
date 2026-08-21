"use client";

import { useEffect, useState } from "react";
import { ErrorState } from "@/components/ErrorState";
import { PageIntro } from "@/components/PageIntro";
import { TimelineList } from "@/components/TimelineList";
import { api } from "@/lib/api";
import type { LoreEntity } from "@/lib/types";

export default function TimelinePage() {
  const [lore, setLore] = useState<LoreEntity[]>([]); const [error, setError] = useState<string>();
  useEffect(() => { void api.timeline().then((result) => { setLore(result.data ?? []); setError(result.error?.message); }); }, []);
  return <><div className="container"><PageIntro eyebrow="World timeline" title="History, one awakening at a time." copy="The order matters. LoreLoop's later creations are shaped by the details it has already placed in the world." /></div><section className="section"><div className="container">{error ? <ErrorState message={error} /> : <TimelineList lore={lore} />}</div></section></>;
}

