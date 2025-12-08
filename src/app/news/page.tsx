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

async function getInitialNews(): Promise<{ articles: NewsArticle[]; breakingArticles: NewsArticle[] }> {
    try {
        const data = await fetchNews({ topic: 'general' });
        const allArticles = data.articles || [];
        const breakingArticles = allArticles.slice(0, 5);
        const articles = allArticles.slice(5);

        return { articles, breakingArticles };
    } catch (error) {
        console.error('Error fetching initial news:', error);
        return { articles: [], breakingArticles: [] };
    }
}

export const metadata: Metadata = {
    title: 'Latest News | DailyScope',
    description: 'Read the latest breaking news, technology trends, wide-ranging updates from DailyScope.',
};

export const revalidate = 60;

export default async function NewsPage() {
    const { articles, breakingArticles } = await getInitialNews();

    return (
        <NewsPageClient
            initialArticles={articles}
            initialBreakingArticles={breakingArticles}
        />
    );
}
