import { useState, useEffect } from "react";
import { fetchEventsByCity } from "../api/events";
import type { Event } from "../types/event.types";

// Custom Hook: encapsulates event fetching logic
export const useEvents = (city: string) => {
  // State: stores the fetched events from the API
  const [events, setEvents] = useState<Event[]>([]);

  // State: indicates whether the fetch request is in progress
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // State: stores any error message from the fetch request
  const [error, setError] = useState<string | null>(null);

  // Effect: runs every time `city` changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchEventsByCity(city);
        setEvents(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Something went wrong while fetching events.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (!city.trim()) return;

    fetchData();
  }, [city]);

  // Expose state to consuming components
  return { events, isLoading, error };
};
