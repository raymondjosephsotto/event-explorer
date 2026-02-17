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

    // Handles changes to the city input field
    const handleCityChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newCityValue = event.target.value;
        setCity(newCityValue);
    };

    // Effect: fetch events whenever the city value changes
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchEventsByCity(city);

            // Update events state with fetched data
            setEvents(data);

            console.log("Fetching for city:", city);
        };

        // Guard clause: prevent API call if city is empty or whitespace
        if (!city.trim()) return;

        // Trigger async fetch
        fetchData();

    }, [city]); // Re-run effect whenever `city` state changes

    return (
        <>
            <div>Event Explorer Container</div>
            <br />
            <Filters city={city} handleCityChange={handleCityChange} />
            <br />
            <EventList events={events} />
        </>
    );
};

export default EventExplorerContainer;