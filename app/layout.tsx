import "./globals.css";
import "../styles/game-ui.css";
import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { ClientProviders } from "@/components/ClientProviders";
import { WebsiteStructuredData } from "@/components/StructuredData";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Analytics } from "@vercel/analytics/next";

// Medium UI & Sans-Serif Font Stack
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  fallback: [
    "medium-content-sans-serif-font",
    "Lucida Grande",
    "Lucida Sans Unicode",
    "Lucida Sans",
    "Geneva",
    "Arial",
    "sans-serif",
  ],
});

// Medium GT Super & Georgia Serif Font Stack
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  fallback: [
    "gt-super",
    "Georgia",
    "Cambria",
    "Times New Roman",
    "Times",
    "serif",
  ],
});



export const metadata: Metadata = {
  metadataBase: new URL("https://messageabcs.vercel.app"),
  title: "MessageABCs - Biblical Truth & Wisdom",
  description:
    "Discover inspiring biblical content and deeper insights on Christian subjects. Ye shall know the truth and the truth shall make you free.",
  keywords: ["bible", "biblical", "Christian", "truth", "faith", "MessageABCs"],
  authors: [{ name: "MessageABCs Team" }],
  icons: {
    icon: [
      { url: "/favicon-new.ico", sizes: "any" },
      { url: "/mabcs.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon-new.ico",
    apple: [
      { url: "/mabcs.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    siteName: "MessageABCs",
    images: [
      {
        url: "https://messageabcs.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "MessageABCs - Biblical Truth & Wisdom",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@messageabcs",
    images: ["https://messageabcs.vercel.app/og-image.png"],
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
      suppressHydrationWarning
      className={`${inter.variable} ${sourceSerif.variable}`}
    >
      <body
        className={`${inter.variable} ${sourceSerif.variable} font-sans bg-background text-foreground transition-colors duration-300 antialiased`}
      >
        <WebsiteStructuredData />
        <ClientProviders>{children}</ClientProviders>
        <FloatingWhatsApp />
        <Analytics />
      </body>
    </html>
  );
}
