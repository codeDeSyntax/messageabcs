import "./globals.css";
import "../styles/game-ui.css";
import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import { ClientProviders } from "@/components/ClientProviders";
import { WebsiteStructuredData } from "@/components/StructuredData";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Analytics } from "@vercel/analytics/next";

// Import Mona Sans font from Google Fonts
const monaSans = Mona_Sans({
  subsets: ["latin"],
  variable: "--font-mona-sans",
  display: "swap",
  fallback: [
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "Noto Sans",
    "sans-serif",
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Segoe UI Symbol",
    "Noto Color Emoji",
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
    icon: "https://messageabcs.vercel.app/mabcs.png",
    apple: "https://messageabcs.vercel.app/mabcs.png",
  },
  openGraph: {
    type: "website",
    siteName: "MessageABCs",
    images: [
      {
        url: "https://messageabcs.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MessageABCs - Biblical Truth & Wisdom",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@messageabcs",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${monaSans.variable} font-sans bg-background text-foreground transition-colors duration-300`}
      >
        <WebsiteStructuredData />
        <ClientProviders>{children}</ClientProviders>
        <FloatingWhatsApp />
        <Analytics />
      </body>
    </html>
  );
}
