# Movie Detail Card Design

## Overview
The detail card provides an immersive full-screen experience for movie information, implementing PRISM+'s visual system for modal interfaces.

## Visual Specifications

### Modal Container
```css
/* Detail Modal Container */
.detail-modal {
  @apply fixed inset-0 z-50;
  @apply bg-black/80 backdrop-blur-sm;
  @apply flex items-center justify-center;
}

.detail-content {
  @apply relative w-full max-w-5xl;
  @apply bg-gradient-to-b from-gray-900 to-black;
  @apply rounded-xl overflow-hidden;
}
```

### Hero Section
```css
.detail-hero {
  @apply relative w-full;
  @apply aspect-video;
  @apply overflow-hidden;
}

.hero-gradient {
  @apply absolute inset-0;
  @apply bg-gradient-to-t from-gray-900 via-transparent to-black/40;
}
```

## Content Layout

### Title Section
```css
.title-section {
  @apply px-8 py-6;
  @apply flex items-start gap-6;
}

.title-content {
  @apply space-y-4;
}
```

### Metadata Display
```css
.metadata-grid {
  @apply grid grid-cols-3 gap-4;
  @apply px-8 py-6;
  @apply border-t border-white/10;
}
```

## Animation System

### Entry Animation
```css
/* Modal Entry */
.modal-enter {
  @apply animate-in fade-in zoom-in-95;
  @apply duration-300;
}

/* Content Reveal */
.content-enter {
  @apply animate-in slide-in-from-bottom;
  @apply duration-500;
}
```

### Video Player Integration
- Seamless transition from thumbnail
- Auto-play with sound enabled
- Quality selector overlay

## Interactive Elements

### Primary Actions
```css
.primary-actions {
  @apply flex items-center gap-4;
  @apply mt-6;
}

.action-button {
  @apply px-8 py-3 rounded-lg;
  @apply flex items-center gap-2;
  @apply transition-colors duration-200;
}
```

### Secondary Features
```css
.feature-grid {
  @apply grid grid-cols-2 md:grid-cols-3 gap-4;
  @apply mt-8;
}
```

## Implementation Guidelines

### Required Props
```typescript
interface DetailCardProps {
  movie: {
    id: string;
    title: string;
    description: string;
    releaseYear: number;
    duration: string;
    rating: string;
    genres: string[];
    cast: string[];
    director: string;
    videoUrl: string;
    thumbnailUrl: string;
    trailerUrl: string;
  };
  onClose: () => void;
  onPlay: () => void;
  onAddToList: () => void;
}
```

### State Management
```typescript
const [isVideoPlaying, setIsVideoPlaying] = useState(false);
const [selectedQuality, setSelectedQuality] = useState<'HD' | '4K'>('HD');
const [showMore, setShowMore] = useState(false);
```

## Accessibility

### Keyboard Navigation
```css
.modal-content:focus-visible {
  @apply ring-2 ring-white ring-offset-2;
  @apply outline-none;
}
```

### ARIA Implementation
```html
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="movie-title"
  aria-describedby="movie-description"
>
```

## Performance Considerations

### Image Loading
- Progressive loading for hero image
- Lazy loading for additional content
- Preload video on user intent

### Animation Performance
- Hardware acceleration for transforms
- Efficient modal mounting/unmounting
- Debounced event handlers

## Quality Checklist
- [ ] Responsive layout testing
- [ ] Keyboard navigation flow
- [ ] Screen reader compatibility
- [ ] Animation performance
- [ ] Video playback optimization
- [ ] Touch device interactions
- [ ] Error state handling 