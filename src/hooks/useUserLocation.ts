import { useEffect, useRef, useState } from "react";

/**
 * Coordinates represents latitude and longitude
 * used throughout the application for geo-based event fetching.
 * 
 * We keep this centralized so both React Query and UI layers
 * can rely on a consistent shape.
 */
type Coordinates = {
  lat: number;
  lng: number;
};

/**
 * ResolutionSource tracks how the user location was determined.
 * 
 * "ip"       → resolved via IP-based lookup (no permission required)
 * "browser"  → resolved via navigator.geolocation (requires permission)
 * "default"  → fallback city when all location strategies fail
 *
 * This helps with debugging, analytics, and future feature expansion.
 */
type ResolutionSource = "ip" | "browser" | "default";

/**
 * CachedLocation represents the structure stored in localStorage.
 * 
 * We persist:
 * - coords     → the resolved coordinates (if available)
 * - city       → resolved city name (used for keyword fallback)
 * - source     → how the location was determined
 * - timestamp  → used for TTL validation
 *
 * This enables:
 * - Reduced API calls
 * - Predictable behavior across reloads
 * - TTL-based invalidation strategy
 */
type CachedLocation = {
  coords: Coordinates | null;
  city: string;
  source: ResolutionSource;
  timestamp: number;
};

/**
 * LocalStorage key for persisting resolved user location.
 * 
 * Centralized here so future migrations or renaming
 * can be handled in one place.
 */
const STORAGE_KEY = "event-explorer:user-location";

/**
 * Time-To-Live for cached location (24 hours).
 * 
 * After this duration:
 * - IP lookup will be attempted again
 * - Browser fallback may be retriggered
 *
 * This balances freshness with API efficiency.
 */
const TTL = 1000 * 60 * 60 * 24;

export const useUserLocation = () => {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [city, setCity] = useState<string>("");
  const [isResolving, setIsResolving] = useState(true);

  /**
   * React 18 StrictMode intentionally double-invokes effects in development.
   * 
   * This ref ensures location resolution runs only once,
   * preventing:
   * - Duplicate IP requests
   * - Duplicate geolocation prompts
   * - Double localStorage writes
   */
  const hasResolvedRef = useRef(false);

  useEffect(() => {
    if (hasResolvedRef.current) return;
    hasResolvedRef.current = true;

    const resolveLocation = async () => {
      try {
        // =================================================
        // STEP 1 — TTL-Based Cache Validation
        // =================================================
        // If a valid cached location exists and has not expired,
        // we hydrate state immediately and skip all network calls.
        // This ensures:
        // - Instant page load experience
        // - No redundant IP lookups
        // - Stable React Query cache keys
        const cachedRaw = localStorage.getItem(STORAGE_KEY);

        if (cachedRaw) {
          const cached: CachedLocation = JSON.parse(cachedRaw);

          const isValid = Date.now() - cached.timestamp < TTL;

          if (isValid) {
            setCoords(cached.coords ?? null);
            setCity(cached.city ?? "");
            setIsResolving(false);
            return;
          }
        }

        // =================================================
        // STEP 2 — IP-Based Location Resolution (No Permission)
        // uses ipapi.co (can swap provider later)
        // =================================================
        // Attempt to resolve user location via IP lookup.
        // Advantages:
        // - No browser permission required
        // - Silent resolution
        // - Works on first load
        //
        // If successful, we cache and short-circuit execution.
        try {
          const ipResponse = await fetch("https://ipapi.co/json/");
          const ipData = await ipResponse.json();

          if (ipData?.latitude && ipData?.longitude) {
            const resolved: CachedLocation = {
              coords: {
                lat: ipData.latitude,
                lng: ipData.longitude,
              },
              city: ipData.city ?? "",
              source: "ip",
              timestamp: Date.now(),
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(resolved));

            setCoords(resolved.coords);
            setCity(resolved.city);
            setIsResolving(false);
            return;
          }
        } catch {
          // If IP lookup fails (network error or blocked),
          // continue gracefully to browser-based resolution.
        }

        // =================================================
        // STEP 3 — Browser Geolocation Fallback
        // =================================================
        // If IP resolution fails, attempt navigator.geolocation.
        // This may trigger a permission prompt.
        // 
        // If accepted → use precise device coordinates.
        // If denied   → fallback to default city.
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const resolved: CachedLocation = {
                coords: {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                },
                city: "",
                source: "browser",
                timestamp: Date.now(),
              };

              localStorage.setItem(STORAGE_KEY, JSON.stringify(resolved));

              setCoords(resolved.coords);
              setCity("");
              setIsResolving(false);
            },
            () => {
              const fallback: CachedLocation = {
                coords: null,
                city: "Denver",
                source: "default",
                timestamp: Date.now(),
              };

              localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));

              setCity("Denver");
              setCoords(null);
              setIsResolving(false);
            }
          );
        } else {
          const fallback: CachedLocation = {
            coords: null,
            city: "Denver",
            source: "default",
            timestamp: Date.now(),
          };

          localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));

          setCity("Denver");
          setCoords(null);
          setIsResolving(false);
        }
      } catch {
        // =================================================
        // FINAL SAFETY NET
        // =================================================
        // If anything unexpected occurs during resolution,
        // default to a known safe city to prevent blank UI
        // and maintain deterministic behavior.
        const fallback: CachedLocation = {
          coords: null,
          city: "Denver",
          source: "default",
          timestamp: Date.now(),
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));

        setCity("Denver");
        setCoords(null);
        setIsResolving(false);
      }
    };

    resolveLocation();
  }, []);

  return { coords, city, isResolving };
};