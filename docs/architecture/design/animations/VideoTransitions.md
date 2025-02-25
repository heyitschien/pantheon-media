# Video Transitions System

## Overview
Specialized animation system for video-related transitions in PRISM+, focusing on smooth, performant video state changes and interactions.

## Video State Transitions

### 1. Thumbnail to Video
```css
/* Container for smooth transitions */
.video-container {
  @apply relative overflow-hidden;
  @apply aspect-video;
}

/* Thumbnail fade out */
.thumbnail-exit {
  @apply absolute inset-0;
  @apply transition-opacity duration-500;
  @apply opacity-100 exit:opacity-0;
}

/* Video fade in */
.video-enter {
  @apply absolute inset-0;
  @apply transition-opacity duration-500;
  @apply opacity-0 enter:opacity-100;
}
```

### 2. Loading States
```css
/* Video buffer indicator */
.buffer-indicator {
  @apply absolute inset-0;
  @apply flex items-center justify-center;
  @apply bg-black/60 backdrop-blur-sm;
  @apply transition-opacity duration-300;
}

/* Loading animation */
.loading-spinner {
  @apply animate-spin;
  @apply w-12 h-12;
  @apply border-4 border-white/20;
  @apply border-t-white;
  @apply rounded-full;
}
```

## Player Controls Animation

### 1. Control Bar
```css
/* Control bar reveal */
.controls-container {
  @apply absolute bottom-0 inset-x-0;
  @apply transition-transform duration-300;
  @apply translate-y-full hover:translate-y-0;
  @apply bg-gradient-to-t from-black/80 to-transparent;
}

/* Button interactions */
.control-button {
  @apply transition-transform duration-150;
  @apply hover:scale-110 active:scale-95;
}
```

### 2. Progress Bar
```css
/* Progress bar hover effect */
.progress-container {
  @apply group relative h-1;
  @apply transition-all duration-200;
  @apply hover:h-3;
}

/* Preview thumbnail */
.preview-thumbnail {
  @apply absolute bottom-full mb-2;
  @apply transition-opacity duration-200;
  @apply opacity-0 group-hover:opacity-100;
  @apply rounded-lg overflow-hidden;
  @apply shadow-xl;
}
```

## Quality Transitions

### 1. Quality Switch
```typescript
interface QualityTransition {
  // Maintain current frame during quality switch
  currentTime: number;
  // Smooth buffer transition
  bufferStatus: 'buffering' | 'ready';
  // Quality levels
  quality: '4K' | 'HD' | 'SD';
}

const handleQualitySwitch = async (newQuality: Quality) => {
  // Store current playback position
  const currentTime = videoRef.current.currentTime;
  
  // Switch source
  await switchVideoSource(newQuality);
  
  // Restore position
  videoRef.current.currentTime = currentTime;
};
```

## Fullscreen Transitions

### 1. Enter/Exit Animation
```css
/* Fullscreen container */
.fullscreen-container {
  @apply fixed inset-0 z-50;
  @apply bg-black;
  @apply transition-all duration-300;
}

/* Content scale */
.fullscreen-content {
  @apply w-full h-full;
  @apply transition-transform duration-300;
  @apply scale-[var(--scale-fullscreen)];
}
```

### 2. Control Adjustments
```css
/* Fullscreen controls */
.fullscreen-controls {
  @apply scale-125;
  @apply transition-transform duration-300;
}
```

## Implementation Guidelines

### 1. Video Preloading
```typescript
const VideoPreloader = {
  // Start preloading when hover intent is detected
  onHoverIntent: () => {
    const video = new HTMLVideoElement();
    video.preload = 'auto';
    video.src = videoUrl;
    
    // Preload first segment
    video.load();
  },
  
  // Cancel preload if hover exits quickly
  onHoverExit: () => {
    if (hoverDuration < 500) {
      video.src = '';
    }
  }
};
```

### 2. Smooth Playback
```typescript
const SmoothPlayback = {
  // Handle play state changes
  onPlayStateChange: (playing: boolean) => {
    if (playing) {
      fadeInVideo(300);
      fadeOutThumbnail(500);
    } else {
      fadeInThumbnail(300);
      fadeOutVideo(500);
    }
  },
  
  // Handle seeking
  onSeek: (time: number) => {
    showBuffering();
    seekToTime(time);
    hideBufferingWhenReady();
  }
};
```

## Performance Optimization

### 1. Memory Management
```typescript
const VideoMemoryManager = {
  // Cleanup unused video elements
  cleanup: () => {
    unloadUnusedSources();
    releaseVideoMemory();
  },
  
  // Optimize for device
  optimize: () => {
    adjustQualityForDevice();
    limitConcurrentVideos();
  }
};
```

### 2. Buffer Management
```typescript
const BufferManager = {
  // Adaptive buffering
  adjustBuffer: (networkSpeed: number) => {
    const bufferSize = calculateOptimalBuffer(networkSpeed);
    setBufferSize(bufferSize);
  },
  
  // Clear unnecessary buffers
  clearBuffer: () => {
    if (!isVisible || !isPlaying) {
      clearVideoBuffer();
    }
  }
};
```

## Quality Checklist
- [ ] Smooth thumbnail to video transition
- [ ] No visible quality switches
- [ ] Responsive controls
- [ ] Efficient memory usage
- [ ] Proper buffer management
- [ ] Graceful fallbacks
- [ ] Mobile optimization 