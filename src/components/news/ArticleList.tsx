'use client';

import ArticleItem from "./ArticleItem";

interface ArticleListProps {
  articles: any[];
  bookmarks: any[];
  toggleBookmark: (article: any) => void;
  fontSize: number;
}

export default function ArticleList({ articles, bookmarks, toggleBookmark, fontSize }: ArticleListProps) {
  if (articles.length === 0)
    return <div className="no-results">No articles found.</div>;

  return (
    <div className="news-list">
      {articles.map((article, i) => (
        <ArticleItem
          key={i}
          article={article}
          fontSize={fontSize}
          isBookmarked={bookmarks.some((b) => b.url === article.url)}
          onToggleBookmark={() => toggleBookmark(article)}
        />
      ))}
    </div>
  );
}
