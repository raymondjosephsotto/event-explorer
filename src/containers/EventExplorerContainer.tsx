import { useState, useEffect } from "react";
import { useEvents } from "../hooks/useEvents";
import EventList from "../components/EventList";
import Filters from "../components/Filters";
import { Container, Box, Stack, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

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
            <Box
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1100,
                    backgroundColor: "background.paper",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    py: 2,
                }}
            >
                <Container>
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={{ xs: query.trim().length > 0 ? 2 : 0, md: 2 }}
                        alignItems={{ md: "center" }}
                        justifyContent="space-between"
                        sx={{}}
                    >
                        <Box
                            sx={{
                                flexGrow: 1,
                                flexBasis: {
                                    md: query.trim().length > 0 ? "calc(100% - 260px)" : "100%",
                                },
                                maxWidth: {
                                    md: query.trim().length > 0 ? "calc(100% - 260px)" : "100%",
                                },
                                transition: "flex-basis 360ms cubic-bezier(0.4, 0, 0.2, 1), max-width 360ms cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                        >
                            <Filters
                                query={query}
                                handleQueryChange={handleQueryChange}
                            />
                        </Box>

                        <Box
                            sx={{
                                display: "block",

                                // Mobile accordion animation
                                overflow: {
                                    xs: query.trim().length > 0 ? "visible" : "hidden",
                                    md: "visible",
                                },
                                maxHeight: {
                                    xs: query.trim().length > 0 ? 120 : 0,
                                },

                                // Desktop horizontal animation
                                flexBasis: {
                                    md: query.trim().length > 0 ? 260 : 0,
                                },
                                maxWidth: {
                                    md: query.trim().length > 0 ? 260 : 0,
                                },
                                opacity: {
                                    md: query.trim().length > 0 ? 1 : 0,
                                },

                                transition: "max-height 300ms ease, flex-basis 360ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms ease",
                                flexShrink: 0,
                            }}
                        >
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
                        </Box>
                    </Stack>
                </Container>
            </Box>

            {/* Events Section */}
            <Container sx={{ py: 4 }}>
                <EventList
                    events={events}
                    isLoading={isLoading}
                    error={error}
                />
            </Container>
        </Box>
    );
};

export default EventExplorerContainer