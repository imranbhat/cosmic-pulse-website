import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CosmicPulse | Beyond Infinity - AI Agentic Solutions & IT Services",
  description:
    "CosmicPulse delivers cutting-edge AI Agentic solutions, intelligent automation, and world-class IT services. We build autonomous AI systems that transform businesses beyond infinity.",
  keywords:
    "AI agents, agentic AI, IT services, AI solutions, autonomous AI, intelligent automation, machine learning, CosmicPulse",
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
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        {/* Inline script prevents flash of wrong theme on load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='light')document.documentElement.setAttribute('data-theme','light')}catch(e){}`,
          }}
        />
      </head>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
