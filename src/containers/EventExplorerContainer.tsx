import { useState, useEffect, useMemo } from "react";
import { useEvents } from "../hooks/useEvents";
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

    //State: stores the page number
    const [page, setPage] = useState(0);

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

    // Handles sort changes and resets pagination
    const handleSortChange = (newSort: string) => {
        setPage(0);
        setSort(newSort);
    };

    //set the custom hook (useEvents)logic:
    const effectiveQuery = debouncedQuery.trim().length > 0 ? debouncedQuery : city;

    // Only use geolocation coords when there is NO manual search query.
    // If the user types a city (e.g., "New York"), we ignore coords
    // so the API does not prioritize the original geolocation (e.g., Denver).
    const effectiveCoords =
        debouncedQuery.trim().length > 0 ? undefined : coords;

    const { events, isLoading, error, refetch } =
        useEvents(effectiveQuery, sort, page, effectiveCoords);

    // Effect: debounce query input before triggering API fetch
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
            setPage(0); // reset pagination when query changes
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

    // Filter events to show only those within the next month
    const getEventsForNextMonth = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const oneMonthFromNow = new Date(today);
        oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

        return filteredEvents.filter(event => {
            if (!event.date) return false;

            const eventDate = new Date(event.date);
            return eventDate >= today && eventDate <= oneMonthFromNow;
        });
    };

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
                {!query && !isLoading && !isResolving && filteredEvents.length > 0 && (
                    <Hero events={filteredEvents} />
                )}
                {!query && !isLoading && !isResolving && filteredEvents.length > 0 && (
                    <PageContentWrapper py={6}>
                        <TrendingMasonry
                            events={getEventsForNextMonth()}
                            location={city}
                        />
                    </PageContentWrapper>
                )}

                {/* Events Section */}
                {error ? (
                    <PageContentWrapper py={6}>
                        <ErrorState
                            message={error}
                            onRetry={() => refetch?.()}
                        />
                    </PageContentWrapper>
                ) : (
                    (query.trim().length > 0 || isLoading) && (
                        <Container sx={{ py: 4 }}>
                            <EventList
                                events={filteredEvents}
                                isLoading={isLoading}
                                error={error}
                                onClearSearch={handleClearSearch}
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
