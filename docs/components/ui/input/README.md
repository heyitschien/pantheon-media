# Input Component

Status: ✅ Ready for Production

## Overview
The Input component provides a flexible and accessible text input solution for the Modern Streaming Hub platform. It supports various types of text input, including search, with built-in validation and error handling.

## Usage

```tsx
import { Input } from '@/components/ui/input'

// Basic Text Input
<Input
  placeholder="Enter title"
  value={value}
  onChange={handleChange}
/>

// Search Input
<Input
  type="search"
  placeholder="Search movies..."
  leftIcon={<SearchIcon />}
  onSearch={handleSearch}
/>

// With Validation
<Input
  type="email"
  value={email}
  onChange={handleEmailChange}
  error={emailError}
  helperText="Enter a valid email address"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | 'text' \| 'search' \| 'email' \| 'password' | 'text' | Input type |
| value | string | '' | Input value |
| placeholder | string | undefined | Placeholder text |
| onChange | (value: string) => void | undefined | Change handler |
| onSearch | (value: string) => void | undefined | Search handler |
| error | boolean | false | Error state |
| helperText | string | undefined | Helper/Error text |
| leftIcon | ReactNode | undefined | Left icon element |
| rightIcon | ReactNode | undefined | Right icon element |
| disabled | boolean | false | Disabled state |
| autoFocus | boolean | false | Auto focus on mount |
| clearable | boolean | false | Show clear button |

## Variants

### Text Input
- Basic text entry
- Optional icons
- Helper text support
- Error state handling

### Search Input
- Search icon
- Clear button
- Instant search
- Search suggestions

### Password Input
- Toggle password visibility
- Password strength indicator
- Error validation
- Security guidelines

### Email Input
- Email validation
- Error formatting
- Domain suggestions
- Auto-completion

## States

### Default
- Clear placeholder
- Visible boundaries
- Proper spacing
- Cursor indicator

### Focus
- Highlighted border
- Background change
- Clear focus ring
- Keyboard navigation

### Error
- Red border color
- Error message
- Icon indicator
- Validation feedback

### Disabled
- Reduced opacity
- No interaction
- Visual distinction
- Cursor: not-allowed

## Accessibility

### Keyboard Navigation
- Tab focus
- Arrow key navigation
- Enter submission
- Escape to clear

### Screen Readers
- Input labels
- Error messages
- Status updates
- Clear button labels

### ARIA Support
- aria-invalid
- aria-describedby
- aria-required
- role definitions

## Implementation Details

### CSS Classes
```css
.input-base {
  @apply w-full px-4 py-2;
  @apply border border-gray-300;
  @apply rounded-lg;
  @apply transition-colors duration-200;
}

.input-focus {
  @apply focus:ring-2 focus:ring-primary-500;
  @apply focus:border-primary-500;
  @apply outline-none;
}

.input-error {
  @apply border-red-500;
  @apply focus:ring-red-500;
  @apply focus:border-red-500;
}
```

### Event Handling
- Debounced search
- Change validation
- Focus management
- Clear functionality

## Testing

### Unit Tests
- Value updates
- Event handling
- Validation logic
- State management

### Integration Tests
- Form submission
- Search functionality
- Error handling
- Keyboard navigation

### Visual Tests
- Layout consistency
- State transitions
- Error display
- Icon alignment

## Best Practices

### Do
- Use clear placeholders
- Provide feedback
- Validate input
- Show helper text

### Don't
- Use vague labels
- Delay feedback
- Hide validation
- Ignore errors

## Examples

### Search Input with Suggestions
```tsx
<Input
  type="search"
  placeholder="Search movies..."
  leftIcon={<SearchIcon />}
  clearable
  onSearch={handleSearch}
  suggestions={searchSuggestions}
  onSuggestionSelect={handleSuggestionSelect}
/>
```

### Form Input with Validation
```tsx
<Input
  type="email"
  value={email}
  onChange={handleEmailChange}
  error={!!emailError}
  helperText={emailError || 'Enter your email address'}
  required
  aria-describedby="email-error"
/>
```

### Password Input with Strength
```tsx
<Input
  type="password"
  value={password}
  onChange={handlePasswordChange}
  rightIcon={<PasswordToggleIcon />}
  strengthIndicator={<PasswordStrength strength={passwordStrength} />}
  helperText="Must be at least 8 characters"
/>
```

## Related Components
- [SearchBar](../search-bar/README.md)
- [FormField](../form-field/README.md)
- [InputGroup](../input-group/README.md)
- [AutoComplete](../auto-complete/README.md) 