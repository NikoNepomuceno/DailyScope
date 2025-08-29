"use client";

import { useState, useEffect } from "react";

export default function NewsPage() {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("technology");
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = (query: string) => {
      setSearchQuery(query);
      setLoading(true);
      setIsSearching(true);
      
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
  
    useEffect(() => {
      handleSearch(searchQuery);
    }, []); // Only run once on mount

    if (loading) return <p className="loading">
      {isSearching ? "Searching..." : "Loading..."}
    </p>;
    
    if (error) {
      return (
        <div className="container">
          <h1 className="title">Latest News</h1>
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
      <h1 className="title">Latest News</h1>
      
      <div className="search-container">
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const query = formData.get('search') as string;
          if (query.trim()) {
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
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </div>

      {news.length === 0 && !loading && !error && (
        <p className="no-results">No articles found for "{searchQuery}". Try a different search term.</p>
      )}

      <ul className="news-list">
        {news.map((article, i) => (
          <li key={i} className="news-item">
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="news-title">
              <h2>{article.title}</h2>
            </a>
            <p className="news-description">{article.description}</p>
            <small className="news-meta">
              {article.source.name} – {new Date(article.publishedAt).toLocaleDateString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}