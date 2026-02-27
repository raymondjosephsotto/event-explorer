import { useState, useEffect } from "react";
import { useEvents } from "../hooks/useEvents";
import EventList from "../components/EventList";
import Filters from "../components/Filters";
import { Container } from "@mui/material";

const EventExplorerContainer = () => {
    // State: stores the currently selected city from the input
    const [city, setCity] = useState<string>("");

    // debouncedCity updates only after the user stops typing.
    // This prevents triggering API calls on every keystroke.
    const [debouncedCity, setDebouncedCity] = useState<string>(city);

    //set the custom hook (useEvents)logic:
    const { events, isLoading, error } = useEvents(debouncedCity);

    //Effect: debounce city input before triggering API fetch
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedCity(city);
        }, 500); //wait 500ms after user stops typing

        return () => {
            clearTimeout(timer); //clear previous timer if user keeps typing
        };
    }, [city])

    // Handles changes to the city input field
    const handleCityChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newCityValue = event.target.value;
        setCity(newCityValue);
    };

    return (
        <Container>
            <Filters city={city} handleCityChange={handleCityChange} />
            <EventList events={events} isLoading={isLoading} error={error} />
        </Container>
    );
};

export default EventExplorerContainer