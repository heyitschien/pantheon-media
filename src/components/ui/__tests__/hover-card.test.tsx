import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { MovieCard } from '../movie-card';
import { getPreviewVideo } from '@/services/bunny-stream';
import { TestWrapper } from '@/test/test-wrapper';

// Mock the Bunny Stream service
vi.mock('@/services/bunny-stream', () => ({
  getPreviewVideo: vi.fn().mockResolvedValue({
    videoUrl: 'https://test-cdn.net/test-video.mp4',
    posterUrl: 'https://test-cdn.net/test-poster.jpg'
  })
}));

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
});
window.IntersectionObserver = mockIntersectionObserver;

describe('MovieCard Hover Functionality', () => {
  const mockMovie = {
    id: 'test-id',
    title: 'Test Movie',
    description: 'Test Description',
    posterUrl: 'test-poster.jpg',
    videoUrl: 'test-video.mp4'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should load preview on hover', async () => {
    render(
      <TestWrapper>
        <MovieCard movie={mockMovie} />
      </TestWrapper>
    );

    const card = screen.getByTestId('movie-card');
    
    // Simulate hover
    await act(async () => {
      fireEvent.mouseEnter(card);
      // Fast-forward timers to trigger preview load
      vi.advanceTimersByTime(500);
    });

    // Verify preview video is requested
    expect(getPreviewVideo).toHaveBeenCalledWith(mockMovie.id);
    
    // Wait for preview to load
    await waitFor(() => {
      const previewVideo = screen.getByTestId('preview-video');
      expect(previewVideo).toBeInTheDocument();
      expect(previewVideo).toHaveAttribute('src', 'https://test-cdn.net/test-video.mp4');
    });
  });

  it('should cleanup resources on unhover', async () => {
    render(
      <TestWrapper>
        <MovieCard movie={mockMovie} />
      </TestWrapper>
    );

    const card = screen.getByTestId('movie-card');
    
    // Simulate hover and wait for preview
    await act(async () => {
      fireEvent.mouseEnter(card);
      vi.advanceTimersByTime(500);
    });

    // Verify preview loaded
    await waitFor(() => {
      expect(screen.getByTestId('preview-video')).toBeInTheDocument();
    });

    // Simulate unhover
    await act(async () => {
      fireEvent.mouseLeave(card);
      vi.advanceTimersByTime(300);
    });

    // Verify cleanup
    await waitFor(() => {
      expect(screen.queryByTestId('preview-video')).not.toBeInTheDocument();
    });
  });

  it('should handle failed preview loads', async () => {
    // Mock failed video load
    vi.mocked(getPreviewVideo).mockRejectedValueOnce(new Error('Failed to load'));

    render(
      <TestWrapper>
        <MovieCard movie={mockMovie} />
      </TestWrapper>
    );

    const card = screen.getByTestId('movie-card');
    
    // Simulate hover
    await act(async () => {
      fireEvent.mouseEnter(card);
      vi.advanceTimersByTime(500);
    });

    // Verify error handling
    await waitFor(() => {
      expect(screen.getByTestId('preview-error')).toBeInTheDocument();
      expect(screen.getByTestId('preview-error')).toHaveTextContent('Failed to load preview');
    });
  });

  it('should manage concurrent hover states', async () => {
    render(
      <TestWrapper>
        <MovieCard movie={mockMovie} />
        <MovieCard movie={{ ...mockMovie, id: 'test-id-2' }} />
      </TestWrapper>
    );

    const [card1, card2] = screen.getAllByTestId('movie-card');
    
    // Hover first card
    await act(async () => {
      fireEvent.mouseEnter(card1);
      vi.advanceTimersByTime(500);
    });

    // Verify first preview loaded
    await waitFor(() => {
      expect(screen.getByTestId('preview-video')).toHaveAttribute('data-movie-id', 'test-id');
    });

    // Hover second card
    await act(async () => {
      fireEvent.mouseEnter(card2);
      vi.advanceTimersByTime(500);
    });

    // Verify first preview is cleaned up and second is loaded
    await waitFor(() => {
      const previewVideos = screen.getAllByTestId('preview-video');
      expect(previewVideos).toHaveLength(1);
      expect(previewVideos[0]).toHaveAttribute('data-movie-id', 'test-id-2');
    });
  });

  it('should handle rapid hover/unhover', async () => {
    render(
      <TestWrapper>
        <MovieCard movie={mockMovie} />
      </TestWrapper>
    );

    const card = screen.getByTestId('movie-card');
    
    // Simulate rapid hover/unhover
    await act(async () => {
      fireEvent.mouseEnter(card);
      vi.advanceTimersByTime(100);
      fireEvent.mouseLeave(card);
      vi.advanceTimersByTime(100);
      fireEvent.mouseEnter(card);
      vi.advanceTimersByTime(500);
    });

    // Verify only one preview request is made
    expect(getPreviewVideo).toHaveBeenCalledTimes(1);
    
    // Verify preview is shown
    await waitFor(() => {
      expect(screen.getByTestId('preview-video')).toBeInTheDocument();
    });
  });

  it('should handle memory cleanup', async () => {
    const { unmount } = render(
      <TestWrapper>
        <MovieCard movie={mockMovie} />
      </TestWrapper>
    );

    const card = screen.getByTestId('movie-card');
    
    // Simulate hover
    await act(async () => {
      fireEvent.mouseEnter(card);
      vi.advanceTimersByTime(500);
    });

    // Verify preview loaded
    await waitFor(() => {
      expect(screen.getByTestId('preview-video')).toBeInTheDocument();
    });

    // Unmount component
    unmount();

    // Verify cleanup
    expect(screen.queryByTestId('preview-video')).not.toBeInTheDocument();
  });
}); 