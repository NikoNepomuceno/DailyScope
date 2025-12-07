import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import type { NewsArticle } from "@/interfaces/news";
import { fetchNews } from "@/services/newsService";

// Lazy load client component
const NewsPageClient = dynamic(
    () => import('@/components/pages/NewsPageClient'),
    {
        loading: () => <div className="loading">Loading DailyScope News...</div>,
    }
);

async function getInitialNews(): Promise<{ articles: NewsArticle[]; breakingHeadlines: string[] }> {
    try {
        const data = await fetchNews({ topic: 'general' });
        const articles = data.articles || [];
        const breakingHeadlines = articles.slice(0, 5).map((a) => a.title);

        return { articles, breakingHeadlines };
    } catch (error) {
        console.error('Error fetching initial news:', error);
        return { articles: [], breakingHeadlines: [] };
    }
}

export const metadata: Metadata = {
    title: 'Latest News | DailyScope',
    description: 'Read the latest breaking news, technology trends, wide-ranging updates from DailyScope.',
};

export const revalidate = 60;

export default async function NewsPage() {
    const { articles, breakingHeadlines } = await getInitialNews();

    return (
        <NewsPageClient
            initialArticles={articles}
            initialBreakingHeadlines={breakingHeadlines}
        />
    );
}
