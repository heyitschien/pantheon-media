import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock ResizeObserver
window.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock window.HTMLMediaElement
Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
  configurable: true,
  value: vi.fn().mockResolvedValue(undefined)
});

Object.defineProperty(window.HTMLMediaElement.prototype, 'pause', {
  configurable: true,
  value: vi.fn()
});

// Mock performance.now
if (typeof window.performance === 'undefined') {
  window.performance = {
    now: vi.fn(() => Date.now())
  } as unknown as Performance;
}

// Add custom matchers
expect.extend({
  toHaveCleanedUp(received) {
    const pass = !received.isConnected;
    return {
      pass,
      message: () => pass
        ? 'Expected element to not be cleaned up'
        : 'Expected element to be cleaned up'
    };
  }
}); 