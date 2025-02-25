export interface Movie {
  id: string;
  title: string;
  image: string;
  description: string;
  rating: string;
  duration: string;
  year: string;
  type: 'movie' | 'series';
  genres: string[];
  
  // Discovery metadata
  isPrismOriginal?: boolean;
  match?: number;
  
  // Rich metadata
  director?: string;
  cast?: string[];
  
  // Technical details
  videoSources: {
    preview?: string;
    main: string;
    trailers?: string[];
  };
}

// Helper type for content filtering
export type ContentFilter = {
  genres?: string[];
  year?: string | [string, string];  // Single year or range
  rating?: string[];
  duration?: {
    min?: number;
    max?: number;
  };
  type?: 'movie' | 'series';
};

// Type for AI recommendation parameters
export type RecommendationParams = {
  preferredGenres?: string[];
  duration?: 'short' | 'medium' | 'long';
  contentType?: 'movie' | 'series';
  similarTo?: string[];      // IDs of content user liked
  excludeWatched?: boolean;
};

// Utility type for search results
export type SearchResult = {
  movie: Movie;
  relevanceScore: number;    // How well it matches search
  matchedFields: string[];   // Which fields matched
}; 