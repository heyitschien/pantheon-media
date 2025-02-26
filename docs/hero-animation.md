# Hero Section Animation Documentation

## Overview

The hero section of Pantheon Media features a Netflix-style text animation where the content transitions from a full display to a more compact version after the video starts playing, and then expands back to the full display when the video ends. This document explains how this animation works and how to modify it.

## Animation Behavior

1. **Initial State**: When the page loads, the hero section displays:
   - A subtitle ("Regenerative Lifestyle")
   - A full-size title ("Regenerative Lifestyle Media")
   - A description paragraph
   - Action buttons ("Watch Our Work" and "More Info")

2. **Transition Trigger**: 4 seconds after the video starts playing, the transition animation begins.

3. **Forward Animation Process**:
   - The subtitle fades out completely
   - The description paragraph fades out and collapses
   - The title splits into two lines ("Regenerative" and "Lifestyle Media")
   - The title scales down slightly to 85% of its original size
   - The entire content block shifts upward
   - The buttons maintain their position relative to the title

4. **Compact State**: The hero section displays:
   - A two-line, slightly smaller title
   - The action buttons
   - No subtitle or description text

5. **Reverse Transition Trigger**: When the video ends (after approximately 8-10 seconds), the reverse animation begins.

6. **Reverse Animation Process**:
   - The title scales back up to its original size
   - The title lines merge back into a single line
   - The subtitle fades back in
   - The description paragraph expands and fades in
   - The entire content block shifts back to its original position

7. **Final State**: Returns to the initial state with all content visible.

## Technical Implementation

The animation uses a frame-by-frame approach with `requestAnimationFrame` for smooth transitions:

```typescript
// Effect to trigger compact mode after video starts playing
useEffect(() => {
  if (showVideo) {
    compactModeTimeoutRef.current = setTimeout(() => {
      // Start the smooth transition animation
      setIsTransitioning(true);
      setIsForward(true);
      
      let startTime: number;
      const duration = 1500; // 1.5 seconds for the transition
      
      const animateTransition = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        setTransitionProgress(progress);
        
        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animateTransition);
        } else {
          setIsCompactMode(true);
          setIsTransitioning(false);
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(animateTransition);
    }, 4000); // 4 seconds after video starts
  }

  return () => {
    if (compactModeTimeoutRef.current) {
      clearTimeout(compactModeTimeoutRef.current);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };
}, [showVideo]);

// Effect to handle reverse animation when video ends
useEffect(() => {
  if (isVideoEnded && isCompactMode) {
    // Start the reverse animation
    setIsReverseTransitioning(true);
    setIsForward(false);
    
    let startTime: number;
    const duration = 1500; // 1.5 seconds for the reverse transition
    
    const animateReverseTransition = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // For reverse animation, we go from 1 to 0
      setTransitionProgress(1 - progress);
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateReverseTransition);
      } else {
        setIsCompactMode(false);
        setIsReverseTransitioning(false);
        setTransitionProgress(0);
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animateReverseTransition);
  }

  return () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };
}, [isVideoEnded, isCompactMode]);
```

### Video End Detection

The component detects when the video has ended using two methods:

1. The `onEnded` event handler:
```typescript
const handleVideoEnded = () => {
  setIsVideoEnded(true);
  setShowVideo(false);
};
```

2. A time-based check in the `onTimeUpdate` handler:
```typescript
const handleTimeUpdate = () => {
  if (!videoRef.current) return;
  
  // Check if the video has reached its end (with a small buffer)
  if (videoRef.current.currentTime >= videoRef.current.duration - 0.5) {
    setIsVideoEnded(true);
  } else if (isVideoEnded) {
    setIsVideoEnded(false);
  }
};
```

### Key Animation Helpers

Three helper functions calculate the exact visual properties during each frame of the animation:

