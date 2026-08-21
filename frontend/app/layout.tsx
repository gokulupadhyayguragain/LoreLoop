import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "LoreLoop. A World That Keeps Writing Itself.",
  description: "LoreLoop is an autonomous worldbuilding agent powered by AWS that continuously creates and expands a persistent fictional universe.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <div className="site-shell"><Header /><main>{children}</main><Footer /></div>;
}
