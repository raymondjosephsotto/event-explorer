import { useState, useEffect } from "react";
import { fetchEventsByCity } from "../api/events";
import EventList from "../components/EventList";
import Filters from "../components/Filters";
import type { Event } from "../types/event.types";

const EventExplorerContainer = () => {
    // State: stores the currently selected city from the input
    const [city, setCity] = useState<string>("");

    // State: stores the fetched events from the API
    const [events, setEvents] = useState<Event[]>([]);

    // State: indicates whether the fetch request is in progress
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // State: stores any error message from the fetch request
    const [error, setError] = useState<string | null>(null);


    // Handles changes to the city input field
    const handleCityChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newCityValue = event.target.value;
        setCity(newCityValue);
    };

    // Effect: runs every time `city` changes.
    // Responsible for fetching events based on the current city input
    // and managing loading + error UI state.
    useEffect(() => {
        // Async helper function to perform the API request
        const fetchData = async () => {

            // Set loading to true before starting the request
            setIsLoading(true);

            // Clear any previous error before making a new request
            setError(null);

            try {
                // Call API layer to fetch events for the selected city
                const data = await fetchEventsByCity(city);

                // Store the fetched events in state (triggers re-render)
                setEvents(data);

            } catch (error) {
                // Narrow unknown error type safely (TypeScript strict mode)
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    // Fallback message if error is not a standard Error object
                    setError("Something went wrong while fetching events.");
                }

                console.error(error);

            } finally {
                // Always stop loading regardless of success or failure
                setIsLoading(false);
            }
        };

        // Guard clause: avoid unnecessary API calls
        // Prevent fetch when city input is empty or only whitespace
        if (!city.trim()) return;

        // Execute async fetch
        fetchData();

    }, [city]); // Re-run this effect whenever `city` state changes

    return (
        <>
            <div>Event Explorer Container</div>
            <br />
            <Filters city={city} handleCityChange={handleCityChange} />
            <br />
            <EventList events={events} isLoading={isLoading} error={error}/>
        </>
    );
};

export default EventExplorerContainer;