1. **Position and Spacing**:
```typescript
const getTransitionStyles = () => {
  if (isCompactMode && !isReverseTransitioning) {
    return {
      transform: 'translateY(-12px)',
      marginBottom: '0'
    };
  }
  
  if (isTransitioning || isReverseTransitioning) {
    const translateY = -12 * transitionProgress;
    const marginBottom = 96 * (1 - transitionProgress);
    
    return {
      transform: `translateY(${translateY}px)`,
      marginBottom: `${marginBottom}px`
    };
  }
  
  return {
    transform: 'translateY(0)',
    marginBottom: '96px' // 24rem = 96px
  };
};
```

2. **Text Opacity**:
```typescript
const getTextOpacity = () => {
  if (isCompactMode && !isReverseTransitioning) return 0;
  if (isTransitioning || isReverseTransitioning) return 1 - transitionProgress;
  return 1;
};
```

3. **Title Scaling**:
```typescript
const getTitleScale = () => {
  if (isCompactMode && !isReverseTransitioning) return 0.85;
  if (isTransitioning || isReverseTransitioning) return 1 - (0.15 * transitionProgress);
  return 1;
};
```

### Title Transformation

During the transition, the title is split into two lines with different vertical movements:

```tsx
{(isTransitioning || isReverseTransitioning) ? (
  <>
    <div className="transition-transform duration-1000" style={{ transform: `translateY(${-10 * transitionProgress}px)` }}>
      Regenerative
    </div>
    <div className="transition-transform duration-1000" style={{ transform: `translateY(${-5 * transitionProgress}px)` }}>
      Lifestyle Media
    </div>
  </>
) : (
  <>Regenerative Lifestyle Media</>
)}
```

## Modifying the Animation

### Timing Adjustments

- **Delay Before Forward Animation**: Change the `4000` value in the `setTimeout` call to adjust when the animation starts after the video begins playing.
- **Animation Duration**: Modify the `duration` constant (currently 1500ms) to make the transition faster or slower. This applies to both forward and reverse animations.
- **Video End Detection**: Adjust the buffer in `handleTimeUpdate` (currently 0.5 seconds) to change when the reverse animation triggers.

### Visual Adjustments

- **Title Scale**: Change the scale factor in `getTitleScale()` (currently 0.85) to make the final title larger or smaller.
- **Vertical Movement**: Adjust the `-12` value in `getTransitionStyles()` to change how far the content moves upward.
- **Text Movement**: Modify the `-10` and `-5` values in the title transformation to change how the title lines move relative to each other.

### Adding New Elements

To add new elements to the animation:
1. Create state variables for their properties
2. Add helper functions to calculate their transition values
3. Apply the calculated styles in the JSX
4. Ensure cleanup in the `useEffect` return function
5. Make sure to handle both forward and reverse animations

## Best Practices

1. **Performance**: Use `transform` and `opacity` for animations as they are GPU-accelerated.
2. **Timing**: Keep the total animation duration between 1-2 seconds for a smooth but noticeable effect.
3. **Easing**: Use ease-in-out transitions for natural movement.
4. **Testing**: Test on different screen sizes to ensure the animation works well across devices.
5. **Accessibility**: Ensure the animation doesn't interfere with screen readers or keyboard navigation.
6. **Symmetry**: Maintain symmetry between forward and reverse animations for a cohesive experience.
7. **State Management**: Properly track and reset state variables to prevent animation glitches.

## Related Components

The hero animation interacts with:
- `MovieInfoModal` - Opened when clicking "More Info"
- `PlayerContext` - Used when clicking "Watch Our Work"
- `getSpaceVideo` service - Provides the video content

## Future Enhancements

Potential improvements to consider:
- Add hover states that temporarily reveal the description
- Implement scroll-based animation triggers
- Add subtle parallax effects to background elements
- Create mobile-specific animation behaviors
- Add user controls to pause/play the video and control the animation cycle
- Implement preloading strategies to ensure smooth video playback
- Add fallback behaviors for browsers that don't support certain animation features 