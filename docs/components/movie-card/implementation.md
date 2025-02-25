# MovieCard Component Documentation

## Overview
The MovieCard component implements a Netflix-style hover effect with smooth transitions, video previews, and rich interactions. This document consolidates implementation details, troubleshooting guides, and best practices.

## Current Implementation Status ✅

### Core Features
```typescript
interface MovieCardFeatures {
  // Base Card ✅
  baseCard: {
    image: 'Implemented';          // Poster display
    title: 'Implemented';          // Movie title
    badges: 'Implemented';         // TOP 10, Original, New badges
    gradient: 'Implemented';       // Overlay gradient
  };

  // Hover State ✅
  hoverCard: {
    preview: 'Implemented';        // Video preview
    controls: 'Implemented';       // Play, Add, Like, Info buttons
    metadata: 'Implemented';       // Match, year, duration, rating
    genres: 'Implemented';         // Genre tags
  };

  // Interactions ✅
  interactions: {
    videoPreview: 'Implemented';   // Auto-play on hover
    buttonFeedback: 'Implemented'; // Visual feedback on actions
    modalTrigger: 'Implemented';   // Info modal integration
  };
}
```

## Component Architecture

### 1. Base Card
```typescript
<div className="relative h-[300px] group/item">
  <div className="relative rounded-lg overflow-hidden">
    <img
      src={image}
      alt={title}
      className="w-full h-[176px] object-cover rounded-lg"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg">
      <div className="absolute bottom-0 p-3 w-full">
        <h3 className="text-white font-bold text-lg line-clamp-1">{title}</h3>
      </div>
    </div>
    {/* Badges */}
    <div className="absolute top-3 left-3 flex gap-2">
      {/* Badge implementation */}
    </div>
  </div>
</div>
```

### 2. Hover Card
```typescript
<div className="absolute w-[120%] transition-all duration-300 origin-bottom-left overflow-visible top-[-64px] z-[1000] scale-110 opacity-100 left-0">
  <div className="rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black">
    {/* Preview Section */}
    <div className="relative aspect-video">
      {/* Video/Image Preview */}
      {/* Control Buttons */}
      {/* Metadata Section */}
    </div>
  </div>
</div>
```

## Key Measurements

### Current Dimensions
- Base Card Height: 300px
- Image Height: 176px
- Hover Card Width: 120% of base
- Preview Height: 216px
- Button Area: 56px (including spacing)

### Spacing System
- Card Padding: 16px (p-4)
- Button Gap: 8px (gap-2)
- Metadata Spacing: 6px (gap-1.5)
- Badge Spacing: 8px (gap-2)

### Z-index Hierarchy
1. Modal: z-[2000]
2. Badges: z-[1001]
3. Hover State: z-[1000]
4. Base State: z-0

## Implementation Details

### 1. Video Preview System
```typescript
const VideoPreviewSystem = {
  // Hover Intent
  handleMouseEnter: () => {
    setIsHovered(true);
    timeoutRef.current = setTimeout(fetchPreviewVideo, 300);
  },

  // Cleanup
  handleMouseLeave: () => {
    setIsHovered(false);
    clearTimeout(timeoutRef.current);
    cleanupVideo();
  },

  // Video Management
  videoHandling: {
    preload: 'hover intent based',
    timeout: '300ms delay',
    cleanup: 'immediate on leave'
  }
};
```

### 2. State Management
```typescript
interface CardState {
  isHovered: boolean;
  isModalOpen: boolean;
  showVideo: boolean;
  isLoading: boolean;
  error: string | null;
  activeButton: string | null;
}
```

## Troubleshooting Guide

### Common Issues & Solutions

1. **Card Hidden Behind Others**
```typescript
// ✅ Correct Implementation
className={cn(
  "relative h-[300px] group/item",
  isHovered ? "z-[1000]" : "z-0"
)}
```

2. **Content Clipping**
```typescript
// ✅ Correct Implementation
className="overflow-visible"
style={{ 
  paddingTop: "10px",
  paddingBottom: "10px",
  marginTop: "-10px",
  marginBottom: "-10px"
}}
```

3. **Video Loading Issues**
```typescript
// ✅ Correct Implementation
const handleVideoError = () => {
  setError('Unable to load preview');
  setShowVideo(false);
  if (retryCount < maxRetries) {
    setRetryCount(prev => prev + 1);
  }
};
```

## Performance Optimizations

### 1. Video Loading
- Delayed loading (300ms hover intent)
- Cleanup on unmount
- Retry mechanism with max attempts

### 2. Animation Performance
- Hardware-accelerated transforms
- Opacity for fade effects
- Efficient state management

### 3. Memory Management
- Video source cleanup
- Timeout cleanup
- Event listener cleanup

## Accessibility

### 1. Keyboard Navigation
- Focus management
- ARIA attributes
- Screen reader support

### 2. Visual Feedback
- Button states
- Loading states
- Error states

## Testing Checklist

### Visual Tests
- [ ] Base card renders correctly
- [ ] Hover transition is smooth
- [ ] Video preview loads and plays
- [ ] Badges display correctly
- [ ] Button feedback works

### Functional Tests
- [ ] Video preview loads after hover
- [ ] All buttons trigger correct actions
- [ ] Modal opens/closes properly
- [ ] Genre navigation works
- [ ] Error states handled properly

### Performance Tests
- [ ] No memory leaks
- [ ] Smooth animations
- [ ] Efficient video loading
- [ ] Proper cleanup on unmount

## Related Components
- MovieRow (Container component)
- MovieInfoModal (Detail view)
- MovieControls (Button components)

## Future Considerations
1. Mobile optimization
2. Reduced motion support
3. Offline fallbacks
4. Loading optimizations
5. A11y improvements

## Testing Considerations
1. Test hover effects at different screen sizes
2. Verify behavior with different content lengths
3. Check transition smoothness
4. Ensure proper z-index stacking
5. Verify no layout shifts during hover
6. Test scroll behavior with hover
7. Verify proper cleanup on unhover

## Troubleshooting Common Symptoms

1. Card disappears behind others when hovering:
   - Check: z-index values in hover state
   - Check: stacking context isn't broken by intermediate containers
   - Solution: Ensure z-[1000] is applied on hover

2. Choppy transitions:
   - Check: transform properties are unified in one place
   - Check: transition-all is properly applied
   - Solution: Consolidate all transforms in className

3. Cards clip at top/bottom:
   - Check: vertical padding in row container
   - Check: overflow-y-visible is not being overridden
   - Solution: Verify py-[50px] -my-[50px] on scroll container

## Quick Fix Reference

If hover effect breaks, verify these in order:
1. MovieRow container:
   ```typescript
   <div className="relative group/row pt-16 pb-32 -mb-24 -mt-8">
   ```

2. Scroll container:
   ```typescript
   <div className="flex gap-2 overflow-x-auto overflow-y-visible scrollbar-hide px-4 sm:px-6 lg:px-8 py-[50px] -my-[50px]">
   ```

3. Card container:
   ```typescript
   <div className="flex-none w-[250px] relative group/card">
   ```

4. MovieCard hover state:
   ```typescript
   className={`absolute w-full transition-all duration-300 ${
     isHovered ? "z-[1000] scale-150 -translate-y-[20%]" : "z-0 scale-100"
   }`}
   ``` 