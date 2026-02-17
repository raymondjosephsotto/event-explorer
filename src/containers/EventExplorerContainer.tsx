import { useState } from "react";
import { useEvents } from "../hooks/useEvents";
import EventList from "../components/EventList";
import Filters from "../components/Filters";

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