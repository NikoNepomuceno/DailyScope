# DailyScope Codebase Summary

## Project Overview
DailyScope is a news aggregator application built with Next.js 15 (App Router) and React 19. It aims to provide a clean, balanced briefing of global events.

## Tech Stack
- **Framework**: Next.js 15.5.2 (App Router)
- **UI Library**: React 19.1.0
- **Styling**: Vanilla CSS with CSS Variables (Custom Design System)
- **Data Fetching**: Native `fetch` with `newsService` abstraction (Server & Client compatible)
- **Icons**: Lucide React
- **Language**: TypeScript

## Project Structure

### Root Directory
- `next.config.ts`: Next.js configuration.
- `middleware.ts`: Middleware (likely for auth or routing, though currently minimal).
- `.env.local`: Environment variables (API keys, etc.).

### `src/app`
- `page.tsx`: The main entry point. It's a Server Component that fetches initial news data using `getInitialNews` (ISR with 60s revalidation) and passes it to `HomePageClient`.
- `layout.tsx`: Global layout.
- `globals.css`: Contains the global styles, CSS reset, and the custom design system (colors, typography, utility classes).
- `api/`: API routes (e.g., `api/news`) to proxy requests to external news APIs.

### `src/components`
Follows Atomic Design methodology:
- `atoms/`: Basic UI elements.
- `molecules/`: Simple combinations of atoms.
- `organisms/`: Complex components like `ArticleItem`, `ArticleList`, `Toolbar`.
- `pages/`: Page-level components.
  - `HomePageClient.tsx`: The main client-side component. Currently renders a static landing page (Hero, About, Testimonials) but contains state management logic for a dynamic news feed (articles, search, bookmarks, dark mode, etc.) which appears to be currently unused in the render output.

### `src/services`
- `newsService.ts`: Handles fetching news from `gnews.io`. It includes a fallback `MOCK_NEWS_DATA` for development or when the API key is missing/fails.
- `httpClient.ts`: Likely a wrapper around `fetch` or `axios`.

## Key Features (Implemented vs. Potential)
- **Implemented (Visible)**:
  - Responsive Landing Page with Hero, About, and Testimonials sections.
  - Custom Design System with Dark Mode support (via CSS variables).
- **Implemented (Logic Only/Hidden)**:
  - News fetching from GNews API.
  - Search and Category filtering.
  - Pagination (Load More).
  - Bookmarking system (using `localStorage`).
  - Text-to-Speech functionality.
  - Font size adjustment.

## Design System
The project uses a custom set of CSS variables defined in `globals.css`:
- **Colors**: `royal-blue`, `amber-orange`, `deep-navy`, etc.
- **Themes**: Light and Dark mode support via `data-theme` attribute.
- **Utilities**: Classes like `.ds-hero`, `.ds-section`, `.ds-card` prefixed with `ds-`.

## Notes
- The `HomePageClient` seems to be in a transitional state where it contains the logic for a full news app but renders a marketing landing page.
- `newsService` is robust with error handling and mock data fallbacks.
