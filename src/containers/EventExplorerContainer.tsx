import { useState } from "react";
import EventList from "../components/EventList";
import Filters from "../components/Filters";

const EventExplorerContainer = () => {
    //create a state (city)
    const [city, setCity] = useState<string>(""); //TS: generic type annotation

    // Handle changes to the city input field, ensuring type safety for the event parameter
    const handleCityChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newCityValue = event.target.value;
        console.log(newCityValue);
        setCity(newCityValue);
    };

    return (
        <>
            <div>Event Explorer Container</div>
            <br />
            <Filters city={city} handleCityChange={handleCityChange} />
            <br />
            <EventList />
        </>
    );
};

export default EventExplorerContainer;