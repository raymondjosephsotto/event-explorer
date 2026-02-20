import { useState } from "react";
import { useEvents } from "../hooks/useEvents";
import EventList from "../components/EventList";
import Filters from "../components/Filters";
import { Container } from "@mui/material";

const EventExplorerContainer = () => {
    // State: stores the currently selected city from the input
    const [city, setCity] = useState<string>("");

    //set the custom hook (useEvents)logic:
    const { events, isLoading, error } = useEvents(city);

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
            <EventList events={events} isLoading={isLoading} error={error}/>
        </Container>
    );
};

export default EventExplorerContainer;