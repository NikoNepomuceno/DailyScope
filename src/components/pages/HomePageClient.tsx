'use client';

import { useEffect, useState, useMemo } from "react";
import type { NewsArticle, NewsApiResponse } from "@/interfaces/news";

interface HomePageClientProps {
  initialArticles: NewsArticle[];
  initialBreakingHeadlines: string[];
}

export default function HomePageClient({ 
  initialArticles, 
  initialBreakingHeadlines 
}: HomePageClientProps) {
  // ----------------------------
  // State management
  // ----------------------------
  
  const [articles, setArticles] = useState<NewsArticle[]>(initialArticles);
  const [breakingHeadlines, setBreakingHeadlines] = useState<string[]>(initialBreakingHeadlines);
  const [query, setQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreArticles, setHasMoreArticles] = useState(true);
  const [oldestArticleDate, setOldestArticleDate] = useState<string | null>(null);
  
  // ----------------------------
  // Effects
  // ----------------------------

  // Sync breakingHeadlines when props change
  useEffect(() => {
    setBreakingHeadlines(initialBreakingHeadlines);
  }, [initialBreakingHeadlines]);

  // Sync articles when props change
  useEffect(() => {
    setArticles(initialArticles);
  }, [initialArticles]);

  // Load bookmarks + dark mode + font size on mount
  useEffect(() => {
    try {
      const storedBookmarks = localStorage.getItem("bookmarks");
      const storedDark = localStorage.getItem("darkMode") === "true";
      const storedFont = localStorage.getItem("fontSize");

      if (storedBookmarks) setBookmarks(JSON.parse(storedBookmarks));
      setDarkMode(storedDark);
      if (storedFont) setFontSize(Number(storedFont));
    } catch {}
  }, []);

  // Apply dark mode to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  // Save font size
  useEffect(() => {
    localStorage.setItem("fontSize", String(fontSize));
  }, [fontSize]);

  // ----------------------------
  // Fetching logic
  // ----------------------------
  const fetchNews = async (url: string, append = false) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(url);
      const data: NewsApiResponse = await res.json();

      if (data.error) throw new Error(data.error);
      
      const newArticles = data.articles || [];
      
      if (append) {
        setArticles(prev => [...prev, ...newArticles]);
      } else {
        setArticles(newArticles);
        // Reset oldest date for new searches
        setOldestArticleDate(null);
      }
      
      // Track the oldest article date for pagination
      if (newArticles.length > 0) {
        const dates = newArticles.map((article) => new Date(article.publishedAt || Date.now()));
        const oldestDate = new Date(Math.min(...dates.map((d) => d.getTime())));
        setOldestArticleDate(oldestDate.toISOString().split('T')[0]); // Format as YYYY-MM-DD
      }
      
      // Check if we have more articles
      setHasMoreArticles(newArticles.length === 10);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Handlers
  // ----------------------------
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setCurrentPage(1);
    await fetchNews(`/api/news?q=${encodeURIComponent(query)}`);
  };

  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category);
    setQuery(""); // Clear search when switching categories
    setCurrentPage(1);
    await fetchNews(`/api/news?topic=${category}`);
  };

  const handleLoadMore = async () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    
    // Build URL with date filtering for older articles
    let url = '';
    if (query.trim()) {
      // Load older search results
      url = `/api/news?q=${encodeURIComponent(query)}&page=${nextPage}`;
    } else {
      // Load older category results
      url = `/api/news?topic=${selectedCategory}&page=${nextPage}`;
    }
    
    // Add date filter to get articles older than the current oldest
    if (oldestArticleDate) {
      url += `&fromDate=${oldestArticleDate}`;
    }
    
    await fetchNews(url, true);
  };

  const toggleBookmark = (article: NewsArticle) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.url === article.url);
      const updated = exists ? prev.filter((b) => b.url !== article.url) : [article, ...prev];
      localStorage.setItem("bookmarks", JSON.stringify(updated));
      return updated;
    });
  };

  // Font size controls
  const increaseFontSize = () => setFontSize((f) => Math.min(f + 1, 24));
  const decreaseFontSize = () => setFontSize((f) => Math.max(f - 1, 12));

  // Dark mode toggle
  const toggleDarkMode = () => setDarkMode((d) => !d);

  // ----------------------------
  // Text-to-speech
  // ----------------------------
  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const text = articles.map((a) => a.title + ". " + a.description).join(" ");
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const showTicker = useMemo(() => breakingHeadlines.length > 0, [breakingHeadlines]);

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <main>
      {/* HTML structure removed - ready for rebuild */}
    </main>
  );
}

