'use client';

import ArticleItem from "./ArticleItem";
import type { ArticleListProps } from "@/interfaces/news";
import styles from "./ArticleList.module.css";

export default function ArticleList({ articles, bookmarks, toggleBookmark, fontSize }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.empty}>
          <p>No articles found. Try adjusting your search or filters.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {articles.map((article, index) => {
          const isBookmarked = bookmarks.some((b) => b.url === article.url);
          return (
            <ArticleItem
              key={`${article.url}-${index}`}
              article={article}
              isBookmarked={isBookmarked}
              onToggleBookmark={() => toggleBookmark(article)}
              fontSize={fontSize}
            />
          );
        })}
      </div>
    </section>
  );
}
