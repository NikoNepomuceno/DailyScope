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

interface NewsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

interface CategoryCount {
    id: string;
    title: string;
    count: number;
}

async function getInitialNews(topic: string): Promise<{ 
    articles: NewsArticle[]; 
    breakingArticles: NewsArticle[];
    totalArticles: number;
}> {
    try {
        const data = await fetchNews({ topic });
        // Limit to max 10 articles to stay within rate limits
        const allArticles = (data.articles || []).slice(0, 10);
        const breakingArticles = allArticles.slice(0, 5);
        const articles = allArticles.slice(5);
        // Use actual fetched count, not the API's total
        const totalArticles = allArticles.length;

        return { articles, breakingArticles, totalArticles };
    } catch (error) {
        console.error('Error fetching initial news:', error);
        return { articles: [], breakingArticles: [], totalArticles: 0 };
    }
}

// Pre-defined category counts to avoid extra API calls and rate limiting
// These represent the max articles we show per category (10)
function getCategoryCounts(): CategoryCount[] {
    const categories = ['world', 'politics', 'business', 'technology'];
    const categoryTitles: { [key: string]: string } = {
        world: 'World',
        politics: 'Politics', 
        business: 'Business',
        technology: 'Technology'
    };

    return categories.map(cat => ({
        id: cat,
        title: categoryTitles[cat],
        count: 10 // We show max 10 articles per category
    }));
}

export const metadata: Metadata = {
    title: 'Latest News | DailyScope',
    description: 'Read the latest breaking news, technology trends, wide-ranging updates from DailyScope.',
};

export const revalidate = 60;

export default async function NewsPage({ searchParams }: NewsPageProps) {
    const resolvedParams = await searchParams;
    const topic = (typeof resolvedParams.topic === 'string' ? resolvedParams.topic : 'general') || 'general';
    
    // Fetch news for current topic only (no extra API calls for category counts)
    const newsData = await getInitialNews(topic);
    const categoryCounts = getCategoryCounts();

    const { articles, breakingArticles, totalArticles } = newsData;

    return (
        <NewsPageClient
            initialArticles={articles}
            initialBreakingArticles={breakingArticles}
            initialTopic={topic}
            totalArticles={totalArticles}
            categoryCounts={categoryCounts}
        />
    );
}
