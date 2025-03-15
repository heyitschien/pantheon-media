import { ChevronLeft, ChevronRight } from "lucide-react";
import { PantheonMediaContainer } from "./media/PantheonMediaContainer";
import { useState, useRef } from "react";

interface FeaturedProjectsRowProps {
  title: string;
  movies: Array<{
    mediaId: string;
    title: string;
    coverImage: string;
    isPantheonOriginal: boolean;
    description: string;
    rating: string;
    duration: string;
    year: string;
    genres?: string[];
  }>;
}

export function FeaturedProjectsRow({ title, movies }: FeaturedProjectsRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = rowRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;

      rowRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });

      setTimeout(() => {
        if (rowRef.current) {
          setShowLeftArrow(rowRef.current.scrollLeft > 0);
          setShowRightArrow(
            rowRef.current.scrollLeft + rowRef.current.clientWidth <
              rowRef.current.scrollWidth
          );
        }
      }, 300);
    }
  };

  return (
    <div className="relative group/row pt-1 pb-2 overflow-visible">
      <h2 className="text-xl text-white font-semibold mb-2 px-12 sm:px-14 lg:px-16">
        {title}
      </h2>
      <div className="relative overflow-visible">
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-0 z-40 w-12 bg-black/50 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
        )}
        <div
          ref={rowRef}
          className="flex gap-2 overflow-visible"
          style={{ 
            scrollbarWidth: "none", 
            msOverflowStyle: "none",
            paddingTop: "10px",
            paddingBottom: "10px",
            marginTop: "-10px",
            marginBottom: "-10px",
          }}
        >
          <div className="pl-12 sm:pl-14 lg:pl-16 flex gap-1 overflow-visible">
            {movies.map((movie, index) => (
              <div 
                key={movie.mediaId || index} 
                className="flex-none relative group/card overflow-visible"
              >
                <PantheonMediaContainer media={movie} />
              </div>
            ))}
          </div>
        </div>
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-0 z-40 w-12 bg-black/50 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        )}
      </div>
    </div>
  );
} 