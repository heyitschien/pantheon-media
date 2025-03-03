import { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ToastProvider } from '@/components/ui/toast';

interface TestWrapperProps {
  children: ReactNode;
}

export function TestWrapper({ children }: TestWrapperProps) {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <ToastProvider>
          <div data-testid="test-wrapper">
            {children}
          </div>
        </ToastProvider>
      </TooltipProvider>
    </BrowserRouter>
  );
}

export const renderWithWrapper = (ui: React.ReactElement) => {
  return render(ui, {
    wrapper: TestWrapper,
  });
};

export const simulateHover = async (element: HTMLElement) => {
  await act(async () => {
    await userEvent.hover(element);
  });
};

export const simulateUnhover = async (element: HTMLElement) => {
  await act(async () => {
    await userEvent.unhover(element);
  });
};

export const waitForStateUpdate = async (callback: () => void | Promise<void>) => {
  await act(async () => {
    await callback();
  });
};

// Helper for video-related tests
export const createMockVideo = () => {
  const mockVideo = document.createElement('video');
  Object.defineProperty(mockVideo, 'load', {
    value: vi.fn(),
  });
  Object.defineProperty(mockVideo, 'play', {
    value: vi.fn().mockResolvedValue(undefined),
  });
  Object.defineProperty(mockVideo, 'pause', {
    value: vi.fn(),
  });
  return mockVideo;
};

// Helper for Bunny.net HLS-related tests
export const createMockHLS = () => {
  return {
    loadSource: vi.fn(),
    attachMedia: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    destroy: vi.fn(),
  };
};

// Bunny.net API mock responses
export const mockBunnyResponse = {
  success: true,
  statusCode: 200,
  result: {
    videoLibraryId: "123456",
    guid: "13904fa8-dda5-4e9e-88c4-0d57fa9af6c4",
    title: "Test Media",
    dateUploaded: "2024-03-21T12:00:00.000Z",
    views: 0,
    isPublic: true,
    length: 1380,
    status: 4,
    thumbnailUrl: "https://vz-123456.b-cdn.net/13904fa8-dda5-4e9e-88c4-0d57fa9af6c4/thumbnail.jpg",
    thumbnailCount: 50,
    previewUrl: "https://vz-123456.b-cdn.net/13904fa8-dda5-4e9e-88c4-0d57fa9af6c4/preview.mp4",
    hlsUrl: "https://vz-123456.b-cdn.net/13904fa8-dda5-4e9e-88c4-0d57fa9af6c4/playlist.m3u8",
  }
};

// Common test data
export const mockMediaData = {
  id: '13904fa8-dda5-4e9e-88c4-0d57fa9af6c4',
  title: 'Test Media',
  description: 'Test Description',
  duration: '23m',
  year: '2024',
  rating: 'PG-13',
  genres: ['Documentary', 'Nature'],
  isPantheonOriginal: true,
}; 