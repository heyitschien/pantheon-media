# Current Handoff: Preview Card System

To: Claude Code
Task: Fix failing tests in PantheonPreview component

## Context
- Recently refactored hover behavior
- Separated preview logic from base card
- Added HLS video cleanup
- Current focus on test stability and performance

## Files
Primary:
- src/components/media/PantheonPreview.tsx
- src/components/media/__tests__/PantheonPreview.test.tsx

Related:
- src/components/media/PantheonCard.tsx
- src/components/media/PantheonMediaContainer.tsx

## Current Issues
1. Preview visibility state management
   - Inconsistent show/hide behavior
   - Race conditions in state updates

2. HLS cleanup on unmount
   - Memory leaks reported
   - Cleanup timing issues
   - Resource management needs improvement

3. Z-index management during hover
   - Stacking context issues
   - Animation timing inconsistencies

## Expected Outcome
- All tests passing
- No memory leaks from HLS
- Smooth preview transitions
- Consistent z-index management
- No console errors

## Next Steps
1. Run test suite
2. Identify specific failing tests
3. Fix HLS cleanup
4. Report back for UX review

## Technical Notes
- Consider debouncing for preview loading
- Check for race conditions in video initialization
- Verify cleanup in all edge cases
- Monitor memory usage during transitions

## Handoff Checklist
- [ ] Review current test failures
- [ ] Analyze HLS cleanup implementation
- [ ] Check z-index management
- [ ] Verify state management
- [ ] Test edge cases
- [ ] Document findings

## Communication
- Report findings in TASKS.md
- Update test status in GitHub
- Flag any UX concerns for review 