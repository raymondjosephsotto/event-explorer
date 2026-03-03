import { useState, useEffect } from "react";
import { useEvents } from "../hooks/useEvents";
import EventList from "../components/EventList";
import Filters from "../components/Filters";
import Hero from "../components/Hero";
import TrendingMasonry from "../components/TrendingMasonry";
import { Container, Box, Stack, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { StickyNav, SearchContainer, SortContainer, PageContentWrapper } from "./EventExplorer.styles";

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

    // debouncedQuery updates only after the user stops typing.
    // This prevents triggering API calls on every keystroke.
    const [debouncedQuery, setDebouncedQuery] = useState<string>(query);

    //set the custom hook (useEvents)logic:
    const { events, isLoading, error } = useEvents(debouncedQuery, sort);

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

    return (
        <Box>
            {/* Sticky Navigation Bar */}
            <StickyNav>
                <Container>
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={{ xs: query.trim().length > 0 ? 2 : 0, md: 2 }}
                        alignItems={{ md: "center" }}
                        justifyContent="space-between"
                        sx={{}}
                    >
                        <SearchContainer hasQuery={query.trim().length > 0}>
                            <Filters
                                query={query}
                                handleQueryChange={handleQueryChange}
                            />
                        </SearchContainer>

                        <SortContainer hasQuery={query.trim().length > 0}>
                            <FormControl
                                fullWidth
                                sx={{
                                    minWidth: { md: 220 },
                                }}
                            >
                                <InputLabel id="sort-label" htmlFor="sort-select">
                                    Sort By
                                </InputLabel>
                                <Select
                                    id="sort-select"
                                    labelId="sort-label"
                                    value={sort}
                                    label="Sort By"
                                    onChange={(event) =>
                                        setSort(event.target.value)
                                    }
                                >
                                    <MenuItem value="date,asc">
                                        Date Ascending
                                    </MenuItem>
                                    <MenuItem value="date,desc">
                                        Date Descending
                                    </MenuItem>
                                    <MenuItem value="name,asc">
                                        Name Ascending
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </SortContainer>
                    </Stack>
                </Container>
            </StickyNav>

            {!query && !isLoading && events.length > 0 && (
                <Hero events={events} />
            )}
            {!query && !isLoading && events.length > 0 && (
                <PageContentWrapper py={6}>
                    <TrendingMasonry events={events.slice(0, 12)} />
                </PageContentWrapper>
            )}

            {/* Events Section */}
            {(query.trim().length > 0 || isLoading || error) && (
                <Container sx={{ py: 4 }}>
                    <EventList
                        events={events}
                        isLoading={isLoading}
                        error={error}
                        onClearSearch={handleClearSearch}
                    />
                </Container>
            )}
        </Box>
    );
};

export default EventExplorerContainer