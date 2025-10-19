## System Architecture

This app is a simple Next.js (App Router) application that fetches news from the GNews API via a server-side API route. Client UI state (topics, saved articles, theme, font scale) is stored in `localStorage`. No database or auth are used.

### High-level components

- Client UI: `src/app/page.tsx` (client component)
- API Route: `src/app/api/news/route.ts`
- Layout & global styles: `src/app/layout.tsx`, `src/app/globals.css`
- Env management: `src/lib/env.ts`

### Data flow diagram

```mermaid
flowchart LR
  subgraph Browser[Browser]
    UI[NewsPage UI (page.tsx)]
    LS[(localStorage\n- preferredTopics\n- savedArticles\n- fontScale\n- theme)]
    TTS[Web Speech API\nText-to-Speech]
  end

  subgraph NextApp[Next.js App Router]
    APIRoute[/GET /api/news\n(src/app/api/news/route.ts)/]
  end

  subgraph External[External Service]
    GNews[(GNews API\napi.gnews.io)]
  end

  UI -->|fetch /api/news?q,topic,breaking| APIRoute
  UI <-.- -> LS
  UI -. speak/stop .-> TTS
  APIRoute -->|HTTP fetch with GNEWS_API_KEY| GNews
  APIRoute -->|JSON articles| UI

```

### Behavioral notes

- Initial load: if user has selected topics in `localStorage`, the UI batches requests per topic to `/api/news?topic=...`; otherwise it loads breaking headlines with `/api/news?breaking=1`.
- Search: submitting the search form triggers `/api/news?q=...`.
- Breaking ticker: polls `/api/news?breaking=1` every 60s, rotates display every 5s.
- Bookmarks: saved client-side in `localStorage` (no backend persistence).
- Text-to-speech: uses the browser Web Speech API.

### Configuration

- Required env at runtime for news fetching: `GNEWS_API_KEY`.
- Optional helpers in `src/lib/env.ts` exist for broader env validation but are not strictly enforced.
