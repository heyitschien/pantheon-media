import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { PantheonMediaContainer } from '../PantheonMediaContainer';

describe('PantheonMediaContainer', () => {
  const mockMedia = {
    mediaId: '13904fa8-dda5-4e9e-88c4-0d57fa9af6c4',
    title: 'Pantheon Highlights',
    coverImage: '/first-movie-card.png',
    isPantheonOriginal: true,
    description: 'Test description',
    rating: 'PG-13',
    duration: '23m',
    year: '2024',
    genres: ['Regenerative', 'Nature', 'Sustainability']
  };

  describe('State Management', () => {
    it('should initialize with preview not visible', () => {
      render(<PantheonMediaContainer media={mockMedia} />);
      const preview = screen.queryByRole('dialog');
      expect(preview).not.toBeVisible();
    });

    it('should show preview on card hover', async () => {
      render(<PantheonMediaContainer media={mockMedia} />);
      const card = screen.getByTestId('pantheon-card');
      
      fireEvent.mouseEnter(card);
      
      await waitFor(() => {
        const preview = screen.getByRole('dialog');
        expect(preview).toBeVisible();
      });
    });

    it('should hide preview on mouse leave', async () => {
      render(<PantheonMediaContainer media={mockMedia} />);
      const card = screen.getByTestId('pantheon-card');
      
      // Show preview
      fireEvent.mouseEnter(card);
      await waitFor(() => {
        const preview = screen.getByRole('dialog');
        expect(preview).toBeVisible();
      });
      
      // Hide preview
      const preview = screen.getByRole('dialog');
      fireEvent.mouseLeave(preview);
      
      await waitFor(() => {
        expect(preview).not.toBeVisible();
      });
    });
  });

  describe('Component Coordination', () => {
    it('should pass correct props to PantheonCard', () => {
      render(<PantheonMediaContainer media={mockMedia} />);
      const card = screen.getByTestId('pantheon-card');
      
      expect(card).toHaveAttribute('data-media-id', mockMedia.mediaId);
      expect(screen.getByText(mockMedia.title)).toBeInTheDocument();
    });

    it('should pass correct props to PantheonPreview', async () => {
      render(<PantheonMediaContainer media={mockMedia} />);
      const card = screen.getByTestId('pantheon-card');
      
      fireEvent.mouseEnter(card);
      
      await waitFor(() => {
        const preview = screen.getByRole('dialog');
        expect(preview).toHaveAttribute('data-media-id', mockMedia.mediaId);
        expect(screen.getByText(mockMedia.description)).toBeInTheDocument();
      });
    });
  });

  describe('Hover Behavior', () => {
    it('should handle rapid hover/unhover events', async () => {
      render(<PantheonMediaContainer media={mockMedia} />);
      const card = screen.getByTestId('pantheon-card');
      
      // Rapid hover/unhover
      fireEvent.mouseEnter(card);
      fireEvent.mouseLeave(card);
      fireEvent.mouseEnter(card);
      
      // Should still end up visible
      await waitFor(() => {
        const preview = screen.getByRole('dialog');
        expect(preview).toBeVisible();
      });
    });

    it('should maintain hover state when moving from card to preview', async () => {
      render(<PantheonMediaContainer media={mockMedia} />);
      const card = screen.getByTestId('pantheon-card');
      
      fireEvent.mouseEnter(card);
      
      await waitFor(() => {
        const preview = screen.getByRole('dialog');
        fireEvent.mouseEnter(preview); // Move to preview
        fireEvent.mouseLeave(card); // Leave card
        expect(preview).toBeVisible();
      });
    });
  });

  describe('Z-Index Management', () => {
    it('should increase z-index on hover', () => {
      render(<PantheonMediaContainer media={mockMedia} />);
      const container = screen.getByTestId('media-container');
      
      fireEvent.mouseEnter(container);
      
      expect(container).toHaveClass('z-[100]');
    });

    it('should reset z-index on unhover', async () => {
      render(<PantheonMediaContainer media={mockMedia} />);
      const container = screen.getByTestId('media-container');
      
      fireEvent.mouseEnter(container);
      fireEvent.mouseLeave(container);
      
      await waitFor(() => {
        expect(container).not.toHaveClass('z-[100]');
      });
    });
  });
}); 