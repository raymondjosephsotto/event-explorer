import { useState, useEffect } from "react";
import { fetchEventsByCity } from "../api/events";
import EventList from "../components/EventList";
import Filters from "../components/Filters";
import type { Event } from "../types/event.types";

const EventExplorerContainer = () => {
    //create a state (city)
    const [city, setCity] = useState<string>(""); //TS: generic type annotation

    //create a state(events)
    const [events, setEvents] = useState<Event[]>([]);

    // Handle changes to the city input field, ensuring type safety for the event parameter
    const handleCityChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newCityValue = event.target.value;
        console.log(newCityValue);
        setCity(newCityValue);
    };

    //Add a temporary useEffect with empty dependency array
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchEventsByCity(city);
            setEvents(data);
        }
        fetchData();
    },[]);

    return (
        <>
            <div>Event Explorer Container</div>
            <br />
            <Filters city={city} handleCityChange={handleCityChange} />
            <br />
            <EventList events={events}/>
        </>
    );
};

export default EventExplorerContainer;