import type { NewsApiResponse } from "@/interfaces/news";

// Mock data for development/testing when API is unreachable
const MOCK_NEWS_DATA: NewsApiResponse = {
    totalArticles: 10,
    articles: [
        {
            title: "Breaking: Major Technology Breakthrough Announced",
            description: "Scientists have made a significant discovery that could revolutionize the tech industry.",
            content: "In a groundbreaking announcement today, researchers unveiled a new technology that promises to change how we interact with digital devices...",
            url: "https://example.com/article1",
            image: "https://picsum.photos/400/300?random=1",
            publishedAt: new Date().toISOString(),
            source: { name: "Tech News", url: "https://example.com" }
        },
        {
            title: "Global Markets React to Economic Changes",
            description: "Stock markets worldwide show positive trends amid economic recovery signals.",
            content: "Markets across the globe are responding favorably to recent economic indicators...",
            url: "https://example.com/article2",
            image: "https://picsum.photos/400/300?random=2",
            publishedAt: new Date(Date.now() - 3600000).toISOString(),
            source: { name: "Business Today", url: "https://example.com" }
        },
        {
            title: "Climate Summit Reaches Historic Agreement",
            description: "World leaders unite on comprehensive climate action plan.",
            content: "After days of intensive negotiations, global leaders have reached a landmark agreement...",
            url: "https://example.com/article3",
            image: "https://picsum.photos/400/300?random=3",
            publishedAt: new Date(Date.now() - 7200000).toISOString(),
            source: { name: "World News", url: "https://example.com" }
        },
        {
            title: "New Medical Treatment Shows Promising Results",
            description: "Clinical trials reveal breakthrough in treatment effectiveness.",
            content: "Medical researchers announce significant progress in treating a previously difficult condition...",
            url: "https://example.com/article4",
            image: "https://picsum.photos/400/300?random=4",
            publishedAt: new Date(Date.now() - 10800000).toISOString(),
            source: { name: "Health & Science", url: "https://example.com" }
        },
        {
            title: "Sports Championship Delivers Thrilling Finale",
            description: "Underdog team secures victory in stunning upset.",
            content: "In an unexpected turn of events, the championship concluded with a dramatic finish...",
            url: "https://example.com/article5",
            image: "https://picsum.photos/400/300?random=5",
            publishedAt: new Date(Date.now() - 14400000).toISOString(),
            source: { name: "Sports Daily", url: "https://example.com" }
        },
        {
            title: "Tech Giant Unveils Revolutionary Product Line",
            description: "New devices promise to reshape consumer technology landscape.",
            content: "A major technology company has announced a new series of products that could change the market...",
            url: "https://example.com/article6",
            image: "https://picsum.photos/400/300?random=6",
            publishedAt: new Date(Date.now() - 18000000).toISOString(),
            source: { name: "Tech Review", url: "https://example.com" }
        },
        {
            title: "Entertainment Industry Embraces New Formats",
            description: "Streaming platforms announce innovative content strategies.",
            content: "The entertainment sector is evolving with new approaches to content delivery...",
            url: "https://example.com/article7",
            image: "https://picsum.photos/400/300?random=7",
            publishedAt: new Date(Date.now() - 21600000).toISOString(),
            source: { name: "Entertainment Weekly", url: "https://example.com" }
        },
        {
            title: "Scientific Discovery Opens New Research Avenues",
            description: "Breakthrough findings could lead to significant advances in multiple fields.",
            content: "Scientists have made an important discovery that opens up new possibilities for research...",
            url: "https://example.com/article8",
            image: "https://picsum.photos/400/300?random=8",
            publishedAt: new Date(Date.now() - 25200000).toISOString(),
            source: { name: "Science Journal", url: "https://example.com" }
        },
        {
            title: "Urban Development Project Transforms City Landscape",
            description: "Major infrastructure improvements bring new life to downtown area.",
            content: "A comprehensive urban renewal project is reshaping the city's core district...",
            url: "https://example.com/article9",
            image: "https://picsum.photos/400/300?random=9",
            publishedAt: new Date(Date.now() - 28800000).toISOString(),
            source: { name: "City News", url: "https://example.com" }
        },
        {
            title: "Education System Implements Innovative Teaching Methods",
            description: "New approaches show improved student engagement and outcomes.",
            content: "Schools are adopting cutting-edge educational strategies with promising results...",
            url: "https://example.com/article10",
            image: "https://picsum.photos/400/300?random=10",
            publishedAt: new Date(Date.now() - 32400000).toISOString(),
            source: { name: "Education Today", url: "https://example.com" }
        }
    ]
};

export interface NewsFetchOptions {
    q?: string;
    topic?: string;
    breaking?: boolean;
    page?: number;
    fromDate?: string;
}

/**
 * Shared service for fetching news data
 * Can be used by both API routes and server components
 */
export async function fetchNews(options: NewsFetchOptions = {}): Promise<NewsApiResponse> {
    try {
        const { q = "", topic, breaking = false } = options;
        const useMockData = process.env.USE_MOCK_NEWS_DATA === 'true';
        
        // Use mock data if enabled
        if (useMockData) {
            console.log('📰 Using mock news data (USE_MOCK_NEWS_DATA=true)');
            return MOCK_NEWS_DATA;
        }
        
        // Check if API key is available
        if (!process.env.GNEWS_API_KEY) {
            console.warn('⚠️  GNEWS_API_KEY not configured - using mock data');
            return MOCK_NEWS_DATA;
        }

        const useTopHeadlines = breaking || (!!topic && !q);
        const endpoint = useTopHeadlines 
            ? "https://gnews.io/api/v4/top-headlines" 
            : "https://gnews.io/api/v4/search";
        const baseUrl = new URL(endpoint);
        
        if (!useTopHeadlines && q) {
            baseUrl.searchParams.set("q", q);
        }
        
        baseUrl.searchParams.set("lang", "en");
        baseUrl.searchParams.set("country", "us");
        baseUrl.searchParams.set("max", "10");
        baseUrl.searchParams.set("apikey", process.env.GNEWS_API_KEY);

        // GNews supports topic param: world, nation, business, technology, entertainment, sports, science, health
        if (topic) {
            baseUrl.searchParams.set("topic", topic);
        }

        // Require a query or topic unless requesting breaking headlines
        if (!breaking && !q && !topic) {
            return {
                error: "Missing query or topic",
                articles: []
            };
        }

        // Add timeout and better error handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        try {
            const res = await fetch(baseUrl.toString(), {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'DailyScope/1.0'
                }
            });

            clearTimeout(timeoutId);

            if (!res.ok) {
                const errorText = await res.text().catch(() => res.statusText);
                console.error(`GNews API error: ${res.status} - ${errorText}`);
                // Fall back to mock data on API errors
                console.log('⚠️  Using mock news data due to API error');
                return MOCK_NEWS_DATA;
            }

            const data = await res.json();
            return data;
        } catch (fetchError: any) {
            clearTimeout(timeoutId);
            
            if (fetchError.name === 'AbortError') {
                console.error('Request timeout after 15 seconds - using mock data');
            } else {
                console.error('Fetch error:', fetchError.message, '- using mock data');
            }
            
            console.log('⚠️  Using mock news data due to API connectivity issues');
            return MOCK_NEWS_DATA;
        }
    } catch (error) {
        console.error("News service error:", error);
        console.log('⚠️  Using mock news data due to error');
        return MOCK_NEWS_DATA;
    }
}

