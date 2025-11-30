// News API Response Interfaces
export interface NewsSource {
  id?: string;
  name: string;
  url?: string;
  country?: string;
}

export interface NewsArticle {
  title: string;
  description: string;
  content?: string;
  url: string;
  image?: string;
  publishedAt?: string;
  source: NewsSource | string;
}

export interface NewsApiResponse {
  totalArticles?: number;
  articles: NewsArticle[];
  error?: string;
}

// Request Interfaces
export interface NewsSearchParams {
  q?: string;
  topic?: string;
  breaking?: boolean;
  page?: number;
  fromDate?: string;
}

// Component Props Interfaces
export interface ArticleItemProps {
  article: NewsArticle;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  fontSize: number;
}

export interface ArticleListProps {
  articles: NewsArticle[];
  bookmarks: NewsArticle[];
  toggleBookmark: (article: NewsArticle) => void;
  fontSize: number;
}

export interface SearchBarProps {
  query: string;
  setQuery: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

export interface BreakingTickerProps {
  headlines: string[];
}

export interface ToolbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  isSpeaking: boolean;
  toggleSpeech: () => void;
}

