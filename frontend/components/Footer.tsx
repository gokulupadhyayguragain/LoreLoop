import Link from "next/link";

export function Footer() {
  return <footer className="footer"><div className="container footer-inner"><p><span className="mono">LORELOOP</span> · A fictional world that keeps writing itself.</p><p><Link href="/architecture">Built with Amazon Bedrock + AWS</Link></p></div></footer>;
}

