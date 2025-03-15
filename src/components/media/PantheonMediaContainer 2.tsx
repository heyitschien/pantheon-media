import { useState } from "react";
import { PantheonCard } from "./PantheonCard";
import { PantheonPreview } from "./PantheonPreview";
import { cn } from "../../lib/utils";

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

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleClose = () => {
    setIsHovered(false);
  };

  return (
    <div 
      className={cn(
        "group relative w-[300px] transition duration-200",
        isHovered ? "z-[100]" : ""
      )}
      data-testid="media-container"
      data-hovered={isHovered}
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
      />
    </div>
  );
} 