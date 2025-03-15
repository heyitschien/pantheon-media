import { Play, Info, Volume2, VolumeX } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getHeroVideo } from "@/services/bunny-stream";
import { usePlayer } from "@/contexts/PlayerContext";
import { MovieInfoModal } from "./ui/movie-info-modal";
import { PANTHEON_HIGHLIGHTS } from "@/data/movies";
import Hls from "hls.js";

interface HeroAsset {
  type: 'image' | 'video';
  url: string;
  fallback?: string;
}

export function Hero() {
  // Core states
  const [currentAsset, setCurrentAsset] = useState<HeroAsset>({
    type: 'image',
    url: '/hero-image.png',
    fallback: '/hero-image.png'
  });
  const [videoAsset, setVideoAsset] = useState<HeroAsset | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  // Video states
  const [showVideo, setShowVideo] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  
  // HLS state
  const hlsRef = useRef<Hls | null>(null);
  
  // Transition states
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isReverseTransitioning, setIsReverseTransitioning] = useState(false);
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [isForward, setIsForward] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout>();
  const compactModeTimeoutRef = useRef<NodeJS.Timeout>();
  const animationFrameRef = useRef<number>();

  // Context
  const { playMovie } = usePlayer();

  // Reset function to ensure clean state
  const resetAllStates = () => {
    setShowVideo(false);
    setIsCompactMode(false);
    setIsTransitioning(false);
    setIsReverseTransitioning(false);
    setTransitionProgress(0);
    setIsForward(true);
    setIsVideoEnded(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
    // Destroy HLS instance if it exists
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  };

  // Load video asset
  useEffect(() => {
    const loadVideo = async () => {
      try {
        const { videoUrl, posterUrl } = await getHeroVideo();
        setVideoAsset({
          type: 'video',
          url: videoUrl,
          fallback: posterUrl
        });
        setIsInitialLoading(false);
      } catch (error) {
        console.error('Failed to load video:', error);
        setIsInitialLoading(false);
      }
    };

    loadVideo();

    // Cleanup on unmount
    return () => {
      resetAllStates();
    };
  }, []);

  // Initialize HLS
  const initHls = async (videoUrl: string) => {
    if (!videoRef.current) return;

    try {
      // Create new HLS instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('HLS network error, attempting to recover...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('HLS media error, attempting to recover...');
              hls.recoverMediaError();
              break;
            default:
              console.error('Fatal HLS error, destroying...');
              hls.destroy();
              break;
          }
        }
      });

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest loaded');
        setIsVideoLoaded(true);
        if (videoRef.current) {
          videoRef.current.play().catch(console.error);
        }
      });

      hls.loadSource(videoUrl);
      hls.attachMedia(videoRef.current);
      hlsRef.current = hls;

    } catch (error) {
      console.error('Failed to initialize HLS:', error);
      resetAllStates();
    }
  };

  // Handle video initialization
  useEffect(() => {
    if (!videoAsset || !videoRef.current) return;

    const initVideo = async () => {
      try {
        resetAllStates(); // Reset states before starting new video
        
        if (Hls.isSupported()) {
          await initHls(videoAsset.url);
        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
          // For Safari - native HLS support
          videoRef.current.src = videoAsset.url;
          videoRef.current.load();
          await videoRef.current.play();
        } else {
          console.error('HLS is not supported in this browser');
          return;
        }

        setShowVideo(true);
      } catch (error) {
        console.error('Failed to initialize video:', error);
        resetAllStates();
      }
    };

    initVideo();

    return () => {
      resetAllStates();
    };
  }, [videoAsset]);

  // Handle compact mode transition
  useEffect(() => {
    if (showVideo && !isVideoEnded) {
      compactModeTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(true);
        setIsForward(true);
        
        let startTime: number;
        const duration = 1500;
        
        const animateTransition = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          setTransitionProgress(progress);
          
          if (progress < 1) {
            animationFrameRef.current = requestAnimationFrame(animateTransition);
          } else {
            setIsCompactMode(true);
            setIsTransitioning(false);
            setTransitionProgress(1); // Ensure we end at exactly 1
          }
        };
        
        animationFrameRef.current = requestAnimationFrame(animateTransition);
      }, 4000);
    }

    return () => {
      if (compactModeTimeoutRef.current) {
        clearTimeout(compactModeTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [showVideo, isVideoEnded]);

  // Handle video end transition
  useEffect(() => {
    if (isVideoEnded) {
      setIsReverseTransitioning(true);
      setIsForward(false);
      
      let startTime: number;
      const duration = 1500;
      
      const animateReverseTransition = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        setTransitionProgress(1 - progress);
        
        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animateReverseTransition);
        } else {
          // Reset states in sequence with precise timing
          setTransitionProgress(0);
          setIsCompactMode(false);
          
          // Use Promise to ensure sequential execution
          Promise.resolve()
            .then(() => {
              setIsReverseTransitioning(false);
              return new Promise(resolve => setTimeout(resolve, 100));
            })
            .then(() => {
              setShowVideo(false);
              return new Promise(resolve => setTimeout(resolve, 100));
            })
            .then(() => {
              if (videoRef.current) {
                videoRef.current.currentTime = 0;
              }
              setIsVideoEnded(false);
            });
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(animateReverseTransition);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isVideoEnded]);

  // Event handlers
  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
    setIsInitialLoading(false);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    if (videoRef.current.currentTime >= videoRef.current.duration - 0.5) {
      if (!isVideoEnded) { // Prevent multiple triggers
        setIsVideoEnded(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handlePlayClick = async () => {
    try {
      const { videoUrl, posterUrl } = await getHeroVideo();
      console.log('Playing hero video:', { videoUrl, posterUrl });
      
      // Ensure we're using the HLS stream URL
      if (!videoUrl.includes('.m3u8')) {
        console.warn('Video URL is not an HLS stream, this may cause playback issues');
      }
      
      playMovie({
        videoUrl,
        posterUrl,
        title: "Pantheon Highlights"
      });
    } catch (error) {
      console.error('Failed to get video:', error);
    }
  };

  // Style calculations
  const getTransitionStyles = () => {
    if (isCompactMode && !isReverseTransitioning) {
      return {
        transform: 'translateY(-12px)',
        marginBottom: '0'
      };
    }
    
    if (isTransitioning || isReverseTransitioning) {
      const translateY = -12 * transitionProgress;
      const marginBottom = 96 * (1 - transitionProgress);
      
      return {
        transform: `translateY(${translateY}px)`,
        marginBottom: `${marginBottom}px`
      };
    }
    
    return {
      transform: 'translateY(0)',
      marginBottom: '96px'
    };
  };

  const getTextOpacity = () => {
    if (isCompactMode && !isReverseTransitioning) return 0;
    if (isTransitioning) return 1 - transitionProgress;
    if (isReverseTransitioning) return transitionProgress;
    return 1;
  };

  const getTitleScale = () => {
    if (isCompactMode && !isReverseTransitioning) return 0.85;
    if (isTransitioning) return 1 - (0.15 * transitionProgress);
    if (isReverseTransitioning) return 0.85 + (0.15 * transitionProgress);
    return 1;
  };

  return (
    <>
      <div className="relative w-screen h-[85vh] bg-pantheon-night overflow-hidden">
        <div className="absolute inset-0 w-screen">
          {/* Image Layer */}
          <div 
            className="absolute inset-0 transition-all ease-in-out duration-1000"
            style={{ opacity: showVideo ? 0 : 1 }}
          >
            <img
              src={currentAsset.url}
              alt="Hero background"
              className="w-full h-full object-cover"
              onLoad={() => setIsInitialLoading(false)}
            />
          </div>

          {/* Video Layer */}
          {videoAsset && (
            <div 
              className="absolute inset-0 transition-all ease-in-out duration-1000"
              style={{ opacity: showVideo ? 1 : 0 }}
            >
              <video
                ref={videoRef}
                muted
                playsInline
                poster={videoAsset.fallback}
                className="w-full h-full object-cover"
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsVideoEnded(true)}
                onError={(e) => {
                  console.error('Video error:', e);
                  resetAllStates();
                }}
              >
                <source src={videoAsset.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              <button
                onClick={toggleMute}
                className={`absolute bottom-8 right-8 z-30 p-2 rounded-full bg-pantheon-night/50 hover:bg-pantheon-night/70 transition-colors
                  ${showVideo ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="w-6 h-6 text-white" />
                ) : (
                  <Volume2 className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          )}
          
          {/* Enhanced gradients for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-pantheon-night/40 via-pantheon-night/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-pantheon-light dark:from-pantheon-night to-transparent" />
        </div>

        {isInitialLoading && (
          <div className="absolute inset-0 bg-white/60 dark:bg-pantheon-night/60 flex items-center justify-center backdrop-blur-sm transition-opacity duration-500">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-pantheon-purple border-t-transparent"></div>
          </div>
        )}

        <div className="relative h-full z-20">
          <div className="h-full max-w-[2000px] mx-auto px-12 sm:px-14 lg:px-16 flex flex-col justify-center">
            <div 
              className="max-w-2xl transition-all duration-1000 ease-in-out"
              style={getTransitionStyles()}
            >
              <span 
                className="inline-block bg-gradient-to-r from-[#F09045] via-[#FFB067] to-[#F09045] bg-clip-text text-transparent font-medium text-sm mb-3 transition-opacity duration-700"
                style={{ opacity: getTextOpacity() }}
              >
                Regenerative Lifestyle
              </span>
              
              {/* Title with maintained structure */}
              {isCompactMode && !isReverseTransitioning ? (
                <div className="flex flex-col origin-left">
                  <h2 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-1 transition-all duration-1000">
                    Regenerative
                  </h2>
                  <h2 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-8 transition-all duration-1000">
                    Lifestyle Media
                  </h2>
                </div>
              ) : (
                <h1 
                  className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg transition-all duration-1000 origin-left"
                  style={{ 
                    transform: `scale(${getTitleScale()})`,
                    marginBottom: isTransitioning || isReverseTransitioning ? `${16 + (16 * transitionProgress)}px` : '16px'
                  }}
                >
                  {(isTransitioning || isReverseTransitioning) ? (
                    <div className="flex flex-col">
                      <div className="transition-transform duration-1000" style={{ transform: `translateY(${-10 * transitionProgress}px)` }}>
                        Regenerative
                      </div>
                      <div className="transition-transform duration-1000" style={{ transform: `translateY(${-5 * transitionProgress}px)` }}>
                        Lifestyle Media
                      </div>
                    </div>
                  ) : (
                    <span className="inline-block">Regenerative Lifestyle Media</span>
                  )}
                </h1>
              )}
              
              <p 
                className="text-lg text-white max-w-xl drop-shadow-lg transition-all duration-700 overflow-hidden"
                style={{ 
                  opacity: getTextOpacity(),
                  maxHeight: (isTransitioning || isReverseTransitioning) ? `${80 * (1 - transitionProgress)}px` : (isCompactMode ? '0' : '80px'),
                  marginBottom: (isTransitioning || isReverseTransitioning) ? `${32 * (1 - transitionProgress)}px` : (isCompactMode ? '0' : '32px')
                }}
              >
                Creating content that inspires positive change and promotes holistic well-being.
                Our cinematic approach captures the essence of regenerative living through emotional storytelling.
              </p>
              <div className="flex items-center gap-4 transition-transform duration-1000">
                <button 
                  onClick={handlePlayClick}
                  className="px-8 py-3 bg-gradient-lotus text-white rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-pantheon-pink/20 transition-all border border-white/10"
                  disabled={!isVideoLoaded || !videoAsset || isTransitioning || isReverseTransitioning}
                >
                  <Play className="w-5 h-5" />
                  Watch Our Work
                </button>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-8 py-3 bg-white hover:bg-white/90 text-pantheon-night rounded-lg font-semibold flex items-center gap-2 transition-colors"
                >
                  <Info className="w-5 h-5" />
                  More Info
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MovieInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movie={{
          title: PANTHEON_HIGHLIGHTS.title,
          image: PANTHEON_HIGHLIGHTS.coverImage || currentAsset.url,
          description: PANTHEON_HIGHLIGHTS.description,
          rating: PANTHEON_HIGHLIGHTS.rating,
          duration: PANTHEON_HIGHLIGHTS.duration,
          year: PANTHEON_HIGHLIGHTS.year,
          genres: PANTHEON_HIGHLIGHTS.genres
        }}
      />
    </>
  );
}
