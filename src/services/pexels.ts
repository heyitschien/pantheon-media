// Public client-side API key for Pexels
const PEXELS_API_KEY = 'J3aSmBAfyTEeyZ9vwrlHa8JUMFTvMsRtQEaLBHEV9moXuKWDHDyaGmDB';

// Specific video mappings for nature and regenerative themes
const SPECIFIC_VIDEO_MAPPINGS: Record<string, number> = {
  'Pantheon': 1550080, // Forest waterfall
  'Horizon': 5383547, // Sustainable farming
  'Regenerative': 3571264, // Blooming flowers
  'Nature': 3571264, // Blooming flowers
  'Sustainable': 5383547, // Sustainable farming
  'Wellness': 3094026, // Yoga by the ocean
};

interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  duration: number;
  video_files: Array<{
    id: number;
    quality: string;
    file_type: string;
    width: number;
    height: number;
    link: string;
  }>;
  image: string;
}

interface PexelsSearchResponse {
  total_results: number;
  page: number;
  per_page: number;
  videos: PexelsVideo[];
}

interface GetPreviewVideoOptions {
  maxDuration?: number;
  minDuration?: number;
  orientation?: 'landscape' | 'portrait';
}

// Simple in-memory cache
const cache = new Map<string, { videoUrl: string; posterUrl: string; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function getPreviewVideo(
  query: string,
  options: GetPreviewVideoOptions = {}
): Promise<{ videoUrl: string; posterUrl: string }> {
  // Check if we have a specific video mapping for this title
  const movieTitle = query.split(' ')[0]; // Get first word of query (usually the title)
  const specificVideoId = SPECIFIC_VIDEO_MAPPINGS[movieTitle];

  if (specificVideoId) {
    try {
      const response = await fetch(
        `https://api.pexels.com/videos/videos/${specificVideoId}`,
        {
          headers: {
            Authorization: PEXELS_API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch specific video');
      }

      const video: PexelsVideo = await response.json();
      const videoFile = video.video_files
        .filter(file => file.width <= 1280) // Limit max resolution
        .sort((a, b) => b.width - a.width)[0];

      if (!videoFile) {
        throw new Error('No suitable video quality found');
      }

      return {
        videoUrl: videoFile.link,
        posterUrl: video.image,
      };
    } catch (error) {
      console.error('Error fetching specific video:', error);
      // Fall through to regular search if specific video fails
    }
  }

  const cacheKey = JSON.stringify({ query, options });
  const cached = cache.get(cacheKey);

  // Return cached result if valid
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return {
      videoUrl: cached.videoUrl,
      posterUrl: cached.posterUrl,
    };
  }

  // Construct search URL with query parameters
  const searchParams = new URLSearchParams({
    query,
    per_page: '10',
    orientation: options.orientation || 'landscape',
  });

  const response = await fetch(
    `https://api.pexels.com/videos/search?${searchParams.toString()}`,
    {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch video from Pexels');
  }

  const data: PexelsSearchResponse = await response.json();

  // Filter videos based on duration
  const filteredVideos = data.videos.filter((video) => {
    if (options.maxDuration && video.duration > options.maxDuration) return false;
    if (options.minDuration && video.duration < options.minDuration) return false;
    return true;
  });

  if (filteredVideos.length === 0) {
    throw new Error('No suitable videos found');
  }

  // Get the first video and its best quality version
  const video = filteredVideos[0];
  const videoFile = video.video_files
    .filter((file) => file.width <= 1280) // Limit max resolution
    .sort((a, b) => b.width - a.width)[0];

  if (!videoFile) {
    throw new Error('No suitable video quality found');
  }

  const result = {
    videoUrl: videoFile.link,
    posterUrl: video.image,
  };

  // Cache the result
  cache.set(cacheKey, {
    ...result,
    timestamp: Date.now(),
  });

  return result;
}

export const getSpaceVideo = async (): Promise<{ videoUrl: string; posterUrl: string }> => {
  try {
    // Fetch specific nature video by ID - lush forest with sunlight
    const response = await fetch(
      'https://api.pexels.com/videos/videos/3571264',
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch video');
    }

    const video: PexelsVideo = await response.json();

    // Get the highest quality video file
    const videoFile = video.video_files
      .filter(file => file.file_type === 'video/mp4')
      .sort((a, b) => b.height - a.height)[0];

    return {
      videoUrl: videoFile.link,
      posterUrl: video.image,
    };
  } catch (error) {
    console.error('Error fetching Pexels video:', error);
    // Fallback to our default video if API fails
    return {
      videoUrl: 'https://player.vimeo.com/progressive_redirect/playback/692355317/rendition/720p/file.mp4?loc=external&signature=d2a8c77c7c72d2c5a5662a7b5535a0c88dd544be2887e2c0922ce4f3c6d0dca0',
      posterUrl: 'https://images.pexels.com/videos/3571264/free-video-3571264.jpg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200'
    };
  }
}; 