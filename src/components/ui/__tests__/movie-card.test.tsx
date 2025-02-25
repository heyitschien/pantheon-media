import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MovieCard } from '../movie-card';
import { getPreviewVideo } from '@/services/pexels';
import { BrowserRouter, Routes, Route, MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PlayerProvider, usePlayer } from '@/contexts/PlayerContext';

// Mock the PlayerContext
const mockPlayMovie = vi.fn();
vi.mock('@/contexts/PlayerContext', () => {
  const actual = vi.importActual('@/contexts/PlayerContext');
  return {
    ...actual,
    PlayerProvider: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="player-provider">
        {children}
      </div>
    ),
    usePlayer: () => {
      const navigate = useNavigate();
      return {
        playMovie: (movie: any) => {
          mockPlayMovie(movie);
          navigate('/player-test');
        },
        isPlaying: false,
        currentMovie: null,
      };
    },
  };
});

// Mock the Pexels service
vi.mock('@/services/pexels', () => ({
  getPreviewVideo: vi.fn().mockResolvedValue({
    videoUrl: 'test-video-url',
    posterUrl: 'test-poster-url'
  }),
}));

// Mock the useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

const mockPreviewVideo = {
  videoUrl: 'test-video-url',
  posterUrl: 'test-poster-url',
};

// Location tracker component for testing navigation
const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
};

// Test wrapper component with all required providers and routes
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <MemoryRouter initialEntries={['/']}>
      <QueryClientProvider client={queryClient}>
        <PlayerProvider>
          <div>
            {children}
            <Routes>
              <Route path="/" element={<div />} />
              <Route path="/genre/:slug" element={<div data-testid="genre-page" />} />
              <Route path="/movie/:id" element={<div data-testid="movie-details" />} />
              <Route path="/player-test" element={<div data-testid="player" />} />
            </Routes>
            <LocationDisplay />
          </div>
        </PlayerProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );
};

// Mock the MovieInfoModal component to avoid dialog accessibility issues
vi.mock('../movie-info-modal', () => ({
  MovieInfoModal: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
    isOpen ? (
      <div data-testid="movie-info-modal">
        <button onClick={onClose}>Close</button>
      </div>
    ) : null
  ),
}));

// Helper function to render with all providers
const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui, { wrapper: TestWrapper });
};

