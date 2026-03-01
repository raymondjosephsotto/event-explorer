import { render, screen } from '@testing-library/react';
import EventList from './EventList';
import { describe, it, expect } from 'vitest';

describe('EventList', () => {
    it('renders without crashing with empty state', () => {
        render(
            <EventList
                events={[]}
                isLoading={false}
                error={null}
            />
        );

        expect(screen.getByText("No events found.")).toBeInTheDocument();
    });

    it('renders loading state when isLoading is true', () => {
        render(
            <EventList
                events={[]}
                isLoading={true}
                error={null}
            />
        );

        expect(screen.getByText("Loading events...")).toBeInTheDocument();
    });

    it('renders event title when events exist', () => {
        const mockEvents = [
            {
                id: '1',
                title: 'New York Yankees vs Mets',
                city: 'New York',
                date: '2026-02-22',
                url: 'https://example.com',
                image: 'https://example.com/image.jpg',
            },
        ];

        render(
            <EventList
                events={mockEvents}
                isLoading={false}
                error={null}
            />
        );

        expect(
            screen.getByText('New York Yankees vs Mets')
        ).toBeInTheDocument();
    });
    it('renders error message when error exists', () => {
        render(
            <EventList
                events={[]}
                isLoading={false}
                error="Something went wrong"
            />
        );

        expect(
            screen.getByText("Error: Something went wrong")
        ).toBeInTheDocument();
    });
});