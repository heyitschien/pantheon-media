# PRISM+ Visual Identity System

## Implementation Status
```typescript
interface VisualSystemStatus {
  // Core Identity ✅
  brand: {
    name: 'Implemented';          // PRISM+ branding
    logo: 'Implemented';          // Modern gradient style
    palette: 'Implemented';       // Core color system
  };

  // Component Systems ✅
  components: {
    cards: 'Implemented';         // Movie card system
    player: 'Implemented';        // Video player
    hero: 'Implemented';          // Hero transitions
  };

  // Animation System ✅
  animations: {
    transitions: 'Implemented';   // State changes
    interactions: 'Implemented';  // Hover effects
    video: 'Implemented';        // Video transitions
  };

  // Responsive System 🚧
  responsive: {
    mobile: 'In Progress';       // Touch optimization
    tablet: 'In Progress';       // Layout adaptation
    desktop: 'Implemented';      // Base experience
  };
}
```

## Design Foundations

### 1. Color System
```typescript
interface ColorSystem {
  // Brand Gradients
  primary: {
    gradient: 'from-indigo-600 via-purple-500 to-pink-500';
    usage: 'Logo, primary CTAs';
  };

  accent: {
    gradient: 'from-sky-500 via-cyan-500 to-teal-500';
    usage: 'Secondary elements';
  };

  interactive: {
    gradient: 'from-amber-400 via-orange-500 to-rose-500';
    usage: 'Hover states';
  };

  // Content Overlays
  overlays: {
    light: 'bg-white/10 backdrop-blur-md';
    dark: 'bg-black/20 backdrop-blur-md';
    content: 'bg-gradient-to-t from-black/80 to-transparent';
  };
}
```

### 2. Typography Scale
```typescript
interface TypographyScale {
  // Display Text
  display: {
    large: 'text-6xl font-bold tracking-tight';
    base: 'text-5xl font-bold tracking-tight';
  };

  // Headings
  heading: {
    h1: 'text-4xl font-bold tracking-tight';
    h2: 'text-3xl font-bold';
    h3: 'text-2xl font-bold';
  };

  // Body Text
  body: {
    large: 'text-lg leading-relaxed';
    base: 'text-base leading-relaxed';
    small: 'text-sm';
  };

  // UI Elements
  ui: {
    button: 'text-sm font-medium';
    caption: 'text-xs text-white/70';
    badge: 'text-xs font-bold uppercase';
  };
}
```

### 3. Spacing System
```typescript
interface SpacingSystem {
  // Component Spacing
  component: {
    tight: 'space-y-2';
    base: 'space-y-4';
    loose: 'space-y-6';
  };

  // Layout Spacing
  layout: {
    section: 'py-12 md:py-16';
    container: 'px-4 md:px-6 lg:px-8';
    grid: 'gap-4 md:gap-6';
  };

  // Interactive Spacing
  interactive: {
    button: 'px-4 py-2';
    input: 'px-3 py-2';
    card: 'p-4';
  };
}
```

## Component Themes

### 1. Movie Cards
```typescript
interface CardTheme {
  // Base Card
  base: {
    container: 'relative rounded-lg overflow-hidden';
    image: 'aspect-[16/9] object-cover';
    overlay: 'bg-gradient-to-t from-black/80 to-transparent';
  };

  // Hover State
  hover: {
    scale: 'hover:scale-110';
    shadow: 'hover:shadow-2xl';
    transition: 'transition-all duration-300';
  };

  // Content
  content: {
    title: 'text-lg font-bold text-white';
    metadata: 'text-sm text-white/70';
    actions: 'flex gap-2 mt-2';
  };
}
```

