import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VideoControls } from '../video-controls';

describe('VideoControls', () => {
  const mockOnPlay = vi.fn();
  const mockOnPause = vi.fn();
  const mockOnMute = vi.fn();
  const mockOnUnmute = vi.fn();
  const mockOnFullscreen = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render basic controls', () => {
    render(
      <VideoControls
        isPlaying={false}
        isMuted={false}
        isFullscreen={false}
        onPlay={mockOnPlay}
        onPause={mockOnPause}
        onMute={mockOnMute}
        onUnmute={mockOnUnmute}
        onFullscreen={mockOnFullscreen}
      />
    );

    expect(screen.getByLabelText(/play/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mute/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fullscreen/i)).toBeInTheDocument();
  });

  it('should toggle play/pause button state and trigger callbacks', () => {
    const { rerender } = render(
      <VideoControls
        isPlaying={false}
        isMuted={false}
        isFullscreen={false}
        onPlay={mockOnPlay}
        onPause={mockOnPause}
        onMute={mockOnMute}
        onUnmute={mockOnUnmute}
        onFullscreen={mockOnFullscreen}
      />
    );

    // Initial state - Play button
    const playButton = screen.getByLabelText(/play/i);
    expect(playButton).toBeInTheDocument();
    
    // Click play
    fireEvent.click(playButton);
    expect(mockOnPlay).toHaveBeenCalledTimes(1);

    // Rerender with isPlaying=true
    rerender(
      <VideoControls
        isPlaying={true}
        isMuted={false}
        isFullscreen={false}
        onPlay={mockOnPlay}
        onPause={mockOnPause}
        onMute={mockOnMute}
        onUnmute={mockOnUnmute}
        onFullscreen={mockOnFullscreen}
      />
    );

    // Should now show pause button
    const pauseButton = screen.getByLabelText(/pause/i);
    expect(pauseButton).toBeInTheDocument();
    
    // Click pause
    fireEvent.click(pauseButton);
    expect(mockOnPause).toHaveBeenCalledTimes(1);
  });

  it('should toggle mute button state and trigger callbacks', () => {
    const { rerender } = render(
      <VideoControls
        isPlaying={false}
        isMuted={false}
        isFullscreen={false}
        onPlay={mockOnPlay}
        onPause={mockOnPause}
        onMute={mockOnMute}
        onUnmute={mockOnUnmute}
        onFullscreen={mockOnFullscreen}
      />
    );

    // Initial state - Volume button
    const volumeButton = screen.getByLabelText(/mute/i);
    expect(volumeButton).toBeInTheDocument();
    
    // Click mute
    fireEvent.click(volumeButton);
    expect(mockOnMute).toHaveBeenCalledTimes(1);

    // Rerender with isMuted=true
    rerender(
      <VideoControls
        isPlaying={false}
        isMuted={true}
        isFullscreen={false}
        onPlay={mockOnPlay}
        onPause={mockOnPause}
        onMute={mockOnMute}
        onUnmute={mockOnUnmute}
        onFullscreen={mockOnFullscreen}
      />
    );

    // Should now show unmute button
    const unmuteButton = screen.getByLabelText(/unmute/i);
    expect(unmuteButton).toBeInTheDocument();
    
    // Click unmute
    fireEvent.click(unmuteButton);
    expect(mockOnUnmute).toHaveBeenCalledTimes(1);
  });

  it('should handle fullscreen toggle', () => {
    const { rerender } = render(
      <VideoControls
        isPlaying={false}
        isMuted={false}
        isFullscreen={false}
        onPlay={mockOnPlay}
        onPause={mockOnPause}
        onMute={mockOnMute}
        onUnmute={mockOnUnmute}
        onFullscreen={mockOnFullscreen}
      />
    );

    // Click fullscreen button
    const fullscreenButton = screen.getByLabelText(/fullscreen/i);
    fireEvent.click(fullscreenButton);
    expect(mockOnFullscreen).toHaveBeenCalledTimes(1);

    // Rerender with isFullscreen=true
    rerender(
      <VideoControls
        isPlaying={false}
        isMuted={false}
        isFullscreen={true}
        onPlay={mockOnPlay}
        onPause={mockOnPause}
        onMute={mockOnMute}
        onUnmute={mockOnUnmute}
        onFullscreen={mockOnFullscreen}
      />
    );

    // Should now show exit fullscreen button
    expect(screen.getByLabelText(/exit fullscreen/i)).toBeInTheDocument();
  });

  it('should show controls on hover', () => {
    render(
      <VideoControls
        isPlaying={false}
        isMuted={false}
        isFullscreen={false}
        onPlay={mockOnPlay}
        onPause={mockOnPause}
        onMute={mockOnMute}
        onUnmute={mockOnUnmute}
        onFullscreen={mockOnFullscreen}
      />
    );

    const controlsContainer = screen.getByTestId('video-controls');
    
    // Initially controls should be hidden
    expect(controlsContainer).toHaveClass('opacity-0');
    
    // Show on hover
    fireEvent.mouseEnter(controlsContainer);
    expect(controlsContainer).toHaveClass('opacity-100');
    
    // Hide when mouse leaves
    fireEvent.mouseLeave(controlsContainer);
    expect(controlsContainer).toHaveClass('opacity-0');
  });

  it('should handle keyboard controls', () => {
    render(
      <VideoControls
        isPlaying={false}
        isMuted={false}
        isFullscreen={false}
        onPlay={mockOnPlay}
        onPause={mockOnPause}
        onMute={mockOnMute}
        onUnmute={mockOnUnmute}
        onFullscreen={mockOnFullscreen}
      />
    );

    // Space should toggle play/pause
    fireEvent.keyDown(document, { key: ' ' });
    expect(mockOnPlay).toHaveBeenCalledTimes(1);

    // M should toggle mute
    fireEvent.keyDown(document, { key: 'm' });
    expect(mockOnMute).toHaveBeenCalledTimes(1);

    // F should toggle fullscreen
    fireEvent.keyDown(document, { key: 'f' });
    expect(mockOnFullscreen).toHaveBeenCalledTimes(1);
  });
}); 