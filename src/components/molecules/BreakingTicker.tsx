"use client";

import type { BreakingTickerProps } from "@/interfaces/news";
import styles from "./BreakingTicker.module.css";
import { useEffect, useState, useCallback } from "react";

export default function BreakingTicker({ articles }: BreakingTickerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance
  useEffect(() => {
    if (isPaused || articles.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % articles.length);
    }, 6000); // 6 seconds

    return () => clearInterval(interval);
  }, [isPaused, articles.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % articles.length);
    setIsPaused(true); // Pause interaction on manual control
  }, [articles.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + articles.length) % articles.length);
    setIsPaused(true);
  }, [articles.length]);

  if (articles.length === 0) return null;

  const currentArticle = articles[activeIndex];

  // Format date
  const dateStr = currentArticle.publishedAt
    ? new Date(currentArticle.publishedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    : "Breaking News";

  // Mock location if not present, or use source
  const sourceLocation = typeof currentArticle.source === 'string' ? currentArticle.source : currentArticle.source.name;

  return (
    <section
      className={styles.container}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Breaking News Carousel"
    >
      <div className={styles.content}>

        {/* Left Side: Text */}
        <div className={styles.textContent}>
          <div className={styles.badge}>
            <span className={styles.badgeLine}></span>
            <span className={styles.badgeText}>Breaking News</span>
          </div>

          <h1 className={styles.title} key={`title-${activeIndex}`}>
            {currentArticle.title}
          </h1>

          <p className={styles.description} key={`desc-${activeIndex}`}>
            {currentArticle.description || "Read the full story to know more about this breaking development."}
          </p>

          <div className={styles.actions}>
            <a
              href={currentArticle.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryButton}
            >
              Read Full Story <span className={styles.arrowIcon}>→</span>
            </a>
            <button className={styles.secondaryButton}>
              Watch Live
            </button>
          </div>

          {/* Navigation Controls */}
          <div className={styles.controls}>
            <button onClick={handlePrev} className={styles.navButton} aria-label="Previous story">←</button>
            <div className={styles.dots}>
              {articles.map((_, idx) => (
                <button
                  key={idx}
                  className={`${styles.dot} ${idx === activeIndex ? styles.activeDot : ''}`}
                  onClick={() => { setActiveIndex(idx); setIsPaused(true); }}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button onClick={handleNext} className={styles.navButton} aria-label="Next story">→</button>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className={styles.imageWrapper}>
          {/* Background blur/shadow effect could be added here */}
          {currentArticle.image ? (
            <img
              src={currentArticle.image}
              alt={currentArticle.title}
              className={styles.image}
              key={`img-${activeIndex}`} // key to trigger animation
            />
          ) : (
            <div className={styles.placeholderImage}>No Image Available</div>
          )}

          <div className={styles.imageOverlay}>
            <span className={styles.overlayText}>{dateStr} • {sourceLocation}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
