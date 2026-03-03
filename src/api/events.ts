import type { Event } from "../types/event.types";

type TicketmasterEvent = {
  id: string;
  name: string;
  url: string;
  dates?: {
    start?: {
      localDate?: string;
      localTime?: string;
    };
  };
  _embedded?: {
    venues?: {
      name?: string;
      city?: {
        name?: string;
      };
    }[];
  };
  images?: {
    url: string;
  }[];
  classifications?: {
    segment?: { name?: string };
    genre?: { name?: string };
    subGenre?: { name?: string };
  }[];
};

export const fetchEventsByQuery = async (query: string, sort: string, signal?: AbortSignal): Promise<Event[]> => {
  const response = await fetch(
    `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${import.meta.env.VITE_TICKETMASTER_API_KEY}&keyword=${query}&sort=${sort}`, {signal}
  );

  const rawData: {
    _embedded?: {
      events?: TicketmasterEvent[];
    };
  } = await response.json();

  // Extract Ticketmaster events array safely
  const events: TicketmasterEvent[] = rawData._embedded?.events ?? [];

  //console.log("Ticketmaster raw events:", events);
// console.log("Raw Ticketmaster event:", rawData._embedded?.events?.[0]);
// console.log(events[0]);
console.log(events[0]?.classifications?.[0]);

  return events.map((event) => {
    const venue = event._embedded?.venues?.[0]?.name ?? "Unknown Venue";
    const city = event._embedded?.venues?.[0]?.city?.name ?? "Unknown";

    const localDate = event.dates?.start?.localDate ?? "TBD";
    const localTime = event.dates?.start?.localTime ?? "";

    const categories =
      event.classifications
        ?.map((c) => c.genre?.name || c.segment?.name)
        .filter((name): name is string => Boolean(name)) ?? [];

    return {
      id: event.id,
      title: event.name,
      venue,
      city,
      date: localDate,
      time: localTime,
      categories,
      url: event.url,
      image: event.images?.[0]?.url ?? "",
    };
  });

};