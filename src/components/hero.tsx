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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isForward, setIsForward] = useState(true);
  const transitionTimeoutRef = useRef<NodeJS.Timeout>();
  const { playMovie } = usePlayer();

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

    if (isVideoLoaded && videoAsset) {
      transitionTimeoutRef.current = setTimeout(() => {
        handlePlay();
      }, 3000);
    }

    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [isVideoLoaded, videoAsset]);

  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
    setIsInitialLoading(false);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    const threshold = 0.1; // Smaller threshold for more precise transitions
    
    if (isForward && video.currentTime >= video.duration - threshold) {
      // Reached the end, switch to reverse
      video.playbackRate = -1;
      setIsForward(false);
    } else if (!isForward && video.currentTime <= threshold) {
      // Reached the start, switch to forward
      video.playbackRate = 1;
      setIsForward(true);
    }
  };

  const handlePlay = () => {
    if (!isVideoLoaded || !videoAsset || isTransitioning) return;
    
    setIsTransitioning(true);
    
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.playbackRate = 1;
      setIsForward(true);
      videoRef.current.play()
        .then(() => {
          setShowVideo(true);
          setTimeout(() => {
            setIsTransitioning(false);
          }, 1000);
        })
        .catch(console.error);
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

  return (
    <>
      <div className="relative w-screen h-[80vh] bg-white dark:bg-pantheon-night overflow-hidden">
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
                loop
                poster={videoAsset.fallback}
                className="w-full h-full object-cover"
                onLoadedData={handleVideoLoaded}
                onTimeUpdate={handleTimeUpdate}
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
            <div className="bg-white/30 dark:bg-pantheon-night/30 backdrop-blur-sm p-6 rounded-lg max-w-xl">
              <span className="inline-block bg-gradient-to-r from-[#F09045] via-[#FFB067] to-[#F09045] bg-clip-text text-transparent font-medium text-sm mb-2">Regenerative Lifestyle</span>
              <h1 className="text-4xl md:text-6xl font-bold text-pantheon-night dark:text-white mb-4">Regenerative Lifestyle Media</h1>
              <p className="text-pantheon-night/90 dark:text-white/90 mb-6">
                Creating content that inspires positive change and promotes holistic well-being.
                Our cinematic approach captures the essence of regenerative living through emotional storytelling.
              </p>
              <div className="flex items-center gap-4">
                <button 
                  onClick={handlePlayClick}
                  className="px-6 py-2 bg-gradient-lotus text-white rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-pantheon-pink/20 transition-all border border-white/10"
                  disabled={!isVideoLoaded || !videoAsset || isTransitioning}
                >
                  <Play className="w-5 h-5" />
                  Watch Our Work
                </button>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-2 bg-white/20 dark:bg-white/20 text-pantheon-night dark:text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-white/30 dark:hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/10"
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
