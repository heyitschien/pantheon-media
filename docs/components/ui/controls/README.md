# Video Controls Component

Status: ✅ Ready for Production

## Overview
The Controls component provides a comprehensive set of video playback controls for the Modern Streaming Hub platform. It follows Netflix-style interaction patterns while maintaining our design system guidelines and accessibility standards.

## Usage

```tsx
import { Controls } from '@/components/ui/controls'

// Basic Usage
<Controls
  isPlaying={isPlaying}
  currentTime={currentTime}
  duration={duration}
  volume={volume}
  onPlayPause={handlePlayPause}
  onSeek={handleSeek}
  onVolumeChange={handleVolumeChange}
/>

// With Quality Control
<Controls
  quality="HD"
  availableQualities={['4K', 'HD', 'SD']}
  onQualityChange={handleQualityChange}
  {...baseProps}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isPlaying | boolean | false | Current playback state |
| currentTime | number | 0 | Current playback position in seconds |
| duration | number | 0 | Total video duration in seconds |
| volume | number | 1 | Current volume level (0-1) |
| quality | string | 'HD' | Current video quality |
| availableQualities | string[] | ['HD'] | Available quality options |
| isMuted | boolean | false | Current mute state |
| isFullscreen | boolean | false | Current fullscreen state |
| showSubtitles | boolean | false | Subtitles visibility state |
| onPlayPause | () => void | - | Play/pause handler |
| onSeek | (time: number) => void | - | Seek handler |
| onVolumeChange | (volume: number) => void | - | Volume change handler |
| onQualityChange | (quality: string) => void | - | Quality change handler |
| onFullscreenToggle | () => void | - | Fullscreen toggle handler |
| onSubtitlesToggle | () => void | - | Subtitles toggle handler |

## Control Elements

### Progress Bar
- Interactive seek bar
- Preview thumbnail on hover
- Buffer progress indication
- Current time display
- Remaining time display

### Playback Controls
- Play/Pause toggle
- Previous/Next episode
- 10s rewind/forward
- Keyboard shortcuts support

### Volume Controls
- Mute toggle
- Volume slider
- Vertical slider on hover
- Keyboard volume control

### Quality Controls
- Current quality display
- Quality selection menu
- Automatic quality option
- Quality change indication

### Additional Controls
- Fullscreen toggle
- Subtitles toggle
- Settings menu
- Info display

## States

### Default
- Controls visible on hover
- Fade in/out animation
- Semi-transparent background
- Clear interaction areas

### Hover
- Individual control highlights
- Preview thumbnails
- Tooltip information
- Cursor indicators

### Active
- Visual feedback
- Smooth transitions
- State updates
- Loading indicators

### Mobile/Touch
- Larger touch targets
- Simplified controls
- Gesture support
- Touch-optimized layout

## Accessibility

### Keyboard Navigation
- Tab navigation
- Space for play/pause
- Arrow keys for seeking
- Volume controls
- Quality selection

### Screen Readers
- Meaningful labels
- State announcements
- Time information
- Error notifications

### Focus Management
- Visible focus indicators
- Focus trap in menus
- Keyboard shortcuts
- Focus restoration

## Implementation Details

### CSS Classes
```css
.controls-container {
  @apply absolute bottom-0 inset-x-0;
  @apply bg-gradient-to-t from-black/80 to-transparent;
  @apply transition-opacity duration-300;
}

.progress-bar {
  @apply relative h-1 group-hover:h-3;
  @apply bg-white/30;
  @apply transition-all duration-200;
}

.control-button {
  @apply rounded-full p-2;
  @apply bg-white/20 hover:bg-white/30;
  @apply transition-colors duration-200;
}
```

### Event Handling
- Debounced seek updates
- Volume change throttling
- Quality change management
- Touch event handling

## Testing

### Unit Tests
- Control rendering
- State management
- Event handling
- Keyboard interaction

### Integration Tests
- Video player integration
- State synchronization
- Quality switching
- Mobile interaction

### Visual Tests
- Layout verification
- Animation testing
- Responsive design
- Dark mode support

## Best Practices

### Do
- Use consistent spacing
- Provide visual feedback
- Support keyboard navigation
- Include loading states

### Don't
- Block video content
- Delay user input
- Hide essential controls
- Ignore mobile users

## Examples

### Basic Video Controls
```tsx
<Controls
  isPlaying={videoState.isPlaying}
  currentTime={videoState.currentTime}
  duration={videoState.duration}
  onPlayPause={() => togglePlayback()}
  onSeek={(time) => seekTo(time)}
/>
```

### Advanced Controls with Quality
```tsx
<Controls
  {...baseProps}
  quality={currentQuality}
  availableQualities={['4K', 'HD', 'SD']}
  onQualityChange={(quality) => {
    setQuality(quality);
    updateVideoSource(quality);
  }}
  showSubtitles={subtitlesEnabled}
  onSubtitlesToggle={() => toggleSubtitles()}
/>
```

### Mobile-Optimized Controls
```tsx
<Controls
  {...baseProps}
  isMobile={true}
  gestureEnabled={true}
  onDoubleTap={(direction) => {
    if (direction === 'left') seekBackward(10);
    if (direction === 'right') seekForward(10);
  }}
/>
```

## Related Components
- [VideoPlayer](../../player/README.md)
- [QualitySelector](../quality-selector/README.md)
- [VolumeSlider](../volume-slider/README.md)
- [ProgressBar](../progress-bar/README.md) 