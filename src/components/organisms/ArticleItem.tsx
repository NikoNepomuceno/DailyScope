'use client';

import { useState } from "react";
import type { ArticleItemProps, NewsSource } from "@/interfaces/news";

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

  const getSourceName = (source?: string | NewsSource) => {
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
    <article>
      {/* HTML structure removed - ready for rebuild */}
    </article>
  );
}

