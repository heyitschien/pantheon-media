import { Movie } from '../types/movie';

export const PANTHEON_HIGHLIGHTS: Movie = {
  id: "13904fa8-dda5-4e9e-88c4-0d57fa9af6c4",
  title: "Pantheon Highlights",
  image: "/first-movie-card.png",
  description: "Journey through Pantheon Media's most compelling stories of impact and transformation. From sacred ceremonies to conscious business leaders, witness how our cinematic lens captures the essence of regenerative living. This showcase features our work with forward-thinking brands who are pioneering a new paradigm where profit meets purpose, and storytelling ignites positive change.",
  rating: "PG-13",
  duration: "23m",
  year: "2024",
  type: "movie",
  genres: ["Regenerative", "Nature", "Sustainability", "Wellness", "Documentary"],
  
  // Discovery metadata
  isPrismOriginal: true,
  match: 98,
  
  // Rich metadata
  director: "Pantheon Creative Team",
  cast: ["Sarah Zhang", "Michael Reeves", "Aisha Patel", "David Okonjo"],
  tags: ["Impact Brands", "Conscious Business", "Visually Stunning", "Regenerative Living"],
  
  // Media
  videos: {
    main: "/videos/pantheon-highlights/main.mp4",
    trailers: ["/videos/pantheon-highlights/trailer-1.mp4"]
  },
  
  // Related
  similarMovies: []
};

// Only keep the collection we're currently using in the UI
export const TRENDING_MOVIES: Movie[] = [PANTHEON_HIGHLIGHTS];
