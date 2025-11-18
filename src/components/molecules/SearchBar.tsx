'use client';

import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { SearchBarProps } from "@/interfaces/news";

export default function SearchBar({ query, setQuery, onSearch }: SearchBarProps) {
  const [isSticky, setIsSticky] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const clearSearch = () => {
    setQuery("");
  };

  useEffect(() => {
    const handleScroll = () => {
      if (searchContainerRef.current) {
        const rect = searchContainerRef.current.getBoundingClientRect();
        // Check if the search container is at the top of the viewport
        setIsSticky(rect.top <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={searchContainerRef}
      className={`search-container ${isSticky ? 'sticky' : ''}`}
    >
      <form onSubmit={onSearch} className="search-form">
        <div className="search-input-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search news..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="clear-button"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button type="submit" className="search-button">
          <Search size={20} />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
}

