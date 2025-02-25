# Modal Component

Status: ✅ Ready for Production

## Overview
The Modal component provides a flexible dialog system for the Modern Streaming Hub platform. It supports both standard dialogs and full-screen modals, with Netflix-style animations and accessibility features.

## Usage

```tsx
import { Modal } from '@/components/ui/modal'

// Basic Modal
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Movie Details"
>
  <Modal.Content>
    Your content here
  </Modal.Content>
</Modal>

// Full-screen Modal
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  variant="fullscreen"
  title="Now Playing"
>
  <Modal.Hero>
    <VideoPlayer />
  </Modal.Hero>
  <Modal.Content>
    Movie details and controls
  </Modal.Content>
</Modal>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isOpen | boolean | false | Controls modal visibility |
| onClose | () => void | required | Close handler |
| title | string | required | Modal title |
| variant | 'standard' \| 'fullscreen' | 'standard' | Modal variant |
| size | 'sm' \| 'md' \| 'lg' \| 'xl' | 'md' | Modal size (standard only) |
| closeOnOverlayClick | boolean | true | Close on backdrop click |
| closeOnEscape | boolean | true | Close on Escape key |
| showCloseButton | boolean | true | Show close button |
| initialFocus | RefObject<HTMLElement> | undefined | Element to focus on open |

## Variants

### Standard Modal
- Centered dialog
- Flexible sizing
- Backdrop blur
- Close button
- Scroll management

### Fullscreen Modal
- Edge-to-edge content
- Hero section support
- Slide-up animation
- Mobile optimization
- Video player integration

## Subcomponents

### Modal.Header
- Title display
- Close button
- Optional back button
- Custom actions

### Modal.Content
- Main content area
- Scroll container
- Padding management
- Content transitions

### Modal.Hero
- Video/Image container
- Gradient overlay
- Content positioning
- Responsive scaling

### Modal.Footer
- Action buttons
- Fixed positioning
- Button alignment
- Optional divider

## States

### Opening
- Fade in backdrop
- Scale/Slide animation
- Focus management
- Content reveal

### Closing
- Fade out backdrop
- Exit animation
- Focus restoration
- Content cleanup

### Loading
- Loading indicator
- Content skeleton
- Maintain size
- Prevent interaction

## Accessibility

### Keyboard Navigation
- Tab trapping
- Escape to close
- Arrow key navigation
- Return focus on close

### Screen Readers
- Role="dialog"
- Aria-modal="true"
- Aria-labelledby
- Aria-describedby

### Focus Management
- Focus trap
- Initial focus
- Focus restoration
- Scroll locking

## Implementation Details

### CSS Classes
```css
.modal-backdrop {
  @apply fixed inset-0;
  @apply bg-black/80;
  @apply backdrop-blur-sm;
  @apply transition-opacity duration-300;
}

.modal-container {
  @apply fixed inset-0;
  @apply flex items-center justify-center;
  @apply p-4;
}

.modal-content {
  @apply bg-gray-900;
  @apply rounded-xl;
  @apply shadow-2xl;
  @apply transform transition-all duration-300;
}

.modal-fullscreen {
  @apply fixed inset-0;
  @apply bg-black;
  @apply transform transition-transform duration-500;
}
```

### Animation System
```typescript
const animations = {
  standard: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  },
  fullscreen: {
    initial: { opacity: 0, y: '100%' },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: '100%' }
  }
};
```

## Testing

### Unit Tests
- Open/Close behavior
- Keyboard interaction
- Focus management
- Animation states

### Integration Tests
- Content rendering
- Event handling
- Scroll behavior
- Mobile interaction

### Visual Tests
- Animation smoothness
- Responsive layout
- Dark mode
- Loading states

## Best Practices

### Do
- Lock body scroll
- Manage focus
- Provide transitions
- Handle cleanup

### Don't
- Nest modals
- Block closing
- Skip animations
- Ignore mobile

## Examples

### Movie Details Modal
```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  variant="fullscreen"
>
  <Modal.Hero>
    <VideoPlayer
      src={movie.trailerUrl}
      poster={movie.posterUrl}
    />
  </Modal.Hero>
  <Modal.Content>
    <MovieDetails movie={movie} />
    <ActionButtons movie={movie} />
  </Modal.Content>
</Modal>
```

### Confirmation Dialog
```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  size="sm"
  title="Confirm Action"
>
  <Modal.Content>
    Are you sure you want to proceed?
  </Modal.Content>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleConfirm}>
      Confirm
    </Button>
  </Modal.Footer>
</Modal>
```

### Loading Modal
```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  loading={isLoading}
>
  <Modal.Content>
    {isLoading ? (
      <LoadingSpinner />
    ) : (
      <ContentComponent />
    )}
  </Modal.Content>
</Modal>
```

## Related Components
- [Dialog](../dialog/README.md)
- [VideoPlayer](../../player/README.md)
- [LoadingSpinner](../loading-spinner/README.md)
- [Portal](../portal/README.md) 