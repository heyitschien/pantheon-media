import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { VideoPlayer } from '../video-player';

// Mock the video element methods and properties
const mockPlay = vi.fn().mockImplementation(() => Promise.resolve());
const mockLoad = vi.fn().mockImplementation(() => {
  setTimeout(() => {
    const video = document.querySelector('[data-testid="video-element"]');
    if (video) {
      fireEvent.loadedData(video);
    }
  }, 0);
});
const mockPause = vi.fn().mockImplementation(() => Promise.resolve());

// Create a proper mock of HTMLVideoElement
class MockVideoElement extends HTMLVideoElement {
  private _muted = true;

  load = mockLoad;
  play = mockPlay;
  pause = mockPause;
  currentTime = 0;

  get muted() {
    return this._muted;
  }

  set muted(value) {
    this._muted = value;
    // Trigger a custom event to ensure state updates
    fireEvent(this, new Event('volumechange'));
  }
}

// Mock the Intersection Observer
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

describe('VideoPlayer', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Set up environment
    process.env.NODE_ENV = 'test';
    
    // Reset mock implementations
    mockPlay.mockImplementation(() => Promise.resolve());
    mockLoad.mockImplementation(() => {
      setTimeout(() => {
        const video = document.querySelector('[data-testid="video-element"]');
        if (video) {
          fireEvent.loadedData(video);
        }
      }, 0);
    });
    
    // Install mock video element
    window.HTMLVideoElement = MockVideoElement as any;
  });
  
  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should render with initial image state', () => {
    render(
      <VideoPlayer
        title="Test Video"
        description="Test Description"
        image="test-image.jpg"
        video="test-video.mp4"
      />
    );

    // Initial state should show the image
    const image = screen.getByAltText('Test Video backdrop');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-image.jpg');

    // Video should be hidden initially
    const videoContainer = screen.getByTestId('video-container');
    expect(videoContainer).toHaveStyle({ opacity: '0' });
  });

  it('should handle video loading states', async () => {
    render(
      <VideoPlayer
        title="Test Video"
        description="Test Description"
        image="test-image.jpg"
        video="test-video.mp4"
      />
    );

    // Should show loading state initially
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();

    // Simulate video loaded
    const video = screen.getByTestId('video-element');
    await act(async () => {
      fireEvent.loadedData(video);
      // Wait for state updates
      await Promise.resolve();
      // Wait an extra tick for good measure
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Loading indicator should be removed
    expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    
    // Play button should be enabled
    const playButton = screen.getByLabelText(/play/i);
    expect(playButton).not.toBeDisabled();
  });

  it('should handle play/pause toggle', async () => {
    const mockPlay = vi.fn().mockResolvedValue(undefined);
    
    render(
      <VideoPlayer
        title="Test Video"
        description="Test Description"
        image="test-image.jpg"
        video="test-video.mp4"
      />
    );

    const video = screen.getByTestId('video-element') as HTMLVideoElement;
    Object.defineProperty(video, 'play', {
      value: mockPlay,
      writable: true
    });

    // Simulate video loaded
    fireEvent.loadedData(video);
    await Promise.resolve(); // Wait for state updates

    const playButton = screen.getByRole('button', { name: /play/i });
    expect(playButton).not.toBeDisabled();

    // Click play button
    fireEvent.click(playButton);
    await Promise.resolve(); // Wait for state updates

    expect(mockPlay).toHaveBeenCalled();

    // Wait for transition to complete (1000ms)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Video should transition to visible
    const videoContainer = screen.getByTestId('video-container');
    expect(videoContainer).toHaveStyle({ opacity: '1' });
  });

  it('should handle play errors', async () => {
    const mockPlay = vi.fn().mockRejectedValue(new Error('Failed to play'));
    
    render(
      <VideoPlayer
        title="Test Video"
        description="Test Description"
        image="test-image.jpg"
        video="test-video.mp4"
      />
    );

    const video = screen.getByTestId('video-element') as HTMLVideoElement;
    Object.defineProperty(video, 'play', {
      value: mockPlay,
      writable: true
    });

    // Simulate video loaded
    fireEvent.loadedData(video);
    await Promise.resolve(); // Wait for state updates

    const playButton = screen.getByRole('button', { name: /play/i });
    expect(playButton).not.toBeDisabled();

    // Click play button
    fireEvent.click(playButton);
    
    // Wait for error state to be rendered
    const errorState = await screen.findByTestId('error-state');
    expect(errorState).toBeInTheDocument();
    expect(errorState).toHaveTextContent('Failed to play video');
  });

  it('should handle mute/unmute toggle', async () => {
    render(
      <VideoPlayer
        title="Test Video"
        description="Test Description"
        image="test-image.jpg"
        video="test-video.mp4"
      />
    );

    const video = screen.getByTestId('video-element');
    
    // Ensure video is loaded
    await act(async () => {
      fireEvent.loadedData(video);
      await Promise.resolve();
    });

    const muteButton = screen.getByLabelText(/unmute/i);
    
    // Initial state should be muted
    expect(video).toHaveProperty('muted', true);

    // Toggle mute
    await act(async () => {
      fireEvent.click(muteButton);
      await Promise.resolve();
    });
    expect(video).toHaveProperty('muted', false);

    // Toggle back to muted
    await act(async () => {
      fireEvent.click(screen.getByLabelText(/mute/i));
      await Promise.resolve();
    });
    expect(video).toHaveProperty('muted', true);
  });

  it('should handle errors gracefully', () => {
    render(
      <VideoPlayer
        title="Test Video"
        description="Test Description"
        image="test-image.jpg"
        video="invalid-video.mp4"
      />
    );

    const video = screen.getByTestId('video-element');
    
    // Simulate error
    fireEvent.error(video);

    // Should show error state and fallback to image
    expect(screen.getByTestId('error-state')).toBeInTheDocument();
    expect(screen.getByAltText('Test Video backdrop')).toBeVisible();
  });

  it('should show video info overlay', () => {
    render(
      <VideoPlayer
        title="Test Video"
        description="Test Description"
        image="test-image.jpg"
        video="test-video.mp4"
        rating="TV-MA"
      />
    );

    // Title and description should be visible
    expect(screen.getByText('Test Video')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    
    // Rating should be visible
    expect(screen.getByText('TV-MA')).toBeInTheDocument();
  });

  it('should handle video load errors', async () => {
    render(
      <VideoPlayer
        title="Test Video"
        description="Test Description"
        image="test-image.jpg"
        video="test-video.mp4"
      />
    );

    const video = screen.getByTestId('video-element');
    
    // Simulate load error
    await act(async () => {
      fireEvent.error(video);
      // Wait for state updates
      await Promise.resolve();
    });

    // Should show error state
    const errorState = screen.getByTestId('error-state');
    expect(errorState).toBeInTheDocument();
    expect(errorState).toHaveTextContent('Failed to load video');

    // Loading indicator should be removed
    expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();

    // Play button should be disabled
    const playButton = screen.getByLabelText(/play/i);
    expect(playButton).toBeDisabled();
  });
}); 