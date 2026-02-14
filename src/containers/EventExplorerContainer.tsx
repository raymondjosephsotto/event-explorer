import EventList from "../components/EventList";
import Filters from "../components/Filters";

const EventExplorerContainer = () => {
    return (
        <>
            <div>Event Explorer Container</div>
            <Filters />
            <EventList />
        </>
    );
};

export default EventExplorerContainer;