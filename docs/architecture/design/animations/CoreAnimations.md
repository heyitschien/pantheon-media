# Core Animation System

## Overview
PRISM+'s animation system is designed to create fluid, meaningful interactions that enhance user experience while maintaining performance.

## Animation Principles

### 1. Timing
```css
/* Standard Durations */
.duration {
  --duration-fast: 150ms;
  --duration-base: 300ms;
  --duration-slow: 500ms;
  --duration-extra-slow: 800ms;
}

/* Standard Easings */
.easing {
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### 2. Motion Scale
```css
/* Transform Scale */
.scale {
  --scale-hover: 1.05;
  --scale-active: 0.98;
  --scale-modal: 0.95;
}

/* Translation Values */
.translate {
  --translate-1: 0.25rem;
  --translate-2: 0.5rem;
  --translate-3: 1rem;
}
```

## Reusable Animations

### 1. Fade Transitions
```css
.fade-enter {
  @apply opacity-0;
  @apply transition-opacity duration-300;
}

.fade-enter-active {
  @apply opacity-100;
}

.fade-exit {
  @apply opacity-100;
  @apply transition-opacity duration-200;
}

.fade-exit-active {
  @apply opacity-0;
}
```

### 2. Scale Transitions
```css
.scale-enter {
  @apply scale-95 opacity-0;
  @apply transition-all duration-300;
}

.scale-enter-active {
  @apply scale-100 opacity-100;
}
```

### 3. Slide Transitions
```css
.slide-up {
  @apply translate-y-4 opacity-0;
  @apply transition-all duration-300;
}

.slide-up-active {
  @apply translate-y-0 opacity-100;
}
```

## Component-Specific Animations

### 1. Card Interactions
```css
.card-hover {
  @apply transition-transform duration-300;
  @apply hover:scale-[var(--scale-hover)];
}

.card-active {
  @apply transition-transform duration-150;
  @apply active:scale-[var(--scale-active)];
}
```

### 2. Modal Animations
```css
.modal-enter {
  @apply opacity-0 scale-[var(--scale-modal)];
  @apply transition-all duration-300;
}

.modal-enter-active {
  @apply opacity-100 scale-100;
}
```

## Performance Guidelines

### 1. Optimized Properties
```css
/* Preferred Properties */
.performant-animation {
  @apply transition-transform; /* GPU accelerated */
  @apply transition-opacity;   /* No layout impact */
}

/* Avoid in Animations */
.expensive-animation {
  @apply transition-width;     /* Triggers layout */
  @apply transition-height;    /* Triggers layout */
}
```

### 2. Loading States
```css
.skeleton {
  @apply animate-pulse;
  @apply bg-gray-800;
  @apply rounded-lg;
}
```

## Implementation with Framer Motion

### 1. Standard Variants
```typescript
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

export const slideUp = {
  initial: { y: 16, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 16, opacity: 0 },
  transition: { duration: 0.3 }
};
```

### 2. Gesture Animations
```typescript
export const hover = {
  scale: 1.05,
  transition: { duration: 0.3 }
};

export const tap = {
  scale: 0.98,
  transition: { duration: 0.15 }
};
```

## Accessibility Considerations

### 1. Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    @apply transition-none;
    @apply transform-none;
    @apply animate-none;
  }
}
```

### 2. Safe Animation Properties
```css
.safe-animation {
  @apply transition-opacity;
  @apply transition-transform;
  @apply transition-colors;
}
```

## Testing & Quality Assurance

### Animation Checklist
- [ ] Performs at 60fps
- [ ] Respects reduced motion
- [ ] Consistent timing
- [ ] Purpose-driven
- [ ] No layout shifts
- [ ] Cross-browser compatible

### Performance Monitoring
```typescript
// Animation Performance Monitor
const measureAnimationPerformance = (element: HTMLElement) => {
  const start = performance.now();
  element.addEventListener('transitionend', () => {
    const duration = performance.now() - start;
    console.log(`Animation completed in ${duration}ms`);
  });
};
``` 