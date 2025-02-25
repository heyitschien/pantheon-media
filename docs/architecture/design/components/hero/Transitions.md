# Hero Section Transitions

## Overview
The hero section features smooth transitions between static images and video content, implementing PRISM+'s animation system for an engaging user experience.

## Core Transitions

### 1. Image to Video
```css
/* Container */
.hero-container {
  @apply relative w-full;
  @apply aspect-[2.1/1];
  @apply overflow-hidden;
}

/* Media Elements */
.hero-image {
  @apply absolute inset-0;
  @apply w-full h-full;
  @apply object-cover;
  @apply transition-opacity duration-1000;
}

.hero-video {
  @apply absolute inset-0;
  @apply w-full h-full;
  @apply object-cover;
  @apply opacity-0;
  @apply transition-opacity duration-1000;
}
```

### 2. Content Overlay
```css
/* Gradient Overlay */
.hero-overlay {
  @apply absolute inset-0;
  @apply bg-gradient-to-r from-black/50 via-black/25 to-transparent;
  @apply transition-opacity duration-500;
}

/* Content Container */
.hero-content {
  @apply absolute bottom-0 left-0;
  @apply p-8;
  @apply w-full md:w-2/3 lg:w-1/2;
  @apply space-y-4;
}
```

## Animation States

### 1. Initial Load
```css
/* Initial State */
.hero-initial {
  .hero-image {
    @apply opacity-0;
  }
  
  .hero-content {
    @apply translate-y-4 opacity-0;
  }
}

/* Loaded State */
.hero-loaded {
  .hero-image {
    @apply opacity-100;
  }
  
  .hero-content {
    @apply translate-y-0 opacity-100;
    @apply transition-all duration-500 delay-300;
  }
}
```

### 2. Video Transition
```css
/* Video Playing State */
.hero-video-playing {
  .hero-image {
    @apply opacity-0;
  }
  
  .hero-video {
    @apply opacity-100;
  }
}

/* Mute Toggle */
.mute-button {
  @apply absolute bottom-4 right-4;
  @apply rounded-full;
  @apply bg-black/50 hover:bg-black/70;
  @apply transition-colors duration-200;
}
```

## Interactive Elements

### 1. Play Button
```css
/* Play Button */
.hero-play {
  @apply px-6 py-3;
  @apply bg-white text-black;
  @apply rounded-lg;
  @apply flex items-center gap-2;
  @apply transition-transform duration-200;
  @apply hover:scale-105;
  @apply active:scale-95;
}
```

### 2. Info Button
```css
/* Info Button */
.hero-info {
  @apply px-6 py-3;
  @apply bg-white/20;
  @apply rounded-lg;
  @apply flex items-center gap-2;
  @apply transition-all duration-200;
  @apply hover:bg-white/30;
  @apply active:scale-95;
}
```

## Content Animation

### 1. Title Animation
```css
/* Title Container */
.hero-title {
  @apply text-4xl md:text-5xl lg:text-6xl;
  @apply font-bold;
  @apply transition-transform duration-500;
  @apply translate-y-4 opacity-0;
  @apply loaded:translate-y-0 loaded:opacity-100;
}
```

### 2. Description Animation
```css
/* Description Container */
.hero-description {
  @apply text-lg md:text-xl;
  @apply text-white/90;
  @apply transition-all duration-500 delay-100;
  @apply translate-y-4 opacity-0;
  @apply loaded:translate-y-0 loaded:opacity-100;
}
```

## Implementation

### 1. Transition Management
```typescript
interface HeroTransition {
  // State management
  isVideoLoaded: boolean;
  isPlaying: boolean;
  isMuted: boolean;

  // Transition handlers
  onVideoLoad: () => void;
  onTransitionComplete: () => void;
}

const TransitionManager = {
  // Start video transition
  startVideoTransition: () => {
    if (isVideoLoaded) {
      setIsPlaying(true);
      fadeOutImage();
      fadeInVideo();
    }
  },

  // Handle mute toggle
  toggleMute: () => {
    setIsMuted(!isMuted);
    updateMuteUI();
  }
};
```

### 2. Loading Strategy
```typescript
const LoadingStrategy = {
  // Preload video
  preloadVideo: () => {
    const video = new HTMLVideoElement();
    video.src = videoUrl;
    video.load();
    
    video.addEventListener('canplay', () => {
      setIsVideoLoaded(true);
    });
  },

  // Progressive image loading
  loadHeroImage: () => {
    const img = new Image();
    img.src = imageUrl;
    
    img.onload = () => {
      setIsImageLoaded(true);
      startContentAnimation();
    };
  }
};
```

## Performance Considerations

### 1. Resource Loading
```typescript
const ResourceManager = {
  // Optimize video loading
  optimizeVideoLoading: () => {
    if (isInViewport && !isVideoLoaded) {
      preloadVideo();
    }
  },

  // Cleanup resources
  cleanup: () => {
    if (!isInViewport) {
      pauseVideo();
      unloadVideo();
    }
  }
};
```

### 2. Animation Performance
```css
/* Performance Optimized Animations */
.performance-class {
  @apply will-change-transform;
  @apply will-change-opacity;
  @apply transform-gpu;
}
```

## Quality Checklist
- [ ] Smooth image to video transition
- [ ] Responsive content layout
- [ ] Optimized video loading
- [ ] Proper resource cleanup
- [ ] Mobile optimization
- [ ] Reduced motion support
- [ ] Error state handling 