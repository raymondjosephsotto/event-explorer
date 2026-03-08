import type { Event } from "../types/event.types";
import type { TicketmasterEvent } from "../utils/eventMapper";
import { mapTicketmasterEvent } from "../utils/eventMapper";
import { isUpcomingEvent } from "../utils/eventValidator";
import { getCityVariants, dedupeById, dedupeByContent } from "../utils/citySearch";

const TICKETMASTER_API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY;

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
// Returns raw Ticketmaster events and total pages, or throws on non-200 status
const fetchFromTicketmaster = async (
  extraParams: Record<string, string>,
  signal?: AbortSignal
): Promise<{ events: TicketmasterEvent[]; totalPages: number }> => {
  if (!TICKETMASTER_API_KEY || TICKETMASTER_API_KEY === "undefined") {
    throw new Error(
      "Missing Ticketmaster API key. Set VITE_TICKETMASTER_API_KEY in your environment before building the app."
    );
  }

  const { startDateTime, endDateTime } = buildDateRangeParams();

  const params = new URLSearchParams({
    apikey: TICKETMASTER_API_KEY,
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
    page?: { totalPages?: number };
  } = await response.json();

  return {
    events: rawData._embedded?.events ?? [],
    totalPages: rawData.page?.totalPages ?? 1,
  };
};

// Main entry point — fetches, maps, and filters Ticketmaster events
// Public API: called from useEvents / useInfiniteEvents hooks via React Query
export const fetchEventsByQuery = async (
  query: string,
  sort: string,
  page: number,
  signal?: AbortSignal,
  coords?: { lat: number; lng: number } | null
): Promise<{ events: Event[]; hasMore: boolean }> => {
  const shared = { sort, page: String(page) };
  let raw: TicketmasterEvent[] = [];
  let maxTotalPages = 1;

  // Path 1: Geolocation-based search
  // When user location is available, search by lat/long radius
  if (coords) {
    const result = await fetchFromTicketmaster(
      { ...shared, latlong: `${coords.lat},${coords.lng}`, radius: "50", unit: "miles" },
      signal
    );
    raw = result.events;
    maxTotalPages = result.totalPages;
  } else {
    // Path 2: Text-based search (keyword or city)
    const trimmed = query.trim();

    // First, try keyword search (catches artist names, event names, etc.)
    const keywordResult = await fetchFromTicketmaster(
      { ...shared, keyword: trimmed || "concert" },
      signal
    );

    if (!trimmed) {
      // No query provided: use default keyword results
      raw = keywordResult.events;
      maxTotalPages = keywordResult.totalPages;
    } else {
      // Query provided: combine keyword + city searches and dedupe
      // This handles cases like "New York" that work better with city param
      const cityResults = await Promise.all(
        getCityVariants(trimmed).map((city) =>
          fetchFromTicketmaster({ ...shared, city }, signal)
        )
      );

      raw = dedupeById([...keywordResult.events, ...cityResults.flatMap((r) => r.events)]);
      maxTotalPages = Math.max(keywordResult.totalPages, ...cityResults.map((r) => r.totalPages));
    }
  }

  // Final pipeline: map Ticketmaster → app Events, dedupe, then filter for upcoming only
  // Apply deduplication to all paths to ensure no duplicate events appear
  const mapped = raw.map(mapTicketmasterEvent);
  const deduped = dedupeByContent(dedupeById(mapped));
  const events = deduped.filter((event) => isUpcomingEvent(event.date, event.time));

  return { events, hasMore: page < maxTotalPages - 1 };
};

// Fetches a paginated set of events within the next month for the trending section.
// Uses a 1-month window so the masonry grid shows a calendar-month of events.
export const fetchTrendingEvents = async (
  page: number,
  signal?: AbortSignal,
  coords?: { lat: number; lng: number } | null,
  city?: string
): Promise<{ events: Event[]; hasMore: boolean }> => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const oneMonthLater = new Date(startOfToday);
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

  const dateOverrides: Record<string, string> = {
    size: "20",
    sort: "date,asc",
    page: String(page),
    startDateTime: formatDateTime(startOfToday),
    endDateTime: formatDateTime(oneMonthLater),
  };

  let raw: TicketmasterEvent[] = [];
  let maxTotalPages = 1;

  if (coords) {
    const result = await fetchFromTicketmaster(
      { ...dateOverrides, latlong: `${coords.lat},${coords.lng}`, radius: "50", unit: "miles" },
      signal
    );
    raw = result.events;
    maxTotalPages = result.totalPages;
  } else if (city) {
    const results = await Promise.all(
      getCityVariants(city).map((c) =>
        fetchFromTicketmaster({ ...dateOverrides, city: c }, signal)
      )
    );
    raw = dedupeById(results.flatMap((r) => r.events));
    maxTotalPages = Math.max(...results.map((r) => r.totalPages));
  }

  const mapped = raw.map(mapTicketmasterEvent);
  const events = dedupeByContent(dedupeById(mapped)).filter((e) => isUpcomingEvent(e.date, e.time));

  return { events, hasMore: page < maxTotalPages - 1 };
};