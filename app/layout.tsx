import "./globals.css";
import "../styles/game-ui.css";
import type { Metadata } from "next";
import { Inter, Crimson_Pro } from "next/font/google";
import { ClientProviders } from "@/components/ClientProviders";
import { WebsiteStructuredData } from "@/components/StructuredData";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

// Import Google Fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-crimson",
  weight: ["300", "400", "500", "600", "700"],
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
        url: "https://messageabcs.vercel.app/mabcs.png",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${crimsonPro.variable} font-crimson bg-background text-foreground transition-colors duration-300`}
      >
        <WebsiteStructuredData />
        <ClientProviders>{children}</ClientProviders>
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