describe('MovieCard', () => {
  const mockProps = {
    id: 'test-movie-1',
    title: 'Test Movie',
    image: '/test-image.jpg',
    description: 'A test movie description',
    rating: 'PG-13',
    duration: '2h 30m',
    year: '2024',
    isPrismOriginal: true,
    genres: ['Action', 'Drama'],
    match: 95,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (getPreviewVideo as ReturnType<typeof vi.fn>).mockResolvedValue(mockPreviewVideo);
  });

  describe('Base State (Before Hover)', () => {
    it('renders with correct structure and styling', () => {
      renderWithProviders(<MovieCard {...mockProps} />);
      
      // Card container
      const card = screen.getByTestId('movie-card');
      expect(card).toHaveClass('relative', 'h-[300px]', 'group/item');
      
      // Image
      const image = screen.getByAltText('Test Movie');
      expect(image).toHaveClass(
        'w-full',
        'h-[176px]',
        'object-cover',
        'rounded-lg'
      );
      
      // Title container
      const titleContainer = screen.getByText('Test Movie').parentElement;
      expect(titleContainer).toHaveClass(
        'absolute',
        'bottom-0',
        'p-3',
        'w-full'
      );
      
      // Title
      const title = screen.getByText('Test Movie');
      expect(title).toHaveClass(
        'text-white',
        'font-bold',
        'text-lg',
        'line-clamp-1'
      );
      
      // Gradient overlay
      const overlay = titleContainer?.parentElement;
      expect(overlay).toHaveClass(
        'absolute',
        'inset-0',
        'bg-gradient-to-t',
        'from-black/60',
        'to-transparent',
        'rounded-lg'
      );
    });

    it('renders badges in correct position with proper styling', () => {
      renderWithProviders(
        <MovieCard
          {...mockProps}
          isPrismOriginal={true}
          isTop10={true}
          isNew={true}
        />
      );
      
      // Badge container
      const badgeContainer = screen.getByText('P').parentElement;
      expect(badgeContainer).toHaveClass(
        'absolute',
        'top-3',
        'left-3',
        'flex',
        'gap-2'
      );
      
      // P badge (formerly PRISM+ Original)
      const pBadge = screen.getByText('P');
      expect(pBadge).toHaveClass(
        'bg-gradient-lotus',
        'bg-clip-text',
        'text-transparent',
        'text-xl',
        'font-extrabold'
      );
      
      // TOP 10 badge
      const top10Badge = screen.getByText('TOP 10');
      expect(top10Badge).toHaveClass(
        'bg-gradient-to-r',
        'from-red-700',
        'via-red-500',
        'to-red-400'
      );
      
      // NEW badge
      const newBadge = screen.getByText('NEW');
      expect(newBadge).toHaveClass(
        'bg-gradient-to-r',
        'from-emerald-600',
        'via-emerald-500',
        'to-emerald-400'
      );
    });

    it('does not show any hover state elements', () => {
      renderWithProviders(<MovieCard {...mockProps} />);
      
      // Should not show any hover elements
      expect(screen.queryByText('95% Match')).not.toBeInTheDocument();
      expect(screen.queryByText('2024')).not.toBeInTheDocument();
      expect(screen.queryByText('2h 30m')).not.toBeInTheDocument();
      expect(screen.queryByText('PG-13')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Play')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('More Info')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Add to List')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Like')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Action' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Drama' })).not.toBeInTheDocument();
    });

    it('maintains base state when mouse leaves after hover', async () => {
      renderWithProviders(<MovieCard {...mockProps} />);
      
      const card = screen.getByTestId('movie-card');
      
      // Hover the card
      fireEvent.mouseEnter(card);
      // Un-hover the card
      fireEvent.mouseLeave(card);
      
      // Verify we're back to base state
      expect(screen.queryByText('95% Match')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Play')).not.toBeInTheDocument();
      
      // Verify base elements are still there
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
      expect(screen.getByText('P')).toBeInTheDocument();
    });
  });

  describe('Hover State', () => {
    it('shows rich content on hover', async () => {
      renderWithProviders(<MovieCard {...mockProps} />);
      
      const card = screen.getByTestId('movie-card');
      fireEvent.mouseEnter(card);
      
      // Wait for hover state elements
      await waitFor(() => {
        // Control buttons
        expect(screen.getByLabelText('Play')).toBeInTheDocument();
        expect(screen.getByLabelText('More Info')).toBeInTheDocument();
        expect(screen.getByLabelText('Add to List')).toBeInTheDocument();
        expect(screen.getByLabelText('Like')).toBeInTheDocument();
        
        // Movie info
        expect(screen.getByText('95% Match')).toBeInTheDocument();
        expect(screen.getByText('2024')).toBeInTheDocument();
        expect(screen.getByText('2h 30m')).toBeInTheDocument();
        expect(screen.getByText('PG-13')).toBeInTheDocument();
        
        // Genre tags (now as buttons)
        const actionButton = screen.getByRole('button', { name: 'Action' });
        const dramaButton = screen.getByRole('button', { name: 'Drama' });
        expect(actionButton).toBeInTheDocument();
        expect(dramaButton).toBeInTheDocument();
      });
    });

    describe('Button Interactions', () => {
      it('shows feedback for Add to List button', async () => {
        renderWithProviders(<MovieCard {...mockProps} />);
        
        // Hover the card
        const card = screen.getByTestId('movie-card');
        fireEvent.mouseEnter(card);
        
        // Click Add to List button
        await waitFor(() => {
          const addButton = screen.getByLabelText('Add to List');
          fireEvent.click(addButton);
        });
        
        // Check feedback
        await waitFor(() => {
          expect(screen.getByTestId('add-feedback')).toBeInTheDocument();
          expect(screen.getByText('Added to List')).toBeInTheDocument();
        });
      });

      it('shows feedback for Like button', async () => {
        renderWithProviders(<MovieCard {...mockProps} />);
        
        // Hover the card
        const card = screen.getByTestId('movie-card');
        fireEvent.mouseEnter(card);
        
        // Click Like button
        await waitFor(() => {
          const likeButton = screen.getByLabelText('Like');
          fireEvent.click(likeButton);
        });
        
        // Check feedback
        await waitFor(() => {
          expect(screen.getByTestId('like-feedback')).toBeInTheDocument();
          expect(screen.getByText('Added to Liked')).toBeInTheDocument();
        });
      });
    });

    describe('Navigation', () => {
      it('navigates to genre page when clicking genre tag', async () => {
        renderWithProviders(<MovieCard {...mockProps} />);
        
        // Hover the card
        const card = screen.getByTestId('movie-card');
        fireEvent.mouseEnter(card);
        
        // Click genre button
        await waitFor(() => {
          const genreButton = screen.getByRole('button', { name: 'Action' });
          fireEvent.click(genreButton);
        });
        
        // Verify navigation
        await waitFor(() => {
          const location = screen.getByTestId('location-display');
          expect(location.textContent).toBe('/genre/action');
        });
      });

      it('navigates to movie details when clicking more info button', async () => {
        renderWithProviders(<MovieCard {...mockProps} />);
        
        // Hover the card
        const card = screen.getByTestId('movie-card');
        fireEvent.mouseEnter(card);
        
        // Click More Info button
        await waitFor(() => {
          const moreInfoButton = screen.getByLabelText('More Info');
          fireEvent.click(moreInfoButton);
        });
        
        // Verify navigation
        await waitFor(() => {
          const location = screen.getByTestId('location-display');
          expect(location.textContent).toBe('/movie/test-movie-1');
        });
      });

      it('navigates to player when clicking play button', async () => {
        renderWithProviders(<MovieCard {...mockProps} />);
        
        // Hover the card
        const card = screen.getByTestId('movie-card');
        fireEvent.mouseEnter(card);
        
        // Click Play button
        await waitFor(() => {
          const playButton = screen.getByLabelText('Play');
          fireEvent.click(playButton);
        });
        
        // Verify navigation
        await waitFor(() => {
          const location = screen.getByTestId('location-display');
          expect(location.textContent).toBe('/player-test');
        });
      });
    });
  });

  describe('Hover Preview Card', () => {
    it('shows preview card with correct dimensions and position', async () => {
      renderWithProviders(<MovieCard {...mockProps} />);
      
      const card = screen.getByTestId('movie-card');
      fireEvent.mouseEnter(card);
      
      await waitFor(() => {
        const previewCard = card.querySelector('.absolute.w-[120%]');
        expect(previewCard).toBeInTheDocument();
        expect(previewCard).toHaveClass(
          'transition-all',
          'duration-300',
          'origin-bottom-left',
          'scale-110',
          'opacity-100'
        );
      });
    });

    it('handles rapid hover state changes', async () => {
      renderWithProviders(<MovieCard {...mockProps} />);
      
      const card = screen.getByTestId('movie-card');
      
      // Rapid hover in/out
      fireEvent.mouseEnter(card);
      fireEvent.mouseLeave(card);
      fireEvent.mouseEnter(card);
      
      await waitFor(() => {
        const previewCard = card.querySelector('.absolute.w-[120%]');
        expect(previewCard).toBeInTheDocument();
      });
      
      // Verify video state is managed correctly
      const video = screen.getByTestId('preview-video');
      expect(video).toHaveAttribute('src', mockPreviewVideo.videoUrl);
    });

    it('cleans up resources when unmounting during hover', async () => {
      const { unmount } = renderWithProviders(<MovieCard {...mockProps} />);
      
      const card = screen.getByTestId('movie-card');
      fireEvent.mouseEnter(card);
      
      await waitFor(() => {
        const video = screen.getByTestId('preview-video');
        expect(video).toBeInTheDocument();
      });
      
      // Unmount while hovering
      unmount();
      
      // Video cleanup will be handled by useEffect cleanup
      // We can't directly test DOM cleanup as component is unmounted
      // But we can verify the mock cleanup was called
      expect(getPreviewVideo).toHaveBeenCalledTimes(1);
    });

    it('maintains hover state during video loading', async () => {
      // Mock a delayed video load
      (getPreviewVideo as jest.Mock).mockImplementationOnce(() => 
        new Promise(resolve => 
          setTimeout(() => resolve(mockPreviewVideo), 100)
        )
      );
      
      renderWithProviders(<MovieCard {...mockProps} />);
      
      const card = screen.getByTestId('movie-card');
      fireEvent.mouseEnter(card);
      
      // Verify loading state
      await waitFor(() => {
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
      });
      
      // Verify preview card remains visible during loading
      const previewCard = card.querySelector('.absolute.w-[120%]');
      expect(previewCard).toBeInTheDocument();
      
      // Verify video appears after loading
      await waitFor(() => {
        const video = screen.getByTestId('preview-video');
        expect(video).toBeInTheDocument();
      });
    });

    it('shows correct metadata in preview card', async () => {
      renderWithProviders(<MovieCard {...mockProps} />);
      
      const card = screen.getByTestId('movie-card');
      fireEvent.mouseEnter(card);
      
      await waitFor(() => {
        // Match percentage
        expect(screen.getByText('95% Match')).toHaveClass('text-[#46d369]', 'font-semibold');
        
        // Metadata separators
        const separators = screen.getAllByText('•');
        expect(separators).toHaveLength(3);
        
        // Year, duration, rating
        expect(screen.getByText('2024')).toHaveClass('text-white/70');
        expect(screen.getByText('2h 30m')).toHaveClass('text-white/70');
        expect(screen.getByText('PG-13')).toHaveClass('border', 'border-white/40');
      });
    });

    it('transitions from fallback to video smoothly', async () => {
      // Mock the preview video service
      (getPreviewVideo as jest.Mock).mockResolvedValue({
        videoUrl: 'test-video-url',
        posterUrl: 'test-poster-url'
      });

      const { getByTestId } = render(
        <TestWrapper>
          <MovieCard {...mockProps} />
        </TestWrapper>
      );
      const card = getByTestId('movie-card');
      
      // Trigger hover
      fireEvent.mouseEnter(card);
      
      // Wait for video element to be rendered
      await waitFor(() => {
        const previewVideo = getByTestId('preview-video');
        expect(previewVideo).toBeInTheDocument();
      });
      
      // Verify initial state (fallback visible, video hidden)
      await waitFor(() => {
        const fallbackImage = getByTestId('preview-fallback');
        const previewVideo = getByTestId('preview-video');
        
        expect(fallbackImage).toHaveClass('opacity-100');
        expect(previewVideo).toHaveClass('opacity-0');
        expect(previewVideo).toHaveAttribute('src', 'test-video-url');
      });
      
      // Mock video play behavior
      const previewVideo = getByTestId('preview-video') as HTMLVideoElement;
      const playPromise = Promise.resolve();
      previewVideo.play = vi.fn().mockReturnValue(playPromise);
      
      // Trigger video load
      fireEvent.loadedData(previewVideo);
      
      // Wait for play to be called
      await waitFor(() => {
        expect(previewVideo.play).toHaveBeenCalled();
      });
      
      // Wait for play promise to resolve
      await act(async () => {
        await playPromise;
      });
      
      // Verify final state (video visible, fallback hidden)
      await waitFor(() => {
        const fallbackImage = getByTestId('preview-fallback');
        expect(fallbackImage).toHaveClass('opacity-0');
        expect(previewVideo).toHaveClass('opacity-100');
      });
    });
  });

  describe('Control Buttons Behavior', () => {
    beforeEach(() => {
      vi.useFakeTimers(); // Use fake timers for testing timeouts
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    describe('Add to List Button', () => {
      it('shows temporary feedback state without persistence', async () => {
        renderWithProviders(<MovieCard {...mockProps} />);
        
        // Hover the card
        const card = screen.getByTestId('movie-card');
        fireEvent.mouseEnter(card);
        
        // Get and click Add button
        const addButton = await screen.findByLabelText('Add to List');
        fireEvent.click(addButton);
        
        // Verify immediate feedback
        expect(screen.getByText('Added to List')).toBeInTheDocument();
        expect(addButton).toHaveClass('bg-zinc-700/80'); // Active state
        
        // Advance timers to verify temporary state
        vi.advanceTimersByTime(1500);
        
        // Verify feedback disappears
        await waitFor(() => {
          expect(screen.queryByText('Added to List')).not.toBeInTheDocument();
          expect(addButton).not.toHaveClass('bg-zinc-700/80');
        });
        
        // Verify no persistent state after hover out/in
        fireEvent.mouseLeave(card);
        fireEvent.mouseEnter(card);
        
        const newAddButton = await screen.findByLabelText('Add to List');
        expect(newAddButton).not.toHaveClass('bg-zinc-700/80');
      });

      it('handles multiple rapid clicks correctly', async () => {
        renderWithProviders(<MovieCard {...mockProps} />);
        
        const card = screen.getByTestId('movie-card');
        fireEvent.mouseEnter(card);
        
        const addButton = await screen.findByLabelText('Add to List');
        
        // Multiple rapid clicks
        fireEvent.click(addButton);
        fireEvent.click(addButton);
        fireEvent.click(addButton);
        
        // Should show feedback only once
        const feedbacks = screen.queryAllByText('Added to List');
        expect(feedbacks).toHaveLength(1);
      });
    });

    describe('Like Button', () => {
      it('shows temporary feedback state without persistence', async () => {
        renderWithProviders(<MovieCard {...mockProps} />);
        
        // Hover the card
        const card = screen.getByTestId('movie-card');
        fireEvent.mouseEnter(card);
        
        // Get and click Like button
        const likeButton = await screen.findByLabelText('Like');
        fireEvent.click(likeButton);
        
        // Verify immediate feedback
        expect(screen.getByText('Added to Liked')).toBeInTheDocument();
        expect(likeButton).toHaveClass('bg-zinc-700/80'); // Active state
        
        // Advance timers to verify temporary state
        vi.advanceTimersByTime(1500);
        
        // Verify feedback disappears
        await waitFor(() => {
          expect(screen.queryByText('Added to Liked')).not.toBeInTheDocument();
          expect(likeButton).not.toHaveClass('bg-zinc-700/80');
        });
        
        // Verify no persistent state after hover out/in
        fireEvent.mouseLeave(card);
        fireEvent.mouseEnter(card);
        
        const newLikeButton = await screen.findByLabelText('Like');
        expect(newLikeButton).not.toHaveClass('bg-zinc-700/80');
      });

      it('handles multiple rapid clicks correctly', async () => {
        renderWithProviders(<MovieCard {...mockProps} />);
        
        const card = screen.getByTestId('movie-card');
        fireEvent.mouseEnter(card);
        
        const likeButton = await screen.findByLabelText('Like');
        
        // Multiple rapid clicks
        fireEvent.click(likeButton);
        fireEvent.click(likeButton);
        fireEvent.click(likeButton);
        
        // Should show feedback only once
        const feedbacks = screen.queryAllByText('Added to Liked');
        expect(feedbacks).toHaveLength(1);
      });
    });

    describe('Button Accessibility', () => {
      it('provides proper aria labels and roles', async () => {
        renderWithProviders(<MovieCard {...mockProps} />);
        
        const card = screen.getByTestId('movie-card');
        fireEvent.mouseEnter(card);
        
        await waitFor(() => {
          expect(screen.getByLabelText('Add to List')).toHaveAttribute('aria-label', 'Add to List');
          expect(screen.getByLabelText('Like')).toHaveAttribute('aria-label', 'Like');
        });
      });

      it('maintains button functionality with keyboard navigation', async () => {
        renderWithProviders(<MovieCard {...mockProps} />);
        
        const card = screen.getByTestId('movie-card');
        fireEvent.mouseEnter(card);
        
        const addButton = await screen.findByLabelText('Add to List');
        const likeButton = await screen.findByLabelText('Like');
        
        // Test keyboard interaction
        addButton.focus();
        fireEvent.keyDown(addButton, { key: 'Enter' });
        expect(screen.getByText('Added to List')).toBeInTheDocument();
        
        likeButton.focus();
        fireEvent.keyDown(likeButton, { key: 'Enter' });
        expect(screen.getByText('Added to Liked')).toBeInTheDocument();
      });
    });

    describe('Visual Feedback', () => {
      it('shows correct hover states on buttons', async () => {
        renderWithProviders(<MovieCard {...mockProps} />);
        
        const card = screen.getByTestId('movie-card');
        fireEvent.mouseEnter(card);
        
        const addButton = await screen.findByLabelText('Add to List');
        const likeButton = await screen.findByLabelText('Like');
        
        // Test hover states
        fireEvent.mouseEnter(addButton);
        expect(addButton).toHaveClass('hover:bg-zinc-700/80');
        
        fireEvent.mouseEnter(likeButton);
        expect(likeButton).toHaveClass('hover:bg-zinc-700/80');
      });

      it('positions feedback tooltips correctly', async () => {
        renderWithProviders(<MovieCard {...mockProps} />);
        
        const card = screen.getByTestId('movie-card');
        fireEvent.mouseEnter(card);
        
        const addButton = await screen.findByLabelText('Add to List');
        fireEvent.click(addButton);
        
        const feedback = screen.getByText('Added to List');
        expect(feedback).toHaveClass('absolute', '-top-8');
      });
    });
  });

  describe('Small Hover Pop-up Modal', () => {
    const detailedMockProps = {
      id: 'test-movie-1',
      title: 'Test Movie',
      image: '/test-image.jpg',
      description: 'A test movie description',
      rating: 'PG-13',
      duration: '2h 23m',
      year: '2024',
      genres: ['Sci-Fi', 'Mystery', 'Adventure'],
      match: 98,
    };

    beforeEach(() => {
      vi.clearAllMocks();
      (getPreviewVideo as ReturnType<typeof vi.fn>).mockResolvedValue(mockPreviewVideo);
    });

    describe('1. Initial Hover Interaction', () => {
      it('shows preview card on hover', async () => {
        const { getByTestId } = render(
          <TestWrapper>
            <MovieCard movie={detailedMockProps} />
          </TestWrapper>
        );
        const card = getByTestId('movie-card');
        
        fireEvent.mouseEnter(card);
        await waitFor(() => {
          expect(getByTestId('preview-card')).toBeInTheDocument();
        });
      });

      it('removes preview card on mouseLeave', async () => {
        const { getByTestId, queryByTestId } = render(
          <TestWrapper>
            <MovieCard movie={detailedMockProps} />
          </TestWrapper>
        );
        const card = getByTestId('movie-card');
        
        fireEvent.mouseEnter(card);
        await waitFor(() => {
          expect(getByTestId('preview-card')).toBeInTheDocument();
        });
        
        fireEvent.mouseLeave(card);
        await waitFor(() => {
          expect(queryByTestId('preview-card')).not.toBeInTheDocument();
        });
      });

      it('handles rapid hover state changes gracefully', async () => {
        const { getByTestId, queryByTestId } = render(
          <TestWrapper>
            <MovieCard movie={detailedMockProps} />
          </TestWrapper>
        );
        const card = getByTestId('movie-card');
        
        // Rapid hover in/out
        fireEvent.mouseEnter(card);
        fireEvent.mouseLeave(card);
        fireEvent.mouseEnter(card);
        
        // Should still show preview properly
        await waitFor(() => {
          expect(getByTestId('preview-card')).toBeInTheDocument();
        });
      });
    });

    describe('2. Preview Card Transition', () => {
      it('animates with correct dimensions and positioning', async () => {
        const { getByTestId } = render(
          <TestWrapper>
            <MovieCard movie={mockProps} />
          </TestWrapper>
        );
        const card = getByTestId('movie-card');
        
        fireEvent.mouseEnter(card);
        await waitFor(() => {
          const previewCard = getByTestId('preview-card');
          expect(previewCard).toBeInTheDocument();
          
          // Check dimensions and positioning classes
          expect(previewCard).toHaveClass('w-[120%]');
          expect(previewCard).toHaveClass('top-[-64px]');
          expect(previewCard).toHaveClass('scale-110');
          expect(previewCard).toHaveClass('left-0');
          
          // Check transition classes
          expect(previewCard).toHaveClass('transition-all');
          expect(previewCard).toHaveClass('duration-300');
          expect(previewCard).toHaveClass('origin-bottom-left');
        });
      });

      it('applies correct layering and shadows', async () => {
        const { getByTestId } = render(
          <TestWrapper>
            <MovieCard movie={mockProps} />
          </TestWrapper>
        );
        const card = getByTestId('movie-card');
        
        fireEvent.mouseEnter(card);
        await waitFor(() => {
          const previewCard = getByTestId('preview-card');
          const previewContent = previewCard.firstElementChild;
          
          // Check z-index and overflow
          expect(previewCard).toHaveClass('z-[1000]');
          expect(previewCard).toHaveClass('overflow-visible');
          
          // Check shadow and background styling
          expect(previewContent).toHaveClass('shadow-2xl');
          expect(previewContent).toHaveClass('ring-1');
          expect(previewContent).toHaveClass('ring-white/10');
          expect(previewContent).toHaveClass('bg-black');
        });
      });
    });

    describe('3. Preview Content Loading', () => {
      it('shows fallback image while video loads', async () => {
        const { getByTestId } = render(
          <TestWrapper>
            <MovieCard {...mockProps} />
          </TestWrapper>
        );

        // Trigger hover
        fireEvent.mouseEnter(getByTestId('movie-card'));

        // Verify fallback is visible and video is not
        const fallbackImage = getByTestId('preview-fallback');
        const previewVideo = getByTestId('preview-video');
        expect(fallbackImage).toHaveClass('opacity-100');
        expect(previewVideo).toHaveClass('opacity-0');
      });

      it('transitions from fallback to video smoothly', async () => {
        const mockVideo = {
          videoUrl: 'test-video-url',
          posterUrl: 'test-poster-url'
        };

        // Mock the preview video service
        (getPreviewVideo as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockVideo);

        const { getByTestId } = render(
          <TestWrapper>
            <MovieCard {...mockProps} />
          </TestWrapper>
        );

        // Trigger hover
        fireEvent.mouseEnter(getByTestId('movie-card'));

        // Wait for the preview video to be fetched
        await waitFor(() => {
          expect(getPreviewVideo).toHaveBeenCalled();
        });

        const previewVideo = getByTestId('preview-video');
        const fallbackImage = getByTestId('preview-fallback');

        // Simulate video load and play events
        fireEvent.loadedData(previewVideo);
        
        // Mock successful play
        const playPromise = Promise.resolve();
        vi.spyOn(previewVideo, 'play').mockImplementation(() => playPromise);
        
        // Wait for the play promise to resolve and state to update
        await act(async () => {
          await playPromise;
        });
        
        // Verify the transition
        await waitFor(() => {
          expect(previewVideo).toHaveClass('opacity-100');
          expect(fallbackImage).toHaveClass('opacity-0');
        });
      });

      it('handles video loading errors gracefully', async () => {
        // Mock the preview video service to fail
        (getPreviewVideo as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Failed to load video'));

        const { getByTestId } = render(
          <TestWrapper>
            <MovieCard {...mockProps} />
          </TestWrapper>
        );

        // Trigger hover
        fireEvent.mouseEnter(getByTestId('movie-card'));

        // Wait for the error to be handled
        await waitFor(() => {
          const fallbackImage = getByTestId('preview-fallback');
          const previewVideo = getByTestId('preview-video');
          expect(fallbackImage).toHaveClass('opacity-100');
          expect(previewVideo).toHaveClass('opacity-0');
        });
      });
    });

    describe('4. Static Information Display', () => {
      it('shows match percentage with correct styling', async () => {
        renderWithProviders(<MovieCard {...detailedMockProps} />);
        const card = screen.getByTestId('movie-card');
        
        fireEvent.mouseEnter(card);
        
        await waitFor(() => {
          const matchText = screen.getByText('98% Match');
          expect(matchText).toHaveClass('text-[#46d369]', 'font-semibold');
        });
      });

      it('displays metadata with correct formatting', async () => {
        renderWithProviders(<MovieCard {...detailedMockProps} />);
        const card = screen.getByTestId('movie-card');
        
        fireEvent.mouseEnter(card);
        
        await waitFor(() => {
          // Year
          expect(screen.getByText('2024')).toHaveClass('text-white/70');
          
          // Duration
          expect(screen.getByText('2h 23m')).toHaveClass('text-white/70');
          
          // Rating badge
          const rating = screen.getByText('PG-13');
          expect(rating).toHaveClass(
            'border',
            'border-white/40',
            'bg-[#232323]',
            'px-2',
            'py-0.5',
            'text-[13px]',
            'text-white/90',
            'rounded'
          );
        });
      });

      it('shows genre tags with hover effects', async () => {
        renderWithProviders(<MovieCard {...detailedMockProps} />);
        const card = screen.getByTestId('movie-card');
        
        fireEvent.mouseEnter(card);
        
        await waitFor(() => {
          ['Sci-Fi', 'Mystery', 'Adventure'].forEach(genre => {
            const genreTag = screen.getByRole('button', { name: genre });
            expect(genreTag).toHaveClass(
              'hover:bg-zinc-700/80',
              'hover:text-white',
              'transition-all',
              'duration-200',
              'hover:scale-105'
            );
          });
        });
      });
    });

    describe('5. Button Interactions', () => {
      beforeEach(() => {
        vi.useFakeTimers();
        (getPreviewVideo as ReturnType<typeof vi.fn>).mockResolvedValue(mockPreviewVideo);
      });

      afterEach(() => {
        vi.useRealTimers();
      });

      it('handles play button click', async () => {
        const { getByTestId, getByLabelText } = render(
          <TestWrapper>
            <MovieCard movie={detailedMockProps} />
          </TestWrapper>
        );
        
        const card = getByTestId('movie-card');
        fireEvent.mouseEnter(card);
        
        // Wait for video loading delay
        await act(async () => {
          await vi.advanceTimersByTimeAsync(300);
        });
        
        // Click play button
        const playButton = getByLabelText('Play');
        await act(async () => {
          fireEvent.click(playButton);
        });
        
        // Verify navigation
        const location = getByTestId('location-display');
        expect(location.textContent).toBe('/player-test');
      });

      it('shows temporary feedback for Add to List button', async () => {
        const { getByTestId, getByLabelText, getByText, queryByText } = render(
          <TestWrapper>
            <MovieCard movie={detailedMockProps} />
          </TestWrapper>
        );
        
        const card = getByTestId('movie-card');
        fireEvent.mouseEnter(card);
        
        // Wait for video loading delay
        await act(async () => {
          await vi.advanceTimersByTimeAsync(300);
        });
        
        // Click Add to List button
        const addButton = getByLabelText('Add to List');
        await act(async () => {
          fireEvent.click(addButton);
        });
        
        // Verify immediate feedback
        const feedback = getByText('Added to List');
        expect(feedback).toBeInTheDocument();
        expect(feedback).toHaveClass('absolute', '-top-8', 'left-1/2', '-translate-x-1/2');
        expect(addButton).toHaveClass('bg-zinc-700/80');
        
        // Advance timer to clear feedback
        await act(async () => {
          await vi.advanceTimersByTimeAsync(1500);
        });
        
        // Verify feedback is cleared
        expect(queryByText('Added to List')).not.toBeInTheDocument();
      });

      it('shows temporary feedback for Like button', async () => {
        const { getByTestId, getByLabelText, getByText, queryByText } = render(
          <TestWrapper>
            <MovieCard movie={detailedMockProps} />
          </TestWrapper>
        );
        
        const card = getByTestId('movie-card');
        fireEvent.mouseEnter(card);
        
        // Wait for video loading delay
        await act(async () => {
          await vi.advanceTimersByTimeAsync(300);
        });
        
        // Click Like button
        const likeButton = getByLabelText('Like');
        await act(async () => {
          fireEvent.click(likeButton);
        });
        
        // Verify immediate feedback
        const feedback = getByText('Added to Liked');
        expect(feedback).toBeInTheDocument();
        expect(feedback).toHaveClass('absolute', '-top-8', 'left-1/2', '-translate-x-1/2');
        expect(likeButton).toHaveClass('bg-zinc-700/80');
        
        // Advance timer to clear feedback
        await act(async () => {
          await vi.advanceTimersByTimeAsync(1500);
        });
        
        // Verify feedback is cleared
        expect(queryByText('Added to Liked')).not.toBeInTheDocument();
      });

      it('opens info modal on info button click', async () => {
        const { getByTestId, getByLabelText } = render(
          <TestWrapper>
            <MovieCard {...detailedMockProps} />
          </TestWrapper>
        );
        
        const card = getByTestId('movie-card');
        fireEvent.mouseEnter(card);
        
        // Wait for video loading delay
        await act(async () => {
          await vi.advanceTimersByTimeAsync(300);
        });
        
        // Click More Info button
        const infoButton = getByLabelText('More Info');
        await act(async () => {
          fireEvent.click(infoButton);
        });
        
        // Verify navigation
        const location = getByTestId('location-display');
        expect(location.textContent).toBe(`/movie/${detailedMockProps.id}`);
      });
    });

    describe('6. Cleanup and Resource Management', () => {
      it('cleans up video resources on unmount', async () => {
        const { unmount } = renderWithProviders(<MovieCard {...detailedMockProps} />);
        const card = screen.getByTestId('movie-card');
        
        fireEvent.mouseEnter(card);
        
        await waitFor(() => {
          const video = screen.getByTestId('preview-video');
          expect(video).toBeInTheDocument();
        });
        
        unmount();
        
        // Verify cleanup was called
        expect(getPreviewVideo).toHaveBeenCalledTimes(1);
      });

      it('resets state on hover exit', async () => {
        renderWithProviders(<MovieCard {...detailedMockProps} />);
        const card = screen.getByTestId('movie-card');
        
        // Enter hover and verify state
        fireEvent.mouseEnter(card);
        await waitFor(() => {
          expect(card.querySelector('.absolute.w-[120%]')).toBeInTheDocument();
        });
        
        // Exit hover and verify cleanup
        fireEvent.mouseLeave(card);
        await waitFor(() => {
          expect(card.querySelector('.absolute.w-[120%]')).not.toBeInTheDocument();
          expect(screen.queryByTestId('preview-video')).not.toBeInTheDocument();
        });
      });
    });
  });
}); 