"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Article = {
  title: string;
  description?: string;
  url: string;
  image?: string;
  publishedAt: string;
  source: { name: string; url?: string };
};

const SUPPORTED_TOPICS: { key: string; label: string }[] = [
  { key: "world", label: "World" },
  { key: "nation", label: "Politics" },
  { key: "business", label: "Business" },
  { key: "technology", label: "Tech" },
  { key: "entertainment", label: "Entertainment" },
  { key: "sports", label: "Sports" },
  { key: "science", label: "Science" },
  { key: "health", label: "Health" },
];

export default function NewsPage() {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);

  const [breaking, setBreaking] = useState<Article[]>([]);
  const [tickerIndex, setTickerIndex] = useState(0);

  const [fontScale, setFontScale] = useState<number>(100);
  const [isDark, setIsDark] = useState<boolean>(false);

  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speakingUrlRef = useRef<string | null>(null);

  // Load preferences
  useEffect(() => {
    try {
      const storedTopics = JSON.parse(localStorage.getItem("preferredTopics") || "null");
      const storedSaved = JSON.parse(localStorage.getItem("savedArticles") || "null");
      const storedFont = parseInt(localStorage.getItem("fontScale") || "100", 10);
      const storedTheme = localStorage.getItem("theme");

      if (Array.isArray(storedTopics)) setSelectedTopics(storedTopics);
      if (Array.isArray(storedSaved)) setSavedArticles(storedSaved);
      if (!Number.isNaN(storedFont)) setFontScale(storedFont);
      if (storedTheme === "dark") setIsDark(true);
    } catch {}
  }, []);

  // Apply font scale and theme
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale}%`;
  }, [fontScale]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
  }, [isDark]);

  // Helpers
  const savePreferences = (topics: string[]) => {
    setSelectedTopics(topics);
    try {
      localStorage.setItem("preferredTopics", JSON.stringify(topics));
    } catch {}
  };

  const toggleTopic = (key: string) => {
    const next = selectedTopics.includes(key)
      ? selectedTopics.filter((t) => t !== key)
      : [...selectedTopics, key];
    savePreferences(next);
  };

  const isBookmarked = (url: string) => savedArticles.some((a) => a.url === url);

  const toggleBookmark = (article: Article) => {
    const exists = isBookmarked(article.url);
    const next = exists
      ? savedArticles.filter((a) => a.url !== article.url)
      : [{ ...article }, ...savedArticles].slice(0, 200);
    setSavedArticles(next);
    try {
      localStorage.setItem("savedArticles", JSON.stringify(next));
    } catch {}
  };

  const startTTS = (article: Article) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `${article.title}. ${article.description || ""}`
    );
    speechRef.current = utterance;
    speakingUrlRef.current = article.url;
    window.speechSynthesis.speak(utterance);
    utterance.onend = () => {
      speakingUrlRef.current = null;
    };
  };

  const stopTTS = () => {
    window.speechSynthesis.cancel();
    speakingUrlRef.current = null;
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setLoading(true);
    setIsSearching(true);
    setHasSearched(true);

    fetch(`/api/news?q=${encodeURIComponent(query)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        setNews(data.articles || []);
        setLoading(false);
        setIsSearching(false);
      })
      .catch((err) => {
        console.error("Error fetching news:", err);
        setError(err.message);
        setLoading(false);
        setIsSearching(false);
      });
  };

  const fetchByTopics = async (topics: string[]) => {
    if (topics.length === 0) return;
    setLoading(true);
    setIsSearching(true);
    setHasSearched(true);
    try {
      const responses = await Promise.all(
        topics.map((t) => fetch(`/api/news?topic=${encodeURIComponent(t)}`))
      );
      const jsons = await Promise.all(responses.map((r) => r.json()));
      const merged: Record<string, Article> = {};
      jsons.forEach((j) => {
        const list: Article[] = j?.articles || [];
        list.forEach((a) => {
          if (a?.url) {
            merged[a.url] = a;
          }
        });
      });
      const combined = Object.values(merged)
        .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
        .slice(0, 30);
      setNews(combined);
      setLoading(false);
      setIsSearching(false);
    } catch (err: any) {
      setError(err?.message || "Failed to load categories");
      setLoading(false);
      setIsSearching(false);
    }
  };

  const loadLatest = async () => {
    setLoading(true);
    setIsSearching(false);
    try {
      const res = await fetch("/api/news?breaking=1");
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setNews((data.articles || []).slice(0, 20));
      setLoading(false);
    } catch (err: any) {
      setError(err?.message || "Failed to load latest news");
      setLoading(false);
    }
  };

  // Initial load: show latest headlines unless categories are selected
  useEffect(() => {
    if (selectedTopics.length > 0) {
      fetchByTopics(selectedTopics);
    } else {
      loadLatest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch when topics change
  useEffect(() => {
    if (selectedTopics.length > 0) {
      fetchByTopics(selectedTopics);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTopics.join(",")]);

  // Breaking news ticker
  useEffect(() => {
    let interval: any;
    const loadBreaking = async () => {
      try {
        const res = await fetch("/api/news?breaking=1");
        const data = await res.json();
        if (!data.error) {
          setBreaking(data.articles || []);
          setTickerIndex(0);
        }
      } catch {}
    };
    loadBreaking();
    interval = setInterval(loadBreaking, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (breaking.length === 0) return;
    const rotator = setInterval(() => {
      setTickerIndex((i) => (i + 1) % Math.max(1, breaking.length));
    }, 5000);
    return () => clearInterval(rotator);
  }, [breaking.length]);

  const visibleBreaking = useMemo(() => breaking[tickerIndex], [breaking, tickerIndex]);

  if (loading) return <p className="loading">{isSearching ? "Searching..." : "Loading..."}</p>;

  if (error) {
    return (
      <div className="container">
        <header className="header">
          <h1 className="title">Daily Scope</h1>
          <p className="subtitle">Stay updated with the latest news and technology trends</p>
        </header>
        <div className="error-container">
          <strong>Error:</strong> {error}
          <br />
          <small>Please check your API key configuration in .env.local</small>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Daily Scope</h1>
        <p className="subtitle">Stay updated with the latest news and technology trends</p>
      </header>

      {/* Accessibility toolbar */}
      <div className="toolbar">
        <div className="toolbar-left">
          <button
            type="button"
            className="toolbar-btn"
            aria-label="Decrease font size"
            onClick={() => {
              const next = Math.max(75, fontScale - 10);
              setFontScale(next);
              try { localStorage.setItem("fontScale", String(next)); } catch {}
            }}
          >A-</button>
          <button
            type="button"
            className="toolbar-btn"
            aria-label="Increase font size"
            onClick={() => {
              const next = Math.min(150, fontScale + 10);
              setFontScale(next);
              try { localStorage.setItem("fontScale", String(next)); } catch {}
            }}
          >A+</button>
        </div>
        <div className="toolbar-right">
          <label className="switch">
            <input
              type="checkbox"
              aria-label="Toggle dark mode"
              checked={isDark}
              onChange={(e) => {
                const v = e.currentTarget.checked;
                setIsDark(v);
                try { localStorage.setItem("theme", v ? "dark" : "light"); } catch {}
              }}
            />
            <span className="slider" />
            <span className="switch-label">Dark</span>
          </label>
          <button
            type="button"
            className={`toolbar-btn ${showSaved ? "active" : ""}`}
            onClick={() => setShowSaved((s) => !s)}
            aria-pressed={showSaved}
          >{showSaved ? "Showing Saved" : "Show Saved"}</button>
        </div>
      </div>

      {/* Breaking ticker */}
      {visibleBreaking && (
        <div className="breaking">
          <span className="breaking-label">Breaking</span>
          <a
            className="breaking-link"
            href={visibleBreaking.url}
            target="_blank"
            rel="noopener noreferrer"
          >{visibleBreaking.title}</a>
        </div>
      )}

      {/* Categories */}
      <div className="categories">
        {SUPPORTED_TOPICS.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`chip ${selectedTopics.includes(t.key) ? "chip-active" : ""}`}
            onClick={() => toggleTopic(t.key)}
            aria-pressed={selectedTopics.includes(t.key)}
          >{t.label}</button>
        ))}
      </div>

      {/* Search */}
      <div className="search-container">
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const query = (formData.get('search') as string) || "";
          if (query.trim()) {
            setSelectedTopics([]);
            savePreferences([]);
            handleSearch(query.trim());
          }
        }}>
          <input
            type="text"
            name="search"
            placeholder="Search for news..."
            defaultValue={searchQuery}
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>

      {/* Saved toggle view */}
      {showSaved ? (
        <>
          {savedArticles.length === 0 && (
            <div className="no-results">
              <strong>No saved articles</strong>
              <p>Bookmark articles to read later.</p>
            </div>
          )}
          <ul className="news-list">
            {savedArticles.map((article) => (
              <li key={article.url} className="news-item">
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="news-title">
                  {article.title}
                </a>
                {article.description && (
                  <p className="news-description">{article.description}</p>
                )}
                <div className="news-actions">
                  <button
                    className="icon-btn"
                    aria-label="Read aloud"
                    onClick={() => (speakingUrlRef.current === article.url ? stopTTS() : startTTS(article))}
                  >{speakingUrlRef.current === article.url ? "Stop" : "Speak"}</button>
                  <button
                    className={`icon-btn ${isBookmarked(article.url) ? "saved" : ""}`}
                    aria-label="Remove bookmark"
                    onClick={() => toggleBookmark(article)}
                  >{isBookmarked(article.url) ? "Saved" : "Save"}</button>
                </div>
                <div className="news-meta">
                  <span>{article.source.name}</span>
                  <span>•</span>
                  <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          {news.length === 0 && !loading && !error && (hasSearched || selectedTopics.length > 0) && (
            <div className="no-results">
              <strong>No articles found{selectedTopics.length ? " for selected categories" : ` for "${searchQuery}"`}</strong>
              <p>Try searching for a different topic or pick other categories.</p>
            </div>
          )}
          <ul className="news-list">
            {news.map((article) => (
              <li key={article.url} className="news-item">
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="news-title">
                  {article.title}
                </a>
                {article.description && (
                  <p className="news-description">{article.description}</p>
                )}
                <div className="news-actions">
                  <button
                    className="icon-btn"
                    aria-label="Read aloud"
                    onClick={() => (speakingUrlRef.current === article.url ? stopTTS() : startTTS(article))}
                  >{speakingUrlRef.current === article.url ? "Stop" : "Speak"}</button>
                  <button
                    className={`icon-btn ${isBookmarked(article.url) ? "saved" : ""}`}
                    aria-label={isBookmarked(article.url) ? "Remove bookmark" : "Save for later"}
                    onClick={() => toggleBookmark(article)}
                  >{isBookmarked(article.url) ? "Saved" : "Save"}</button>
                </div>
                <div className="news-meta">
                  <span>{article.source.name}</span>
                  <span>•</span>
                  <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}