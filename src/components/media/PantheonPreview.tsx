import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { getPreviewVideo } from "@/services/bunny-stream";
import { Play, Eye, Heart, Info } from "lucide-react";
import { PlayButton, MovieControlButton, InfoButton } from "../ui/movie-controls";
import Hls from 'hls.js';

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
}: PantheonPreviewProps) {
  const [previewVideo, setPreviewVideo] = useState<{ videoUrl: string; posterUrl: string } | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Initialize HLS
  const initHls = async (videoElement: HTMLVideoElement, src: string) => {
    if (!videoElement || !src) return;

    try {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            console.error('HLS error:', data);
            setError('Failed to load preview');
            setShowVideo(false);
          }
        });

        hls.attachMedia(videoElement);
        hls.loadSource(src);
        hlsRef.current = hls;

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoElement.play()
            .then(() => {
              setShowVideo(true);
              setIsLoading(false);
            })
            .catch(console.error);
        });
      }
    } catch (error) {
      console.error('HLS initialization error:', error);
      setError('Failed to initialize video');
    }
  };

  // Load preview when visible
  useEffect(() => {
    if (!isVisible) {
      setShowVideo(false);
      setError(null);
      return;
    }

    const loadPreview = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const video = await getPreviewVideo(mediaId);
        if (!video?.videoUrl) throw new Error('Invalid video data');
        
        setPreviewVideo(video);
        if (videoRef.current) {
          await initHls(videoRef.current, video.videoUrl);
        }
      } catch (error) {
        console.error('Preview load failed:', error);
        setError('Unable to load preview');
      } finally {
        setIsLoading(false);
      }
    };

    loadPreview();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [isVisible, mediaId]);

  return (
    <div
      data-testid="preview-container"
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
              src={previewVideo?.posterUrl}
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
                poster={previewVideo?.posterUrl}
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