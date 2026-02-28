import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CosmicPulse | Beyond Infinity - AI Agentic Solutions & IT Services",
  description: "CosmicPulse delivers cutting-edge AI Agentic solutions, intelligent automation, and world-class IT services. We build autonomous AI systems that transform businesses beyond infinity.",
  keywords: "AI agents, agentic AI, IT services, AI solutions, autonomous AI, intelligent automation, machine learning, CosmicPulse",
  openGraph: {
    title: "CosmicPulse | Beyond Infinity",
    description: "Pioneering AI Agentic Solutions & Next-Gen IT Services",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
