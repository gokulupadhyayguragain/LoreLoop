"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems } from "@/lib/constants";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return <header className="site-header"><div className="container header-inner">
    <Link href="/" className="brand" aria-label="LoreLoop home" onClick={() => setOpen(false)}><span className="brand-mark" aria-hidden="true" />LORELOOP</Link>
    <nav className={`nav ${open ? "open" : ""}`} aria-label="Main navigation">
      {navItems.map((item) => <Link key={item.href} href={item.href} className={pathname.startsWith(item.href) ? "active" : ""} onClick={() => setOpen(false)}>{item.label}</Link>)}
    </nav>
    <span className="status-pill"><span className="status-dot" />Autonomous agent</span>
    <button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open}>{open ? <X size={20} /> : <Menu size={20} />}</button>
  </div></header>;
}

