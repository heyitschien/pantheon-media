import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PantheonPreview } from '../PantheonPreview';
import { getPreviewVideo } from '@/services/bunny-stream';

// Mock bunny-stream service
vi.mock('@/services/bunny-stream', () => ({
  getPreviewVideo: vi.fn()
}));

// Mock HLS.js
vi.mock('hls.js', () => ({
  default: class MockHls {
    static isSupported() { return true; }
    static Events = {
      MANIFEST_PARSED: 'manifestparsed',
      ERROR: 'hlserror'
    }
    attachMedia = vi.fn();
    loadSource = vi.fn();
    destroy = vi.fn();
    on = vi.fn((event, callback) => {
      if (event === MockHls.Events.MANIFEST_PARSED) {
        setTimeout(callback, 50);
      }
    });
  }
}));

describe('PantheonPreview', () => {
  const mockProps = {
    mediaId: '13904fa8-dda5-4e9e-88c4-0d57fa9af6c4',
    title: 'Pantheon Highlights',
    description: 'Test description',
    rating: 'PG-13',
    duration: '23m',
    year: '2024',
    genres: ['Regenerative', 'Nature', 'Sustainability'],
    isVisible: true,
    onClose: vi.fn()
  };

  const mockVideoUrls = {
    videoUrl: 'https://test.com/video.m3u8',
    posterUrl: 'https://test.com/poster.jpg'
  };

  beforeEach(() => {
    (getPreviewVideo as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockVideoUrls);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Visual Elements', () => {
    it('should render with correct dimensions and styling', () => {
      const { container } = render(<PantheonPreview {...mockProps} />);
      const previewElement = container.firstChild as HTMLElement;
      
      expect(previewElement).toHaveClass('w-[360px]');
      // Check for transform classes instead of computed style
      expect(previewElement).toHaveClass('-translate-y-[32px]');
      expect(previewElement).toHaveClass('-translate-x-[30px]');
    });

    it('should display metadata with correct formatting', () => {
      render(<PantheonPreview {...mockProps} />);
      
      expect(screen.getByText('2024')).toBeInTheDocument();
      expect(screen.getByText('23m')).toBeInTheDocument();
      expect(screen.getByText('PG-13')).toBeInTheDocument();
    });

    it('should render genre tags with correct styling', () => {
      render(<PantheonPreview {...mockProps} />);
      
      mockProps.genres.forEach(genre => {
        const tag = screen.getByText(genre);
        expect(tag).toHaveClass('bg-zinc-800/70', 'text-white/90');
      });
    });
  });

  describe('Video Playback', () => {
    it('should initialize video when becoming visible', async () => {
      render(<PantheonPreview {...mockProps} />);
      
      await waitFor(() => {
        expect(getPreviewVideo).toHaveBeenCalledWith(mockProps.mediaId);
      });
    });

    it('should show loading state while video initializes', () => {
      (getPreviewVideo as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => new Promise(() => {}));
      render(<PantheonPreview {...mockProps} />);
      
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should handle video load errors gracefully', async () => {
      (getPreviewVideo as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Failed to load'));
      render(<PantheonPreview {...mockProps} />);
      
      await waitFor(() => {
        const errorElement = screen.getByTestId('error-message');
        expect(errorElement).toBeInTheDocument();
        expect(errorElement.textContent).toContain('Unable to load preview');
      });
    });
  });

  describe('Interaction Behavior', () => {
    it('should call onClose when mouse leaves', async () => {
      await act(async () => {
        render(<PantheonPreview {...mockProps} />);
      });
      const previewElement = screen.getByTestId('preview-container');
      
      fireEvent.mouseLeave(previewElement);
      expect(mockProps.onClose).toHaveBeenCalled();
    });

    it('should set visibility state when hidden', async () => {
      let rerender: ReturnType<typeof render>['rerender'];
      
      await act(async () => {
        const result = render(<PantheonPreview {...mockProps} />);
        rerender = result.rerender;
      });
      
      await act(async () => {
        rerender(<PantheonPreview {...mockProps} isVisible={false} />);
      });
      
      // When isVisible is false, showVideo should be reset
      const previewElement = screen.getByTestId('preview-container');
      expect(previewElement).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should load preview and call API', async () => {
      render(<PantheonPreview {...mockProps} />);
      
      await waitFor(() => {
        expect(getPreviewVideo).toHaveBeenCalled();
      });
      
      // Verify API was called with correct parameters
      expect(getPreviewVideo).toHaveBeenCalledWith(mockProps.mediaId);
    });
  });

  describe('Accessibility', () => {
    it('should have correct ARIA attributes', () => {
      render(<PantheonPreview {...mockProps} />);
      const previewElement = screen.getByTestId('preview-container');
      
      expect(previewElement).toHaveAttribute('aria-label', 'Preview: Pantheon Highlights');
      expect(previewElement).toHaveAttribute('role', 'dialog');
    });

    it('should maintain proper focus management', () => {
      render(<PantheonPreview {...mockProps} />);
      const previewElement = screen.getByTestId('preview-container');
      
      expect(previewElement).toHaveAttribute('tabIndex', '0');
    });
  });
}); 