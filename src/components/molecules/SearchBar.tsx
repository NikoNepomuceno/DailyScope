"use client";

import { useEffect, useRef, useState } from "react";
import type { SearchBarProps } from "@/interfaces/news";
import Button from "@/components/atoms/Button";
import styles from "./SearchBar.module.css";
import { Search } from "lucide-react";

export default function SearchBar({
  query,
  setQuery,
  onSearch,
}: SearchBarProps) {
  const [isSticky, setIsSticky] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (searchRef.current) {
        setIsSticky(window.scrollY > 150);
      }
    };
    window.addEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={searchRef}
      className={`${styles.wrapper} ${isSticky ? styles.sticky : ""}`}
    >
      <form onSubmit={onSearch} className={styles.container}>
        <input
          type="text"
          className={styles.input}
          placeholder="Search topics, regions, or keywords..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" variant="default" className={styles.searchBtn}>
          <Search size={18} />
          Search
        </Button>
      </form>
    </div>
  );
}
