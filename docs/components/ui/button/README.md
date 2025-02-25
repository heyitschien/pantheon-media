# Button Component

Status: ✅ Ready for Production

## Overview
The Button component is a fundamental UI element that follows our design system guidelines. It provides various styles and states to handle different user interactions while maintaining accessibility standards.

## Usage

```tsx
import { Button } from '@/components/ui/button'

// Primary Button
<Button variant="primary">Click Me</Button>

// Secondary Button
<Button variant="secondary">Cancel</Button>

// Icon Button
<Button variant="icon" icon={<PlayIcon />}>Play</Button>

// Loading State
<Button loading>Processing...</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'primary' \| 'secondary' \| 'tertiary' \| 'icon' | 'primary' | The visual style variant of the button |
| size | 'sm' \| 'md' \| 'lg' | 'md' | The size of the button |
| loading | boolean | false | Shows loading spinner and disables button |
| disabled | boolean | false | Disables button interactions |
| icon | ReactNode | undefined | Optional icon element |
| fullWidth | boolean | false | Makes button take full width |
| onClick | () => void | undefined | Click handler |

## Variants

### Primary Button
- Used for primary actions
- High contrast background
- Clear hover state
- Loading state support

### Secondary Button
- Used for secondary actions
- Outlined style
- Subtle hover effect
- Pairs well with primary

### Tertiary Button
- Used for tertiary actions
- Text-only style
- Minimal visual weight
- Good for less important actions

### Icon Button
- Used for icon-only actions
- Square aspect ratio
- Tooltip support
- Aria-label required

## States

### Default
- Clear background
- High contrast text
- Visible borders where needed

### Hover
- Background lightens
- Smooth transition
- Cursor: pointer

### Focus
- Keyboard focus ring
- High contrast outline
- No focus ring on click

### Active
- Slight scale reduction
- Darker background
- Immediate feedback

### Loading
- Centered spinner
- Disabled interactions
- Maintains width
- Optional loading text

### Disabled
- Reduced opacity
- No hover effects
- No interactions
- Cursor: not-allowed

## Accessibility

### Keyboard Navigation
- Focusable with Tab
- Activated with Enter/Space
- Focus visible indicator
- No focus ring on click

### Screen Readers
- Role="button"
- Aria-disabled when disabled
- Aria-label for icon buttons
- Loading state announced

### Color Contrast
- Meets WCAG 2.1 AA
- Tested with common color blindness
- High contrast mode support

## Implementation Details

### CSS Classes
```css
.btn-primary {
  @apply bg-primary-600 text-white hover:bg-primary-700;
}

.btn-secondary {
  @apply border-2 border-primary-600 text-primary-600;
}

.btn-tertiary {
  @apply text-primary-600 hover:bg-primary-50;
}
```

### Event Handling
- Debounced click handlers
- Touch event support
- Prevent double submission
- Loading state management

## Testing

### Unit Tests
- Renders in all variants
- Handles click events
- Manages loading state
- Maintains accessibility

### Integration Tests
- Works in forms
- Handles async actions
- Maintains state
- Keyboard navigation

### Visual Tests
- Storybook stories
- Visual regression
- Dark mode support
- Responsive design

## Best Practices

### Do
- Use semantic colors
- Maintain consistent spacing
- Include loading states
- Add hover feedback

### Don't
- Mix different variants in a group
- Disable without feedback
- Remove focus styles
- Use non-semantic colors

## Examples

### Form Submit Button
```tsx
<Button 
  variant="primary"
  loading={isSubmitting}
  onClick={handleSubmit}
>
  {isSubmitting ? 'Saving...' : 'Save Changes'}
</Button>
```

### Icon Button with Tooltip
```tsx
<Button
  variant="icon"
  icon={<PlayIcon />}
  aria-label="Play video"
  tooltip="Play"
/>
```

### Button Group
```tsx
<div className="flex gap-2">
  <Button variant="secondary">Cancel</Button>
  <Button variant="primary">Confirm</Button>
</div>
```

## Related Components
- [IconButton](../icon-button/README.md)
- [ButtonGroup](../button-group/README.md)
- [LoadingSpinner](../loading-spinner/README.md) 