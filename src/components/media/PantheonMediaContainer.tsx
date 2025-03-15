import { useState, useRef, useEffect } from "react";
import { PantheonCard } from "./PantheonCard";
import { PantheonPreview } from "./PantheonPreview";
import { cn } from "../../lib/utils";
import { MovieInfoModal } from "../ui/movie-info-modal";

// Debug counter for component instances
let containerInstanceCounter = 0;

interface PantheonMediaContainerProps {
  media: {
    mediaId: string;
    title: string;
    coverImage: string;
    isPantheonOriginal: boolean;
    description: string;
    rating: string;
    duration: string;
    year: string;
    genres?: string[];
  };
}

export function PantheonMediaContainer({ media }: PantheonMediaContainerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const instanceIdRef = useRef(`container-${++containerInstanceCounter}`);
  const hoverTimeoutRef = useRef<number | null>(null);
  
  // Log mounting and unmounting
  useEffect(() => {
    const id = instanceIdRef.current;
    console.group(`📦 ${id} MOUNTED - ${media.title}`);
    console.log(`Initial media data:`, media.mediaId);
    
    return () => {
      console.log(`🗑️ ${id} UNMOUNTED - ${media.title}`);
      
      // Clear any lingering timeouts
      if (hoverTimeoutRef.current !== null) {
        window.clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      
      console.groupEnd();
    };
  }, [media.title, media.mediaId]);
  
  // Add debounce to hover state to prevent rapid flickering
  const handleHover = () => {
    const id = instanceIdRef.current;
    console.log(`👆 ${id} handleHover called`);
    
    // Clear any existing timeout
    if (hoverTimeoutRef.current !== null) {
      window.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    // CRITICAL FIX: Set hover state immediately without checking current state
    console.log(`🔄 ${id} Setting hovered state to TRUE immediately`);
    setIsHovered(true);
  };

  const handleClose = () => {
    const id = instanceIdRef.current;
    console.log(`👇 ${id} handleClose called`);
    
    // CRITICAL FIX: Increase delay slightly to prevent premature closing
    if (hoverTimeoutRef.current !== null) {
      window.clearTimeout(hoverTimeoutRef.current);
    }
    
    hoverTimeoutRef.current = window.setTimeout(() => {
      console.log(`🔄 ${id} Setting hovered state to FALSE (after delay)`);
      setIsHovered(false);
      hoverTimeoutRef.current = null;
    }, 100); // Slightly longer delay to prevent accidental closing
  };

  const handleMoreInfo = () => {
    const id = instanceIdRef.current;
    console.log(`ℹ️ ${id} handleMoreInfo called`);
    setIsModalOpen(true);
  };
  
  // Log hover state changes
  useEffect(() => {
    const id = instanceIdRef.current;
    console.log(`👁️ ${id} isHovered changed:`, isHovered ? 'HOVERED' : 'NOT HOVERED');
  }, [isHovered]);

  return (
    <div 
      className={cn(
        "group relative w-[300px] transition duration-200",
        isHovered ? "z-[100]" : ""
      )}
      data-testid="media-container"
      data-hovered={isHovered}
      data-instance-id={instanceIdRef.current}
    >
      <PantheonCard
        mediaId={media.mediaId}
        title={media.title}
        coverImage={media.coverImage}
        isPantheonOriginal={media.isPantheonOriginal}
        onHover={handleHover}
      />
      <PantheonPreview
        mediaId={media.mediaId}
        title={media.title}
        description={media.description}
        rating={media.rating}
        duration={media.duration}
        year={media.year}
        genres={media.genres}
        isVisible={isHovered}
        onClose={handleClose}
        coverImage={media.coverImage}
        onMoreInfo={handleMoreInfo}
      />
      
      {/* Movie Info Modal */}
      <MovieInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movie={{
          title: media.title,
          image: media.coverImage,
          description: media.description,
          rating: media.rating,
          duration: media.duration,
          year: media.year,
          genres: media.genres
        }}
      />
    </div>
  );
} 