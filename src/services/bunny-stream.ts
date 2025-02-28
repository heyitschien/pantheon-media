// Bunny.net Stream configuration
const BUNNY_CONFIG = {
  libraryId: '390283',
  cdnHostname: 'vz-1a354919-87f.b-cdn.net',
  baseUrl: 'https://iframe.mediadelivery.net',
  apiBaseUrl: 'https://video.bunnycdn.com/library',
  apiKey: '6ce7a827-49db-45d9-9737f0c957fc-256d-4dcd'
};

interface BunnyVideoAsset {
  id: string;
  title: string;
  videoUrl: string;
  posterUrl: string;
  duration: number;
  qualities: {
    [key: string]: string;
  };
  thumbnailUrl: string;
  guid?: string;
  dateCreated?: string;
}

interface GetPreviewVideoOptions {
  maxDuration?: number;
  minDuration?: number;
  orientation?: 'landscape' | 'portrait';
}

// Simple in-memory cache
const cache = new Map<string, { videoUrl: string; posterUrl: string; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

// Helper function to generate video URLs
function generateVideoUrls(videoId: string) {
  return {
    // Direct CDN URL for better performance
    videoUrl: `https://${BUNNY_CONFIG.cdnHostname}/${videoId}/playlist.m3u8`,
    // Specific quality streams
    qualities: {
      '1080p': `https://${BUNNY_CONFIG.cdnHostname}/${videoId}/playlist_1080p.m3u8`,
      '720p': `https://${BUNNY_CONFIG.cdnHostname}/${videoId}/playlist_720p.m3u8`,
      '480p': `https://${BUNNY_CONFIG.cdnHostname}/${videoId}/playlist_480p.m3u8`,
      '360p': `https://${BUNNY_CONFIG.cdnHostname}/${videoId}/playlist_360p.m3u8`
    },
    // Thumbnail and preview URLs
    posterUrl: `https://${BUNNY_CONFIG.cdnHostname}/${videoId}/thumbnail.jpg`,
    thumbnailUrl: `https://${BUNNY_CONFIG.cdnHostname}/${videoId}/thumbnail.jpg`,
    previewUrl: `https://${BUNNY_CONFIG.cdnHostname}/${videoId}/preview.webp`,
    // iframe embed URL (fallback)
    embedUrl: `${BUNNY_CONFIG.baseUrl}/embed/${BUNNY_CONFIG.libraryId}/${videoId}`
  };
}

// Video assets mapping - we'll expand this as we add more videos
const VIDEO_ASSETS: Record<string, BunnyVideoAsset> = {
  'pantheon-highlight': {
    id: '13904fa8-dda5-4e9e-88c4-0d57fa9af6c4',
    title: 'Pantheon Highlight',
    duration: 113, // 1:53 in seconds
    qualities: {
      '720p': 'https://vz-1a354919-87f.b-cdn.net/13904fa8-dda5-4e9e-88c4-0d57fa9af6c4/playlist_720p.m3u8',
      '480p': 'https://vz-1a354919-87f.b-cdn.net/13904fa8-dda5-4e9e-88c4-0d57fa9af6c4/playlist_480p.m3u8',
      '360p': 'https://vz-1a354919-87f.b-cdn.net/13904fa8-dda5-4e9e-88c4-0d57fa9af6c4/playlist_360p.m3u8'
    },
    ...generateVideoUrls('13904fa8-dda5-4e9e-88c4-0d57fa9af6c4'),
    thumbnailUrl: `https://${BUNNY_CONFIG.cdnHostname}/13904fa8-dda5-4e9e-88c4-0d57fa9af6c4/thumbnail.jpg`
  }
};

// API Functions
export async function fetchVideoList(): Promise<BunnyVideoAsset[]> {
  try {
    const response = await fetch(`${BUNNY_CONFIG.apiBaseUrl}/${BUNNY_CONFIG.libraryId}/videos`, {
      headers: {
        'Accept': 'application/json',
        'AccessKey': BUNNY_CONFIG.apiKey
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch video list');
    }

    const videos = await response.json();
    return videos.map((video: any) => ({
      id: video.guid,
      title: video.title,
      duration: video.length,
      ...generateVideoUrls(video.guid),
      guid: video.guid,
      dateCreated: video.dateCreated,
      thumbnailUrl: `https://${BUNNY_CONFIG.cdnHostname}/${video.guid}/thumbnail.jpg`
    }));
  } catch (error) {
    console.error('Error fetching video list:', error);
    throw error;
  }
}

export async function getPreviewVideo(
  videoId: string,
  options: GetPreviewVideoOptions = {}
): Promise<{ videoUrl: string; posterUrl: string }> {
  try {
    console.log('getPreviewVideo called with ID:', videoId);
    
    // Check cache first
    const cacheKey = videoId;
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Using cached preview for video:', videoId);
      return {
        videoUrl: cached.videoUrl,
        posterUrl: cached.posterUrl,
      };
    }

    // Try to get video details from API
    console.log('Fetching video details from Bunny.net API for ID:', videoId);
    const response = await fetch(`${BUNNY_CONFIG.apiBaseUrl}/${BUNNY_CONFIG.libraryId}/videos/${videoId}`, {
      headers: {
        'Accept': 'application/json',
        'AccessKey': BUNNY_CONFIG.apiKey
      }
    });

    if (!response.ok) {
      console.error('API response not OK:', response.status, response.statusText);
      throw new Error('Failed to fetch video details');
    }

    const videoDetails = await response.json();
    console.log('Video details received from API:', videoDetails);
    
    const urls = generateVideoUrls(videoDetails.guid);
    console.log('Generated URLs:', urls);
    
    const result = {
      videoUrl: urls.videoUrl,
      posterUrl: urls.posterUrl,
    };

    // Cache the result
    cache.set(cacheKey, {
      ...result,
      timestamp: Date.now(),
    });

    console.log('Returning preview video result:', result);
    return result;
  } catch (error) {
    console.error('Error in getPreviewVideo:', error);
    
    // Fallback to static asset if API fails or video ID not found
    console.log('Using fallback video asset');
    const asset = VIDEO_ASSETS['pantheon-highlight'];
    if (!asset) {
      throw new Error('Preview video asset not found');
    }

    return {
      videoUrl: asset.videoUrl,
      posterUrl: asset.posterUrl,
    };
  }
}

// Helper function to get hero video
export const getHeroVideo = async (): Promise<{ videoUrl: string; posterUrl: string }> => {
  try {
    // Get video details from API first
    const response = await fetch(`${BUNNY_CONFIG.apiBaseUrl}/${BUNNY_CONFIG.libraryId}/videos/13904fa8-dda5-4e9e-88c4-0d57fa9af6c4`, {
      headers: {
        'Accept': 'application/json',
        'AccessKey': BUNNY_CONFIG.apiKey
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch video details');
    }

    const videoDetails = await response.json();
    console.log('Video details:', videoDetails); // Debug log

    const urls = generateVideoUrls(videoDetails.guid);
    return {
      videoUrl: urls.videoUrl,
      posterUrl: urls.posterUrl,
    };
  } catch (error) {
    console.error('Error fetching Bunny Stream video:', error);
    
    // Fallback to static asset if API fails
    const asset = VIDEO_ASSETS['pantheon-highlight'];
    if (!asset) {
      throw new Error('Hero video asset not found');
    }

    return {
      videoUrl: asset.videoUrl,
      posterUrl: asset.posterUrl,
    };
  }
};

// Add function to upload video
export async function uploadVideo(file: File, title: string): Promise<string> {
  try {
    // 1. Create the video object first
    const createResponse = await fetch(`${BUNNY_CONFIG.apiBaseUrl}/${BUNNY_CONFIG.libraryId}/videos`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'AccessKey': BUNNY_CONFIG.apiKey
      },
      body: JSON.stringify({ title })
    });

    if (!createResponse.ok) {
      throw new Error('Failed to create video');
    }

    const { guid } = await createResponse.json();

    // 2. Upload the actual video file
    const uploadResponse = await fetch(`${BUNNY_CONFIG.apiBaseUrl}/${BUNNY_CONFIG.libraryId}/videos/${guid}`, {
      method: 'PUT',
      headers: {
        'AccessKey': BUNNY_CONFIG.apiKey
      },
      body: file
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload video');
    }

    return guid;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
}

// Add function to delete video
export async function deleteVideo(videoId: string): Promise<void> {
  try {
    const response = await fetch(`${BUNNY_CONFIG.apiBaseUrl}/${BUNNY_CONFIG.libraryId}/videos/${videoId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'AccessKey': BUNNY_CONFIG.apiKey
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete video');
    }
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
}

// Add function to get video details
export async function getVideoDetails(videoId: string): Promise<BunnyVideoAsset> {
  try {
    const response = await fetch(`${BUNNY_CONFIG.apiBaseUrl}/${BUNNY_CONFIG.libraryId}/videos/${videoId}`, {
      headers: {
        'Accept': 'application/json',
        'AccessKey': BUNNY_CONFIG.apiKey
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch video details');
    }

    const video = await response.json();
    return {
      id: video.guid,
      title: video.title,
      duration: video.length,
      qualities: video.availableResolutions,
      ...generateVideoUrls(video.guid),
      guid: video.guid,
      dateCreated: video.dateCreated
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw error;
  }
} 