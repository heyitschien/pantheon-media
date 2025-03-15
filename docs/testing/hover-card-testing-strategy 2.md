# Hover Card Testing Strategy

## Progress Tracking

### Implementation Status
- [x] Strategy document created
- [x] Basic test setup completed
- [x] Mock implementations defined
- [ ] Integration tests with MovieRow
- [ ] Performance benchmarks
- [ ] Visual regression tests

### Test Coverage Status
- [x] Basic hover functionality (100%)
- [x] Resource cleanup (100%)
- [x] Error handling (100%)
- [x] Concurrent hover states (100%)
- [ ] Parent-child interactions (0%)
- [ ] Performance metrics (0%)

### Current Focus
🔄 Phase 1: Basic Functionality Implementation
- Current Task: Integration tests with MovieRow component
- Next Task: Performance benchmarks implementation

## Overview
This document outlines our testing strategy for resolving the hover card preview functionality issues. The goal is to use testing to identify, isolate, and fix the current problems with the hover card behavior.

## Why Testing Will Help

### 1. Issue Isolation
Testing helps isolate where exactly the hover card functionality is breaking by:
- Testing the video preview loading in isolation
- Verifying state transitions during hover
- Checking memory management and cleanup
- Validating event handler behavior

### 2. Regression Prevention
Once fixed, tests will ensure the hover functionality doesn't break again by:
- Verifying hover state management
- Ensuring proper video resource cleanup
- Validating transition animations
- Checking memory usage patterns

## Test Categories

### 1. Unit Tests
```typescript
// Example test structure for hover card
describe('MovieCard Hover Functionality', () => {
  it('should load preview on hover', async () => {
    // Test preview loading
  });

  it('should cleanup resources on unhover', () => {
    // Test cleanup
  });

  it('should handle failed preview loads', () => {
    // Test error states
  });
});
```

### 2. Integration Tests
```typescript
describe('MovieCard Integration', () => {
  it('should integrate with video service', async () => {
    // Test video service integration
  });

  it('should manage hover state with row component', () => {
    // Test parent-child interaction
  });
});
```

### 3. Performance Tests
```typescript
describe('MovieCard Performance', () => {
  it('should limit concurrent video loads', () => {
    // Test resource management
  });

  it('should cleanup memory properly', () => {
    // Test memory management
  });
});
```

### 4. Visual Transition Tests
```typescript
describe('MovieCard Visual Transitions', () => {
  it('should smoothly transition from poster to preview', async () => {
    // Test opacity transitions
  });

  it('should maintain aspect ratio during transition', () => {
    // Test layout stability
  });

  it('should handle HLS video initialization', () => {
    // Test video quality transitions
  });
});
```

### 5. Performance Metrics
```typescript
describe('MovieCard Performance', () => {
  it('should load preview within 300ms', async () => {
    // Test loading performance
  });

  it('should maintain 60fps during transitions', () => {
    // Test animation performance
  });

  it('should limit memory usage to 100MB', () => {
    // Test memory constraints
  });
});
```

## Test Implementation Plan

### Phase 1: Basic Functionality
1. Test hover state management
2. Test preview video loading
3. Test transition animations
4. Test error handling

### Phase 2: Integration
1. Test interaction with video service
2. Test parent component communication
3. Test event propagation
4. Test state management

### Phase 3: Performance
1. Test resource management
2. Test memory usage
3. Test concurrent loads
4. Test cleanup procedures

### Phase 4: Visual Quality
1. Test visual regression
2. Test transition smoothness
3. Test layout stability
4. Test HLS video quality

## Test Utilities Needed

### 1. Mock Implementations
```typescript
// Video service mock
const mockVideoService = {
  getPreviewVideo: vi.fn(),
  cleanup: vi.fn()
};

// IntersectionObserver mock
const mockIntersectionObserver = {
  observe: vi.fn(),
  unobserve: vi.fn()
};
```

