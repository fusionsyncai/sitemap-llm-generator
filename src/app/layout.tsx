import type { Metadata } from "next";
import { Poppins, Montserrat, Geist_Mono } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://sitemap.fusionsync.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "FusionSync Sitemap & llms.txt Generator",
  title: {
    default: "Sitemap & llms.txt Generator | FusionSync",
    template: "%s | FusionSync",
  },
  description:
    "Free tool to crawl your website and generate sitemap.xml and llms.txt files for search engines and AI discovery. No API keys required.",
  keywords: [
    "sitemap generator",
    "llms.txt generator",
    "sitemap.xml",
    "llms.txt",
    "GEO",
    "generative engine optimization",
    "AI discovery",
    "AI SEO",
    "FusionSync",
  ],
  authors: [{ name: "FusionSync AI", url: "https://www.fusionsync.ai" }],
  creator: "FusionSync AI",
  publisher: "FusionSync AI",
  category: "technology",
  openGraph: {
    title: "Sitemap & llms.txt Generator",
    description:
      "Generate publish-ready sitemap.xml and llms.txt files from any public website.",
    url: siteUrl,
    siteName: "FusionSync",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "FusionSync AI sitemap.xml and llms.txt generator",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sitemap & llms.txt Generator",
    description:
      "Free deterministic crawler that outputs sitemap.xml and llms.txt.",
    images: ["/twitter-image"],
  },
  icons: {
    icon: [
      {
        url: "/brand/fusion-icon.png",
        type: "image/png",
      },
    ],
    shortcut: "/brand/fusion-icon.png",
    apple: "/brand/fusion-icon.png",
  },
  robots: {
    index: true,
    follow: true,
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
      className={`${poppins.variable} ${montserrat.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-slate-900">{children}</body>
    </html>
  );
}
