# Hero Image to Video Transition Solution

## Initial Problem
When transitioning from a static image to a video in the hero section, we encountered several issues:

1. **Abrupt Transitions**
   - The transition was jumping instead of fading smoothly
   - Video would appear suddenly even with opacity transitions
   - CSS transitions weren't being respected

2. **Original Approach Issues**
```tsx
// Original problematic approach
<div className={`transition-opacity duration-[2500ms] ${showVideo ? 'opacity-100' : 'opacity-0'}`}>
```
This didn't work because:
- CSS class changes were competing with video loading
- Browser was optimizing/batching updates differently than expected
- Video playback was starting after opacity changes

## Solution

### 1. State Management
```tsx
// Added transition state to prevent multiple transitions
const [isTransitioning, setIsTransitioning] = useState(false);
```

### 2. Layer Structure
```tsx
// Both layers always present, controlled by opacity
<div className="absolute inset-0">
  {/* Image Layer */}
  <div 
    className="absolute inset-0 transition-all ease-in-out duration-1000"
    style={{ opacity: showVideo ? 0 : 1 }}
  >
    <img ... />
  </div>

  {/* Video Layer */}
  <div 
    className="absolute inset-0 transition-all ease-in-out duration-1000"
    style={{ opacity: showVideo ? 1 : 0 }}
  >
    <video ... />
  </div>
</div>
```

### 3. Transition Handling
```tsx
const handlePlay = () => {
  if (!isVideoLoaded || !videoAsset || isTransitioning) return;
  
  setIsTransitioning(true);
  
  if (videoRef.current) {
    videoRef.current.currentTime = 0;
    // Ensure video is playing before starting transition
    videoRef.current.play()
      .then(() => {
        setShowVideo(true);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 1000);
      })
      .catch(console.error);
  }
};
```

## Why This Works Better

1. **Inline Styles vs Classes**
   - Using `style={{ opacity }}` provides more direct control
   - Prevents class application timing issues
   - Browser handles inline style transitions more consistently

2. **Layer Management**
   - Both layers remain mounted
   - Prevents DOM reconstruction during transition
   - Allows for true CSS transitions

3. **Playback Coordination**
   - Video starts playing while invisible
   - Transition only begins after playback confirmed
   - Prevents visual jump from poster to video

4. **State Lock**
   - `isTransitioning` prevents multiple transitions
   - Ensures transition completes before new ones start
   - Better user experience with button disabled state

## Key Learnings

1. **Browser Optimization**
   - Browsers optimize video loading and class changes differently
   - Direct style manipulation is more predictable
   - Need to coordinate media playback with visual changes

2. **State Timing**
   - Media events and CSS transitions need careful coordination
   - Always ensure media is ready before starting transitions
   - Use state locks to prevent transition interruption

3. **Performance**
   - Keeping both layers mounted is more efficient
   - Opacity transitions perform better than mount/unmount
   - Shorter durations (1000ms) feel more responsive than longer ones

## Best Practices

1. Always ensure video is playing before starting transition
2. Use inline styles for critical animations
3. Keep transition duration reasonable (1000ms-2000ms)
4. Implement state locks for transitions
5. Handle loading and error states gracefully
6. Provide visual feedback during transitions
7. Maintain smooth performance by keeping layers mounted

## Common Pitfalls to Avoid

1. Don't rely on CSS classes for critical animations
2. Don't start transitions before media is ready
3. Don't mount/unmount media elements during transitions
4. Don't forget to handle loading and error states
5. Don't use overly long transition durations
6. Don't allow transitions to be interrupted

This solution provides a robust foundation for smooth image-to-video transitions that can be reused across similar components. 