import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { getPreviewVideo } from "@/services/bunny-stream";
import { Play, Eye, Heart, Info, ChevronDown } from "lucide-react";
import { PlayButton, MovieControlButton, InfoButton } from "../ui/movie-controls";
import Hls from 'hls.js';
import { usePlayer } from "@/contexts/PlayerContext";

// Global counter to track active HLS instances to avoid too many connections
let activeHlsInstances = 0;
const MAX_CONCURRENT_HLS = 2; // Maximum concurrent HLS instances to prevent browser connection limits

// Debug counter to track component lifecycle across renders
let debugInstanceCounter = 0;

interface PantheonPreviewProps {
  mediaId: string;
  title: string;
  description: string;
  rating: string;
  duration: string;
  year: string;
  genres?: string[];
  isVisible: boolean;
  onClose: () => void;
  coverImage: string;
  onMoreInfo?: () => void;
}

export function PantheonPreview({
  mediaId,
  title,
  description,
  rating,
  duration,
  year,
  genres = [],
  isVisible,
  onClose,
  coverImage,
  onMoreInfo,
}: PantheonPreviewProps) {
  const [previewVideo, setPreviewVideo] = useState<{ videoUrl: string; posterUrl: string } | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const { playMovie } = usePlayer();
  const loadAttemptedRef = useRef(false); // Track if we've already attempted to load
  
  // Create instance ID for this component for tracking in logs
  const instanceIdRef = useRef(`preview-${++debugInstanceCounter}`);
  
  // Add a console group at component mount for better log organization
  useEffect(() => {
    const id = instanceIdRef.current;
    console.group(`🎬 ${id} MOUNTED - ${title} (${mediaId})`);
    console.log(`Initial isVisible:`, isVisible);
    
    return () => {
      console.log(`🗑️ ${id} UNMOUNTED - ${title}`);
      console.groupEnd();
    };
  }, [title, mediaId]);
  
  // Log visibility changes
  useEffect(() => {
    const id = instanceIdRef.current;
    console.log(`👁️ ${id} visibility changed:`, isVisible ? 'VISIBLE' : 'HIDDEN');
  }, [isVisible]);
  
  // Clean up HLS resources completely
  const cleanupHls = () => {
    const id = instanceIdRef.current;
    if (hlsRef.current) {
      try {
        console.log(`🧹 ${id} Destroying HLS instance (${activeHlsInstances} active)`);
        hlsRef.current.stopLoad();
        hlsRef.current.detachMedia();
        hlsRef.current.destroy();
        activeHlsInstances = Math.max(0, activeHlsInstances - 1);
        console.log(`✅ ${id} HLS destroyed, now ${activeHlsInstances} active`);
      } catch (err) {
        console.error(`❌ ${id} Error cleaning up HLS:`, err);
      } finally {
        hlsRef.current = null;
      }
    } else {
      console.log(`ℹ️ ${id} No HLS instance to clean up`);
    }
    
    // Also clean up the video element
    if (videoRef.current) {
      try {
        console.log(`🧹 ${id} Cleaning up video element`);
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
      } catch (err) {
        console.error(`❌ ${id} Error cleaning up video element:`, err);
      }
    }
  };

  // Initialize HLS with better resource management
  const initHls = async (videoElement: HTMLVideoElement, src: string) => {
    const id = instanceIdRef.current;
    if (!videoElement || !src) {
      console.error(`❌ ${id} Invalid video element or source for HLS`);
      return;
    }
    
    console.log(`🚀 ${id} Initializing HLS with src:`, src.substring(0, 50) + '...');
    
    // Clean up any existing HLS instance first
    cleanupHls();
    
    // Check if we can create a new instance
    if (activeHlsInstances >= MAX_CONCURRENT_HLS) {
      console.warn(`❌ ${id} Too many active HLS instances (${activeHlsInstances}/${MAX_CONCURRENT_HLS})`);
      setError('Too many video previews open');
      return;
    }
    
    try {
      if (Hls.isSupported()) {
        console.log(`✅ ${id} HLS is supported in this browser`);
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          fragLoadingMaxRetry: 2,
          manifestLoadingMaxRetry: 2,
          levelLoadingMaxRetry: 2
        });
        
        // Track the instance
        hlsRef.current = hls;
        activeHlsInstances++;
        console.log(`➕ ${id} Created new HLS instance, now ${activeHlsInstances} active`);
        
        // Set up error handling
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error(`❌ ${id} HLS error:`, data.type, data.details);
          
          if (data.fatal) {
            console.error(`🔥 ${id} Fatal HLS error`, data);
            setError('Failed to load preview');
            setShowVideo(false);
            cleanupHls();
          }
        });
        
        // Track all HLS events for debugging
        const hlsEvents = Object.values(Hls.Events);
        hlsEvents.forEach(event => {
          hls.on(event, (name, data) => {
            if (event !== Hls.Events.FRAG_LOADING && 
                event !== Hls.Events.FRAG_LOADED && 
                event !== Hls.Events.FRAG_PARSING_USERDATA) {
              console.log(`🔄 ${id} HLS Event:`, event);
            }
          });
        });
        
        // Attach media first
        console.log(`🔄 ${id} Attaching media element to HLS`);
        hls.attachMedia(videoElement);
        
        // Then load source when media is attached
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          console.log(`✅ ${id} HLS media attached, loading source`);
          hls.loadSource(src);
        });
        
        // Handle manifest parsing for playback
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log(`✅ ${id} HLS manifest parsed, attempting playback`);
          
          // Check if still visible
          if (!isVisible) {
            console.log(`⚠️ ${id} Component no longer visible, aborting playback`);
            return;
          }
          
          console.log(`▶️ ${id} Starting video playback`);
          videoElement.play()
            .then(() => {
              console.log(`✅ ${id} Video playback started successfully`);
              setShowVideo(true);
              setIsLoading(false);
            })
            .catch(err => {
              console.error(`❌ ${id} Error playing video:`, err);
              setError('Failed to play video');
              setIsLoading(false);
            });
        });
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        console.log(`ℹ️ ${id} Using native HLS support for Safari`);
        videoElement.src = src;
        videoElement.addEventListener('loadedmetadata', () => {
          console.log(`✅ ${id} Video metadata loaded in Safari, starting playback`);
          videoElement.play()
            .then(() => {
              console.log(`✅ ${id} Safari video playback started`);
              setShowVideo(true);
              setIsLoading(false);
            })
            .catch(err => {
              console.error(`❌ ${id} Error playing video in Safari:`, err);
              setError('Failed to play video');
              setIsLoading(false);
            });
        });
      } else {
        console.error(`❌ ${id} HLS is not supported in this browser`);
        setError('Your browser does not support HLS video');
        setIsLoading(false);
      }
    } catch (error) {
      console.error(`🔥 ${id} HLS initialization error:`, error);
      setError('Failed to initialize video');
      setIsLoading(false);
      cleanupHls();
    }
  };
  
  // Reset state when visibility changes
  useEffect(() => {
    const id = instanceIdRef.current;
    
    // When becoming visible
    if (isVisible) {
      console.log(`👀 ${id} Component now VISIBLE, loadAttempted:`, loadAttemptedRef.current);
      
      // CRITICAL FIX: Always reset loadAttemptedRef when visibility changes
      // This ensures we always try to load the preview every time we hover
      loadAttemptedRef.current = false;
      
      // Reset state variables
      setError(null);
      
      // Only attempt to load if we haven't tried yet
      if (!loadAttemptedRef.current) {
        console.log(`🔄 ${id} First time visible, attempting to load preview`);
        loadAttemptedRef.current = true;
        
        // First clean up any existing resources
        cleanupHls();
        
        setIsLoading(true);
        setShowVideo(false); // Ensure we show the image while loading
        console.log(`⏳ ${id} Starting load with timeout`);
        
        // Use a promise with a timeout to prevent hanging
        const loadPromise = new Promise<void>(async (resolve, reject) => {
          try {
            console.log(`🔄 ${id} Fetching preview video for:`, mediaId);
            // CRITICAL FIX: Always force refresh to get fresh data
            const video = await getPreviewVideo(mediaId, { forceRefresh: true });
            
            if (!isVisible) {
              console.log(`⚠️ ${id} Component no longer visible during fetch, aborting`);
              return resolve();
            }
            
            console.log(`✅ ${id} Received video data:`, !!video);
            
            if (!video?.videoUrl) {
              console.error(`❌ ${id} Invalid video data received`);
              throw new Error('Invalid video data');
            }
            
            console.log(`💾 ${id} Setting preview video state, URL:`, video.videoUrl.substring(0, 50) + '...');
            setPreviewVideo(video);
            
            if (videoRef.current) {
              console.log(`🎬 ${id} videoRef exists, initializing HLS`);
              await initHls(videoRef.current, video.videoUrl);
            } else {
              console.error(`❌ ${id} videoRef is null, cannot initialize HLS`);
            }
            
            resolve();
          } catch (error) {
            console.error(`🔥 ${id} Preview load failed:`, error);
            setError('Unable to load preview');
            setIsLoading(false);
            reject(error);
          }
        });
        
        // Set a timeout to avoid hanging in loading state
        const timeoutPromise = new Promise<void>((_, reject) => {
          setTimeout(() => {
            console.warn(`⏱️ ${id} Preview loading timed out after 8 seconds`);
            reject(new Error('Loading preview timed out'));
          }, 8000);
        });
        
        // Race the loading promise against the timeout
        Promise.race([loadPromise, timeoutPromise])
          .catch(error => {
            console.error(`❌ ${id} Preview loading error:`, error);
            setError('Preview loading timed out');
            setIsLoading(false);
          });
      } else {
        console.log(`⏭️ ${id} Load already attempted, skipping`);
      }
    } else {
      // When becoming invisible
      console.log(`🙈 ${id} Component now HIDDEN, cleaning up`);
      setShowVideo(false);
      // CRITICAL FIX: Always reset loadAttempted when invisible
      loadAttemptedRef.current = false;
      cleanupHls();
    }
    
    // Cleanup when component unmounts or visibility changes
    return () => {
      console.log(`🧹 ${id} Cleanup from visibility effect`);
      // CRITICAL FIX: Always clean up and reset state on cleanup
      loadAttemptedRef.current = false;
      cleanupHls();
    };
  }, [isVisible, mediaId]);

  // Handle play button click
  const handlePlay = async () => {
    try {
      // Prioritize using the already loaded preview video
      if (previewVideo && previewVideo.videoUrl) {
        playMovie({
          videoUrl: previewVideo.videoUrl,
          posterUrl: previewVideo.posterUrl || coverImage,
          title: title
        });
      } else {
        // Fallback to fetching a fresh URL
        const video = await getPreviewVideo(mediaId, { forceRefresh: true });
        if (!video?.videoUrl) throw new Error('Invalid video data');
        
        playMovie({
          videoUrl: video.videoUrl,
          posterUrl: video.posterUrl || coverImage,
          title: title
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Failed to play video:', error);
      setError('Failed to play video');
    }
  };

  // Handle more info button click
  const handleMoreInfo = () => {
    if (onMoreInfo) {
      onMoreInfo();
      onClose(); // Close the preview when opening the modal
    }
  };

  return (
    <div
      data-testid="preview-container"
      data-media-id={mediaId}
      role="dialog"
      aria-label={`Preview: ${title}`}
      tabIndex={0}
      className={cn(
        "absolute top-0 left-0 w-[360px] -translate-y-[32px] -translate-x-[30px] transition-all duration-300",
        "opacity-0 invisible scale-95 group-hover:opacity-100 group-hover:visible group-hover:scale-100",
        "origin-center transform-gpu z-[100]"
      )}
      onMouseLeave={onClose}
    >
      <div className="rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black/90 backdrop-blur-sm">
        {/* Preview Section */}
        <div className="relative aspect-video">
          <div className="relative w-full h-[216px]">
            <img
              alt={`${title} preview`}
              src={coverImage}
              className={cn(
                "w-full h-full object-cover transition-opacity duration-500 brightness-110",
                showVideo ? "opacity-0" : "opacity-100"
              )}
              data-testid="preview-poster"
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
                poster={coverImage}
                data-testid="preview-video"
              />
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black/50"
              data-testid="loading-indicator"
              role="progressbar"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black/50"
              data-testid="error-message"
            >
              <p className="text-white text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="p-4" data-testid="preview-info">
          {/* Control Buttons Section - Moved here */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                className="flex items-center justify-center w-11 h-11 rounded-full bg-white hover:bg-white/90 transition-colors"
                aria-label="Play"
                data-testid="play-button"
                onClick={handlePlay}
              >
                <Play className="w-6 h-6 text-black" />
              </button>
            </div>
            <button
              className="flex items-center justify-center w-11 h-11 rounded-full bg-zinc-800/80 hover:bg-zinc-800 border border-white/20 transition-colors"
              aria-label="More Info"
              data-testid="more-info-button"
              onClick={handleMoreInfo}
            >
              <ChevronDown className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="flex items-center gap-1 text-[15px]">
            <span className="text-white/80">{year}</span>
            <span className="text-white/80 mx-1.5">•</span>
            <span className="text-white/80">{duration}</span>
            <span className="text-white/80 mx-1.5">•</span>
            <span className="border border-white/50 bg-[#2a2a2a] px-2 py-0.5 text-[13px] text-white/95 rounded">
              {rating}
            </span>
          </div>
          {/* Genre Tags */}
          <div className="flex flex-wrap gap-2 mt-3" data-testid="genre-tags">
            {genres.map((genre) => (
              <span
                key={genre}
                className="text-xs text-white/90 px-2 py-1 bg-zinc-800/70 rounded"
                data-testid={`genre-tag-${genre.toLowerCase()}`}
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 