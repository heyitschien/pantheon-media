# Testing Structure

This directory contains the test suite for the Modern Streaming Hub project, organized according to industry standards and best practices.

## Directory Structure

```
__tests__/
├── unit/               # Unit tests for individual components and functions
│   ├── components/     # Component-specific tests
│   ├── hooks/         # Custom hooks tests
│   └── utils/         # Utility function tests
├── integration/        # Integration tests for feature workflows
│   ├── features/      # Feature-specific integration tests
│   └── api/           # API integration tests
├── e2e/               # End-to-end tests for complete user flows
│   └── flows/         # User journey test scenarios
└── performance/       # Performance and load testing
    ├── metrics/       # Performance measurement tests
    └── optimization/  # Optimization verification tests
```

## Testing Guidelines

### Unit Tests
- Test individual components in isolation
- Mock external dependencies
- Focus on component behavior and logic
- Aim for high coverage (90%+)

### Integration Tests
- Test component interactions
- Verify feature workflows
- Test data flow between components
- Focus on user interactions

### E2E Tests
- Test complete user journeys
- Verify critical paths
- Test real-world scenarios
- Include error cases

### Performance Tests
- Measure load times
- Test component rendering performance
- Verify optimization implementations
- Monitor memory usage

## Best Practices

1. **Test Organization**
   - Keep tests close to implementation
   - Use descriptive test names
   - Group related tests
   - Follow AAA pattern (Arrange, Act, Assert)

2. **Code Quality**
   - Write maintainable tests
   - Avoid test duplication
   - Use proper assertions
   - Keep tests focused

3. **Coverage Goals**
   - Unit Tests: 90%+
   - Integration Tests: 80%+
   - E2E Tests: Critical paths
   - Performance: Key metrics

4. **Running Tests**
```bash
# Run all tests
bun test

# Run specific test suite
bun test unit
bun test integration
bun test e2e

# Run with coverage
bun test:coverage
```

## Writing Tests

### Example Unit Test
```typescript
import { render, screen } from '@testing-library/react';
import { MovieCard } from '@/components/ui/movie-card';

describe('MovieCard', () => {
  it('renders movie information correctly', () => {
    const movie = {
      title: 'Test Movie',
      description: 'Test Description'
    };

    render(<MovieCard movie={movie} />);
    
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });
});
```

### Example Integration Test
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MoviePlayer } from '@/components/player/MoviePlayer';

describe('MoviePlayer Integration', () => {
  it('handles play/pause interaction correctly', async () => {
    render(<MoviePlayer src="test-video.mp4" />);
    
    const playButton = screen.getByRole('button', { name: /play/i });
    await fireEvent.click(playButton);
    
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
  });
});
```

## Continuous Integration

Tests are automatically run in CI pipeline:
- On pull requests
- Before merges to main branch
- On deployment to staging/production

## Resources

- [Testing Library Documentation](https://testing-library.com/docs/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Best Practices](https://reactjs.org/docs/testing.html)