### 2. Detail Modal
```typescript
interface DetailModalTheme {
  // Modal Container
  container: {
    backdrop: 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50';
    wrapper: 'relative w-full max-w-5xl mx-auto my-8';
    content: 'bg-gradient-to-b from-gray-900 to-black rounded-xl overflow-hidden';
  };

  // Hero Section
  hero: {
    container: 'relative w-full aspect-video';
    overlay: 'absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-black/40';
    media: 'w-full h-full object-cover';
  };

  // Content Layout
  content: {
    wrapper: 'px-8 py-6 space-y-6';
    title: 'text-4xl font-bold text-white',
    metadata: 'flex items-center gap-4 text-white/70',
    description: 'text-lg text-white/90 leading-relaxed',
  };

  // Action Buttons
  actions: {
    container: 'flex items-center gap-4 mt-6';
    primary: 'px-8 py-3 bg-white text-black rounded-lg hover:scale-105',
    secondary: 'px-8 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30',
  };

  // Additional Info
  info: {
    grid: 'grid grid-cols-3 gap-4 px-8 py-6 border-t border-white/10',
    label: 'text-sm font-medium text-white/50',
    value: 'text-sm text-white',
  };

  // Animation
  animation: {
    enter: 'animate-in fade-in zoom-in-95 duration-300',
    exit: 'animate-out fade-out zoom-out-95 duration-200',
    content: 'animate-in slide-in-from-bottom duration-500',
  };
}
```

### 3. Video Player
```typescript
interface PlayerTheme {
  // Container
  container: {
    wrapper: 'relative aspect-video bg-black';
    overlay: 'absolute inset-0 bg-gradient-to-t from-black/80';
  };

  // Controls
  controls: {
    bar: 'absolute bottom-0 w-full p-4';
    button: 'rounded-full bg-white/20 hover:bg-white/30';
    progress: 'h-1 bg-white/30 rounded-full';
  };

  // Quality
  quality: {
    selector: 'px-2 py-1 text-sm bg-black/60';
    options: 'rounded bg-black/90 backdrop-blur-sm';
  };
}
```

### 3. Hero Section
```typescript
interface HeroTheme {
  // Container
  container: {
    wrapper: 'relative aspect-[2.1/1]';
    content: 'absolute inset-0 flex items-end';
  };

  // Media
  media: {
    image: 'absolute inset-0 object-cover';
    video: 'absolute inset-0 object-cover';
    transition: 'transition-opacity duration-1000';
  };

  // Content
  content: {
    wrapper: 'relative z-10 p-8 space-y-4';
    title: 'text-4xl md:text-5xl lg:text-6xl font-bold',
    description: 'text-lg md:text-xl text-white/90';
  };
}
```

## Animation Tokens

### 1. Durations
```css
.durations {
  --duration-fast: 150ms;
  --duration-base: 300ms;
  --duration-slow: 500ms;
  --duration-video: 1000ms;
}
```

### 2. Easings
```css
.easings {
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### 3. Transforms
```css
.transforms {
  --scale-hover: 1.05;
  --scale-active: 0.98;
  --scale-modal: 0.95;
}
```

## Accessibility

### 1. Color Contrast
```typescript
interface ContrastRatios {
  text: {
    large: '> 3:1';              // Large text
    small: '> 4.5:1';            // Body text
    ui: '> 3:1';                 // UI elements
  };
}
```

### 2. Focus States
```css
.focus-states {
  --focus-ring: ring-2 ring-white ring-offset-2;
  --focus-visible: outline-none;
}
```

## Performance Guidelines

### 1. Animation Performance
```typescript
interface AnimationPerformance {
  preferred: {
    transform: true;             // GPU accelerated
    opacity: true;              // No layout impact
  };

  avoid: {
    width: false;               // Triggers layout
    height: false;             // Triggers layout
    boxShadow: false;          // Paint heavy
  };
}
```

### 2. Loading States
```typescript
interface LoadingStates {
  skeleton: {
    base: 'animate-pulse bg-gray-800';
    duration: '1.5s';
    timing: 'ease-in-out';
  };

  transition: {
    image: 'blur-up progressive';
    content: 'fade-in stagger';
  };
}
```
