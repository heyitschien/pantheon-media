import { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  onPlay: () => void;
  onPause: () => void;
  onMute: () => void;
  onUnmute: () => void;
  onFullscreen: () => void;
}

export function VideoControls({
  isPlaying,
  isMuted,
  isFullscreen,
  onPlay,
  onPause,
  onMute,
  onUnmute,
  onFullscreen,
}: VideoControlsProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case ' ':
          event.preventDefault();
          isPlaying ? onPause() : onPlay();
          break;
        case 'm':
          event.preventDefault();
          isMuted ? onUnmute() : onMute();
          break;
        case 'f':
          event.preventDefault();
          onFullscreen();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted, onPlay, onPause, onMute, onUnmute, onFullscreen]);

  return (
    <div
      data-testid="video-controls"
      className={cn(
        'absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <div className="flex items-center gap-4">
        <button
          aria-label={isPlaying ? 'Pause' : 'Play'}
          onClick={isPlaying ? onPause : onPlay}
          className="p-2 rounded-full hover:bg-white/20 transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white" />
          )}
        </button>

        <button
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          onClick={isMuted ? onUnmute : onMute}
          className="p-2 rounded-full hover:bg-white/20 transition-colors"
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6 text-white" />
          ) : (
            <Volume2 className="w-6 h-6 text-white" />
          )}
        </button>

        <button
          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          onClick={onFullscreen}
          className="p-2 rounded-full hover:bg-white/20 transition-colors"
        >
          {isFullscreen ? (
            <Minimize className="w-6 h-6 text-white" />
          ) : (
            <Maximize className="w-6 h-6 text-white" />
          )}
        </button>
      </div>
    </div>
  );
} 