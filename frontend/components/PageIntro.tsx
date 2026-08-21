export function PageIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <div className="page-hero"><div className="eyebrow">{eyebrow}</div><h1 className="display">{title}</h1><p className="lede">{copy}</p></div>;
}

