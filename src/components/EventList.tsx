import type { Event } from "../types/event.types";
import { CircularProgress } from "@mui/material";

type EventListProps = {
  events: Event[];
  isLoading: boolean;
  error: string | null;
};

const EventList = ({ events, isLoading, error }: EventListProps) => {
  return (
    <>
      <div>Event List</div>
      <br />

      {/* Loading State */}
      {isLoading && (
        <>
          <p>Loading events...</p>
          <br />
          <CircularProgress />
        </>
      )}

      {/* Error State */}
      {!isLoading && error && <p>Error: {error}</p>}

      {/* Empty State */}
      {!isLoading && !error && events.length === 0 && (
        <p>No events found.</p>
      )}

      {/* Data State */}
      {!isLoading && !error && events.length > 0 && (
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <p>Event Name: {event.title}</p>
              <p>City: {event.city}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default EventList;