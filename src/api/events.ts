import type { Event } from "../types/event.types";
import type { TicketmasterEvent } from "../utils/eventMapper";
import { mapTicketmasterEvent } from "../utils/eventMapper";
import { isUpcomingEvent } from "../utils/eventValidator";
import { getCityVariants, dedupeById } from "../utils/citySearch";

/**
 * API orchestration layer for Ticketmaster event discovery.
 *
 * Responsibilities:
 * - Build Ticketmaster request parameters
 * - Coordinate parallel searches (keyword + city variants)
 * - Map and validate results before returning to UI
 *
 * Note: Complex business logic (date filtering, city variants, mapping)
 * is delegated to focused utility modules for clarity and testability.
 */

// Strips milliseconds from an ISO string → "YYYY-MM-DDTHH:mm:ssZ"
// (Ticketmaster is strict about datetime format)
const formatDateTime = (date: Date) =>
  date.toISOString().replace(/\.\d{3}Z$/, "Z");

// Builds the shared date-range params for every Ticketmaster request
// Returns a 3-month window from today onwards (to ensure we have upcoming events)
const buildDateRangeParams = () => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const endDate = new Date(startOfToday);
  endDate.setMonth(endDate.getMonth() + 3);

  return {
    startDateTime: formatDateTime(startOfToday),
    endDateTime: formatDateTime(endDate),
  };
};

// Low-level fetch wrapper that hits the Ticketmaster Discovery API
// Accepts any extra parameters (keyword, city, latlong, etc.)
// Returns raw Ticketmaster events or throws on non-200 status
const fetchFromTicketmaster = async (
  extraParams: Record<string, string>,
  signal?: AbortSignal
): Promise<TicketmasterEvent[]> => {
  const { startDateTime, endDateTime } = buildDateRangeParams();

  const params = new URLSearchParams({
    apikey: import.meta.env.VITE_TICKETMASTER_API_KEY,
    size: "20",
    startDateTime,
    endDateTime,
    ...extraParams,
  });

  const response = await fetch(
    `https://app.ticketmaster.com/discovery/v2/events.json?${params.toString()}`,
    { signal }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ticketmaster request failed (${response.status}): ${errorText}`);
  }

  const rawData: {
    _embedded?: { events?: TicketmasterEvent[] };
  } = await response.json();

  return rawData._embedded?.events ?? [];
};

// Main entry point — fetches, maps, and filters Ticketmaster events
// Public API: called from useEvents hook via React Query
export const fetchEventsByQuery = async (
  query: string,
  sort: string,
  page: number,
  signal?: AbortSignal,
  coords?: { lat: number; lng: number } | null
): Promise<Event[]> => {
  const shared = { sort, page: String(page) };
  let raw: TicketmasterEvent[] = [];

  // Path 1: Geolocation-based search
  // When user location is available, search by lat/long radius
  if (coords) {
    raw = await fetchFromTicketmaster(
      { ...shared, latlong: `${coords.lat},${coords.lng}`, radius: "50", unit: "miles" },
      signal
    );
  } else {
    // Path 2: Text-based search (keyword or city)
    const trimmed = query.trim();

    // First, try keyword search (catches artist names, event names, etc.)
    const keywordResults = await fetchFromTicketmaster(
      { ...shared, keyword: trimmed || "concert" },
      signal
    );

    if (!trimmed) {
      // No query provided: use default keyword results
      raw = keywordResults;
    } else {
      // Query provided: combine keyword + city searches and dedupe
      // This handles cases like "New York" that work better with city param
      const cityResults = await Promise.all(
        getCityVariants(trimmed).map((city) =>
          fetchFromTicketmaster({ ...shared, city }, signal)
        )
      );

      raw = dedupeById([...keywordResults, ...cityResults.flat()]);
    }
  }

  // Final pipeline: map Ticketmaster → app Events, then filter for upcoming only
  return raw
    .map(mapTicketmasterEvent)
    .filter((event) => isUpcomingEvent(event.date, event.time));
};