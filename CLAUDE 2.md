# Pantheon Media Project Coordination

## Project Overview
- Modern streaming platform with focus on cinematic storytelling
- Tech Stack: React 18, TypeScript, Tailwind CSS, Vite, Bunny.net
- Key Components: PantheonCard, PantheonPreview, PantheonMediaContainer
- Video Integration: Bunny.net HLS Streaming

## Assistant Roles

### Claude in Cursor (Primary Architect)
- Architecture & Planning
- UX/Design Reviews
- Component Design
- Complex Feature Discussions
- Documentation
- Progress Tracking
- Test Strategy Development

### Claude Code (Implementation Support)
- Test Fixes & Validation
- Performance Optimization
- Code Search & Analysis
- Direct File Edits
- Git Operations
- Technical Implementation
- Infrastructure Setup

## Current Focus
- ✓ Refactoring preview card system
- ✓ Improving test coverage for PantheonPreview
- → Setting up test infrastructure
- → Implementing test wrapper utility
- → Creating Bunny.net service mock

## Testing Standards
### Framework & Tools
- Primary: Vitest with React Testing Library
- Utilities: @testing-library/user-event
- Wrapper: Custom TestWrapper component
- Mock Data: Centralized test data
- Video: Bunny.net HLS mock implementation

### Best Practices
1. Component Testing:
   - Use data-testid for element selection
   - Test class presence over computed styles
   - Wrap state updates in act()
   - Use renderWithWrapper utility

2. Mock Implementation:
   - Use ReturnType<typeof vi.fn> for type safety
   - Provide complete mock objects
   - Centralize common mocks (video, HLS)
   - Document mock behavior

3. State Management:
   - Use waitForStateUpdate helper
   - Handle async operations properly
   - Clean up resources after tests
   - Test error states

4. Visual Testing:
   - Verify class presence
   - Check accessibility attributes
   - Test responsive behavior
   - Validate transitions

### Test File Structure
```typescript
import { renderWithWrapper, simulateHover } from '@/test/test-wrapper';

describe('ComponentName', () => {
  describe('Visual Elements', () => {
    // Render and style tests
  });

  describe('Interactions', () => {
    // User interaction tests
  });

  describe('State Management', () => {
    // Component state tests
  });

  describe('Error Handling', () => {
    // Error state tests
  });
});
```

## Build Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run all tests
- `npm test -- -t "component name"` - Run specific test
- `npm test file.test.tsx` - Run tests in specific file
- `npm run lint` - Run ESLint
- `npm run test:coverage` - Generate coverage report

## Code Style Guidelines
- **Imports**: Group by external/internal, use absolute paths with @/ alias
- **Components**: Use PascalCase for components, camelCase for functions/hooks
- **File Structure**: Follow modular architecture
- **Error Handling**: Use try/catch with specific messages
- **State Management**: Use React Context for global state
- **Testing**: Follow RTL best practices, focus on user behavior

## Progress Tracking
### Completed
- ✓ PantheonPreview test fixes
- ✓ Test utilities setup
- ✓ Mock implementations

### In Progress
- → Test wrapper implementation
- → Bunny.net service mock
- → Movie info modal tests

### Upcoming
1. Performance benchmarking
2. Visual regression testing
3. Accessibility testing
4. Documentation updates

## Handoff Protocol
1. Current State
2. Specific Task/Question
3. Relevant Files
4. Expected Outcome
5. Next Steps

## Project Standards
- Component Naming: Pantheon[ComponentName]
- Test Pattern: [ComponentName].test.tsx
- Color System: 
  - Primary: #E05A8C (pink), #8A5EC8 (purple), #4A7FE0 (blue)
  - Accent: #F09045 (orange), #D4AF37 (gold)
  - Background: #121620 (night)
- Video Integration: Bunny.net HLS

### Accessibility Standards
- All interactive components must include proper ARIA attributes
- Keyboard navigation support is required
- Loading states must be properly indicated
- Error states must be visually distinct
- Screen reader support is mandatory
- Focus management must be implemented
- Color contrast must meet WCAG guidelines

### Error Handling Standards
- All user-facing components must implement error boundaries
- Error states must provide clear feedback
- Toast notifications for user feedback
- Proper error logging and monitoring
- Graceful fallback UI for error states
- TypeScript for type safety
- Proper error propagation

### Component Standards
- Use TypeScript interfaces for props
- Implement proper ref forwarding
- Include loading states
- Handle error cases
- Support keyboard navigation
- Follow ARIA best practices
- Include proper documentation
- Add unit tests for all states