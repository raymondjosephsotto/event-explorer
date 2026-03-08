import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchEventsByQuery } from '../api/events';
import { dedupeById, dedupeByContent, spreadSimilarEvents } from '../utils/citySearch';

export const useInfiniteEvents = (
  query: string,
  sort: string,
  coords?: { lat: number; lng: number } | null,
  enabled = true
) => {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['events-infinite', query, sort, coords],
    queryFn: ({ signal, pageParam }) =>
      fetchEventsByQuery(query, sort, pageParam as number, signal, coords),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined;
      return allPages.length;
    },
    enabled,
  });

  // Flatten all pages, deduplicate across page boundaries, and spread similar events apart
  const events = spreadSimilarEvents(dedupeByContent(dedupeById(data?.pages.flatMap((p) => p.events) ?? [])));

  return {
    events,
    isLoading,
    error: error instanceof Error ? error.message : null,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
  };
};
