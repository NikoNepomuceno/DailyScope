'use client';

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { NewsArticle } from "@/interfaces/news";
import FooterSection from "@/components/landing/FooterSection";
import BreakingTicker from "@/components/molecules/BreakingTicker";
import CategoryExplorer, { type CategoryCount } from "@/components/molecules/CategoryExplorer";
import SearchBar from "@/components/molecules/SearchBar";
import Toolbar from "@/components/organisms/Toolbar";
import ArticleList from "@/components/organisms/ArticleList";

interface NewsPageClientProps {
  initialArticles: NewsArticle[];
  initialBreakingArticles: NewsArticle[];
  initialTopic?: string;
  totalArticles?: number;
  categoryCounts?: CategoryCount[];
}

import styles from "./NewsPage.module.css";

const topicTitles: { [key: string]: string } = {
  general: 'Top Headlines',
  world: 'World News',
  politics: 'Politics',
  business: 'Business',
  technology: 'Technology',
  entertainment: 'Entertainment',
  sports: 'Sports',
  science: 'Science',
  health: 'Health'
};

export default function NewsPageClient({
  initialArticles,
  initialBreakingArticles,
  initialTopic = 'general',
  totalArticles = 0,
  categoryCounts = []
}: NewsPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [articles, setArticles] = useState<NewsArticle[]>(initialArticles);
  const [breakingArticles] = useState<NewsArticle[]>(initialBreakingArticles);
  const [query, setQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(initialTopic);
  const [currentTotalArticles, setCurrentTotalArticles] = useState(totalArticles);

  // Update state when URL params change
  useEffect(() => {
    const urlTopic = searchParams.get('topic') || 'general';
    if (urlTopic !== currentTopic) {
      setCurrentTopic(urlTopic);
      fetchArticlesByTopic(urlTopic);
    }
  }, [searchParams]);

  // Update articles when initial data changes (from server)
  useEffect(() => {
    setArticles(initialArticles);
    setCurrentTotalArticles(totalArticles);
  }, [initialArticles, totalArticles]);

  const fetchArticlesByTopic = useCallback(async (topic: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/news?topic=${encodeURIComponent(topic)}`);
      const data = await res.json();
      if (data.articles) {
        // Limit to max 10 articles to avoid rate limiting
        const limitedArticles = data.articles.slice(0, 10);
        setArticles(limitedArticles);
        setCurrentTotalArticles(limitedArticles.length);
      }
    } catch (err) {
      console.error("Failed to fetch topic articles", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      const storedBookmarks = localStorage.getItem("bookmarks");
      const storedDark = localStorage.getItem("darkMode") === "true";
      const storedFont = localStorage.getItem("fontSize");

      if (storedBookmarks) setBookmarks(JSON.parse(storedBookmarks));
      setDarkMode(storedDark);
      if (storedFont) setFontSize(Number(storedFont));
    } catch (e) {
      console.error("Failed to load preferences", e);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("fontSize", String(fontSize));
  }, [fontSize]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/news?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.articles) {
        // Limit to max 10 articles to avoid rate limiting
        const limitedArticles = data.articles.slice(0, 10);
        setArticles(limitedArticles);
        setCurrentTotalArticles(limitedArticles.length);
      }
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = (article: NewsArticle) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.url === article.url);
      const updated = exists ? prev.filter((b) => b.url !== article.url) : [article, ...prev];
      localStorage.setItem("bookmarks", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const text = articles.map((a) => a.title).join(". ");
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const topicTitle = topicTitles[currentTopic] || 'Top Headlines';

  return (
    <div className={styles.page}>
      <BreakingTicker articles={breakingArticles} />
      <CategoryExplorer categoryCounts={categoryCounts} />

      <main className={styles.main}>
        <div className={styles.shell}>

          <header className={styles.header}>
            <div className={styles.featuredLabel}>
              {currentTopic !== 'general' ? `${topicTitle} • ${currentTotalArticles} articles available` : 'Featured Stories'}
            </div>
            <div className={styles.headlineRow}>
              <h1 className={styles.title}>
                Today&apos;s <span className={styles.titleHighlight}>{topicTitle}</span>
              </h1>
            </div>
          </header>

          <Toolbar
            darkMode={darkMode}
            toggleDarkMode={() => setDarkMode(!darkMode)}
            fontSize={fontSize}
            increaseFontSize={() => setFontSize(s => Math.min(s + 1, 24))}
            decreaseFontSize={() => setFontSize(s => Math.max(s - 1, 12))}
            isSpeaking={isSpeaking}
            toggleSpeech={toggleSpeech}
          />

          <SearchBar query={query} setQuery={setQuery} onSearch={handleSearch} />

          <div className={styles.content}>
            {loading ? (
              <div className={styles.loading}>
                Scanning global sources...
              </div>
            ) : (
              <ArticleList
                articles={articles.filter(a => !breakingArticles.some(b => b.title === a.title))}
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
                fontSize={fontSize}
              />
            )}
          </div>

        </div>
      </main>
      <FooterSection />
    </div>
  );
}
