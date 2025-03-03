# Current Tasks

## Active Sprint
- [x] Fix PantheonPreview Tests
  - Owner: Claude Code
  - Status: Completed
  - Files: src/components/media/PantheonPreview.tsx
  - Dependencies: None
  - Priority: High
  - Success Criteria:
    - ✓ All tests passing
    - ✓ No memory leaks
    - ✓ Smooth transitions
  - Completed Changes:
    - Fixed Jest/Vitest type mismatch
    - Updated style testing approach
    - Improved performance testing
    - Fixed HLS mock implementation
    - Added proper error checking
    - Added required data attributes
    - Added description rendering

- [ ] HLS Cleanup Implementation
  - Owner: Claude Code
  - Status: In Progress
  - Files: src/components/media/PantheonPreview.tsx
  - Dependencies: Test fixes ✓
  - Priority: High
  - Success Criteria:
    - No memory leaks
    - Clean unmount
    - No console errors

- [ ] Preview Animation Review
  - Owner: Claude in Cursor
  - Status: Not Started
  - Files: src/components/media/PantheonMediaContainer.tsx
  - Dependencies: None
  - Priority: Medium
  - Success Criteria:
    - Smooth transitions
    - No flickering
    - Consistent z-index

## New Issues to Address
- [ ] Create missing test wrapper utility
  - Owner: Unassigned
  - Status: New
  - Files: src/test/test-wrapper.tsx
  - Priority: Medium

- [ ] Fix YouTube service import
  - Owner: Unassigned
  - Status: New
  - Files: src/services/youtube.ts
  - Priority: Medium

- [ ] Create movie-info-modal test suite
  - Owner: Unassigned
  - Status: New
  - Files: src/components/ui/__tests__/movie-info-modal.test.tsx
  - Priority: Low

## Decisions Log
2024-03-21: Separated PantheonCard from PantheonPreview
- Context: Improve component responsibility separation
- Owner: Claude in Cursor
- Status: Implemented
- Impact: Improved maintainability and testing
- Next Steps: Complete test coverage ✓

2024-03-21: Adopted Bunny.net for video streaming
- Context: Better performance and preview generation
- Owner: Claude in Cursor
- Status: Implemented
- Impact: Improved video loading and quality
- Next Steps: Optimize cleanup and memory management

2024-03-21: Updated Testing Strategy
- Context: Improved test reliability and maintainability
- Owner: Claude Code
- Status: Implemented
- Impact: More reliable and maintainable tests
- Changes:
  - Switched to class presence testing
  - Improved mock implementations
  - Better error handling
  - Added data-testid attributes

## Next Up
1. Performance benchmarking
2. Visual regression testing
3. Accessibility audit

## Test Infrastructure (High Priority)
- [ ] Create Test Wrapper Utility
  - Owner: Claude Code
  - Status: Ready for Implementation
  - Files: src/test/test-wrapper.tsx
  - Dependencies: None
  - Priority: High (Blocking)
  - Success Criteria:
    - Handles React state updates with act()
    - Provides common test providers
    - Supports hover interactions
    - Follows RTL best practices
  - Implementation Details:
    - Export TestWrapper component
    - Include necessary providers
    - Add act() wrapper utility
    - Add hover simulation helpers

- [ ] Create Bunny.net Service Mock
  - Owner: Claude Code
  - Status: Ready for Implementation
  - Files: src/services/bunny.ts
  - Dependencies: None
  - Priority: High
  - Success Criteria:
    - Movie card tests can import service
    - Proper TypeScript types
    - Mock implementation for tests
    - HLS stream initialization
    - Preview video loading

- [ ] Create Movie Info Modal Tests
  - Owner: Claude Code
  - Status: Ready for Implementation
  - Files: src/components/ui/__tests__/movie-info-modal.test.tsx
  - Dependencies: Test Wrapper
  - Priority: Medium
  - Success Criteria:
    - Basic render tests
    - Interaction tests
    - State management tests
    - Accessibility tests

## Decisions Log
2024-03-21: Updated Testing Infrastructure
- Context: Need robust test utilities and mocks
- Owner: Claude Code
- Status: In Progress
- Impact: Will improve test reliability and reduce boilerplate
- Changes:
  - Creating centralized test wrapper
  - Standardizing mock implementations
  - Adding helper utilities
  - Improving error handling

## Next Up
1. Implement test wrapper utility
2. Create Bunny.net service mock
3. Create movie info modal tests
4. Complete HLS cleanup implementation
5. Address remaining act() warnings

### Hover Card System Improvements
- Owner: Claude
- Status: Updated
- Files affected: 
  - src/components/ui/hover-card.tsx
  - src/components/ui/__tests__/hover-card.test.tsx
- Success criteria:
  - [x] Simplified hover preview (removed description)
  - [x] Clear separation between hover preview and info modal
  - [x] Enhanced accessibility with ARIA attributes
  - [x] Proper error handling with toast notifications
  - [x] Loading states and visual feedback
  - [x] Keyboard navigation support
  - [x] Performance optimizations
  - [x] Preloading support
- Changes made:
  1. Removed description from hover preview
  2. Simplified hover card content
  3. Reduced padding for preview card
  4. Updated error messages to be preview-specific
  5. Maintained accessibility features
  6. Kept performance optimizations
  7. Preserved loading states

### Info Modal Implementation
- Owner: Unassigned
- Status: Ready for Implementation
- Files:
  - src/components/ui/movie-info-modal.tsx
  - src/components/ui/__tests__/movie-info-modal.test.tsx
- Priority: High
- Success Criteria:
  - [ ] Full movie details display
  - [ ] Description text
  - [ ] Additional metadata
  - [ ] "More Info" button functionality
  - [ ] Proper modal transitions
  - [ ] Accessibility support
  - [ ] Test coverage

## Decisions Log

### Hover Card and Info Modal Separation
- Date: [Current Date]
- Decision: Separated hover preview from full info modal functionality
- Rationale: 
  - Hover preview should be lightweight and quick
  - Full details reserved for info modal
  - Better user experience with progressive disclosure
- Impact:
  - Clearer user interaction model
  - Better performance for hover previews
  - More organized code structure

## Next Up
1. Test accessibility improvements with screen readers
2. Add automated accessibility tests
3. Document new hover card props and features 