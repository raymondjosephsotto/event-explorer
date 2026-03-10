# Event Explorer

`Event Explorer` is a React + TypeScript app for discovering upcoming live events using the Ticketmaster Discovery API.

It supports location-aware discovery, debounced search, category filtering, sort controls, and responsive event layouts.

## Live Demo

`https://raymondjosephsotto.github.io/event-explorer/`

## Features

- Discover upcoming events from Ticketmaster (3-month rolling window).
- Location-aware results:
- Uses IP-based lookup first, then browser geolocation fallback.
- Falls back to `Denver` if location cannot be resolved.
- Debounced search with URL sync (`?q=...`) for shareable searches.
- Smart query strategy:
- Keyword search for artists/event names.
- City-variant search to improve city-name matching.
- Client-side category chips with deduplicated category labels.
- Sort options integrated into the request flow.
- Hero + trending masonry sections when no manual search is active.
- Loading, empty, and error states with retry support.
- React Query caching and next-page prefetching.

## Tech Stack

- React 19
- TypeScript 5
- Vite 7
- Material UI (MUI)
- TanStack Query
- Swiper (hero/carousel behavior)
- Vitest + Testing Library
- ESLint

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- A Ticketmaster API key

### 1. Clone and Install

```bash
git clone https://github.com/raymondjosephsotto/event-explorer.git
cd event-explorer
npm install
```

### 2. Configure Environment

Create `.env` in the project root:

```env
VITE_TICKETMASTER_API_KEY=your_ticketmaster_key_here
```

Without this value, API requests fail with a clear runtime error.

### 3. Run Locally

```bash
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Available Scripts

- `npm run dev`: Start Vite dev server.
- `npm run build`: Type-check (`tsc -b`) then build production assets.
- `npm run preview`: Preview the production build locally.
- `npm run lint`: Run ESLint across the project.
- `npm test`: Run Vitest test suite once.
- `npm run deploy`: Publish `dist/` via `gh-pages`.
- `npm run prod`: Build, then deploy.

## How It Works

### Data Flow

- UI state is managed in `src/containers/EventExplorerContainer.tsx`.
- Event fetching is handled by `src/hooks/useEvents.ts` (React Query).
- API orchestration lives in `src/api/events.ts`.
- Ticketmaster responses are mapped/validated in utility modules.

### Query Strategy

- If coordinates exist and there is no manual search query:
- Fetch by `latlong` + radius.
- If a search query exists:
- Fetch keyword results.
- Fetch city-variant results in parallel.
- Merge and deduplicate by event ID.
- Filter final events to upcoming dates only.

### Location Resolution

Implemented in `src/hooks/useUserLocation.ts`:

- Checks localStorage cache (`event-explorer:user-location`) with 24-hour TTL.
- Tries `https://ipapi.co/json/`.
- Falls back to `navigator.geolocation`.
- Falls back to city `Denver` if all else fails.

## React Query Notes

Default query behavior is configured in `src/main.tsx`:

- `staleTime`: 5 minutes
- `gcTime`: 10 minutes
- `refetchOnWindowFocus`: false
- `retry`: 1

Devtools can be enabled in development by either:

- Appending `?rq-devtools` to the URL, or
- Running in browser console: `localStorage.setItem("rq-devtools", "true")`

## Testing

Run tests:

```bash
npm test
```

Current test coverage includes:

- `ChipsBar` interaction behavior.
- `EventList` render states (loading, empty, error, populated).
- `useEvents` initial loading state.

Test setup file: `src/test/setup.ts`.

## Linting

```bash
npm run lint
```

## Deployment

This project is configured for GitHub Pages with Vite base path:

- `base: "/event-explorer/"` in `vite.config.ts`

### Manual Deploy

```bash
npm run prod
```

### GitHub Actions Deploy Requirements

Add this repository secret:

- `VITE_TICKETMASTER_API_KEY`

If the secret is missing, production API calls will resolve with an undefined key and fail at runtime.

CI/deploy workflows run tests (`npm test`) before deployment.

## Project Structure

```text
src/
	api/
		events.ts                 # Ticketmaster request orchestration
	components/
		navigation/               # Sticky top nav, chips, filters, search controls
	containers/
		EventExplorerContainer.tsx
	hooks/
		useEvents.ts
		useUserLocation.ts
	test/
		*.test.tsx
	types/
	utils/
```

## Troubleshooting

- `Missing Ticketmaster API key`:
- Ensure `.env` exists and includes `VITE_TICKETMASTER_API_KEY`.
- Restart dev server after editing `.env`.
- No results shown:
- Confirm key is valid and quota is not exceeded.
- Try a broad query like `concert`.
- GitHub Pages loads but API fails:
- Confirm Actions secret `VITE_TICKETMASTER_API_KEY` is set.

## Roadmap Ideas

- Add pagination controls/infinite scroll in UI.
- Expand test coverage around API mapping and filtering utils.
- Add observability for API errors/rate limits.
- Improve accessibility audits and keyboard flows.

## License

MIT
