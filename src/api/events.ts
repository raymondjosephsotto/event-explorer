import type { Event } from "../types/event.types";

export const fetchEventsByCity = async (_city: string): Promise<Event[]> => {
    void _city; //temporarily void the city type
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    return data;
};