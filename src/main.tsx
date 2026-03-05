import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import App from './App.tsx'

// Create a single QueryClient instance.
// This acts as the central cache and manager for all server data in the app.
const queryClient = new QueryClient();

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
