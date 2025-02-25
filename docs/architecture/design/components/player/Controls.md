# Video Player Controls Design

## Overview
The control system provides an intuitive interface for video playback, following PRISM+'s design language while maintaining Netflix-like functionality.

## Control Layout

### Primary Controls Bar
```css
/* Main Control Bar */
.controls-bar {
  @apply absolute bottom-0 inset-x-0;
  @apply flex flex-col gap-2;
  @apply p-4;
  @apply bg-gradient-to-t from-black/80 to-transparent;
  @apply transform transition-transform duration-300;
  @apply translate-y-full hover:translate-y-0;
}

/* Control Groups */
.control-group {
  @apply flex items-center gap-4;
  @apply text-white;
}
```

### Progress Control
```css
/* Progress Track */
.progress-track {
  @apply relative w-full;
  @apply h-1 group-hover:h-3;
  @apply bg-white/30;
  @apply transition-all duration-200;
  @apply rounded-full overflow-hidden;
}

/* Progress Indicator */
.progress-indicator {
  @apply absolute inset-y-0 left-0;
  @apply bg-primary-500;
  @apply transition-all duration-100;
}

/* Preview Thumbnail */
.preview-thumbnail {
  @apply absolute bottom-full mb-4;
  @apply rounded-lg overflow-hidden;
  @apply shadow-2xl;
  @apply opacity-0 group-hover:opacity-100;
  @apply transition-opacity duration-200;
}
```

## Control Components

### 1. Play/Pause Button
```css
/* Play/Pause Container */
.play-pause-button {
  @apply relative;
  @apply w-10 h-10;
  @apply rounded-full;
  @apply flex items-center justify-center;
  @apply bg-white/20 hover:bg-white/30;
  @apply transition-colors duration-200;
}

/* Icon Animation */
.play-icon, .pause-icon {
  @apply absolute inset-0;
  @apply flex items-center justify-center;
  @apply transition-opacity duration-200;
}
```

### 2. Volume Control
```css
/* Volume Container */
.volume-control {
  @apply flex items-center gap-2;
  @apply group;
}

/* Volume Slider */
.volume-slider {
  @apply w-0 group-hover:w-24;
  @apply overflow-hidden;
  @apply transition-all duration-300;
}

/* Volume Track */
.volume-track {
  @apply relative h-1;
  @apply bg-white/30;
  @apply rounded-full;
}
```

### 3. Quality Selector
```css
/* Quality Button */
.quality-button {
  @apply px-3 py-1;
  @apply rounded-lg;
  @apply bg-white/20 hover:bg-white/30;
  @apply transition-colors duration-200;
  @apply text-sm font-medium;
}

/* Quality Menu */
.quality-menu {
  @apply absolute bottom-full mb-2;
  @apply bg-black/90 backdrop-blur-sm;
  @apply rounded-lg overflow-hidden;
  @apply transform transition-all duration-200;
  @apply opacity-0 scale-95;
  @apply origin-bottom-right;
}
```

## Interactive States

### 1. Hover States
```css
/* Control Button Hover */
.control-button {
  @apply hover:scale-110;
  @apply hover:bg-white/30;
  @apply active:scale-95;
  @apply transition-all duration-200;
}

/* Progress Bar Hover */
.progress-container {
  @apply group;
  @apply cursor-pointer;
}

.progress-preview {
  @apply opacity-0 group-hover:opacity-100;
  @apply transition-opacity duration-200;
}
```

### 2. Active States
```css
/* Button Press */
.control-button:active {
  @apply scale-95;
  @apply bg-white/40;
}

/* Slider Drag */
.slider-thumb:active {
  @apply scale-125;
  @apply shadow-lg;
}
```

## Time Display

### 1. Current Time
```css
/* Time Container */
.time-display {
  @apply flex items-center gap-1;
  @apply text-sm font-medium;
  @apply text-white/90;
}

/* Time Separator */
.time-separator {
  @apply text-white/60;
  @apply mx-1;
}
```

### 2. Duration
```css
/* Duration Display */
.duration {
  @apply text-white/60;
}
```

## Accessibility

### 1. Keyboard Navigation
```css
/* Focus States */
.control-button:focus-visible {
  @apply ring-2 ring-white ring-offset-1;
  @apply outline-none;
}

.progress-track:focus-visible {
  @apply ring-2 ring-white;
  @apply outline-none;
}
```

### 2. Screen Reader Support
```html
<button
  role="button"
  aria-label="Play video"
  aria-pressed="false"
  class="play-pause-button"
>
  <span class="sr-only">Play</span>
</button>

<div
  role="slider"
  aria-label="Video progress"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-valuenow="50"
  class="progress-track"
>
</div>
```

## Mobile Optimization

### 1. Touch Targets
```css
/* Mobile Controls */
@media (max-width: 640px) {
  .control-button {
    @apply w-12 h-12; /* Larger touch targets */
  }
  
  .progress-track {
    @apply h-2; /* Larger by default for touch */
  }
}
```

### 2. Gesture Support
```typescript
const TouchControls = {
  // Double tap for play/pause
  onDoubleTap: (side: 'left' | 'right') => {
    if (side === 'left') seekBackward(10);
    if (side === 'right') seekForward(10);
  },
  
  // Vertical slide for volume
  onVerticalSlide: (delta: number) => {
    adjustVolume(delta);
  }
};
```

## Quality Checklist
- [ ] Smooth hover transitions
- [ ] Responsive layout
- [ ] Touch optimization
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] High contrast support
- [ ] Gesture support 