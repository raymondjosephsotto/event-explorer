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
