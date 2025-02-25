# Video Integration Plan

## Overview
This plan outlines the steps to integrate a video using a direct URL alongside the existing Pexels API integration.

## Steps

### 1. Direct URL Integration
- **Pexels API:** Fetch video data using API calls, which provide metadata and URLs.
- **Direct URL:** Manually add the video URL to your component.

### 2. Implementation Steps
- **Video Player Component:** Use the direct URL as the `src` for the video element.
- **Movie Card:** Add a new card for this video, similar to how you handle Pexels videos.

### 3. Conflict Management
- Ensure that the video player component can handle both API-fetched and direct URLs.
- Use conditional logic to differentiate between Pexels API data and direct URLs if needed.

### 4. Testing
- Use Jest to test the integration of both Pexels and direct URL videos.
- Ensure features like video preview on hover work for both types.

### 5. Refactoring
- Refactor the code to maintain readability and avoid duplication.

## Next Steps
- **Add a New Movie Card:** Integrate the new video URL into a second movie card.
- **Test and Refactor:** Ensure everything works smoothly and refactor as needed. 