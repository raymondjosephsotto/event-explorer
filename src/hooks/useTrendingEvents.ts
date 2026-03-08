import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchTrendingEvents } from '../api/events';
import { dedupeById, dedupeByContent, spreadSimilarEvents } from '../utils/citySearch';

export const useTrendingEvents = (
  coords?: { lat: number; lng: number } | null,
  city?: string
) => {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['trending-events', coords, city],
    queryFn: ({ signal, pageParam }) =>
      fetchTrendingEvents(pageParam as number, signal, coords, city),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined;
      return allPages.length;
    },
    enabled: !!(coords || city),
  });

  const events = spreadSimilarEvents(
    dedupeByContent(dedupeById(data?.pages.flatMap((p) => p.events) ?? []))
  );

  return {
    events,
    isLoading,
    error: error instanceof Error ? error.message : null,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
  };
};
