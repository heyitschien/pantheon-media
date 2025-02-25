import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings,
  PictureInPicture2, ChevronRight, FastForward, Rewind
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MoviePlayerProps {
  src: string;
  poster?: string;
  title?: string;
  onClose?: () => void;
  className?: string;
}

export function MoviePlayer({
  src,
  poster,
  title,
  onClose,
  className
}: MoviePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState<'auto' | '1080p' | '720p' | '480p'>('auto');

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Playback speed options
  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!videoRef.current) return;

      switch(e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'm':
          toggleMute();
          break;
        case 'p':
          togglePiP();
          break;
        case 'arrowright':
          videoRef.current.currentTime += 10;
          break;
        case 'arrowleft':
          videoRef.current.currentTime -= 10;
          break;
        case '>':
          const nextSpeed = speedOptions[speedOptions.indexOf(playbackSpeed) + 1];
          if (nextSpeed) setPlaybackSpeed(nextSpeed);
          break;
        case '<':
          const prevSpeed = speedOptions[speedOptions.indexOf(playbackSpeed) - 1];
          if (prevSpeed) setPlaybackSpeed(prevSpeed);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playbackSpeed]);

  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  // Handle mute toggle
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle Picture-in-Picture
  const togglePiP = async () => {
    if (!videoRef.current) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiP(false);
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
        setIsPiP(true);
      }
    } catch (err) {
      console.error('PiP failed:', err);
    }
  };

  // Handle fullscreen
  const toggleFullscreen = async () => {
    if (!playerRef.current) return;

    if (!isFullscreen) {
      try {
        if (playerRef.current.requestFullscreen) {
          await playerRef.current.requestFullscreen();
        }
        setIsFullscreen(true);
      } catch (err) {
        console.error('Failed to enter fullscreen:', err);
      }
    } else {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
      } catch (err) {
        console.error('Failed to exit fullscreen:', err);
      }
    }
  };

  // Update playback speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Update progress bar
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  // Handle seeking
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;

    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const width = bounds.width;
    const percentage = x / width;
    const newTime = percentage * videoRef.current.duration;
    
    videoRef.current.currentTime = newTime;
    setProgress(percentage * 100);
  };

  // Auto-hide controls
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }

      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };

    const player = playerRef.current;
    if (player) {
      player.addEventListener('mousemove', handleMouseMove);
      player.addEventListener('mouseleave', () => setShowControls(false));
    }

    return () => {
      if (player) {
        player.removeEventListener('mousemove', handleMouseMove);
        player.removeEventListener('mouseleave', () => setShowControls(false));
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => {
      setIsLoading(false);
      setDuration(video.duration);
    };
    const handleError = () => {
      setError('Failed to load video');
      setIsLoading(false);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, []);

  // Format time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={playerRef}
      className={cn(
        "relative bg-black",
        "w-full h-full",
        className
      )}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
          <p className="text-white mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              if (videoRef.current) {
                videoRef.current.load();
              }
            }}
            className="px-4 py-2 bg-white text-black rounded-md"
          >
            Retry
          </button>
        </div>
      )}

      {/* Enhanced Controls Overlay */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent",
          "transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Title Bar */}
        {title && (
          <div className="absolute top-0 left-0 right-0 p-4">
            <h2 className="text-white text-lg font-medium">{title}</h2>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress Bar */}
          <div 
            className="w-full h-1 bg-white/20 rounded-full mb-4 cursor-pointer"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-white rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="text-white hover:text-white/80 transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>

            {/* Rewind 10s */}
            <button
              onClick={() => videoRef.current && (videoRef.current.currentTime -= 10)}
              className="text-white hover:text-white/80 transition-colors"
              aria-label="Rewind 10 seconds"
            >
              <Rewind className="w-5 h-5" />
            </button>

            {/* Forward 10s */}
            <button
              onClick={() => videoRef.current && (videoRef.current.currentTime += 10)}
              className="text-white hover:text-white/80 transition-colors"
              aria-label="Forward 10 seconds"
            >
              <FastForward className="w-5 h-5" />
            </button>

            {/* Volume */}
            <button
              onClick={toggleMute}
              className="text-white hover:text-white/80 transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6" />
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
            </button>

            {/* Time Display */}
            <div className="text-white text-sm">
              {videoRef.current && (
                <>
                  {formatTime(videoRef.current.currentTime)} / {formatTime(duration)}
                </>
              )}
            </div>

            <div className="flex-1" />

            {/* Picture in Picture */}
            <button
              onClick={togglePiP}
              className="text-white hover:text-white/80 transition-colors"
              aria-label={isPiP ? "Exit Picture in Picture" : "Enter Picture in Picture"}
            >
              <PictureInPicture2 className="w-5 h-5" />
            </button>

            {/* Settings */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-white hover:text-white/80 transition-colors"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Settings Menu */}
              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 w-48 bg-black/90 rounded-md shadow-lg">
                  {/* Playback Speed */}
                  <div className="p-2">
                    <div className="text-white/60 text-xs mb-1">Playback Speed</div>
                    <div className="grid grid-cols-3 gap-1">
                      {speedOptions.map(speed => (
                        <button
                          key={speed}
                          onClick={() => setPlaybackSpeed(speed)}
                          className={cn(
                            "px-2 py-1 text-sm rounded",
                            playbackSpeed === speed
                              ? "bg-white text-black"
                              : "text-white hover:bg-white/10"
                          )}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quality Selection */}
                  <div className="p-2 border-t border-white/10">
                    <div className="text-white/60 text-xs mb-1">Quality</div>
                    {['auto', '1080p', '720p', '480p'].map(q => (
                      <button
                        key={q}
                        onClick={() => setQuality(q as any)}
                        className={cn(
                          "block w-full text-left px-2 py-1 text-sm rounded",
                          quality === q
                            ? "bg-white text-black"
                            : "text-white hover:bg-white/10"
                        )}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-white/80 transition-colors"
              aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize className="w-6 h-6" />
              ) : (
                <Maximize className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="absolute top-4 right-4 text-xs text-white/60">
        <div>Space: Play/Pause</div>
        <div>F: Fullscreen</div>
        <div>M: Mute</div>
        <div>P: Picture in Picture</div>
        <div>←/→: Seek 10s</div>
        <div>&lt;/&gt;: Change Speed</div>
      </div>
    </div>
  );
} 