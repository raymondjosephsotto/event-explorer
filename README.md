# Event Explorer

A modern **React + TypeScript** web application that allows users to discover live events using the **Ticketmaster Discovery API**.  
The app features real-time search, sorting, responsive layouts, image fallbacks, and robust loading/error states.

---

## Live Demo

https://raymondjosephsotto.github.io/event-explorer/

---

## Features

- Event search powered by the Ticketmaster API
- Sorting by relevance or date
- Responsive masonry layout for trending events
- Hero carousel highlighting featured events
- Image fallback handling for missing event images
- Skeleton loaders for smooth loading states
- Error UI with retry functionality
- Mobile responsive design
- Production-ready build deployed via GitHub Pages

---

## Tech Stack

### Frontend
- React
- TypeScript
- Vite

### UI / Styling
- Material UI (MUI)
- Responsive Masonry Layout

### Data Fetching
- TanStack Query

### API
- Ticketmaster Discovery API

### Deployment
- GitHub Pages

---

## Installation

Clone the repository

```bash
git clone https://github.com/raymondjosephsotto/event-explorer.git
cd event-explorer
```

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm run dev
```

---

## Environment Setup

Create a `.env` file in the project root:

```
VITE_TICKETMASTER_API_KEY=your_api_key_here
```

For GitHub Pages deployment via GitHub Actions, also add a repository secret:

- `VITE_TICKETMASTER_API_KEY` = your Ticketmaster API key

GitHub path: `Settings` -> `Secrets and variables` -> `Actions` -> `New repository secret`.

---

## Build

Create a production build

```bash
npm run build
```

Preview the production build locally

```bash
npm run preview
```

---

## Project Highlights

This project demonstrates several modern frontend engineering practices:

- Type-safe API integration using **TypeScript**
- Advanced state management with **TanStack Query**
- Resilient UI through loading, empty, and error states
- Responsive layouts using **Material UI**
- Graceful fallback strategies for missing images
- Production-ready build pipeline using **Vite**

---

## Future Improvements

- Infinite scroll pagination
- Query caching optimizations
- TanStack Query DevTools integration
- Geolocation-based event discovery
- Performance optimizations via code splitting

---

## License

MIT
