# Movie Card Hover Design

## Overview
The hover state extends the base card with rich interactions and preview functionality, following PRISM+'s visual identity system.

## Visual Specifications

### Hover Container
```css
/* Hover Card Container */
.movie-card-hover {
  @apply scale-110 z-50 shadow-2xl;
  @apply transition-all duration-300;
}
```

### Preview Video
- Aspect Ratio: 16:9 (maintained)
- Auto-play on hover
- Muted by default
- Fade transition: 300ms

### Content Overlay
```css
.hover-content {
  @apply absolute inset-0;
  @apply bg-gradient-to-t from-black via-black/80 to-transparent;
  @apply opacity-0 hover:opacity-100;
  @apply transition-opacity duration-300;
}
```

## Animation System

### Entry Animation
```css
/* Card Scale */
.hover-scale {
  @apply hover:scale-110;
  @apply transition-transform duration-300;
}

/* Content Reveal */
.content-reveal {
  @apply translate-y-4 hover:translate-y-0;
  @apply opacity-0 hover:opacity-100;
  @apply transition-all duration-300;
}
```

### Video Transition
- Fade-in duration: 300ms
- Start after 500ms hover
- Cross-fade with thumbnail

## Interactive Elements

### Control Buttons
```css
.hover-controls {
  @apply flex gap-2 items-center;
  @apply p-4;
}

.control-button {
  @apply rounded-full bg-white/20;
  @apply hover:bg-white/30;
  @apply transition-colors duration-200;
}
```

### Metadata Display
```css
.hover-metadata {
  @apply flex flex-col gap-2;
  @apply p-4;
  @apply text-white;
}
```

## Implementation Guidelines

### Required Props
```typescript
interface HoverCardProps extends BaseCardProps {
  previewUrl?: string;
  genre: string[];
  rating: string;
  description: string;
  onPlay: () => void;
  onMoreInfo: () => void;
  onAddToList: () => void;
}
```

### Hover State Management
```typescript
const [isHovered, setIsHovered] = useState(false);
const [isVideoLoaded, setIsVideoLoaded] = useState(false);

const handleMouseEnter = () => {
  setIsHovered(true);
  // Start loading video after 500ms
  setTimeout(() => {
    if (isHovered) setIsVideoLoaded(true);
  }, 500);
};
```

## Performance Considerations

### Video Loading
- Preload on hover intent
- Cancel if hover exits before 500ms
- Unload on hover exit

### Animation Performance
- Use transform for scaling
- Avoid layout shifts
- GPU acceleration where needed

## Accessibility

### Keyboard Navigation
```css
.movie-card:focus-visible .hover-content {
  @apply opacity-100;
}
```

### ARIA Attributes
```html
<div
  role="button"
  aria-expanded="false"
  aria-haspopup="true"
  aria-label="Show more information about [Movie Title]"
>
```

## Quality Checklist
- [ ] Smooth hover transitions
- [ ] Video preload optimization
- [ ] Keyboard accessibility
- [ ] Touch device fallback
- [ ] Performance testing
- [ ] ARIA implementation 

## Optimal Spacing Configuration

### Control Button Positioning
```css
/* Control buttons container */
.control-buttons {
  @apply absolute -bottom-16;  /* Increased from -bottom-12 for more spacing */
  @apply w-full flex justify-center gap-2;
  @apply transition-all duration-300;
}

/* Info section padding */
.info-section {
  @apply pt-20;  /* Increased from pt-14 to accommodate lowered buttons */
  @apply bg-black/80;
}
```

### Key Measurements
- Preview Height: 216px (h-[216px])
- Button Container Position: -bottom-16
- Info Section Top Padding: pt-20
- Total Card Height: 300px

### Visual Hierarchy
1. Preview image at top
2. Gradient overlay for text visibility
3. Control buttons with proper spacing
4. Info section with metadata and genres

### Implementation Notes
- Maintain 16px spacing between preview and buttons
- Ensure gradient overlay provides sufficient contrast
- Prevent content clipping with proper container height
- Keep consistent spacing across different states

### Quality Checklist
- [ ] No button clipping at bottom of preview
- [ ] Smooth transition between states
- [ ] Consistent spacing across breakpoints
- [ ] Proper gradient overlay visibility
- [ ] Clear visual hierarchy

## Title Update Documentation

### Movie Title Changes
- Previous Title: "Quantum Horizon"
- Updated Title: "Pantheon Highlights"

### Implementation Details
1. Updated in `src/data/movies.ts`:
   ```typescript
   export const PANTHEON_HIGHLIGHTS: Movie = {
     id: "pantheon-highlights-2024",
     title: "Pantheon Highlights",
     // ... other properties
   };
   ```

2. Updated video mapping in `src/services/pexels.ts`
   - Changed search query from "Quantum" to "Pantheon"
   - Updated related video mappings

### Quality Assurance
- [x] Title updated in movie data
- [x] Video mappings updated
- [x] UI reflects new title
- [x] No remaining references to old title
- [x] Documentation updated

### Notes
- Changes are immediately visible through HMR
- No server restart required
- UI components pull from updated data file 