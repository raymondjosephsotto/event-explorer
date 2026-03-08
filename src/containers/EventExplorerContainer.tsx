import { useState, useEffect, useMemo } from "react";
import { useInfiniteEvents } from "../hooks/useInfiniteEvents";
import { useTrendingEvents } from "../hooks/useTrendingEvents";
import { useUserLocation } from "../hooks/useUserLocation";
import EventList from "../components/EventList";
import Hero from "../components/Hero";
import TrendingMasonry from "../components/TrendingMasonry";
import ErrorState from "../components/ErrorState";
import StickyNavTop from "../components/navigation/StickyNavTop";
import ScrollToTopFab from "../components/ScrollToTopFab";
import { Container, Box, styled } from "@mui/material";
import { getRenderableCategories } from "../utils/eventCategories";

const PageContentWrapper = styled(Box)(({ theme }) => ({
    maxWidth: 1400,
    margin: "0 auto",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),

    [theme.breakpoints.up("md")]: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
    },
}));

const EventExplorerContainer = () => {
    // Initialize query state from URL query param (if present)
    const getInitialQueryFromURL = (): string => {
        const params = new URLSearchParams(window.location.search);
        return params.get("q") ?? "";
    };

    // State: stores the current search query from the input
    const [query, setQuery] = useState<string>(getInitialQueryFromURL());

    // State: controls selected sorting option for events
    // Default is date ascending
    const [sort, setSort] = useState<string>("date,asc");

    // State: selected category chip for filtering
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Resolve user location (IP → browser → default fallback)
    const { coords, city, isResolving } = useUserLocation();

    // debouncedQuery updates only after the user stops typing.
    // This prevents triggering API calls on every keystroke.
    const [debouncedQuery, setDebouncedQuery] = useState<string>(query);

    //Handles clear search
    const handleClearSearch = () => {
        // Clear query state
        setQuery("");

        // Remove query param from URL
        const newURL = window.location.pathname;
        window.history.replaceState(null, "", newURL);

        // Scroll to top for better UX
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Handles sort changes
    const handleSortChange = (newSort: string) => {
        setSort(newSort);
    };

    //set the custom hook logic:
    const effectiveQuery = debouncedQuery.trim().length > 0 ? debouncedQuery : city;

    // Only use geolocation coords when there is NO manual search query.
    // If the user types a city (e.g., "New York"), we ignore coords
    // so the API does not prioritize the original geolocation (e.g., Denver).
    const effectiveCoords =
        debouncedQuery.trim().length > 0 ? undefined : coords;

    // Trending events for homepage (1-month window, infinite scroll)
    const {
        events: trendingEvents,
        isLoading: isTrendingLoading,
        fetchNextPage: fetchNextTrending,
        hasNextPage: hasMoreTrending,
        isFetchingNextPage: isFetchingMoreTrending,
    } = useTrendingEvents(
        effectiveCoords,
        city
    );

    const isSearching = debouncedQuery.trim().length > 0;

    const { events, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteEvents(effectiveQuery, sort, effectiveCoords, isSearching);

    const isDebouncing = query !== debouncedQuery && query.trim().length > 0;

    // Effect: debounce query input before triggering API fetch
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500); //wait 500ms after user stops typing

        return () => {
            clearTimeout(timer); //clear previous timer if user keeps typing
        };
    }, [query])

    // Effect: sync query state to URL query parameter
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        if (query.trim()) {
            params.set("q", query);
        } else {
            params.delete("q");
        }

        const queryString = params.toString();
        const newURL = queryString
            ? `${window.location.pathname}?${queryString}`
            : window.location.pathname;

        window.history.replaceState(null, "", newURL);
    }, [query])

    // Handles changes to the search query input field
    const handleQueryChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newQueryValue = event.target.value;
        setQuery(newQueryValue);
    };

    // Derive unique categories from all fetched events for the chips bar
    const uniqueCategories = useMemo(() => {
        const cats = events.flatMap((e) => getRenderableCategories(e.categories));
        return [...new Set(cats)];
    }, [events]);

    // Auto-reset selected category if it's no longer present in the new results
    const activeCategory = uniqueCategories.includes(selectedCategory ?? "") ? selectedCategory : null;

    // Apply category filter client-side on top of API results
    const filteredEvents = useMemo(() => {
        if (!activeCategory) return events;
        return events.filter((e) =>
            e.categories.some(
                (c) => c.toLowerCase() === activeCategory.toLowerCase()
            )
        );
    }, [events, activeCategory]);

    return (
        <Box>
            {/* Sticky top nav: Logo (all) + SearchControls (desktop only) */}
            <StickyNavTop
                query={query}
                handleQueryChange={handleQueryChange}
                sort={sort}
                setSort={handleSortChange}
                categories={uniqueCategories}
                selectedCategory={activeCategory}
                onCategorySelect={setSelectedCategory}
            />

            {/* Main content */}
            <Box>
                {/* Homepage: Hero + Trending with infinite scroll */}
                {!query && !isTrendingLoading && !isResolving && trendingEvents.length > 0 && (
                    <Hero events={trendingEvents} />
                )}
                {!query && !isTrendingLoading && !isResolving && trendingEvents.length > 0 && (
                    <PageContentWrapper py={6}>
                        <TrendingMasonry
                            events={trendingEvents}
                            location={city}
                            hasMore={hasMoreTrending}
                            isFetchingMore={isFetchingMoreTrending}
                            onLoadMore={fetchNextTrending}
                        />
                    </PageContentWrapper>
                )}

                {/* Search Results with infinite scroll */}
                {error ? (
                    <PageContentWrapper py={6}>
                        <ErrorState
                            message={error}
                            onRetry={() => fetchNextPage()}
                        />
                    </PageContentWrapper>
                ) : (
                    (query.trim().length > 0 || isLoading) && (
                        <Container sx={{ py: 4 }}>
                            <EventList
                                events={filteredEvents}
                                isLoading={isDebouncing || isLoading}
                                error={null}
                                onClearSearch={handleClearSearch}
                                hasMore={hasNextPage}
                                isFetchingMore={isFetchingNextPage}
                                onLoadMore={fetchNextPage}
                            />
                        </Container>
                    )
                )}
            </Box>

            <ScrollToTopFab />
        </Box>
    );
};

export default EventExplorerContainer
