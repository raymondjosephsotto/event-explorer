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
    width?: number;
    height?: number;
  }[];
  classifications?: {
    segment?: { name?: string };
    genre?: { name?: string };
    subGenre?: { name?: string };
  }[];
};

export const fetchEventsByQuery = async (query: string, sort: string, page: number, signal?: AbortSignal): Promise<Event[]> => {

  const response = await fetch(
    `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${import.meta.env.VITE_TICKETMASTER_API_KEY}&keyword=${query.trim() || "concert"}&sort=${sort}&page=${page}&size=20`, { signal }
  );

  const rawData: {
    _embedded?: {
      events?: TicketmasterEvent[];
    };
  } = await response.json();

  // Extract Ticketmaster events array safely
  const events: TicketmasterEvent[] = rawData._embedded?.events ?? [];

  return events.map((event) => {
    const venue = event._embedded?.venues?.[0]?.name ?? "Unknown Venue";
    const city = event._embedded?.venues?.[0]?.city?.name ?? "Unknown";

    const localDate = event.dates?.start?.localDate ?? "TBD";
    const localTime = event.dates?.start?.localTime ?? "";

    const categories =
      event.classifications
        ?.map((c) => c.genre?.name || c.segment?.name)
        .filter((name): name is string => Boolean(name)) ?? [];

    const largestImage =
      event.images
        ?.slice()
        .sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0]
        ?.url ?? null;

    return {
      id: event.id,
      title: event.name,
      venue,
      city,
      date: localDate,
      time: localTime,
      categories,
      url: event.url,
      image: largestImage,
    };
  });

};