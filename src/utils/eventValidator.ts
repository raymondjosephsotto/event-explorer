/**
 * Client-side filters to remove past events that slip through
 * the Ticketmaster API's date window.
 *
 * Why this layer exists:
 * - Ticketmaster's API can return events outside the requested date range
 * - Local timezone conversions can cause off-by-one date errors
 * - Events on today's date may have already occurred (time-based filtering)
 */

/**
 * Returns true when the event has not yet occurred
 * relative to the user's local date and time.
 *
 * Logic:
 * 1. "TBD" dates are always included (no time info to validate)
 * 2. Future dates are always included
 * 3. Past dates are always excluded
 * 4. Same-day events are checked against current local time
 *    - If no time is provided, the event is included (date-only entries)
 *    - If time is provided, event must be >= now
 *
 * @param eventDate - Ticketmaster date (YYYY-MM-DD format or "TBD")
 * @param eventTime - Ticketmaster time (HH:mm:ss format or empty string)
 * @param now - Reference time (defaults to current local time)
 * @returns true if the event is upcoming; false if it's in the past
 */
export const isUpcomingEvent = (
  eventDate: string,
  eventTime: string,
  now: Date = new Date()
): boolean => {
  if (eventDate === "TBD") return true;

  // Extract and validate the YYYY-MM-DD portion
  const dateOnly = eventDate.slice(0, 10);
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateOnly);
  if (!dateMatch) return false;

  // Parse as local calendar date (not UTC) to avoid timezone shift
  const [, year, month, day] = dateMatch;
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDayStart = new Date(Number(year), Number(month) - 1, Number(day));

  if (Number.isNaN(eventDayStart.getTime())) return false;

  // Future date → include
  if (eventDayStart.getTime() > startOfToday.getTime()) return true;

  // Past date → exclude
  if (eventDayStart.getTime() < startOfToday.getTime()) return false;

  // Same day → compare time when available; keep if time is unknown
  if (!eventTime) return true;

  // Validate time format (HH:mm or HH:mm:ss)
  const timeMatch = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(eventTime);
  if (!timeMatch) return true;

  // Build the full event datetime as a local date (not UTC)
  const [, hh, mm, ss] = timeMatch;
  const eventDateTime = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hh),
    Number(mm),
    Number(ss ?? "0")
  );

  if (Number.isNaN(eventDateTime.getTime())) return true;

  // Only include if event time is >= current time
  return eventDateTime.getTime() >= now.getTime();
};
