'use client';

import type { ArticleItemProps, NewsSource } from "@/interfaces/news";
import Button from "@/components/atoms/Button";
import styles from "./ArticleItem.module.css";
import { Bookmark, ExternalLink } from "lucide-react";

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
    if (!source) return 'Unknown';
    if (typeof source === 'string') return source;
    return source.name;
  };

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
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.source}>{getSourceName(article.source)}</span>
          <button
            onClick={onToggleBookmark}
            className={styles.bookmarkBtn}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this article"}
          >
            <Bookmark fill={isBookmarked ? "currentColor" : "none"} size={20} />
          </button>
        </div>

        <h3
          className={styles.title}
          style={{ fontSize: `${fontSize * 1.25}px` }}
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
          <div className={styles.date}>
            {formatDate(article.publishedAt)}
          </div>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.readSource}
          >
            Read full story <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </article>
  );
}