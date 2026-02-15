
// Static array for mock events
const mockEvents = [
  { id: 1, title: "Music Festival", city: "New York" },
  { id: 2, title: "Tech Conference", city: "San Francisco" },
  { id: 3, title: "Art Expo", city: "Chicago" },
  { id: 4, title: "Food Fair", city: "Austin" },
  { id: 5, title: "Film Premiere", city: "Los Angeles" },
  { id: 6, title: "Book Signing", city: "Seattle" },
  { id: 7, title: "Startup Pitch", city: "Boston" },
  { id: 8, title: "Charity Run", city: "Denver" },
  { id: 9, title: "Comedy Night", city: "Portland" },
  { id: 10, title: "Wine Tasting", city: "Napa Valley" }
];

const EventList = () => {
  return (
    <>
      <div>Event List</div>
      <br />
      <ul>
        {mockEvents.map((mockEvent) => (
          <li key={mockEvent.id}>
            <p>Event Name: {mockEvent.title}</p>
            <p>City: {mockEvent.city}</p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default EventList;