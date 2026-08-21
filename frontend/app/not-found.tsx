import Link from "next/link";

export default function NotFound() {
  return <div className="container"><div style={{ padding: "120px 0", textAlign: "center" }}><div className="eyebrow">404 · Uncharted</div><h1 className="section-title">This page is not in the canon.</h1><p className="lede" style={{ margin: "20px auto" }}>The archive has no record of this place yet.</p><Link href="/" className="button-link">Return home</Link></div></div>;
}

