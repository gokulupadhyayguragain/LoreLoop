"use client";

import { FormEvent, useState } from "react";
import { api } from "@/lib/api";
import type { SignalType, WorldSignal } from "@/lib/types";

const signalTypes: Array<{ value: SignalType; label: string; description: string }> = [
  { value: "QUESTION", label: "Question", description: "Ask what the world should investigate." },
  { value: "THREAD", label: "Thread", description: "Point toward a character, place, or mystery." },
  { value: "MOOD", label: "Mood", description: "Give the next awakening a feeling to carry." },
];

export function InfluenceForm({ onSent }: { onSent?: (signal: WorldSignal) => void }) {
  const [type, setType] = useState<SignalType>("QUESTION");
  const [text, setText] = useState("");
  const [message, setMessage] = useState<string>();
  const [sending, setSending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (text.trim().length < 3) {
      setMessage("Give the archive a little more to work with.");
      return;
    }
    setSending(true);
    setMessage(undefined);
    const result = await api.sendInfluence(type, text.trim());
    setSending(false);
    if (result.data) {
      setText("");
      setMessage("Signal received. LoreLoop will decide whether it belongs in the next awakening.");
      onSent?.(result.data);
    } else {
      setMessage(result.error?.message ?? "Your signal could not reach the archive.");
    }
  }

  return <form className="influence-form" onSubmit={submit}><div className="influence-form-head"><div><div className="eyebrow">Your place in the loop</div><h3>Leave a signal for the world.</h3></div><span className="mono">{text.length}/280</span></div><p className="influence-copy">LoreLoop will not generate on demand. Your signal becomes part of the memory it considers at its next scheduled awakening.</p><div className="signal-types">{signalTypes.map((item) => <button type="button" key={item.value} className={`signal-type ${type === item.value ? "selected" : ""}`} onClick={() => setType(item.value)}><strong>{item.label}</strong><span>{item.description}</span></button>)}</div><textarea value={text} onChange={(event) => setText(event.target.value.slice(0, 280))} placeholder="What should Aethra notice next?" aria-label="Your signal" maxLength={280} rows={4} /><div className="influence-form-foot"><span className="form-message">{message}</span><button className="button-link primary" type="submit" disabled={sending}>{sending ? "Sending" : "Send signal"} <span aria-hidden="true">↗</span></button></div></form>;
}
