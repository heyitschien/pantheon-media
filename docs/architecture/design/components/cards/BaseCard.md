# Movie Card Base Design

## Overview
The base movie card is the foundation of our content display system, implementing PRISM+'s visual identity while maintaining Netflix-like functionality.

## Visual Specifications

### Card Container
```css
/* Base Card Container */
.movie-card-base {
  @apply rounded-lg overflow-hidden relative;
  aspect-ratio: 16/9;
}
```

### Image Treatment
- Aspect Ratio: 16:9
- Border Radius: `rounded-lg`
- Overlay Gradient: `bg-gradient-to-t from-black/20 to-transparent`

### Typography
- Title: Inter Bold, 16px/1.25
- Metadata: Inter Regular, 14px/1.5
- Color: White with text-shadow

### States

#### Default State
```css
.movie-card {
  @apply relative overflow-hidden rounded-lg;
  @apply transition-all duration-300;
}
```

#### Loading State
```css
.movie-card-skeleton {
  @apply animate-pulse bg-gray-800;
  @apply rounded-lg overflow-hidden;
}
```

## Animation Integration

### Loading Animation
- Skeleton loading with pulse effect
- Duration: 1.5s
- Timing: ease-in-out

### Image Loading
- Progressive loading with blur-up
- Fade-in duration: 300ms

## Accessibility

### Color Contrast
- Text against dark backgrounds: 4.5:1 minimum
- Interactive elements: 3:1 minimum

### Focus States
```css
.movie-card:focus-visible {
  @apply ring-2 ring-white ring-offset-2 ring-offset-black;
  @apply outline-none;
}
```

## Implementation Guidelines

### Required Props
```typescript
interface BaseCardProps {
  imageUrl: string;
  title: string;
  metadata?: {
    year?: number;
    rating?: string;
    duration?: string;
  };
  loading?: boolean;
}
```

### Usage Example
```tsx
<MovieCard
  imageUrl="/path/to/image.jpg"
  title="Movie Title"
  metadata={{
    year: 2024,
    rating: "PG-13",
    duration: "2h 15m"
  }}
/>
```

## Quality Checklist
- [ ] Image optimization implemented
- [ ] Skeleton loading in place
- [ ] Proper aspect ratio maintained
- [ ] Accessible focus states
- [ ] Proper text contrast
- [ ] Responsive behavior tested 