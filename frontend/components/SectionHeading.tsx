import Link from "next/link";

export function SectionHeading({ eyebrow, title, copy, link }: { eyebrow: string; title: string; copy?: string; link?: { href: string; label: string } }) {
  return <div className="section-header"><div><div className="eyebrow">{eyebrow}</div><h2 className="section-title">{title}</h2></div>{copy ? <p className="section-copy">{copy}</p> : null}{link ? <Link href={link.href} className="button-link">{link.label} →</Link> : null}</div>;
}

