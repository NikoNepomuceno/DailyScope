'use client';

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
    <div ref={searchContainerRef}>
      {/* HTML structure removed - ready for rebuild */}
    </div>
  );
}

