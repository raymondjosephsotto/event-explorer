import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ChipsBar from '../components/navigation/ChipsBar';

describe('ChipsBar', () => {
    it('renders nothing when categories is empty', () => {
        const { container } = render(
            <ChipsBar
                categories={[]}
                selectedCategory={null}
                onCategorySelect={() => {}}
            />
        );
        expect(container.firstChild).toBeNull();
    });

    it('renders an "All" chip and one chip per category', () => {
        render(
            <ChipsBar
                categories={['Alternative', 'Alternative Rock']}
                selectedCategory={null}
                onCategorySelect={() => {}}
            />
        );

        expect(screen.getByText('All')).toBeInTheDocument();
        expect(screen.getByText('Alternative')).toBeInTheDocument();
        expect(screen.getByText('Alternative Rock')).toBeInTheDocument();
    });

    it('renders each category exactly once (no duplicates)', () => {
        render(
            <ChipsBar
                categories={['Alternative', 'Alternative Rock']}
                selectedCategory={null}
                onCategorySelect={() => {}}
            />
        );

        expect(screen.getAllByText('Alternative')).toHaveLength(1);
    });

    it('calls onCategorySelect with the category when a chip is clicked', () => {
        const onCategorySelect = vi.fn();

        render(
            <ChipsBar
                categories={['Alternative']}
                selectedCategory={null}
                onCategorySelect={onCategorySelect}
            />
        );

        fireEvent.click(screen.getByText('Alternative'));
        expect(onCategorySelect).toHaveBeenCalledWith('Alternative');
    });

    it('calls onCategorySelect with null when the active category chip is clicked again', () => {
        const onCategorySelect = vi.fn();

        render(
            <ChipsBar
                categories={['Alternative']}
                selectedCategory="Alternative"
                onCategorySelect={onCategorySelect}
            />
        );

        fireEvent.click(screen.getByText('Alternative'));
        expect(onCategorySelect).toHaveBeenCalledWith(null);
    });

    it('calls onCategorySelect with null when the "All" chip is clicked', () => {
        const onCategorySelect = vi.fn();

        render(
            <ChipsBar
                categories={['Alternative']}
                selectedCategory="Alternative"
                onCategorySelect={onCategorySelect}
            />
        );

        fireEvent.click(screen.getByText('All'));
        expect(onCategorySelect).toHaveBeenCalledWith(null);
    });
});
