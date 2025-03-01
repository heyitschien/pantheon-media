import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
    attachMedia = vi.fn();
    loadSource = vi.fn();
    destroy = vi.fn();
    on = vi.fn();
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
    (getPreviewVideo as jest.Mock).mockResolvedValue(mockVideoUrls);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Visual Elements', () => {
    it('should render with correct dimensions and styling', () => {
      const { container } = render(<PantheonPreview {...mockProps} />);
      const previewElement = container.firstChild as HTMLElement;
      
      expect(previewElement).toHaveClass('w-[360px]');
      expect(previewElement).toHaveStyle({
        transform: 'translateY(-32px) translateX(-30px)'
      });
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
      (getPreviewVideo as jest.Mock).mockImplementation(() => new Promise(() => {}));
      render(<PantheonPreview {...mockProps} />);
      
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should handle video load errors gracefully', async () => {
      (getPreviewVideo as jest.Mock).mockRejectedValue(new Error('Failed to load'));
      render(<PantheonPreview {...mockProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Failed to load preview')).toBeInTheDocument();
      });
    });
  });

  describe('Interaction Behavior', () => {
    it('should call onClose when mouse leaves', () => {
      render(<PantheonPreview {...mockProps} />);
      const previewElement = screen.getByTestId('preview-container');
      
      fireEvent.mouseLeave(previewElement);
      expect(mockProps.onClose).toHaveBeenCalled();
    });

    it('should cleanup resources when hidden', () => {
      const { rerender } = render(<PantheonPreview {...mockProps} />);
      rerender(<PantheonPreview {...mockProps} isVisible={false} />);
      
      // Verify HLS cleanup
      const mockHls = require('hls.js').default;
      expect(mockHls.prototype.destroy).toHaveBeenCalled();
    });
  });

  describe('Performance', () => {
    it('should load preview within time limit', async () => {
      const startTime = performance.now();
      render(<PantheonPreview {...mockProps} />);
      
      await waitFor(() => {
        expect(getPreviewVideo).toHaveBeenCalled();
      });
      
      const loadTime = performance.now() - startTime;
      expect(loadTime).toBeLessThan(300);
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