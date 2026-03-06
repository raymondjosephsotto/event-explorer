/**
 * Maps raw Ticketmaster API response objects
 * into the app's normalised Event shape.
 *
 * Why this separation exists:
 * - Ticketmaster's response structure is deeply nested and optional
 * - App events need a flatter, more consistent interface
 * - This layer handles all the null-coalescing and fallbacks
 * - Makes the API contract change-tolerant
 */
import type { Event } from "../types/event.types";

export type TicketmasterEvent = {
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

/**
 * Converts a Ticketmaster event into the app's Event type.
 *
 * Handles:
 * - Extracting venue name/city from deeply nested structure
 * - Selecting the largest image by width
 * - Flattening and deduping category names
 * - Providing sensible fallbacks for missing fields
 *
 * @param event - Raw Ticketmaster event object
 * @returns Normalized Event object ready for UI rendering
 */
export const mapTicketmasterEvent = (event: TicketmasterEvent): Event => {
  // Extract venue and city with safe fallbacks for missing nested data
  const venue = event._embedded?.venues?.[0]?.name ?? "Unknown Venue";
  const city = event._embedded?.venues?.[0]?.city?.name ?? "Unknown";

  // Extract date and time (may be "TBD" or empty strings)
  const localDate = event.dates?.start?.localDate ?? "TBD";
  const localTime = event.dates?.start?.localTime ?? "";

  // Flatten and dedupe category names from classifications
  // (e.g., genre, segment, and subGenre are different classification types)
  const categories =
    event.classifications
      ?.map((c) => c.genre?.name || c.segment?.name)
      .filter((name): name is string => Boolean(name)) ?? [];

  // Select the largest image by width for best display quality
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
};
