'use client';

import { useState, useEffect } from "react";
import type { NewsArticle } from "@/interfaces/news";
import FooterSection from "@/components/landing/FooterSection";
import BreakingTicker from "@/components/molecules/BreakingTicker";
import SearchBar from "@/components/molecules/SearchBar";
import Toolbar from "@/components/organisms/Toolbar";
import ArticleList from "@/components/organisms/ArticleList";

interface NewsPageClientProps {
  initialArticles: NewsArticle[];
  initialBreakingArticles: NewsArticle[];
}

import styles from "./NewsPage.module.css";

// ... previous imports ...

export default function NewsPageClient({
  initialArticles,
  initialBreakingArticles
}: NewsPageClientProps) {

  const [articles, setArticles] = useState<NewsArticle[]>(initialArticles);
  const [breakingArticles] = useState<NewsArticle[]>(initialBreakingArticles);
  const [query, setQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [isSpeaking, setIsSpeaking] = useState(false);

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
        setArticles(data.articles);
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

  return (
    <div className={styles.page}>



      <BreakingTicker articles={breakingArticles} />

      <main className={styles.main}>
        <div className={styles.shell}>

          <header className={styles.header}>
            <h1 className={styles.title}>Latest Visual Briefings</h1>
            <p className={styles.subtitle}>Real-time briefings from across the globe, curated for clarity and depth.</p>
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
