import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NovaAI — Enterprise AI Orchestration",
  description: "Multi-provider AI platform with intelligent routing and cost optimization",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
