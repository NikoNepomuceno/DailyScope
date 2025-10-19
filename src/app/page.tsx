'use client';

import { useEffect, useState, useMemo } from "react";
import Toolbar from "@/components/news/Toolbar";
import BreakingTicker from "@/components/news/BreakingTicker";
import SearchBar from "@/components/news/SearchBar";
import ArticleList from "@/components/news/ArticleList";

export default function HomePage() {
  // ----------------------------
  // State management
  // ----------------------------
  const [articles, setArticles] = useState<any[]>([]);
  const [breakingHeadlines, setBreakingHeadlines] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreArticles, setHasMoreArticles] = useState(true);
  const [oldestArticleDate, setOldestArticleDate] = useState<string | null>(null);

  // ----------------------------
  // Effects
  // ----------------------------

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
      const data = await res.json();

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
        const dates = newArticles.map((article: any) => new Date(article.publishedAt || article.pubDate || Date.now()));
        const oldestDate = new Date(Math.min(...dates.map((d: Date) => d.getTime())));
        setOldestArticleDate(oldestDate.toISOString().split('T')[0]); // Format as YYYY-MM-DD
      }
      
      // Check if we have more articles (assuming 10 articles per page)
      setHasMoreArticles(newArticles.length === 10);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial news and breaking headlines on mount
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/news?topic=general");
        const data = await res.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        if (data.articles && data.articles.length > 0) {
          setArticles(data.articles);
          setBreakingHeadlines(data.articles.slice(0, 10).map((a: any) => a.title));
          setHasSearched(true); // Show articles immediately
        } else {
          // Fallback: try to fetch any news if general topic fails
          const fallbackRes = await fetch("/api/news?topic=world");
          const fallbackData = await fallbackRes.json();
          if (fallbackData.articles && fallbackData.articles.length > 0) {
            setArticles(fallbackData.articles);
            setBreakingHeadlines(fallbackData.articles.slice(0, 10).map((a: any) => a.title));
            setHasSearched(true);
          } else {
            setError("No news articles available at the moment");
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to load news. Please try searching for specific topics.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ----------------------------
  // Handlers
  // ----------------------------
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setHasSearched(true);
    setCurrentPage(1);
    await fetchNews(`/api/news?q=${encodeURIComponent(query)}`);
  };

  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category);
    setHasSearched(true);
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

  const toggleBookmark = (article: any) => {
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
    <main className={`container ${darkMode ? "dark" : "light"}`}>
      <div className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">📰</div>
            <h1 className="title">DailyScope News</h1>
          </div>
        </div>
      </div>

      {/* Accessibility Toolbar */}
      <Toolbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        fontSize={fontSize}
        increaseFontSize={increaseFontSize}
        decreaseFontSize={decreaseFontSize}
        isSpeaking={isSpeaking}
        toggleSpeech={toggleSpeech}
      />

      {/* Breaking News Ticker */}
      {showTicker && <BreakingTicker headlines={breakingHeadlines} />}

      {/* Search */}
      <SearchBar query={query} setQuery={setQuery} onSearch={handleSearch} />

      {/* Category Filters */}
      <div className="category-filters">
        {[
          { id: "general", label: "All News" },
          { id: "world", label: "World" },
          { id: "technology", label: "Tech" },
          { id: "business", label: "Business" },
          { id: "science", label: "Science" },
          { id: "health", label: "Health" },
          { id: "entertainment", label: "Entertainment" },
          { id: "sports", label: "Sports" }
        ].map((category) => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? "active" : ""}`}
            onClick={() => handleCategoryChange(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Loading / Error */}
      {loading && <div className="loading">Loading news...</div>}
      {error && <div className="error-container">{error}</div>}

      {/* News List */}
      {!loading && !error && (
        <>
          {articles.length > 0 ? (
            <>
              <ArticleList
                articles={articles}
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
                fontSize={fontSize}
              />
              {hasMoreArticles && (
                <div className="load-more-container">
                  <button 
                    onClick={handleLoadMore}
                    className="load-more-btn"
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Load Older Articles'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-results">
              <strong>Welcome to DailyScope News</strong>
              <br />
              Search for news or browse the latest headlines.
            </div>
          )}
        </>
      )}
    </main>
  );
}
