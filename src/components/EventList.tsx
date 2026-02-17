import type { Event } from "../types/event.types";

type EventListProps = {
  events: Event[]
}

const EventList = ({ events }: EventListProps) => {
  return (
    <>
      <div>Event List</div>
      <br />
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <p>Event Name: {event.title}</p>
            <p>City: {event.city}</p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default EventList;