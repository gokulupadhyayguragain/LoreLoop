const steps = ["The scheduler wakes LoreLoop.", "LoreLoop reads the existing world.", "It studies characters, places, events, and open mysteries.", "Amazon Bedrock chooses the next meaningful development.", "LoreLoop validates the new entry against established canon.", "Artwork and lore are stored on AWS.", "The world becomes slightly larger."];

export function HowItWorks() {
  return <div className="cards-grid">{steps.map((step, index) => <div className="memory-card" key={step}><div className="eyebrow">0{index + 1}</div><p style={{ margin: "22px 0 0", lineHeight: 1.6 }}>{step}</p></div>)}</div>;
}

