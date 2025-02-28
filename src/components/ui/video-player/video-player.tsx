import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import Hls from 'hls.js';

interface VideoPlayerProps {
  title: string;
  description: string;
  image: string;
  video: string;
  rating?: string;
  onInfoClick?: () => void;
}

export function VideoPlayer({
  title,
  description,
  image,
  video,
  rating,
  onInfoClick
}: VideoPlayerProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [currentQuality, setCurrentQuality] = useState<number>(-1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Initialize HLS with enhanced configuration
  const initHls = useCallback(() => {
    if (!videoRef.current || !video) return;

    try {
      if (Hls.isSupported()) {
        console.log('Initializing HLS with source:', video);

        // Cleanup previous instance
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }

        const hls = new Hls({
          debug: true,
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
          maxBufferSize: 0,
          maxBufferLength: 30,
          maxMaxBufferLength: 600,
          startLevel: -1,
          manifestLoadingTimeOut: 10000,
          manifestLoadingMaxRetry: 3,
          manifestLoadingRetryDelay: 500,
          levelLoadingTimeOut: 10000,
          levelLoadingMaxRetry: 3,
          levelLoadingRetryDelay: 500
        });

        hlsRef.current = hls;

        // Setup event listeners
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          console.log('HLS: Media attached');
          hls.loadSource(video);
        });

        hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
          console.log('HLS: Manifest parsed, levels:', data.levels);
          setIsVideoLoaded(true);
          setIsInitialLoading(false);
          
          if (videoRef.current) {
            videoRef.current.muted = isMuted;
            if (!isTransitioning) {
              videoRef.current.play()
                .then(() => {
                  console.log('Playback started successfully');
                  setShowVideo(true);
                })
                .catch(error => {
                  console.error('Play failed:', error);
                  setError('Unable to start playback');
                });
            }
          }
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS Error:', data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log('HLS: Fatal network error encountered, trying to recover');
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('HLS: Fatal media error encountered, trying to recover');
                hls.recoverMediaError();
                break;
              default:
                console.log('HLS: Fatal error, cannot recover');
                hls.destroy();
                setError('Failed to load video stream');
                break;
            }
          }
        });

        // Quality selection
        hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
          setCurrentQuality(data.level);
          console.log('Quality Level Changed:', data.level);
        });

        // Attach media
        hls.attachMedia(videoRef.current);

      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        console.log('Using native HLS support');
        videoRef.current.src = video;
        videoRef.current.addEventListener('loadedmetadata', () => {
          setIsVideoLoaded(true);
          setIsInitialLoading(false);
          if (!isTransitioning && videoRef.current) {
            videoRef.current.muted = isMuted;
            videoRef.current.play()
              .then(() => setShowVideo(true))
              .catch(error => {
                console.error('Native playback failed:', error);
                setError('Unable to start playback');
              });
          }
        });
      } else {
        console.error('HLS is not supported in this browser');
        setError('Your browser does not support video playback');
      }
    } catch (error) {
      console.error('Error initializing video player:', error);
      setError('Failed to initialize video player');
    }
  }, [video, isMuted, isTransitioning]);

  // Initialize on mount or video change
  useEffect(() => {
    initHls();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [initHls]);

  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
    setIsInitialLoading(false);
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  };

  const handlePlay = () => {
    if (!isVideoLoaded || isTransitioning) return;
    
    setIsTransitioning(true);
    setError(null);
    
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = isMuted;
      
      try {
        const playPromise = videoRef.current.play();
        if (playPromise?.then) {
          playPromise
            .then(() => {
              setShowVideo(true);
              setTimeout(() => {
                setIsTransitioning(false);
              }, 1000);
            })
            .catch((error) => {
              console.error('Error playing video:', error);
              setError('Failed to play video');
              setIsTransitioning(false);
              setShowVideo(false);
            });
        }
      } catch (error) {
        console.error('Error playing video:', error);
        setError('Failed to play video');
        setIsTransitioning(false);
        setShowVideo(false);
      }
    }
  };

  const handleVideoError = () => {
    setError('Failed to load video');
    setIsVideoLoaded(false);
    setIsInitialLoading(false);
    setShowVideo(false);
  };

  const handleVideoEnded = () => {
    setShowVideo(false);
    setIsVideoLoaded(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  return (
    <div className="relative w-screen h-[80vh] bg-black overflow-hidden">
      <div className="absolute inset-0 w-screen">
        {/* Image Backdrop */}
        <div
          className="absolute inset-0 transition-all ease-in-out duration-1000"
          style={{ opacity: showVideo ? 0 : 1 }}
        >
          <img
            src={image}
            alt={`${title} backdrop`}
            className="w-full h-full object-cover"
            onLoad={() => setIsInitialLoading(false)}
          />
        </div>

        {/* Video Container */}
        <div
          data-testid="video-container"
          className="absolute inset-0 transition-all ease-in-out duration-1000"
          style={{ opacity: showVideo ? 1 : 0 }}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            poster={image}
            onLoadedData={handleVideoLoaded}
            onError={handleVideoError}
            onEnded={handleVideoEnded}
            autoPlay
            playsInline
            data-testid="video-element"
          />

          {/* Mute/Unmute Button */}
          <button
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            className={`absolute bottom-8 right-8 z-30 p-2 rounded-full bg-black/50 hover:bg-black/70 ${
              showVideo ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-500`}
          >
            {isMuted ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
          </button>
        </div>

        {/* Loading State */}
        {isInitialLoading && (
          <div 
            data-testid="loading-indicator"
            className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm transition-opacity duration-500"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
          </div>
        )}

        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="relative h-full z-20">
        <div className="h-full max-w-[2000px] mx-auto px-12 sm:px-14 lg:px-16 flex flex-col justify-center">
          {rating && (
            <div className="mb-4">
              <span className="px-2 py-1 bg-white/20 text-white text-sm rounded">
                {rating}
              </span>
            </div>
          )}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
          <p className="text-white/80 max-w-xl mb-6">{description}</p>
          <div className="flex items-center gap-4">
            <button
              aria-label="Play"
              className="px-6 py-2 bg-white text-black rounded-lg font-semibold flex items-center gap-2 hover:bg-white/90 transition-colors"
              onClick={handlePlay}
              disabled={!isVideoLoaded || isTransitioning}
            >
              <Play className="w-5 h-5" />
              Play
            </button>
            {onInfoClick && (
              <button
                onClick={onInfoClick}
                className="px-6 py-2 bg-white/20 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-white/30 transition-colors"
              >
                <Info className="w-5 h-5" />
                More Info
              </button>
            )}
          </div>
          {error && (
            <div data-testid="error-state" className="mt-4 text-red-500 font-medium">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 