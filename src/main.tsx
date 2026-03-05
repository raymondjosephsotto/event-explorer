import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import App from './App.tsx'

// Create a single QueryClient instance.
// This acts as the central cache and manager for all server data in the app.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data remains fresh for 5 minutes before becoming stale
      staleTime: 5 * 60 * 1000,

      // Cached data stays in memory for 10 minutes after unused
      gcTime: 10 * 60 * 1000,

      // Prevent refetching when the window regains focus
      refetchOnWindowFocus: false,

      // Retry failed requests once
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/*
      QueryClientProvider makes TanStack Query available
      to the entire React component tree.

      Any component that uses `useQuery()` will:
      - Access this shared client
      - Use its caching system
      - Automatically manage loading and error states
    */}
    <QueryClientProvider client={queryClient}>
      
      <App />

      {/* TanStack Query Devtool: Only display during development mode */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}

    </QueryClientProvider>
  </StrictMode>
)
