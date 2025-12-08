import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DailyScope News - Latest Breaking News & Headlines",
    template: "%s | DailyScope News"
  },
  description: "Stay updated with the latest breaking news, technology trends, business updates, science discoveries, and more. Your trusted source for comprehensive news coverage.",
  keywords: ["news", "breaking news", "technology", "business", "science", "health", "entertainment", "sports", "world news"],
  authors: [{ name: "DailyScope News" }],
  creator: "DailyScope News",
  publisher: "DailyScope News",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "DailyScope News",
    title: "DailyScope News - Latest Breaking News & Headlines",
    description: "Stay updated with the latest breaking news, technology trends, business updates, and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DailyScope News - Latest Breaking News & Headlines",
    description: "Stay updated with the latest breaking news, technology trends, business updates, and more.",
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
    <html lang="en">
      <body
        className={`${montserrat.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>

      </body>
    </html>
  );
}
