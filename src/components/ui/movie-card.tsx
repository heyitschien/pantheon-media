import { useEffect, useState, useCallback, useRef } from "react";
import { Play, Eye, Heart, Info, Trophy } from "lucide-react";
import { theme } from "@/config/theme";
import { MovieInfoModal } from "./movie-info-modal";
import { getPreviewVideo } from "@/services/pexels";
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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [feedbackPosition, setFeedbackPosition] = useState({ x: 0, y: 0 });
  const [viewCount, setViewCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Fetch preview video
  const fetchPreviewVideo = useCallback(async () => {
    if (previewVideo && videoRef.current) {
      try {
        videoRef.current.currentTime = 0;
        videoRef.current.muted = true;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          setShowVideo(true);
        }
      } catch (error) {
        console.error('Error replaying video:', error);
        setError('Unable to load preview. Please try again later.');
      }
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowVideo(false);

    try {
      const searchQuery = `${title} ${genres?.join(' ')} movie scene`;
      const video = await getPreviewVideo(searchQuery, {
        maxDuration: 30,
        minDuration: 5,
        orientation: 'landscape',
      });
      setPreviewVideo(video);
      setRetryCount(0);
      
      if (videoRef.current) {
        videoRef.current.muted = true;
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadeddata = () => resolve(true);
            videoRef.current.onerror = () => resolve(false);
          }
        });
        
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          setShowVideo(true);
        }
      }
    } catch (err) {
      console.error('Failed to load preview:', err);
      setError('Unable to load preview. Please try again later.');
      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
      }
    } finally {
      setIsLoading(false);
    }
  }, [title, genres, previewVideo, retryCount, maxRetries]);

  // Handle mouse enter
  const handleMouseEnter = useCallback(() => {
    if (!isModalOpen) { // Only allow hover if modal is not open
      setIsHovered(true);
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Set new timeout for video fetch
      timeoutRef.current = setTimeout(fetchPreviewVideo, 300);
    }
  }, [fetchPreviewVideo, isModalOpen]);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setShowVideo(false);
    setError(null);
    setIsLoading(false);
    
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoRef.current.src = ''; // Clear the source
    }
  }, []);

  // Effect to handle modal state changes
  useEffect(() => {
    if (isModalOpen) {
      handleMouseLeave(); // Clean up hover state when modal opens
    }
  }, [isModalOpen, handleMouseLeave]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
      }
    };
  }, []);

  // Ensure continuous playback
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleEnded = () => {
      if (videoElement) {
        videoElement.currentTime = 0;
        videoElement.play().catch(() => {
          setError('Unable to load preview. Please try again later.');
        });
      }
    };

    const handleError = () => {
      console.error('Video playback error');
      setError('Unable to load preview. Please try again later.');
      setShowVideo(false);
    };

    const handlePause = () => {
      if (videoElement && !videoElement.ended && isHovered) {
        videoElement.play().catch(() => {
          setError('Unable to load preview. Please try again later.');
        });
      }
    };

    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('error', handleError);
    videoElement.addEventListener('pause', handlePause);

    return () => {
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('error', handleError);
      videoElement.removeEventListener('pause', handlePause);
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
      // If we already have a preview video, use it
      if (previewVideo) {
        playMovie({
          videoUrl: previewVideo.videoUrl,
          posterUrl: previewVideo.posterUrl,
          title: title
        });
        return;
      }

      // Otherwise fetch a new video
      const searchQuery = `${title} ${genres?.join(' ')} movie scene`;
      const video = await getPreviewVideo(searchQuery, {
        maxDuration: 30,
        minDuration: 5,
        orientation: 'landscape',
      });
      
      playMovie({
        videoUrl: video.videoUrl,
        posterUrl: video.posterUrl,
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
    
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    setFeedbackPosition({
      x: rect.left + rect.width / 2,
      y: rect.top
    });
    
    setViewCount(prev => prev + 1);
    setActiveButton('view');
    setTimeout(() => setActiveButton(null), 1500);
  };

  const handleLike = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    setFeedbackPosition({
      x: rect.left + rect.width / 2,
      y: rect.top
    });
    
    setIsLiked(!isLiked);
    setActiveButton('like');
    setTimeout(() => setActiveButton(null), 1500);
  };

  return (
    <div
      className="relative h-[300px] group/item"
      data-testid="movie-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Base Card - Simple version */}
      <div className="relative rounded-lg overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-[176px] object-cover rounded-lg brightness-110"
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

      {/* Hover Card - Rich version */}
      {isHovered && (
        <div
          data-testid="preview-card"
          className="absolute w-[120%] transition-all duration-300 origin-bottom-left overflow-visible top-[-64px] z-[1000] scale-110 opacity-100 left-0"
        >
          <div className="rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black/90">
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
                  {/* Video Preview */}
                  <video
                    ref={videoRef}
                    src={previewVideo?.videoUrl}
                    poster={previewVideo?.posterUrl}
                    className={cn(
                      "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
                      showVideo ? "opacity-100" : "opacity-0"
                    )}
                    muted
                    playsInline
                    data-testid="preview-video"
                  />
                </div>
              </div>
              {/* Control Buttons - Moved further down from preview */}
              <div className="absolute -bottom-16 left-0 right-0 flex items-center justify-between px-4">
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
            </div>
            {/* Info Section - Increased top padding to match new button position */}
            <div className="p-4 pt-20 bg-black/80">
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
      )}

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
