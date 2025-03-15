import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./dialog";
import { Play, Eye, Heart, VolumeX, Volume2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { theme } from "@/config/theme";
import { useState, useRef, useEffect, useCallback } from "react";
import { getPreviewVideo } from "@/services/bunny-stream";
import { usePlayer } from "@/contexts/PlayerContext";
import { useToast } from "@/hooks/use-toast";
import { PlayButton, AddToListButton, LikeButton, VolumeButton } from "./movie-controls";
import Hls from 'hls.js';

interface MovieInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: {
    title: string;
    image: string;
    description: string;
    rating: string;
    duration: string;
    year: string;
    genres?: string[];
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
  };
}

export function MovieInfoModal({ isOpen, onClose, movie }: MovieInfoModalProps) {
  const [previewVideo, setPreviewVideo] = useState<{ videoUrl: string; posterUrl: string } | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const { playMovie } = usePlayer();
  const { toast } = useToast();
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const lastMovieTitleRef = useRef<string>(movie.title);
  const hasInitializedRef = useRef<boolean>(false);
  const [imageError, setImageError] = useState(false);

  // Check if image path is valid (has extension)
  const isValidImagePath = (path: string) => {
    // Check if path is a URL or a valid local path with extension
    return path && (
      path.startsWith('http') || 
      path.match(/\.(jpeg|jpg|gif|png|webp)$/) ||
      path.startsWith('/') // Local path starting with /
    );
  };
  
  // Get a valid image URL or fallback
  const getValidImageUrl = useCallback((imagePath: string) => {
    if (isValidImagePath(imagePath)) {
      return imagePath;
    }
    // Fallback to a default image
    console.warn('Invalid image path:', imagePath);
    return '/first-movie-card.png'; // Default fallback image
  }, []);

  // Initialize HLS
  const initHls = useCallback((videoElement: HTMLVideoElement, src: string) => {
    if (!videoElement || !src) return;
    
    console.log('Initializing HLS for modal preview:', src);
    
    try {
      if (Hls.isSupported()) {
        // Clean up existing HLS instance if any
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
  
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          // Add debug mode to help troubleshoot
          debug: true,
          // Add more aggressive settings for better recovery
          fragLoadingMaxRetry: 5,
          manifestLoadingMaxRetry: 5,
          levelLoadingMaxRetry: 5
        });
  
        hls.attachMedia(videoElement);
        
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          console.log('HLS media attached, loading source:', src);
          hls.loadSource(src);
        });
  
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('HLS manifest parsed, starting playback');
          videoElement.play()
            .then(() => {
              console.log('Video playback started successfully');
              setShowVideo(true);
              setIsLoading(false);
            })
            .catch(err => {
              console.error('Error starting playback:', err);
              // Try muted playback as fallback (for autoplay policies)
              videoElement.muted = true;
              setIsMuted(true);
              videoElement.play()
                .then(() => {
                  console.log('Muted playback started successfully');
                  setShowVideo(true);
                  setIsLoading(false);
                })
                .catch(innerErr => {
                  console.error('Even muted playback failed:', innerErr);
                  setError('Failed to play video. Please try the play button.');
                  setIsLoading(false);
                });
            });
        });
  
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS error event:', event);
          console.error('HLS error data:', data);
          
          if (data.fatal) {
            console.error('Fatal HLS error:', data.type, data.details);
            setError(`Video playback error: ${data.details}`);
            setShowVideo(false);
            setIsLoading(false);
            
            // Try to recover on media and network errors
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR || 
                data.type === Hls.ErrorTypes.MEDIA_ERROR) {
              hls.recoverMediaError();
            }
          }
        });
  
        hlsRef.current = hls;
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        // For Safari which has native HLS support
        console.log('Using native HLS support for Safari');
        videoElement.src = src;
        videoElement.addEventListener('loadedmetadata', () => {
          videoElement.play()
            .then(() => {
              setShowVideo(true);
              setIsLoading(false);
            })
            .catch(err => {
              console.error('Error playing video in Safari:', err);
              setError('Failed to play video');
              setIsLoading(false);
            });
        });
      } else {
        console.error('HLS is not supported in this browser and no native support');
        setError('Your browser does not support HLS video playback');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error in initHls:', error);
      setError('Failed to initialize video player');
      setIsLoading(false);
    }
  }, []);

  // Enhanced fetch preview video function
  const fetchPreviewVideo = useCallback(async () => {
    console.log('Fetching preview video for:', movie.title);
    setIsLoading(true);
    setError(null);
    setShowVideo(false);

    try {
      // Always fetch a fresh video URL to avoid stale cache issues
      const video = await getPreviewVideo(movie.title, { forceRefresh: true });
      console.log('Received preview video:', video);
      
      if (!video?.videoUrl) {
        throw new Error('Invalid video data received');
      }
      
      setPreviewVideo(video);
      setRetryCount(0);
      
      if (videoRef.current) {
        videoRef.current.muted = isMuted;
        initHls(videoRef.current, video.videoUrl);
      }
    } catch (err) {
      console.error('Failed to load preview:', err);
      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        setTimeout(fetchPreviewVideo, 1000);
      } else {
        setError('Unable to load preview. Please try again later.');
      }
    } finally {
      if (!videoRef.current) {
        setIsLoading(false);
      }
    }
  }, [movie.title, retryCount, isMuted, initHls]);

  // Check if movie title changed
  useEffect(() => {
    if (lastMovieTitleRef.current !== movie.title) {
      console.log('Movie title changed, resetting preview state');
      lastMovieTitleRef.current = movie.title;
      setPreviewVideo(null);
      setShowVideo(false);
      setError(null);
      hasInitializedRef.current = false;
    }
  }, [movie.title]);

  // Enhanced modal open/close effect
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isOpen) {
      console.log('Modal opened, initializing preview');
      // Reset state when modal opens to ensure fresh initialization
      setShowVideo(false);
      setError(null);
      
      // Force a new fetch every time the modal opens
      // This is the key fix - we're not relying on cached data anymore
      setPreviewVideo(null);
      hasInitializedRef.current = false;
      
      // Delay fetch slightly to ensure DOM is ready
      timeout = setTimeout(fetchPreviewVideo, 300);
    } else {
      console.log('Modal closed, cleaning up video');
      // When modal closes, clean up completely
      setShowVideo(false);
      
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
      }
      
      // Properly destroy HLS instance
      if (hlsRef.current) {
        hlsRef.current.stopLoad();
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isOpen, fetchPreviewVideo, initHls]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('Modal component unmounting, cleaning up HLS');
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, []);

  // Video element event handlers
  const handleVideoLoaded = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleVideoError = useCallback((e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const videoElement = e.currentTarget;
    console.error('Video error:', videoElement.error);
    setError('Failed to play video');
    setShowVideo(false);
  }, []);

  // Enhanced volume toggle with smoother state management
  const handleVolumeToggle = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (videoRef.current) {
      const newMutedState = !videoRef.current.muted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  }, []);

  const handlePlay = async () => {
    try {
      // Use existing preview video if available
      if (previewVideo) {
        playMovie({
          videoUrl: previewVideo.videoUrl,
          posterUrl: previewVideo.posterUrl || movie.image,
          title: movie.title
        });
        onClose();
        return;
      }
      
      // Otherwise fetch new video
      const video = await getPreviewVideo(movie.title);
      
      playMovie({
        videoUrl: video.videoUrl,
        posterUrl: video.posterUrl || movie.image,
        title: movie.title
      });
      onClose();
    } catch (error) {
      console.error('Failed to play video:', error);
      toast({
        title: "Error",
        description: "Failed to play video. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddToList = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveButton('add');
    setTimeout(() => setActiveButton(null), 1500);
  };

  const handleLike = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveButton('like');
    setTimeout(() => setActiveButton(null), 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-zinc-900 mt-0 top-[3vh] translate-y-0 border-0">
        <DialogTitle className="sr-only">
          {movie.title}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Movie details for {movie.title}
        </DialogDescription>
        
        {/* Close Button */}
        <button
          onClick={() => onClose()}
          className="absolute top-2 right-2 z-50 p-1.5 rounded-full bg-zinc-800/80 hover:bg-zinc-700/80 transition-colors"
        >
          <X className="w-4 h-4 text-white/80" />
        </button>

        <div>
          {/* Preview Section */}
          <div className="relative w-full aspect-[16/9]">
            {/* Static Image */}
            <img
              src={getValidImageUrl(movie.image)}
              alt={`${movie.title} backdrop`}
              className={cn(
                "w-full h-full object-cover transition-opacity duration-700",
                showVideo ? "opacity-0" : "opacity-100",
                imageError ? "opacity-50" : ""
              )}
              onError={(e) => {
                console.error('Image failed to load:', movie.image);
                setImageError(true);
                // Set fallback image
                e.currentTarget.src = '/first-movie-card.png';
              }}
            />

            {/* Video Preview */}
            <div className="absolute inset-0">
              <video
                ref={videoRef}
                className={cn(
                  "w-full h-full object-cover",
                  "transition-opacity duration-1000",
                  showVideo ? "opacity-100" : "opacity-0"
                )}
                muted
                loop
                playsInline
                preload="auto"
                poster={movie.image}
                onLoadedData={handleVideoLoaded}
                onError={handleVideoError}
              />

              {/* Volume Control */}
              {showVideo && !error && (
                <VolumeButton
                  onClick={handleVolumeToggle}
                  isMuted={isMuted}
                  showFeedback={true}
                />
              )}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/80 backdrop-blur-sm">
                <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin mb-2" />
                <p className="text-white text-sm font-medium">
                  {retryCount > 0 ? `Retrying (${retryCount}/${maxRetries})...` : 'Loading preview...'}
                </p>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/80 backdrop-blur-sm">
                <p className="text-white text-sm font-medium text-center px-4 mb-2">{error}</p>
                <button
                  onClick={() => {
                    setRetryCount(0);
                    setError(null);
                    fetchPreviewVideo();
                  }}
                  className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white text-sm transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Preview Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />
            
            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              {/* Title and Action Buttons */}
              <div className="flex flex-col gap-4">
                <h2 className="text-3xl font-bold text-white">{movie.title}</h2>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2 mt-4">
                  <PlayButton onClick={handlePlay} showText={true} />
                  <AddToListButton 
                    onClick={handleAddToList}
                    isActive={activeButton === 'add'}
                    showFeedback={activeButton === 'add'}
                  />
                  <LikeButton
                    onClick={handleLike}
                    isActive={activeButton === 'like'}
                    showFeedback={activeButton === 'like'}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-[2fr,1fr] gap-6">
              {/* Left Column */}
              <div>
                {/* Metadata Row */}
                <div className="flex items-center gap-2 text-sm mb-4">
                  {movie.match && (
                    <span className="text-green-500 font-medium">{movie.match}% Match</span>
                  )}
                  <span className="text-white">{movie.year}</span>
                  <span className="text-white/50">•</span>
                  <span className="text-white">{movie.duration}</span>
                  <span className="text-white/50">•</span>
                  <span className="px-1.5 py-0.5 text-xs font-medium border border-white/30 text-white rounded-sm">
                    {movie.rating}
                  </span>
                </div>

                {/* Description */}
                <p className="text-white/90 text-sm leading-relaxed mb-4">{movie.description}</p>
              </div>

              {/* Right Column */}
              <div className="space-y-4 text-sm">
                {/* Cast */}
                {movie.cast && movie.cast.length > 0 && (
                  <p>
                    <span className="text-white/50">Cast: </span>
                    <span className="text-white">{movie.cast.join(', ')}</span>
                  </p>
                )}
                
                {/* Director */}
                {movie.director && (
                  <p>
                    <span className="text-white/50">Director: </span>
                    <span className="text-white">{movie.director}</span>
                  </p>
                )}

                {/* Genres */}
                {movie.genres && movie.genres.length > 0 && (
                  <div>
                    <span className="text-white/50 block mb-2">Genres: </span>
                    <div className="flex flex-wrap gap-2">
                      {movie.genres.map((genre, index) => (
                        <button
                          key={index}
                          onClick={() => window.location.href = `/genres/${genre.toLowerCase()}`}
                          className={cn(
                            "text-xs text-white/80 px-2 py-1 bg-zinc-800/80 rounded",
                            "hover:bg-zinc-700/80 hover:text-white",
                            "transition-all duration-200",
                            "hover:scale-105",
                            "cursor-pointer",
                            "ring-1 ring-white/10 hover:ring-white/20"
                          )}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* More Like This Section */}
          {movie.similarMovies && movie.similarMovies.length > 0 && (
            <div className="px-6 py-4 border-t border-white/10">
              <h3 className="text-lg font-medium text-white mb-4">More Like This</h3>
              <div className="grid grid-cols-3 gap-4">
                {movie.similarMovies.map((similar, index) => (
                  <div key={index} className="rounded-md overflow-hidden bg-zinc-800/50">
                    <img
                      src={similar.image}
                      alt={similar.title}
                      className="w-full aspect-video object-cover"
                    />
                    <div className="p-3">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-sm font-medium text-white line-clamp-1">{similar.title}</span>
                        {similar.rating && (
                          <span className="text-[10px] text-white/70 px-1.5 py-0.5 border border-white/20 rounded whitespace-nowrap">
                            {similar.rating}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/70 line-clamp-2">{similar.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
