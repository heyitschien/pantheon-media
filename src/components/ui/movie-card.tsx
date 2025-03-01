import { useEffect, useState, useCallback, useRef } from "react";
import { Play, Eye, Heart, Info, Trophy } from "lucide-react";
import { theme } from "@/config/theme";
import { MovieInfoModal } from "./movie-info-modal";
import { getPreviewVideo, getHeroVideo } from "@/services/bunny-stream";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { cn } from "@/lib/utils";
import { usePlayer } from "@/contexts/PlayerContext";
import { PlayButton, AddToListButton, InfoButton, MovieControlButton } from "./movie-controls";
import { OriginalBadge } from "./badges/original-badge";
import Hls from 'hls.js';

interface MovieCardProps {
  id?: string;
  title: string;
  image: string;
  description: string;
  rating: string;
  duration: string;
  year: string;
  isPrismOriginal?: boolean;
  isTop10?: boolean;
  isNew?: boolean;
  genres?: string[];
  hasWonAward?: boolean;
  director?: string;
  cast?: string[];
  tags?: string[];
  match?: number;
  similarMovies?: Array<{
    title: string;
    image: string;
    description: string;
    rating: string;
    duration: string;
    year: string;
  }>;
}

export function MovieCard({
  id = 'default',
  title,
  image,
  description,
  rating,
  duration,
  year,
  isPrismOriginal,
  isTop10,
  isNew,
  genres,
  hasWonAward,
  director,
  cast,
  tags,
  match,
  similarMovies,
}: MovieCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { playMovie } = usePlayer();
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<{ videoUrl: string; posterUrl: string } | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingHover, setIsProcessingHover] = useState(false);
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const lastHoverTime = useRef<number>(0);
  const activeInitializationRef = useRef<boolean>(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Enhanced cleanup function with state tracking
  const cleanup = useCallback(async () => {
    if (isCleaningUp) {
      console.log('Cleanup already in progress, skipping...');
      return;
    }

    console.log('Starting cleanup for:', title);
    setIsCleaningUp(true);

    try {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
      }

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      setShowVideo(false);
      setPreviewVideo(null);
      setError(null);
      setIsProcessingHover(false);
    } finally {
      setIsCleaningUp(false);
      console.log('Cleanup completed for:', title);
    }
  }, [title, isCleaningUp]);

  // Simplified HLS initialization with better debugging
  const initHls = useCallback(async (videoElement: HTMLVideoElement, src: string) => {
    if (!videoElement) {
      console.error('No video element provided');
      return;
    }

    if (activeInitializationRef.current) {
      console.log('HLS initialization already in progress, skipping...');
      return;
    }

    console.log('Starting HLS initialization for:', title, 'src:', src);
    activeInitializationRef.current = true;
    setIsLoading(true);

    try {
      // Clean up existing HLS instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      if (Hls.isSupported()) {
        console.log('HLS is supported, creating new instance');
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          debug: false, // Set to true for more verbose logging if needed
        });

        // Set up error handling
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS error:', data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log('Network error, attempting to recover...');
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('Media error, attempting to recover...');
                hls.recoverMediaError();
                break;
              default:
                console.error('Fatal error, destroying HLS instance');
                hls.destroy();
                setError('Failed to load preview');
                setShowVideo(false);
                break;
            }
          }
        });

        // Attach media and load source
        hls.attachMedia(videoElement);
        
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          console.log('HLS: Media attached for:', title);
          hls.loadSource(src);
        });

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('HLS: Manifest parsed for:', title);
          videoElement.play().then(() => {
            console.log('Video playback started for:', title);
            setShowVideo(true);
            setIsLoading(false);
          }).catch(error => {
            console.error('Video playback failed:', error);
            setError('Failed to play video');
          });
        });

        hlsRef.current = hls;

      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        // For Safari - native HLS support
        console.log('Using native HLS support for Safari');
        videoElement.src = src;
        videoElement.addEventListener('loadedmetadata', () => {
          console.log('Video metadata loaded');
          videoElement.play().then(() => {
            console.log('Video playback started');
            setShowVideo(true);
            setIsLoading(false);
          }).catch(error => {
            console.error('Video playback failed:', error);
            setError('Failed to play video');
          });
        });
      } else {
        throw new Error('HLS not supported');
      }
    } catch (error) {
      console.error('HLS initialization error:', error);
      setError('Failed to initialize video');
      setShowVideo(false);
    } finally {
      setIsLoading(false);
      activeInitializationRef.current = false;
      console.log('HLS initialization completed for:', title);
    }
  }, [title]);

  // Enhanced preview video fetching with better debugging
  const fetchPreviewVideo = useCallback(async () => {
    if (!isHovered || isProcessingHover) return;

    console.log('Starting preview fetch for:', title, 'with ID:', id);
    setIsLoading(true);
    setError(null);
    setShowVideo(false);
    setIsProcessingHover(true);

    try {
      // Use the movie's ID to fetch its specific preview
      console.log('Fetching preview for ID:', id);
      const video = await getPreviewVideo(id);
      console.log('Video data received for:', title, video);
      
      if (!video?.videoUrl) {
        throw new Error('Invalid video data');
      }

      if (!isHovered) {
        console.log('No longer hovered, aborting preview for:', title);
        return;
      }

      setPreviewVideo(video);
      
      if (!videoRef.current) {
        throw new Error('Video element not found');
      }

      await initHls(videoRef.current, video.videoUrl);
      
    } catch (error) {
      console.error('Preview load failed:', error);
      setError('Unable to load preview');
      setIsLoading(false);
    } finally {
      setIsProcessingHover(false);
    }
  }, [title, id, initHls, isHovered, isProcessingHover]);

  // Enhanced mouse enter handler with debouncing and preview optimization
  const handleMouseEnter = useCallback(() => {
    const now = Date.now();
    if (
      isProcessingHover || 
      isCleaningUp || 
      (now - lastHoverTime.current) < 1000 // 1 second cooldown
    ) {
      console.log('Skipping hover processing for:', title, {
        isProcessingHover,
        isCleaningUp,
        timeSinceLastHover: now - lastHoverTime.current
      });
      return;
    }

    console.log('Processing hover for:', title);
    lastHoverTime.current = now;
    setIsHovered(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Start loading the video after a shorter delay for better responsiveness
    timeoutRef.current = setTimeout(() => {
      fetchPreviewVideo();
    }, 300); // Reduced from 500ms to 300ms for faster preview
  }, [fetchPreviewVideo, title, isProcessingHover, isCleaningUp]);

  // Enhanced mouse leave handler
  const handleMouseLeave = useCallback(() => {
    console.log('Mouse leave for:', title);
    setIsHovered(false);
    cleanup();
  }, [cleanup, title]);

  // Handle viewport changes
  useEffect(() => {
    const handleResize = () => {
      if (isHovered) {
        console.log('Viewport changed, cleaning up:', title);
        cleanup();
        setIsHovered(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isHovered, cleanup, title]);

  // Effect to handle modal state changes
  useEffect(() => {
    if (isModalOpen) {
      cleanup();
    }
  }, [isModalOpen, cleanup]);

  // Ensure continuous playback
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !isHovered) return;

    const handleEnded = () => {
      if (videoElement && isHovered) {
        videoElement.currentTime = 0;
        videoElement.play().catch(console.error);
      }
    };

    const handleError = (e: Event) => {
      console.error('Video playback error:', e);
      setError('Playback error');
      setShowVideo(false);
    };

    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('error', handleError);

    return () => {
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('error', handleError);
    };
  }, [isHovered]);

  const handleGenreClick = (genre: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    navigate(`/genre/${genre.toLowerCase()}`);
  };

  const handleMoreInfo = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsModalOpen(true);
  };

  const handlePlay = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    try {
      let videoToPlay;
      
      // If we already have a preview video loaded, use it
      if (previewVideo) {
        videoToPlay = previewVideo;
      } else {
        // Otherwise fetch the video
        videoToPlay = await getPreviewVideo(id);
      }
      
      playMovie({
        videoUrl: videoToPlay.videoUrl,
        posterUrl: videoToPlay.posterUrl,
        title: title
      });
    } catch (error) {
      console.error('Failed to play video:', error);
      toast({
        title: "Error",
        description: "Unable to play video. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleView = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    setViewCount(prev => prev + 1);
    setActiveButton('view');
    setTimeout(() => setActiveButton(null), 1500);
  };

  const handleLike = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    setIsLiked(!isLiked);
    setActiveButton('like');
    setTimeout(() => setActiveButton(null), 1500);
  };

  return (
    <div
      className="group relative w-[300px] transition duration-200 hover:z-[100]"
      data-testid="movie-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Base Card */}
      <div className="w-full rounded-lg group-hover:opacity-0 group-hover:invisible transition duration-200">
        <div className="relative h-[176px] rounded-lg overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover rounded-lg brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg">
            <div className="absolute bottom-0 p-3 w-full">
              <h3 className="text-white font-bold text-lg line-clamp-1">{title}</h3>
            </div>
          </div>
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {isPrismOriginal && <OriginalBadge />}
            {isTop10 && (
              <div className="bg-gradient-to-r from-red-700 via-red-500 to-red-400 px-2 py-1 text-xs font-bold rounded-md text-white shadow-lg shadow-red-900/20 backdrop-blur-sm">
                TOP 10
              </div>
            )}
            {isNew && (
              <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 px-2 py-1 text-xs font-bold rounded-md text-white shadow-lg shadow-emerald-900/20 backdrop-blur-sm">
                NEW
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hover Card - Updated positioning and visibility */}
      <div
        className={cn(
          "absolute top-0 left-0 w-[360px] -translate-y-[32px] -translate-x-[30px] transition-all duration-300",
          "opacity-0 invisible scale-95 group-hover:opacity-100 group-hover:visible group-hover:scale-100",
          "origin-center transform-gpu z-[100]"
        )}
        data-testid="preview-card"
      >
        <div className="rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black/90 backdrop-blur-sm">
          {/* Preview Section */}
          <div className="relative aspect-video">
            <div className="relative w-full h-[216px]">
              <img
                data-testid="preview-fallback"
                alt={`${title} preview`}
                src={image}
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-500 brightness-110",
                  showVideo ? "opacity-0" : "opacity-100"
                )}
              />
              <div className="absolute inset-0">
                <video
                  ref={videoRef}
                  className={cn(
                    "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
                    showVideo ? "opacity-100" : "opacity-0"
                  )}
                  muted
                  playsInline
                  preload="metadata"
                  poster={previewVideo?.posterUrl}
                  onLoadedMetadata={() => {
                    console.log('Video metadata loaded:', title);
                  }}
                  onCanPlay={() => {
                    console.log('Video can play:', title);
                  }}
                  onPlay={() => {
                    console.log('Video started playing:', title);
                  }}
                  onError={(e) => {
                    console.error('Video error:', e);
                    setError('Failed to play video');
                    setShowVideo(false);
                  }}
                />
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <p className="text-white text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Black section with controls and info */}
          <div className="bg-black/90">
            {/* Control Buttons - Now positioned inside the black section */}
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PlayButton onClick={handlePlay} />
                <MovieControlButton
                  onClick={handleView}
                  icon={
                    <div className="relative">
                      <Eye className="w-6 h-6 text-white" />
                      {viewCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-pantheon-pink text-white text-xs rounded-full px-1.5 py-0.5">
                          {viewCount}
                        </span>
                      )}
                    </div>
                  }
                  label="View count"
                  isActive={activeButton === 'view'}
                />
                <MovieControlButton
                  onClick={handleLike}
                  icon={
                    <Heart className={cn(
                      "w-6 h-6",
                      isLiked ? "text-pantheon-pink fill-pantheon-pink" : "text-white"
                    )} />
                  }
                  label="Like"
                  isActive={activeButton === 'like'}
                />
              </div>
              <InfoButton onClick={handleMoreInfo} />
            </div>

            {/* Info Section */}
            <div className="p-4">
              <div className="flex items-center gap-1 text-[15px]">
                <span className="text-[#46d369] font-semibold">{match}% Match</span>
                <span className="text-white/80 mx-1.5">•</span>
                <span className="text-white/80">{year}</span>
                <span className="text-white/80 mx-1.5">•</span>
                <span className="text-white/80">{duration}</span>
                <span className="text-white/80 mx-1.5">•</span>
                <span className="border border-white/50 bg-[#2a2a2a] px-2 py-0.5 text-[13px] text-white/95 rounded">
                  {rating}
                </span>
              </div>
              {/* Genre Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {genres?.map((genre) => (
                  <button
                    key={genre}
                    onClick={(e) => handleGenreClick(genre, e)}
                    className={cn(
                      "text-xs text-white/90 px-2 py-1 bg-zinc-800/70 rounded",
                      "hover:bg-zinc-700/80 hover:text-white",
                      "transition-all duration-200",
                      "hover:scale-105",
                      "cursor-pointer",
                      "ring-1 ring-white/20 hover:ring-white/30"
                    )}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Info Modal */}
      <MovieInfoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsHovered(false); // Ensure hover state is cleared when modal closes
        }}
        movie={{
          title,
          image,
          description,
          rating,
          duration,
          year,
          genres,
          director,
          cast,
          tags,
          match,
          similarMovies
        }}
      />
    </div>
  );
}
