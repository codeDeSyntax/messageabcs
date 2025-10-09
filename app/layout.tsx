import "./globals.css";
import "../styles/game-ui.css";
import type { Metadata } from "next";
import { Inter, Crimson_Pro } from "next/font/google";
import { ClientProviders } from "@/components/ClientProviders";
import { WebsiteStructuredData } from "@/components/StructuredData";

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
  title: "Biblical subjects Blogs - Know the truth concerning bible subjects",
  description:
    "Discover inspiring biblical truth content, get a deeper read on different bible subjects usually not taught right amongst Christians",
  keywords: [
    "bible",
    "biblical",
    "subjects",
    "Christian",
    "truth",
    "faith",
    "MessageABCs",
  ],
  authors: [{ name: "MessageABCS Brothers" }],
  icons: {
    icon: "https://messageabcs.vercel.app/mabcs.png?v=3",
    apple: "https://messageabcs.vercel.app/mabcs.png?v=3",
    shortcut: "https://messageabcs.vercel.app/favicon.ico?v=3",
  },
  openGraph: {
    title: "MessageABCs - Biblical Truth & Wisdom",
    description:
      "Discover inspiring biblical content and deeper understanding of Christian subjects",
    type: "website",
    url: "https://messageabcs.vercel.app",
    siteName: "MessageABCs",
    locale: "en_US",
    images: [
      {
        url: "https://messageabcs.vercel.app/mabcs.png?v=3",
        width: 1200,
        height: 300,
        alt: "MessageABCs - Biblical Truth and Wisdom",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@messageabcs",
    creator: "@messageabcs",
    title:
      "Biblical Blogs - Ye shall know the truth and the truth shall make you free",
    description:
      "Discover inspiring biblical truth content, get a deeper read on different bible subjects usually not taught right amongst Christians.",
    images: [
      {
        url: "https://messageabcs.vercel.app/mabcs.png?v=2",
        alt: "MessageABCs - Biblical Truth and Wisdom",
      },
    ],
  },
  other: {
    // WhatsApp specific meta tags (as per official documentation)
    "og:title": "MessageABCs - Biblical Truth & Wisdom",
    "og:description":
      "Discover inspiring biblical content and deeper understanding of Christian subjects",
    "og:url": "https://messageabcs.vercel.app",
    "og:image": "https://messageabcs.vercel.app/mabcs.png?v=3",
    "og:image:type": "image/png",
    "og:image:width": "1200",
    "og:image:height": "300",
    "og:image:alt": "MessageABCs - Biblical Truth and Wisdom",
    "theme-color": "#1e3a8a",
    "msapplication-TileColor": "#1e3a8a",
    "msapplication-TileImage": "https://messageabcs.vercel.app/mabcs.png?v=3",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
      </body>
    </html>
  );
}
