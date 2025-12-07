# Type/Interface Documentation

This document provides a comprehensive reference for all TypeScript interfaces, types, and component props used in the DailyScope News application. It serves as an instant, accurate API reference for hooks, interfaces, and component props, preventing misuse.

---

## Table of Contents

1. [Common Types](#common-types)
2. [News API Interfaces](#news-api-interfaces)
3. [Request/Service Interfaces](#requestservice-interfaces)
4. [Component Props Interfaces](#component-props-interfaces)

---

## Common Types

### `Id`

**File:** `src/interfaces/common.ts`

**Type Definition:**
```typescript
export type Id = string | number;
```

**Description:**  
A union type representing an identifier that can be either a string or a number. Used for flexible ID handling across the application.

**Usage:**  
Useful when working with entities that may have string-based IDs (e.g., UUIDs) or numeric IDs (e.g., database auto-increment IDs).

**Example:**
```typescript
const userId: Id = "user-123";
const postId: Id = 456;
```

---

### `ApiError`

**File:** `src/interfaces/common.ts`

**Type Definition:**
```typescript
export type ApiError = {
  message: string;
  status?: number;
  details?: unknown;
};
```

**Description:**  
Represents an error object returned from API calls. Provides structured error information including a human-readable message, optional HTTP status code, and optional additional error details.

**Properties:**

| Property | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `message` | `string` | Yes | Human-readable error message describing what went wrong |
| `status` | `number` | No | HTTP status code (e.g., 400, 404, 500) if available from the API response |
| `details` | `unknown` | No | Additional error details or full response data object for debugging purposes |

**Usage:**  
Used by the error normalization function `toError()` in `src/services/httpClient.ts` to create consistent error objects across all API calls. This ensures React Query and other callers receive a standardized error structure.

**Example:**
```typescript
try {
  await fetchNews({ q: "technology" });
} catch (error: ApiError) {
  console.error(error.message); // "Request failed"
  if (error.status === 429) {
    // Handle rate limit
  }
}
```

---

## News API Interfaces

### `NewsSource`

**File:** `src/interfaces/news.ts`

**Type Definition:**
```typescript
export interface NewsSource {
  id?: string;
  name: string;
  url?: string;
  country?: string;
}
```

**Description:**  
Represents metadata about a news source or publication. Used to identify where an article originated.

**Properties:**

| Property | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `id` | `string` | No | Unique identifier for the news source (e.g., GNews source ID) |
| `name` | `string` | Yes | Display name of the news source (e.g., "BBC News", "TechCrunch") |
| `url` | `string` | No | URL to the news source's website |
| `country` | `string` | No | ISO country code indicating the source's country of origin |

**Usage:**  
Used within `NewsArticle` to provide source information. The `source` property in `NewsArticle` can be either a `NewsSource` object or a simple string (for backward compatibility).

**Example:**
```typescript
const source: NewsSource = {
  id: "bbc-news",
  name: "BBC News",
  url: "https://www.bbc.com",
  country: "gb"
};
```

---

### `NewsArticle`

**File:** `src/interfaces/news.ts`

**Type Definition:**
```typescript
export interface NewsArticle {
  title: string;
  description: string;
  content?: string;
  url: string;
  image?: string;
  publishedAt?: string;
  source: NewsSource | string;
}
```

**Description:**  
Represents a single news article with all its metadata and content. This is the primary data structure for displaying news items throughout the application.

**Properties:**

| Property | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `title` | `string` | Yes | The headline/title of the article |
| `description` | `string` | Yes | A brief summary or description of the article content |
| `content` | `string` | No | Full article content (may be truncated or partial depending on API) |
| `url` | `string` | Yes | Direct link to the original article on the source website |
| `image` | `string` | No | URL to the article's featured image or thumbnail |
| `publishedAt` | `string` | No | ISO 8601 timestamp indicating when the article was published (e.g., "2024-01-01T12:00:00Z") |
| `source` | `NewsSource \| string` | Yes | Source information - can be a `NewsSource` object with full details, or a simple string with the source name (for backward compatibility) |

**Usage:**  
Used throughout the application to represent news articles. Displayed in `ArticleItem` components, stored in bookmarks, and passed between components. The `source` property's dual type (`NewsSource | string`) allows flexibility when handling data from different API responses.

**Example:**
```typescript
const article: NewsArticle = {
  title: "Breaking: Major Technology Breakthrough",
  description: "Scientists announce revolutionary discovery...",
  content: "In a groundbreaking announcement today...",
  url: "https://example.com/article1",
  image: "https://example.com/image.jpg",
  publishedAt: "2024-01-01T12:00:00Z",
  source: {
    name: "Tech News",
    url: "https://example.com"
  }
};
```

---

### `NewsApiResponse`

**File:** `src/interfaces/news.ts`

**Type Definition:**
```typescript
export interface NewsApiResponse {
  totalArticles?: number;
  articles: NewsArticle[];
  error?: string;
}
```

**Description:**  
Represents the response structure returned from the GNews API and the internal `/api/news` endpoint. This structure is always returned, even when errors occur (in which case `articles` will be empty and `error` will be populated).

**Properties:**

| Property | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `totalArticles` | `number` | No | Total number of articles available from the API (may not match `articles.length` due to pagination or API limits) |
| `articles` | `NewsArticle[]` | Yes | Array of news articles. Always present, but may be empty if an error occurred |
| `error` | `string` | No | Error message string. Only present when local validation fails (e.g., missing query/topic) or when the API returns an error. When present, `articles` is typically empty |

**Usage:**  
Used as the return type for `fetchNews()` service function and the response type for the `/api/news` API route. The application always returns this structure, even on errors, ensuring clients receive a consistent response format. On API failures, the service falls back to mock data, so `articles` is never undefined.

**Example:**
```typescript
const response: NewsApiResponse = {
  totalArticles: 100,
  articles: [
    { title: "Article 1", description: "...", url: "...", source: "..." },
    { title: "Article 2", description: "...", url: "...", source: "..." }
  ]
};

// Error case
const errorResponse: NewsApiResponse = {
  error: "Missing query or topic",
  articles: []
};
```

---

## Request/Service Interfaces

### `NewsSearchParams`

**File:** `src/interfaces/news.ts`

**Type Definition:**
```typescript
export interface NewsSearchParams {
  q?: string;
  topic?: string;
  breaking?: boolean;
  page?: number;
  fromDate?: string;
}
```

**Description:**  
Defines the search and filter parameters that can be passed to the news API. Used for querying news articles with various filters.

**Properties:**

| Property | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `q` | `string` | No | Search query string - keywords to search for in article titles and content |
| `topic` | `string` | No | GNews topic filter. Valid values: `"world"`, `"nation"`, `"business"`, `"technology"`, `"entertainment"`, `"sports"`, `"science"`, `"health"` |
| `breaking` | `boolean` | No | When `true`, fetches top headlines/breaking news instead of search results. Defaults to `false` |
| `page` | `number` | No | Page number for pagination (1-indexed). Used to fetch additional articles beyond the first page |
| `fromDate` | `string` | No | Date filter in ISO 8601 format (YYYY-MM-DD). Used to fetch articles published on or after this date. Useful for pagination to get older articles |

**Usage:**  
Used in the `HomePageClient` component for building API request URLs and passed to `fetchNews()` service function. At least one of `q`, `topic`, or `breaking: true` must be provided for a valid request.

**Example:**
```typescript
// Search query
const searchParams: NewsSearchParams = {
  q: "technology",
  page: 1
};

// Topic filter
const topicParams: NewsSearchParams = {
  topic: "business",
  page: 2
};

// Breaking news
const breakingParams: NewsSearchParams = {
  breaking: true
};

// Date-filtered search
const dateParams: NewsSearchParams = {
  q: "climate",
  fromDate: "2024-01-01"
};
```

---

### `NewsFetchOptions`

**File:** `src/services/newsService.ts`

**Type Definition:**
```typescript
export interface NewsFetchOptions {
  q?: string;
  topic?: string;
  breaking?: boolean;
  page?: number;
  fromDate?: string;
}
```

**Description:**  
Identical to `NewsSearchParams`, this interface defines the options parameter for the `fetchNews()` service function. Used internally by the news service to configure API requests.

**Properties:**

| Property | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `q` | `string` | No | Search query string |
| `topic` | `string` | No | GNews topic filter (world, nation, business, technology, entertainment, sports, science, health) |
| `breaking` | `boolean` | No | When `true`, uses top-headlines endpoint. Defaults to `false` |
| `page` | `number` | No | Page number for pagination |
| `fromDate` | `string` | No | Date filter in ISO 8601 format (YYYY-MM-DD) |

**Usage:**  
Used as the parameter type for `fetchNews()` function. The function uses these options to determine which GNews endpoint to call (top-headlines vs search) and to build the query parameters.

**Example:**
```typescript
const options: NewsFetchOptions = {
  q: "artificial intelligence",
  breaking: false,
  page: 1
};

const response = await fetchNews(options);
```

**Note:** This interface is functionally identical to `NewsSearchParams` but is defined separately in the service file for internal use.

---

## Component Props Interfaces

### `ArticleItemProps`

**File:** `src/interfaces/news.ts`

**Type Definition:**
```typescript
export interface ArticleItemProps {
  article: NewsArticle;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  fontSize: number;
}
```

**Description:**  
Props interface for the `ArticleItem` component, which renders a single news article card with bookmark functionality and accessibility features.

**Properties:**

| Property | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `article` | `NewsArticle` | Yes | The news article object to display. Contains all article data including title, description, URL, image, etc. |
| `isBookmarked` | `boolean` | Yes | Indicates whether this article is currently bookmarked by the user. Used to show/hide bookmark icon state |
| `onToggleBookmark` | `() => void` | Yes | Callback function invoked when the user clicks the bookmark button. Should toggle the bookmark state for this article |
| `fontSize` | `number` | Yes | Font size in pixels (typically 12-24). Used to apply dynamic font sizing for accessibility. The component applies this value to article text |

**Usage:**  
Used by the `ArticleItem` component (`src/components/organisms/ArticleItem.tsx`) to type-check props. The component displays the article information, handles bookmark toggling, and supports text-to-speech functionality.

**Example:**
```typescript
<ArticleItem
  article={article}
  isBookmarked={bookmarks.some(b => b.url === article.url)}
  onToggleBookmark={() => toggleBookmark(article)}
  fontSize={16}
/>
```

---

### `ArticleListProps`

**File:** `src/interfaces/news.ts`

**Type Definition:**
```typescript
export interface ArticleListProps {
  articles: NewsArticle[];
  bookmarks: NewsArticle[];
  toggleBookmark: (article: NewsArticle) => void;
  fontSize: number;
}
```

**Description:**  
Props interface for the `ArticleList` component, which renders a list of news articles.

**Properties:**

| Property | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `articles` | `NewsArticle[]` | Yes | Array of news articles to display in the list. Can be empty, in which case the component shows an empty state message |
| `bookmarks` | `NewsArticle[]` | Yes | Array of all bookmarked articles. Used to determine which articles should show the bookmarked state when rendering `ArticleItem` components |
| `toggleBookmark` | `(article: NewsArticle) => void` | Yes | Callback function that toggles the bookmark state for a specific article. Receives the article object as a parameter |
| `fontSize` | `number` | Yes | Font size in pixels (typically 12-24). Passed down to each `ArticleItem` for consistent font sizing |

**Usage:**  
Used by the `ArticleList` component (`src/components/organisms/ArticleList.tsx`) to render a collection of articles. The component maps over `articles` and renders an `ArticleItem` for each, checking `bookmarks` to determine bookmark state.

**Example:**
```typescript
<ArticleList
  articles={filteredArticles}
  bookmarks={bookmarks}
  toggleBookmark={toggleBookmark}
  fontSize={fontSize}
/>
```

---

### `SearchBarProps`

**File:** `src/interfaces/news.ts`

**Type Definition:**
```typescript
export interface SearchBarProps {
  query: string;
  setQuery: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
}
```

**Description:**  
Props interface for the `SearchBar` component, which provides a search input field with submit functionality.

**Properties:**

| Property | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `query` | `string` | Yes | The current search query string. Used as the controlled input value |
| `setQuery` | `(value: string) => void` | Yes | Callback function to update the search query. Called when the user types in the search input |
| `onSearch` | `(e: React.FormEvent) => void` | Yes | Callback function invoked when the search form is submitted (e.g., Enter key or button click). Receives the form event object |

**Usage:**  
Used by the `SearchBar` component (`src/components/molecules/SearchBar.tsx`) to handle search input and submission. The component implements sticky behavior on scroll and includes a clear button.

**Example:**
```typescript
<SearchBar
  query={query}
  setQuery={setQuery}
  onSearch={handleSearch}
/>
```

---

### `BreakingTickerProps`

**File:** `src/interfaces/news.ts`

**Type Definition:**
```typescript
export interface BreakingTickerProps {
  headlines: string[];
}
```

**Description:**  
Props interface for the `BreakingTicker` component, which displays a scrolling ticker of breaking news headlines.

**Properties:**

| Property | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `headlines` | `string[]` | Yes | Array of headline strings to display in the ticker. If empty, the component returns `null` and renders nothing |

**Usage:**  
Used by the `BreakingTicker` component (`src/components/molecules/BreakingTicker.tsx`) to display breaking news headlines in a scrolling ticker format. The component extracts headlines from breaking news articles.

**Example:**
```typescript
const headlines = breakingArticles.map(article => article.title);

<BreakingTicker headlines={headlines} />
```

---

### `ToolbarProps`

**File:** `src/interfaces/news.ts`

**Type Definition:**
```typescript
export interface ToolbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  isSpeaking: boolean;
  toggleSpeech: () => void;
}
```

**Description:**  
Props interface for the `Toolbar` component, which provides accessibility and UI controls including dark mode toggle, font size adjustment, and text-to-speech functionality.

**Properties:**

| Property | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `darkMode` | `boolean` | Yes | Current dark mode state. `true` when dark mode is enabled, `false` when light mode is enabled |
| `toggleDarkMode` | `() => void` | Yes | Callback function to toggle between dark and light mode. Updates the theme and persists to localStorage |
| `fontSize` | `number` | Yes | Current font size in pixels (typically 12-24). Displayed in the toolbar and used to show current size |
| `increaseFontSize` | `() => void` | Yes | Callback function to increase font size by 1px. Typically clamped to a maximum (e.g., 24px) |
| `decreaseFontSize` | `() => void` | Yes | Callback function to decrease font size by 1px. Typically clamped to a minimum (e.g., 12px) |
| `isSpeaking` | `boolean` | Yes | Indicates whether text-to-speech is currently active. Used to show the speaking state in the UI |
| `toggleSpeech` | `() => void` | Yes | Callback function to start or stop text-to-speech. Starts speaking all article titles/descriptions when enabled, cancels when disabled |

**Usage:**  
Used by the `Toolbar` component (`src/components/organisms/Toolbar.tsx`) to provide user controls for accessibility and UI preferences. All settings are persisted to localStorage.

**Example:**
```typescript
<Toolbar
  darkMode={darkMode}
  toggleDarkMode={toggleDarkMode}
  fontSize={fontSize}
  increaseFontSize={increaseFontSize}
  decreaseFontSize={decreaseFontSize}
  isSpeaking={isSpeaking}
  toggleSpeech={toggleSpeech}
/>
```

---

### `ButtonProps`

**File:** `src/components/atoms/Button.tsx`

**Type Definition:**
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}
```

**Description:**  
Props interface for the `Button` component, extending standard HTML button attributes with a custom variant prop for styling.

**Properties:**

| Property | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `variant` | `"default" \| "outline"` | No | Button style variant. `"default"` for primary button style, `"outline"` for outlined button style. Defaults to `"default"` |
| All standard button attributes | `React.ButtonHTMLAttributes<HTMLButtonElement>` | No | Inherits all standard HTML button props (onClick, disabled, type, className, etc.) |

**Usage:**  
Used by the `Button` component (`src/components/atoms/Button.tsx`) to provide a reusable button component with variant styling. Extends React's button HTML attributes for full compatibility.

**Example:**
```typescript
<Button variant="outline" onClick={handleClick} disabled={isLoading}>
  Click me
</Button>
```

---

### `NavbarProps`

**File:** `src/components/landing/Navbar.tsx`

**Type Definition:**
```typescript
interface NavbarProps {
  onNavigate?: (sectionId: string) => void;
}
```

**Description:**  
Props interface for the `Navbar` component, which provides the main navigation header with mobile menu support.

**Properties:**

| Property | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `onNavigate` | `(sectionId: string) => void` | No | Optional callback function invoked when a navigation link is clicked. Receives the target section ID (e.g., "about", "testimonials", "footer"). If not provided, the component uses default scroll behavior |

**Usage:**  
Used by the `Navbar` component (`src/components/landing/Navbar.tsx`) to handle navigation clicks. The component implements smooth scrolling to sections and includes mobile menu functionality.

**Example:**
```typescript
<Navbar onNavigate={(sectionId) => {
  // Custom navigation logic
  scrollToSection(sectionId);
}} />
```

---

### `HeroSectionProps`

**File:** `src/components/landing/HeroSection.tsx`

**Type Definition:**
```typescript
interface HeroSectionProps {
  onPrimaryCtaClick?: () => void;
}
```

**Description:**  
Props interface for the `HeroSection` component, which displays the hero/landing section with animated headline and call-to-action buttons.

**Properties:**

| Property | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `onPrimaryCtaClick` | `() => void` | No | Optional callback function invoked when the primary CTA button ("Start reading now") is clicked. If not provided, the component uses default scroll behavior to the "about" section |

**Usage:**  
Used by the `HeroSection` component (`src/components/landing/HeroSection.tsx`) to handle the primary call-to-action button click. The component includes animated letter-by-letter headline rendering and hero card visuals.

**Example:**
```typescript
<HeroSection onPrimaryCtaClick={() => {
  // Custom action, e.g., navigate to news feed
  router.push('/news');
}} />
```

---

### `HomePageClientProps`

**File:** `src/components/pages/HomePageClient.tsx`

**Type Definition:**
```typescript
interface HomePageClientProps {
  initialArticles: NewsArticle[];
  initialBreakingHeadlines: string[];
}
```

**Description:**  
Props interface for the `HomePageClient` component, which is the main client-side page component that manages news article state and user interactions.

**Properties:**

| Property | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `initialArticles` | `NewsArticle[]` | Yes | Array of news articles to display initially. These are typically fetched server-side and passed as props for initial render (SSR/hydration) |
| `initialBreakingHeadlines` | `string[]` | Yes | Array of headline strings for breaking news ticker. Extracted from breaking news articles fetched server-side |

**Usage:**  
Used by the `HomePageClient` component (`src/components/pages/HomePageClient.tsx`) to receive initial data from the server. The component manages all client-side state including bookmarks, search, dark mode, font size, and pagination.

**Example:**
```typescript
// In server component
const initialArticles = await fetchNews({ breaking: true });
const initialBreakingHeadlines = initialArticles.articles
  .slice(0, 5)
  .map(article => article.title);

<HomePageClient
  initialArticles={initialArticles.articles}
  initialBreakingHeadlines={initialBreakingHeadlines}
/>
```

---

## Summary

This documentation covers all TypeScript interfaces and types used throughout the DailyScope News application:

- **2 Common Types**: `Id`, `ApiError`
- **3 News API Interfaces**: `NewsSource`, `NewsArticle`, `NewsApiResponse`
- **2 Request/Service Interfaces**: `NewsSearchParams`, `NewsFetchOptions`
- **9 Component Props Interfaces**: `ArticleItemProps`, `ArticleListProps`, `SearchBarProps`, `BreakingTickerProps`, `ToolbarProps`, `ButtonProps`, `NavbarProps`, `HeroSectionProps`, `HomePageClientProps`

All interfaces are located in:
- `src/interfaces/common.ts` - Common types
- `src/interfaces/news.ts` - News-related interfaces and component props
- `src/services/newsService.ts` - Service-specific interfaces
- Component files - Component-specific prop interfaces

---

**Last Updated:** December 2024



