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
  forceRefresh?: boolean;
}

// Simple in-memory cache
const cache = new Map<string, { videoUrl: string; posterUrl: string; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes instead of 1 hour

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
  // Generate a unique request ID for tracking this specific call
  const requestId = `req-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
  
  console.group(`🎬 getPreviewVideo [${requestId}] for ID: ${videoId}`);
  console.log(`Options:`, options);
  
  try {
    // Check cache first (unless forceRefresh is true)
    const cacheKey = videoId;
    const cached = cache.get(cacheKey);
    const now = Date.now();
    
    console.log(`Cache check - forceRefresh: ${!!options.forceRefresh}, hasCached: ${!!cached}`);
    if (cached) {
      const age = now - cached.timestamp;
      const isExpired = age > CACHE_DURATION;
      console.log(`Cache age: ${age}ms, expired: ${isExpired}, max age: ${CACHE_DURATION}ms`);
    }

    // Only use cache if not forcing refresh, cache exists, and isn't expired
    if (!options.forceRefresh && 
        cached && 
        (now - cached.timestamp < CACHE_DURATION)) {
      console.log(`Using cached preview for video:`, videoId);
      
      // Validate cached URLs
      try {
        console.log(`Validating cached URL: ${cached.videoUrl.substring(0, 50)}...`);
        const response = await fetch(cached.videoUrl, { method: 'HEAD' });
        console.log(`Cache validation response:`, response.status);
        
        if (response.ok) {
          console.log(`✅ Cache is valid, returning cached data`);
          console.groupEnd();
          return {
            videoUrl: cached.videoUrl,
            posterUrl: cached.posterUrl,
          };
        } else {
          console.log(`❌ Cached video URL is invalid (status: ${response.status}), fetching fresh data`);
          cache.delete(cacheKey);
        }
      } catch (error) {
        console.warn(`❌ Error validating cached URL:`, error);
        cache.delete(cacheKey);
      }
    }

    // If we reach here, we need fresh data
    console.log(`Fetching fresh video details from API for ID: ${videoId}`);
    console.time(`api-fetch-${requestId}`);
    
    const response = await fetch(`${BUNNY_CONFIG.apiBaseUrl}/${BUNNY_CONFIG.libraryId}/videos/${videoId}`, {
      headers: {
        'Accept': 'application/json',
        'AccessKey': BUNNY_CONFIG.apiKey
      }
    });
    
    console.timeEnd(`api-fetch-${requestId}`);
    console.log(`API response status:`, response.status);

    if (!response.ok) {
      console.error(`❌ API response not OK: ${response.status} - ${response.statusText}`);
      throw new Error(`Failed to fetch video details: ${response.statusText}`);
    }

    const videoDetails = await response.json();
    console.log(`✅ Video details received`);
    
    if (!videoDetails || !videoDetails.guid) {
      console.error(`❌ Invalid video details received from API:`, videoDetails);
      throw new Error('Invalid video details received from API');
    }
    
    const urls = generateVideoUrls(videoDetails.guid);
    console.log(`Generated URLs - videoUrl: ${urls.videoUrl.substring(0, 50)}...`);
    
    // Validate the video URL before caching
    console.log(`Validating generated video URL...`);
    console.time(`url-validation-${requestId}`);
    const videoResponse = await fetch(urls.videoUrl, { method: 'HEAD' });
    console.timeEnd(`url-validation-${requestId}`);
    
    console.log(`URL validation response:`, videoResponse.status);
    if (!videoResponse.ok) {
      console.error(`❌ Generated video URL validation failed (status: ${videoResponse.status})`);
      throw new Error('Generated video URL is invalid');
    }
    
    const result = {
      videoUrl: urls.videoUrl,
      posterUrl: urls.posterUrl,
    };

    // Cache the validated result
    console.log(`✅ Caching valid result`);
    cache.set(cacheKey, {
      ...result,
      timestamp: now,
    });

    console.log(`✅ Returning fresh preview video result`);
    console.groupEnd();
    return result;
  } catch (error) {
    console.error(`❌ Error in getPreviewVideo:`, error);
    
    // Clear cache for this video ID if there was an error
    console.log(`Clearing cache for ${videoId} due to error`);
    cache.delete(videoId);
    
    // Try fallback video if available
    console.log(`Attempting to use fallback video`);
    const asset = VIDEO_ASSETS['pantheon-highlight'];
    if (!asset) {
      console.error(`❌ Fallback video asset not found`);
      console.groupEnd();
      throw new Error('Preview video not available');
    }

    // Validate fallback video URL
    try {
      console.log(`Validating fallback URL: ${asset.videoUrl.substring(0, 50)}...`);
      const response = await fetch(asset.videoUrl, { method: 'HEAD' });
      
      if (!response.ok) {
        console.error(`❌ Fallback validation failed (status: ${response.status})`);
        throw new Error('Fallback video URL is invalid');
      }
      
      console.log(`✅ Using fallback video`);
      console.groupEnd();
      return {
        videoUrl: asset.videoUrl,
        posterUrl: asset.posterUrl,
      };
    } catch (fallbackError) {
      console.error(`❌ Fallback video also failed:`, fallbackError);
      console.groupEnd();
      throw new Error('Video preview is currently unavailable');
    }
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