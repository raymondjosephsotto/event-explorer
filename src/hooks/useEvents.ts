import { useQuery } from '@tanstack/react-query';
import { fetchEventsByCity } from "../api/events";

// Custom Hook: encapsulates event fetching logic
export const useEvents = (city: string, sort: string) => {
  // useQuery manages server-state lifecycle for us.
  // It handles fetching, caching, loading state, error state,
  // background refetching, and deduplication automatically.
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['events', city, sort],
    // queryKey uniquely identifies this query in TanStack's cache.
    // If 'city' changes, TanStack treats it as a new query and refetches.

    queryFn: () => fetchEventsByCity(city, sort),
    // queryFn is the function that actually fetches data from the server.
    // It must return a Promise. TanStack calls this internally.

    enabled: city.trim().length >= 3,
    // enabled acts like a guard condition.
    // The query will only run if this evaluates to true.
  });

  // We normalize the return shape so the rest of the app
  // does not need to know it's using TanStack.
  // 'data' can be undefined before the first fetch,
  // so we fallback to an empty array for safety.
  return {
    events: data ?? [],
    isLoading,
    error: error instanceof Error ? error.message : null,
  };
};
