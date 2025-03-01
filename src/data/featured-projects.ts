interface PantheonMedia {
  mediaId: string;
  title: string;
  coverImage: string;
  isPantheonOriginal: boolean;
  description: string;
  rating: string;
  duration: string;
  year: string;
  genres?: string[];
}

export const PANTHEON_HIGHLIGHTS: PantheonMedia = {
  mediaId: "13904fa8-dda5-4e9e-88c4-0d57fa9af6c4",
  title: "Pantheon Highlights",
  coverImage: "/first-movie-card.png",
  isPantheonOriginal: true,
  description: "Journey through Pantheon Media's most compelling stories of impact and transformation. From sacred ceremonies to conscious business leaders, witness how our cinematic lens captures the essence of regenerative living. This showcase features our work with forward-thinking brands who are pioneering a new paradigm where profit meets purpose, and storytelling ignites positive change.",
  rating: "PG-13",
  duration: "23m",
  year: "2024",
  genres: ["Regenerative", "Nature", "Sustainability", "Wellness", "Documentary"]
};

// Featured projects collection
export const FEATURED_PROJECTS: PantheonMedia[] = [PANTHEON_HIGHLIGHTS];

// Export for backward compatibility during transition
export const TRENDING_MOVIES = FEATURED_PROJECTS; 