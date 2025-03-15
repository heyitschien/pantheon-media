import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings,
  PictureInPicture2, ChevronRight, FastForward, Rewind, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import Hls from 'hls.js';

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
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
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
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const hlsRef = useRef<Hls | null>(null);

  // Playback speed options
  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  // Initialize HLS
  const initHls = useCallback((videoElement: HTMLVideoElement, src: string) => {
    if (!videoElement || !src) return;
    
    try {
      console.log('Initializing HLS with source:', src);
      
      // Clean up existing HLS instance if any
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          debug: false,
          fragLoadingMaxRetry: 5,
          manifestLoadingMaxRetry: 5,
          levelLoadingMaxRetry: 5,
          xhrSetup: (xhr) => {
            xhr.withCredentials = false;
          }
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS error event:', event);
          console.error('HLS error data:', data);
          
          if (data.fatal) {
            console.error('Fatal HLS error:', data.type, data.details);
            setError(`Video playback error: ${data.details}`);
            setIsLoading(false);
            
            // Try to recover on media and network errors
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR || 
                data.type === Hls.ErrorTypes.MEDIA_ERROR) {
              hls.recoverMediaError();
            }
          }
        });
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('HLS manifest parsed successfully');
          setIsLoading(false);
          
          // Set initial mute state based on user preference
          videoElement.muted = isMuted;
          
          if (videoElement.paused && isPlaying) {
            videoElement.play()
              .then(() => {
                console.log('Video playback started');
              })
              .catch(err => {
                console.error('Error starting playback:', err);
                // Try muted playback as fallback
                videoElement.muted = true;
                setIsMuted(true);
                videoElement.play()
                  .catch(innerErr => {
                    console.error('Even muted playback failed:', innerErr);
                  });
              });
          }
        });
        
        hls.attachMedia(videoElement);
        hls.loadSource(src);
        hlsRef.current = hls;
        
        console.log('HLS instance created and attached to video element');
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        // For Safari which has native HLS support
        console.log('Using native HLS support');
        videoElement.src = src;
        videoElement.addEventListener('loadedmetadata', () => {
          setIsLoading(false);
          // Set initial mute state based on user preference
          videoElement.muted = isMuted;
          
          if (isPlaying) {
            videoElement.play()
              .catch(err => {
                console.error('Error playing video:', err);
                // Try muted playback as fallback
                videoElement.muted = true;
                setIsMuted(true);
                videoElement.play()
                  .catch(innerErr => {
                    console.error('Even muted playback failed:', innerErr);
                  });
              });
          }
        });
      } else {
        console.error('HLS is not supported in this browser and no native support');
        setError('Your browser does not support HLS video playback');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error initializing HLS:', error);
      setError('Failed to initialize video player');
      setIsLoading(false);
    }
  }, [isPlaying, isMuted]);

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
        case 'escape':
          if (onClose) onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playbackSpeed, onClose]);

  // Initialize video player with HLS
  useEffect(() => {
    if (!videoRef.current || !src) return;
    
    console.log('Setting up video with source:', src);
    setIsLoading(true);
    setError(null);
    
    // Check if the source is an HLS stream (m3u8)
    if (src.includes('.m3u8')) {
      console.log('Detected HLS stream, initializing HLS.js');
      initHls(videoRef.current, src);
    } else {
      console.log('Not an HLS stream, using standard video element');
      videoRef.current.src = src;
    }
    
    return () => {
      if (hlsRef.current) {
        console.log('Destroying HLS instance on cleanup');
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, initHls]);

  // Handle play/pause
  const togglePlay = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      if (isPlaying) {
        await videoRef.current.pause();
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise) {
          await playPromise;
        }
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error toggling play state:', error);
    }
  }, [isPlaying]);

  // Handle mute toggle
  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      
      // If unmuting, restore previous volume or set to 1
      if (!newMutedState && videoRef.current.volume === 0) {
        videoRef.current.volume = volume > 0 ? volume : 1;
      }
      
      setIsMuted(newMutedState);
    }
  }, [isMuted, volume]);

  // Add volume change handler
  const handleVolumeChange = useCallback((newVolume: number) => {
    if (videoRef.current) {
      // Clamp volume between 0 and 1
      const clampedVolume = Math.max(0, Math.min(1, newVolume));
      videoRef.current.volume = clampedVolume;
      setVolume(clampedVolume);
      
      // Update muted state based on volume
      if (clampedVolume === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else if (isMuted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  }, [isMuted]);

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
      setError('Picture-in-Picture mode is not available');
    }
  };

  // Handle fullscreen
  const toggleFullscreen = async () => {
    if (!playerRef.current) return;

    try {
      if (!isFullscreen) {
        if (playerRef.current.requestFullscreen) {
          await playerRef.current.requestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Fullscreen failed:', err);
      setError('Fullscreen mode is not available');
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

      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
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
      setError(null);
      setRetryCount(0);
      
      // Try to auto-play but don't force mute
      video.play().then(() => {
        // Successfully started playing
        setIsPlaying(true);
        // Restore user's mute preference
        video.muted = isMuted;
      }).catch(error => {
        console.warn('Auto-play failed:', error);
        // Try muted playback as fallback (for autoplay policies)
        video.muted = true;
        video.play().then(() => {
          setIsPlaying(true);
          // Keep track that we had to mute
          setIsMuted(true);
        }).catch(innerError => {
          console.error('Even muted playback failed:', innerError);
          setError('Click play to start video');
          setIsPlaying(false);
        });
      });
    };
    const handleError = () => {
      console.error('Video error:', video.error);
      setError('Failed to load video. Please try again.');
      setIsLoading(false);
      
      // Retry logic
      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        retryTimeoutRef.current = setTimeout(() => {
          setError(null);
          video.load();
        }, 1000);
      }
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    // Initial load
    video.load();

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [retryCount, maxRetries, isMuted]);

  // Format time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Update volume when component mounts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  return (
    <div 
      ref={playerRef}
      className={cn(
        "relative bg-black",
        "w-full h-full",
        className
      )}
      onClick={togglePlay}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        poster={poster}
        className="w-full h-full object-cover"
        onTimeUpdate={handleTimeUpdate}
        crossOrigin="anonymous"
        playsInline
        preload="auto"
        onError={(e) => {
          const video = e.currentTarget;
          console.error('Video error details:', {
            error: video.error,
            networkState: video.networkState,
            readyState: video.readyState,
            src: video.src,
            currentTime: video.currentTime,
          });
          setError(`Failed to load video: ${video.error?.message || 'Unknown error'}`);
          setIsLoading(false);
        }}
        onLoadStart={() => {
          console.log('Video load started:', {
            src,
            poster,
            crossOrigin: 'anonymous'
          });
          setIsLoading(true);
        }}
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
            onClick={(e) => {
              e.stopPropagation();
              setError(null);
              setRetryCount(0);
              if (videoRef.current) {
                videoRef.current.load();
              }
            }}
            className="px-4 py-2 bg-white text-black rounded-md hover:bg-white/90 transition-colors"
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
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <h2 className="text-white text-lg font-medium">{title}</h2>
          {onClose && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onClose) onClose();
              }}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close player"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress Bar */}
          <div 
            className="w-full h-1 bg-white/20 rounded-full mb-4 cursor-pointer group"
            onClick={(e) => {
              e.stopPropagation();
              handleSeek(e);
            }}
          >
            <div 
              className="h-full bg-white rounded-full group-hover:bg-pantheon-pink transition-colors"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
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
              onClick={(e) => {
                e.stopPropagation();
                if (videoRef.current) videoRef.current.currentTime -= 10;
              }}
              className="text-white hover:text-white/80 transition-colors"
              aria-label="Rewind 10 seconds"
            >
              <Rewind className="w-5 h-5" />
            </button>

            {/* Forward 10s */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (videoRef.current) videoRef.current.currentTime += 10;
              }}
              className="text-white hover:text-white/80 transition-colors"
              aria-label="Forward 10 seconds"
            >
              <FastForward className="w-5 h-5" />
            </button>

            {/* Volume */}
            <div className="relative flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className="text-white hover:text-white/80 transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="w-6 h-6" />
                ) : (
                  <Volume2 className="w-6 h-6" />
                )}
              </button>
              
              {/* Volume Slider */}
              <div 
                className="w-16 h-1 bg-white/20 rounded-full ml-2 cursor-pointer hidden md:block"
                onClick={(e) => {
                  e.stopPropagation();
                  const bounds = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - bounds.left;
                  const width = bounds.width;
                  const percentage = x / width;
                  handleVolumeChange(percentage);
                }}
              >
                <div 
                  className="h-full bg-white rounded-full"
                  style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                />
              </div>
            </div>

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
              onClick={(e) => {
                e.stopPropagation();
                togglePiP();
              }}
              className="text-white hover:text-white/80 transition-colors"
              aria-label={isPiP ? "Exit Picture in Picture" : "Enter Picture in Picture"}
            >
              <PictureInPicture2 className="w-5 h-5" />
            </button>

            {/* Settings */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSettings(!showSettings);
                }}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            setPlaybackSpeed(speed);
                          }}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuality(q as any);
                        }}
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
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
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
    </div>
  );
} 