'use client';

import type { ArticleItemProps, NewsSource } from "@/interfaces/news";
import Button from "@/components/atoms/Button";
import styles from "./ArticleItem.module.css";
// import { Bookmark } from "lucide-react";

export default function ArticleItem({ article, isBookmarked, onToggleBookmark, fontSize }: ArticleItemProps) {

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recent';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      });
    } catch { return 'Recent'; }
  };

  const getSourceName = (source?: string | NewsSource) => {
    // If we have a source, use it as the "Category" for now since we lack category data
    if (!source) return 'General';
    if (typeof source === 'string') return source;
    return source.name;
  };

  const readTime = "5 min read"; // Placeholder since API doesn't provide this

  return (
    <article className={styles.article}>
      <div className={styles.imageWrapper}>
        <img
          src={
            article.image ||
            `https://placehold.co/600x400/e2e8f0/1e2b4b?text=DailyScope`
          }
          alt={article.title}
          className={styles.image}
          loading="lazy"
        />
        <span className={styles.categoryPill}>
          {getSourceName(article.source)}
        </span>
      </div>

      <div className={styles.content}>
        <h3
          className={styles.title}
          style={{ fontSize: `${fontSize * 1.5}px` }} // Increased scale for impact
        >
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {article.title}
          </a>
        </h3>

        <p className={styles.description} style={{ fontSize: `${fontSize}px` }}>
          {article.description}
        </p>

        <div className={styles.footer}>
          <span className={styles.date}>{formatDate(article.publishedAt)}</span>
          <span>{readTime}</span>
        </div>
      </div>
    </article>
  );
}