import type { Event } from "../types/event.types";

type TicketmasterEvent = {
  id: string;
  name: string;
  url: string;
  dates?: {
    start?: {
      localDate?: string;
    };
  };
  _embedded?: {
    venues?: {
      city?: {
        name?: string;
      };
    }[];
  };
  images?: {
    url: string;
  }[];
};

export const fetchEventsByCity = async (city: string): Promise<Event[]> => {
    const response = await fetch(
        `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${import.meta.env.VITE_TICKETMASTER_API_KEY}&keyword=${city}`
    );

    const rawData = await response.json();

    // Extract Ticketmaster events array safely
    const events: TicketmasterEvent[] = rawData._embedded?.events ?? [];

    console.log("Ticketmaster raw events:", events);

    return events.map((event) => ({
        id: event.id,
        title: event.name,
        city: event._embedded?.venues?.[0]?.city?.name ?? "Unknown",
        date: event.dates?.start?.localDate ?? "TBD",
        url: event.url,
        image: event.images?.[0]?.url ?? "",
    }));

};