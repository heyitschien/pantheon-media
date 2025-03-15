I'll outline a detailed plan for implementing the Google Drive API service to replace the current R2 video service. Here's the comprehensive implementation plan:

Setup Phase
Install required dependencies:
npm install @google-cloud/storage googleapis
Create new service file: src/services/google-drive.ts
Set up environment variables for Google Cloud credentials
Google Drive Service Structure
// google-drive.ts
interface GoogleDriveConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  refreshToken: string;
}

interface VideoAsset {
  id: string;
  title: string;
  videoUrl: string;
  posterUrl: string;
  duration: number;
  mimeType: string;
  fileSize: number;
}

class GoogleDriveService {
  private drive: any; // google.drive instance
  private cache: Map<string, VideoAsset>;
  
  constructor(config: GoogleDriveConfig) {
    // Initialize Google Drive client
    // Setup caching mechanism
  }

  // Core methods
  async initialize(): Promise<void>
  async getVideoById(fileId: string): Promise<VideoAsset>
  async getVideosByFolder(folderId: string): Promise<VideoAsset[]>
  async generateSignedUrl(fileId: string): Promise<string>
  
  // Helper methods
  private async refreshAccessToken(): Promise<void>
  private async validateMimeType(fileId: string): Promise<boolean>
  private getCachedAsset(key: string): VideoAsset | null
}
Integration Points a) Create environment configuration:
// src/config/google-drive.ts
export const GOOGLE_DRIVE_CONFIG = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
  refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  videosFolder: process.env.GOOGLE_DRIVE_VIDEOS_FOLDER
};
b) Update existing video services to use Google Drive:

// src/services/video-service.ts
export async function getPreviewVideo(
  query: string,
  options: PreviewOptions = {}
): Promise<VideoAsset> {
  const driveService = await getDriveService();
  const video = await driveService.getVideoById(options.videoId);
  const signedUrl = await driveService.generateSignedUrl(video.id);
  return {
    ...video,
    videoUrl: signedUrl
  };
}
Security & Performance Optimizations
Implement token refresh mechanism
Add caching layer for video metadata
Implement signed URL generation with expiration
Add error handling and retry logic
Set up rate limiting
Migration Strategy a) Create parallel implementation:
// src/services/video-provider.ts
export class VideoProvider {
  static async getVideo(id: string, source: 'r2' | 'drive' = 'r2') {
    if (source === 'drive') {
      return await googleDriveService.getVideo(id);
    }
    return await r2Service.getVideo(id);
  }
}
b) Gradual rollout:

Add feature flag for Google Drive integration
Test with a subset of videos first
Monitor performance and errors
Roll out to more videos gradually
Required Google Cloud Setup
Create Google Cloud Project
Enable Google Drive API
Create OAuth 2.0 credentials
Set up service account
Configure proper IAM roles
Generate refresh token for long-term access
Component Updates Update the following components to work with the new service:
MoviePlayer.tsx
Hero.tsx
MovieCard.tsx
Testing Strategy
Unit tests for Google Drive service
Integration tests for video playback
Error handling tests
Performance testing for signed URL generation
Cache hit rate monitoring
Would you like me to elaborate on any of these aspects before we proceed with implementation? Also, have you completed the Google Cloud API setup? This will help me understand which specific steps we should prioritize.