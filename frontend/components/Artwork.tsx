/* eslint-disable @next/next/no-img-element -- image hosts are configured at deployment time via ARTWORK_URL_BASE. */
export function Artwork({ lore, large = false }: { lore?: { title: string; imageUrl?: string }; large?: boolean }) {
  return <div className={large ? "feature-art" : "lore-art"} aria-label={lore ? `Artwork for ${lore.title}` : "LoreLoop archive artwork placeholder"} role="img">
    {lore?.imageUrl ? <img src={lore.imageUrl} alt={`Artwork for ${lore.title}`} /> : <><span className="art-label">Archive image pending · LoreLoop visual study</span></>}
  </div>;
}
