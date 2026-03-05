import { useState, useEffect } from "react";
import { useEvents } from "../hooks/useEvents";
import { useUserLocation } from "../hooks/useUserLocation";
import EventList from "../components/EventList";
import Hero from "../components/Hero";
import TrendingMasonry from "../components/TrendingMasonry";
import ErrorState from "../components/ErrorState";
import StickyNavigation from "../components/StickyNavigation";
import { Container, Box } from "@mui/material";
import { PageContentWrapper } from "./EventExplorer.styles";

const EventExplorerContainer = () => {
    // Initialize query state from URL query param (if present)
    const getInitialQueryFromURL = (): string => {
        const params = new URLSearchParams(window.location.search);
        return params.get("q") ?? "";
    };
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
    // State: stores the current search query from the input
    const [query, setQuery] = useState<string>(getInitialQueryFromURL());

    // State: controls selected sorting option for events
    // Default is date ascending
    const [sort, setSort] = useState<string>("date,asc");

    // Handles sort changes and resets pagination
    const handleSortChange = (newSort: string) => {
        setPage(0);
        setSort(newSort);
    };

    //State: stores the page number
    const [page, setPage] = useState(0);

    // Resolve user location (IP → browser → default fallback)
    const { coords, city, isResolving } = useUserLocation();

    // debouncedQuery updates only after the user stops typing.
    // This prevents triggering API calls on every keystroke.
    const [debouncedQuery, setDebouncedQuery] = useState<string>(query);

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

    return (
        <Box>
            {/* Sticky Navigation Bar */}
            <StickyNavigation
                query={query}
                handleQueryChange={handleQueryChange}
                sort={sort}
                setSort={handleSortChange}
            />

            {!query && !isLoading && !isResolving && events.length > 0 && (
                <Hero events={events} />
            )}
            {!query && !isLoading && !isResolving && events.length > 0 && (
                <PageContentWrapper py={6}>
                    <TrendingMasonry events={events.slice(0, 12)} />
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
                            events={events}
                            isLoading={isLoading}
                            error={error}
                            onClearSearch={handleClearSearch}
                        />
                    </Container>
                )
            )}
        </Box>
    );
};

export default EventExplorerContainer