import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";

// Debug counter for component instances
let cardInstanceCounter = 0;

interface PantheonCardProps {
  mediaId: string;
  title: string;
  coverImage: string;
  isPantheonOriginal: boolean;
  onHover: () => void;
}

export function PantheonCard({
  mediaId,
  title,
  coverImage,
  isPantheonOriginal,
  onHover,
}: PantheonCardProps) {
  const instanceIdRef = useRef(`card-${++cardInstanceCounter}`);
  
  // Debug logging
  useEffect(() => {
    const id = instanceIdRef.current;
    console.log(`🃏 ${id} MOUNTED - ${title}`);
    
    return () => {
      console.log(`🗑️ ${id} UNMOUNTED - ${title}`);
    };
  }, [title]);

  // Track mouse events
  const handleMouseEnter = (e: React.MouseEvent) => {
    const id = instanceIdRef.current;
    console.log(`🖱️ ${id} mouseEnter event triggered`, e.type);
    onHover();
  };

  return (
    <div 
      className="w-full rounded-lg group-hover:opacity-0 group-hover:invisible transition duration-200"
      onMouseEnter={handleMouseEnter}
      data-testid="pantheon-card"
      data-media-id={mediaId}
      data-instance-id={instanceIdRef.current}
    >
      <div className="relative h-[176px] rounded-lg overflow-hidden">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover rounded-lg brightness-110"
          data-testid="card-image"
        />
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"
          data-testid="gradient-overlay"
        >
          <div 
            className="absolute bottom-0 p-3 w-full"
            data-testid="title-container"
          >
            <h3 className="text-white font-bold text-lg line-clamp-1">{title}</h3>
          </div>
        </div>
        {/* Pantheon Badge */}
        {isPantheonOriginal && (
          <div 
            className="absolute top-3 left-3"
            data-testid="pantheon-badge"
          >
            <div className="bg-gradient-to-r from-pantheon-purple via-pantheon-pink to-pantheon-purple px-2 py-1 text-xs font-bold rounded-md text-white shadow-lg shadow-pantheon-purple/20 backdrop-blur-sm">
              P
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 