import { Suspense } from 'react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import type { NewsArticle } from "@/interfaces/news";
import { fetchNews } from "@/services/newsService";

// Lazy load heavy components to reduce initial bundle size.
// HomePageClient is a client component imported into this server component.
// We rely on Next.js to handle the client boundary; SSR disabling is not
// supported in App Router server components.
const HomePageClient = dynamic(
  () => import('@/components/pages/HomePageClient'),
  {
    loading: () => <div className="loading">Loading DailyScope News...</div>,
  }
);

/**
 * Fetch initial news data on the server
 * Using ISR (Incremental Static Regeneration) for optimal performance
 * Revalidates every 60 seconds to keep content fresh
 * 
 * Uses the shared newsService instead of making HTTP requests to API routes
 */
async function getInitialNews(): Promise<{ articles: NewsArticle[]; breakingHeadlines: string[] }> {
  try {
    // Use the shared service directly - no HTTP request needed
    // This works better in server components and during build
    const data = await fetchNews({ topic: 'general' });

    if (data.error) {
      console.warn('News service returned error:', data.error);
      // Still return articles if available, even with error
    }

    const articles = data.articles || [];
    const breakingHeadlines = articles.slice(0, 10).map((a) => a.title);

    return { articles, breakingHeadlines };
  } catch (error) {
    console.error('Error fetching initial news:', error);
    // Return empty arrays on error - client will handle fallback
    // This allows the page to still render, and the client component
    // can fetch data on mount if needed
    return { articles: [], breakingHeadlines: [] };
  }
}

// Enhanced SEO metadata
export const metadata: Metadata = {
  title: {
    default: 'DailyScope News - Latest Breaking News & Headlines',
    template: '%s | DailyScope News'
  },
  description: 'Stay updated with the latest breaking news, technology trends, business updates, science discoveries, and more. Your trusted source for comprehensive news coverage.',
  keywords: ['news', 'breaking news', 'technology', 'business', 'science', 'health', 'entertainment', 'sports', 'world news'],
  authors: [{ name: 'DailyScope News' }],
  creator: 'DailyScope News',
  publisher: 'DailyScope News',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'DailyScope News',
    title: 'DailyScope News - Latest Breaking News & Headlines',
    description: 'Stay updated with the latest breaking news, technology trends, business updates, and more.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DailyScope News',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DailyScope News - Latest Breaking News & Headlines',
    description: 'Stay updated with the latest breaking news, technology trends, business updates, and more.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

/**
 * Home Page - Server Component with SSR/ISR
 * Fetches initial data on the server for better SEO and performance
 * Revalidates every 60 seconds to keep content fresh
 */
export const revalidate = 60;

export default async function HomePage() {
  // Fetch initial data on the server
  const { articles, breakingHeadlines } = await getInitialNews();

  return (
    <Suspense fallback={<div className="loading">Loading DailyScope News...</div>}>
      <HomePageClient
        initialArticles={articles}
        initialBreakingHeadlines={breakingHeadlines}
      />
    </Suspense>
  );
}
