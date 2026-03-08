/**
 * Helpers for resolving city-name variations
 * so Ticketmaster locality searches are more tolerant.
 *
 * Problem:
 * - Ticketmaster indexes cities with inconsistent naming
 *   (e.g., "New York" vs "New York City")
 * - Single-name queries often return zero results
 *
 * Solution:
 * - Try keyword + all known city variants in parallel
 * - Dedupe results by event ID
 * - More comprehensive results with fewer false empties
 */

/**
 * Given a user's search input, returns an array of
 * city-name variants to try against the Ticketmaster `city` param.
 *
 * Currently handles:
 * - "New York" → also tries "New York City"
 * - "NYC" → tries both "New York City" and "New York"
 * - Anything else → appends " City" suffix (e.g., "Boston" → "Boston City")
 *
 * @param input - Raw city name from user search
 * @returns Array of city name variants to query (in order of priority)
 */
export const getCityVariants = (input: string): string[] => {
  const trimmed = input.trim();
  if (!trimmed) return [];

  const variants: string[] = [trimmed];
  const normalized = trimmed.toLowerCase();

  // Ticketmaster often indexes New York as "New York City"
  if (normalized === "new york") variants.push("New York City");
  if (normalized === "nyc") variants.push("New York City", "New York");

  // Generic fallback: append "City" if not already present
  if (!normalized.endsWith(" city")) variants.push(`${trimmed} City`);

  return [...new Set(variants)];
};

/**
 * Deduplicates an array of items that each have an `id` property,
 * preserving the order of first occurrence.
 *
 * Use case:
 * - After combining keyword + city search results,
 *   some events may appear in multiple result sets
 * - This removes duplicates while preserving order
 *
 * @param items - Array of objects with `id` property
 * @returns Deduplicated array with unique IDs only
 */
export const dedupeById = <T extends { id: string }>(items: T[]): T[] => {
  const seen = new Set<string>();
  const unique: T[] = [];

  // Iterate once, keeping first occurrence of each ID
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    unique.push(item);
  }

  return unique;
};

/**
 * Deduplicates events that share the same title, date, and venue
 * but have different IDs (common with Ticketmaster multi-source listings).
 */
export const dedupeByContent = <T extends { title: string; date: string; venue: string }>(items: T[]): T[] => {
  const seen = new Set<string>();
  const unique: T[] = [];

  for (const item of items) {
    const key = `${item.title.toLowerCase().trim()}|${item.date}|${item.venue.toLowerCase().trim()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }

  return unique;
};

/**
 * Reorders events so that items with similar titles (e.g. same artist
 * performing on different dates) are spread apart rather than clustered.
 *
 * Algorithm: group by a normalised title key, then round-robin across
 * groups so each pick comes from a different group until all are placed.
 */
export const spreadSimilarEvents = <T extends { title: string }>(items: T[]): T[] => {
  if (items.length <= 2) return items;

  // Normalise: strip trailing parentheticals, convert to lowercase
  const normTitle = (t: string) => t.toLowerCase().replace(/\s*\(.*\)$/, '').trim();

  // Build ordered buckets — one per unique normalised title
  const buckets = new Map<string, T[]>();
  for (const item of items) {
    const key = normTitle(item.title);
    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = [];
      buckets.set(key, bucket);
    }
    bucket.push(item);
  }

  // Round-robin: cycle through the buckets, taking one from each per pass
  const result: T[] = [];
  const queues = [...buckets.values()];
  let emptied = 0;
  const pointers = new Array<number>(queues.length).fill(0);

  while (emptied < queues.length) {
    for (let i = 0; i < queues.length; i++) {
      if (pointers[i] < queues[i].length) {
        result.push(queues[i][pointers[i]]);
        pointers[i]++;
        if (pointers[i] === queues[i].length) emptied++;
      }
    }
  }

  return result;
};