### 2. Test Helpers
```typescript
// Hover simulation helper
const simulateHover = async (element: HTMLElement) => {
  fireEvent.mouseEnter(element);
  await waitFor(() => {
    // Wait for hover effects
  });
};

// Cleanup helper
const verifyCleanup = (element: HTMLElement) => {
  fireEvent.mouseLeave(element);
  // Verify cleanup
};
```

## Expected Outcomes

### 1. Functionality Verification
- Confirm hover triggers preview loading
- Verify proper state transitions
- Ensure cleanup on unhover
- Validate error handling

### 2. Performance Validation
- Verify memory usage patterns
- Confirm resource cleanup
- Check concurrent load handling
- Validate transition smoothness

### 3. Integration Confirmation
- Verify service communication
- Confirm state management
- Check event handling
- Validate parent-child interaction

### 4. Visual Quality Confirmation
- Verify visual regression
- Confirm layout stability
- Validate HLS video quality

### 5. Performance Metrics Confirmation
- Verify loading time
- Confirm animation performance
- Validate memory constraints

## Implementation Priority

1. Basic Functionality Tests
   - [x] Hover state management
   - [x] Preview loading
   - [x] Error handling

2. Integration Tests
   - [ ] Video service integration
   - [ ] Component communication
   - [ ] State management

3. Performance Tests
   - [ ] Resource management
   - [ ] Memory cleanup
   - [ ] Load handling

4. Visual Quality Tests
   - [ ] Visual regression
   - [ ] Layout stability
   - [ ] HLS video quality

5. Performance Metrics Tests
   - [ ] Loading time
   - [ ] Animation performance
   - [ ] Memory constraints

## Success Criteria

- All unit tests passing
- Integration tests verifying component interaction
- Performance tests confirming resource management
- No memory leaks detected
- Smooth transition animations verified
- Error states properly handled

### Additional Success Metrics
- Preview load time < 300ms
- Transition animation maintains 60fps
- Memory usage < 100MB per card
- No layout shifts during transitions (CLS < 0.1)
- HLS video initialization < 500ms
- Cache hit rate > 90%

## Step-by-Step Implementation Guide

### Phase 1: Basic Functionality ✅
1. [x] Set up test environment
2. [x] Implement hover state tests
3. [x] Add resource cleanup tests
4. [x] Implement error handling tests

### Phase 2: Integration 🔄
1. [ ] Set up MovieRow integration tests
2. [ ] Implement parent-child communication tests
3. [ ] Add event propagation tests
4. [ ] Test state management between components

### Phase 3: Performance 📊
1. [ ] Set up performance measurement tools
2. [ ] Implement loading time tests
3. [ ] Add memory usage tests
4. [ ] Create animation performance tests

### Phase 4: Visual Quality 🎨
1. [ ] Set up visual regression testing
2. [ ] Implement transition tests
3. [ ] Add layout stability tests
4. [ ] Create HLS quality tests

## Monitoring and Reporting

### Performance Dashboard
- [ ] Set up performance monitoring
- [ ] Create test coverage dashboard
- [ ] Implement visual regression comparison
- [ ] Track memory usage over time

### Weekly Progress Review
- [ ] Review test results
- [ ] Update progress tracking
- [ ] Identify bottlenecks
- [ ] Plan next improvements

## Next Steps

1. Implement basic functionality tests
2. Add integration tests
3. Create performance test suite
4. Set up continuous testing
5. Monitor and adjust based on results

## Visual Acceptance Criteria

### Preview Modal Layout
```
┌────────────────────────────┐
│                            │
│      Video Preview         │
│                            │
│                            │
├────────────────────────────┤
│ 2024 • 23m • PG-13         │
├────────────────────────────┤
│ [Regenerative] [Nature]    │
│ [Sustainability] [Wellness]│
│ [Documentary]              │
└────────────────────────────┘
```

### Required Visual Elements
1. **Video Preview Area**
   - Dimensions: 360px width
   - Aspect ratio: 16:9
   - Background: Black with 90% opacity
   - Blur effect on background

