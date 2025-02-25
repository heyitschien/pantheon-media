# UI Components

This directory contains documentation for all shared UI components in the Modern Streaming Hub project. Each component follows our design system and accessibility guidelines.

## Component Status
| Component | Status | Documentation | Tests | Accessibility |
|-----------|--------|---------------|--------|---------------|
| Button    | ✅     | Complete      | ✅     | WCAG 2.1 AA  |
| Input     | ✅     | Complete      | ✅     | WCAG 2.1 AA  |
| Modal     | ✅     | Complete      | ✅     | WCAG 2.1 AA  |
| Navigation| ✅     | Complete      | ✅     | WCAG 2.1 AA  |
| Controls  | ✅     | Complete      | ✅     | WCAG 2.1 AA  |

## Core Components

### [Button](./button/README.md)
- Primary, Secondary, and Tertiary variants
- Icon support
- Loading states
- Disabled states
- Hover and focus states

### [Input](./input/README.md)
- Text input
- Search input
- Error states
- Validation
- Helper text

### [Modal](./modal/README.md)
- Standard modal
- Full-screen modal
- Backdrop handling
- Focus management
- Keyboard navigation

### [Navigation](./navigation/README.md)
- Main navigation
- Mobile navigation
- Dropdown menus
- Breadcrumbs
- Search bar

### [Controls](./controls/README.md)
- Play/Pause buttons
- Volume controls
- Progress bar
- Quality selector
- Subtitles toggle

## Design Guidelines

### Spacing
- Use our spacing scale: 4px, 8px, 16px, 24px, 32px, 48px, 64px
- Maintain consistent padding within components
- Follow grid system for alignment

### Typography
- Use defined type scale
- Maintain consistent line heights
- Follow heading hierarchy

### Colors
- Use theme tokens for colors
- Ensure sufficient contrast (WCAG 2.1)
- Use semantic color naming

### Interactions
- Consistent hover states
- Focus indicators
- Loading states
- Error states
- Success states

## Accessibility Guidelines
- All components meet WCAG 2.1 AA standards
- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly
- Focus management

## Implementation
- Built with React + TypeScript
- Styled with Tailwind CSS
- Unit tested with Vitest
- E2E tested with Playwright
- Storybook documentation

## Contributing
1. Follow component structure template
2. Include tests
3. Document props and usage
4. Add accessibility features
5. Create Storybook stories 