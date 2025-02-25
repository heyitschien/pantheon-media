import { Play, Info, Volume2, VolumeX } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getSpaceVideo } from "../services/pexels";
import { usePlayer } from "@/contexts/PlayerContext";
import { MovieInfoModal } from "./ui/movie-info-modal";
import { PANTHEON_HIGHLIGHTS } from "@/data/movies";

interface HeroAsset {
  type: 'image' | 'video';
  url: string;
  fallback?: string;
}

export function Hero() {
  const [currentAsset, setCurrentAsset] = useState<HeroAsset>({
    type: 'image',
    url: '/hero-image.png',
    fallback: '/hero-image.png'
  });
  const [videoAsset, setVideoAsset] = useState<HeroAsset | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isForward, setIsForward] = useState(true);
  const transitionTimeoutRef = useRef<NodeJS.Timeout>();
  const compactModeTimeoutRef = useRef<NodeJS.Timeout>();
  const animationFrameRef = useRef<number>();
  const { playMovie } = usePlayer();
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [isReverseTransitioning, setIsReverseTransitioning] = useState(false);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const { videoUrl, posterUrl } = await getSpaceVideo();
        setVideoAsset({
          type: 'video',
          url: videoUrl,
          fallback: posterUrl
        });
      } catch (error) {
        console.error('Failed to load video:', error);
      }
    };

    loadVideo();
  }, []);

  useEffect(() => {
    if (videoRef.current && videoAsset) {
      videoRef.current.load();
      videoRef.current.muted = true;
    }

    if (isVideoLoaded && videoAsset && videoRef.current) {
      const playVideo = async () => {
        try {
          await videoRef.current?.play();
          setShowVideo(true);
        } catch (error) {
          console.error('Failed to play video:', error);
        }
      };

      const timer = setTimeout(() => {
        playVideo();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVideoLoaded, videoAsset]);

  // Effect to trigger compact mode after video starts playing
  useEffect(() => {
    if (showVideo) {
      compactModeTimeoutRef.current = setTimeout(() => {
        // Start the smooth transition animation
        setIsTransitioning(true);
        setIsForward(true);
        
        let startTime: number;
        const duration = 1500; // 1.5 seconds for the transition
        
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
          }
        };
        
        animationFrameRef.current = requestAnimationFrame(animateTransition);
      }, 4000); // 4 seconds after video starts
    }

    return () => {
      if (compactModeTimeoutRef.current) {
        clearTimeout(compactModeTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [showVideo]);

  // Effect to handle reverse animation when video ends
  useEffect(() => {
    if (isVideoEnded && isCompactMode) {
      // Start the reverse animation
      setIsReverseTransitioning(true);
      setIsForward(false);
      
      let startTime: number;
      const duration = 1500; // 1.5 seconds for the reverse transition
      
      const animateReverseTransition = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // For reverse animation, we go from 1 to 0
        setTransitionProgress(1 - progress);
        
        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animateReverseTransition);
        } else {
          setIsCompactMode(false);
          setIsReverseTransitioning(false);
          setTransitionProgress(0);
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(animateReverseTransition);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isVideoEnded, isCompactMode]);

  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
    setIsInitialLoading(false);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    
    // Check if the video has reached its end (with a small buffer)
    if (videoRef.current.currentTime >= videoRef.current.duration - 0.5) {
      setIsVideoEnded(true);
    } else if (isVideoEnded) {
      setIsVideoEnded(false);
    }
  };

  const handleVideoEnded = () => {
    setIsVideoEnded(true);
    setShowVideo(false);
  };

  const handlePlay = () => {
    if (!videoRef.current || !isVideoLoaded || !videoAsset) return;
    
    try {
      videoRef.current.play();
    } catch (error) {
      console.error('Failed to play video:', error);
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
      const { videoUrl, posterUrl } = await getSpaceVideo();
      playMovie({
        videoUrl,
        posterUrl,
        title: "Pantheon Highlights"
      });
    } catch (error) {
      console.error('Failed to get video:', error);
    }
  };

  // Calculate transition styles based on progress
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
      marginBottom: '96px' // 24rem = 96px
    };
  };

  // Calculate text opacity based on transition progress
  const getTextOpacity = () => {
    if (isCompactMode && !isReverseTransitioning) return 0;
    if (isTransitioning) return 1 - transitionProgress;
    if (isReverseTransitioning) return 1 - transitionProgress;
    return 1;
  };

  // Calculate title scale based on transition progress
  const getTitleScale = () => {
    if (isCompactMode && !isReverseTransitioning) return 0.85;
    if (isTransitioning) return 1 - (0.15 * transitionProgress);
    if (isReverseTransitioning) return 1 - (0.15 * transitionProgress);
    return 1;
  };

  return (
    <>
      <div 
        className="relative w-screen h-[85vh] bg-pantheon-night overflow-hidden"
      >
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
                autoPlay
                muted
                playsInline
                poster={videoAsset.fallback}
                className="w-full h-full object-cover"
                onLoadedData={handleVideoLoaded}
                onTimeUpdate={handleTimeUpdate}
                onPause={handlePlay}
                onEnded={handleVideoEnded}
              >
                <source src={videoAsset.url} type="video/mp4" />
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
          image: PANTHEON_HIGHLIGHTS.image,
          description: PANTHEON_HIGHLIGHTS.description,
          rating: PANTHEON_HIGHLIGHTS.rating,
          duration: PANTHEON_HIGHLIGHTS.duration,
          year: PANTHEON_HIGHLIGHTS.year,
          genres: PANTHEON_HIGHLIGHTS.genres,
          director: PANTHEON_HIGHLIGHTS.director,
          cast: PANTHEON_HIGHLIGHTS.cast,
          match: PANTHEON_HIGHLIGHTS.match
        }}
      />
    </>
  );
}
