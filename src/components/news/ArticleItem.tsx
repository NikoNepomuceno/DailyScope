'use client';

import { Bookmark, BookmarkCheck, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

interface Article {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedAt?: string;
  source?: string | { id?: string; name?: string; url?: string; country?: string };
}

interface ArticleItemProps {
  article: Article;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  fontSize: number;
}

export default function ArticleItem({ article, isBookmarked, onToggleBookmark, fontSize }: ArticleItemProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recent';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return 'Recent';
    }
  };

  const getSourceName = (source?: string | { id?: string; name?: string; url?: string; country?: string }) => {
    if (!source) return null;
    if (typeof source === 'string') return source;
    return source.name || source.id || 'Unknown Source';
  };

  const handleTextToSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const text = `${article.title}. ${article.description}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="news-item">
      {article.image && (
        <img src={article.image} alt={article.title} className="news-image" />
      )}
      
      <div className="news-content">
        <h2 className="news-title" style={{ fontSize: `${fontSize + 2}px` }}>
          {article.title}
        </h2>
        <p className="news-description" style={{ fontSize: `${fontSize}px` }}>
          {article.description}
        </p>
        
        <div className="news-meta">
          <span className="news-date">{formatDate(article.publishedAt)}</span>
          {getSourceName(article.source) && <span className="news-source">• {getSourceName(article.source)}</span>}
        </div>
      </div>

      <div className="news-actions">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="news-link"
        >
          Read more
        </a>
        <div className="news-action-buttons">
          <button 
            onClick={handleTextToSpeech}
            aria-label="Text to speech"
            className={`icon-btn ${isSpeaking ? 'active' : ''}`}
          >
            {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button 
            onClick={onToggleBookmark} 
            aria-label="Toggle bookmark"
            className={`icon-btn ${isBookmarked ? 'saved' : ''}`}
          >
            {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