2. **Metadata Bar**
   - Year (2024)
   - Duration (23m)
   - Rating badge (PG-13)
   - Separator dots between items
   - Semi-transparent background

3. **Genre Tags**
   - Pill-shaped containers
   - Dark background (zinc-800/70)
   - White text with 90% opacity
   - Flexible wrapping
   - Consistent spacing

### Visual States

1. **Default Card State**
```typescript
describe('PantheonCard Default State', () => {
  it('should display correct thumbnail image', () => {
    // Test image loading and dimensions
  });

  it('should show Pantheon badge when isPantheonOriginal is true', () => {
    // Test badge visibility and styling
  });
});
```

2. **Hover Transition**
```typescript
describe('Preview Hover Transition', () => {
  it('should scale smoothly on hover', () => {
    // Test transform scale animation
  });

  it('should maintain position relative to original card', () => {
    // Test positioning: -32px top, -30px left
  });

  it('should have correct z-index layering', () => {
    // Test z-index: 100
  });
});
```

3. **Video States**
```typescript
describe('Video Preview States', () => {
  it('should show loading state while video initializes', () => {
    // Test loading spinner
  });

  it('should transition smoothly from thumbnail to video', () => {
    // Test opacity transition
    // Test video playback start
  });

  it('should handle video load errors gracefully', () => {
    // Test error state display
  });
});
```

### Interaction Tests

1. **Mouse Interactions**
```typescript
describe('Mouse Interaction Behavior', () => {
  it('should trigger preview on mouseEnter', () => {
    // Test hover activation
  });

  it('should close preview on mouseLeave', () => {
    // Test hover deactivation
  });

  it('should handle rapid hover/unhover events', () => {
    // Test hover spam protection
  });
});
```

2. **Video Playback**
```typescript
describe('Video Playback Behavior', () => {
  it('should start playing automatically when visible', () => {
    // Test autoplay
  });

  it('should be muted by default', () => {
    // Test muted state
  });

  it('should cleanup video resources on close', () => {
    // Test resource cleanup
  });
});
```

### Performance Metrics

1. **Timing Requirements**
```typescript
describe('Performance Requirements', () => {
  it('should initialize preview within 300ms', async () => {
    // Test initialization time
  });

  it('should complete hover animation within 200ms', () => {
    // Test animation duration
  });

  it('should start video playback within 500ms of hover', () => {
    // Test video start timing
  });
});
```

2. **Resource Management**
```typescript
describe('Resource Management', () => {
  it('should properly destroy HLS instance on unmount', () => {
    // Test HLS cleanup
  });

  it('should release video resources when hidden', () => {
    // Test video element cleanup
  });

  it('should handle multiple preview instances efficiently', () => {
    // Test memory usage with multiple cards
  });
});
```

### Accessibility Tests

```typescript
describe('Accessibility Requirements', () => {
  it('should maintain readable text contrast ratios', () => {
    // Test text contrast
  });

  it('should provide appropriate ARIA labels', () => {
    // Test aria-labels
  });

  it('should handle keyboard navigation', () => {
    // Test keyboard interactions
  });
});
```

## Implementation Checklist

### Visual Implementation
- [x] Video preview container
- [x] Metadata bar layout
- [x] Genre tags styling
- [x] Hover transitions
- [ ] Loading states
- [ ] Error states

### Functional Implementation
- [x] Video initialization
- [x] Hover state management
- [x] Resource cleanup
- [ ] Error handling
- [ ] Performance optimization

### Testing Implementation
- [ ] Unit tests
- [ ] Integration tests
- [ ] Visual regression tests
- [ ] Performance tests
- [ ] Accessibility tests

## Success Metrics

### Performance
- Video preview loads within 300ms
- Hover transition completes in 200ms
- Memory usage < 100MB per preview
- 60fps animation performance

### Quality
- No visual glitches during transitions
- Correct aspect ratio maintained
- Consistent typography and spacing
- Proper error state handling

### Accessibility
- WCAG 2.1 AA compliant
- Keyboard navigable
- Screen reader friendly
- Proper focus management 