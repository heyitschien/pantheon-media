# Navigation Component

Status: ✅ Ready for Production

## Overview
The Navigation component provides the main navigation system for the Modern Streaming Hub platform. It implements a Netflix-style navigation bar with responsive design, search integration, and user profile management.

## Usage

```tsx
import { Navigation } from '@/components/ui/navigation'

// Basic Navigation
<Navigation
  items={navigationItems}
  currentPath={currentPath}
  onSearch={handleSearch}
  user={currentUser}
/>

// With Custom Menu
<Navigation
  items={navigationItems}
  customMenu={<CategoryMenu />}
  logo={<BrandLogo />}
  profileMenu={<ProfileDropdown />}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | NavigationItem[] | required | Navigation items |
| currentPath | string | required | Current route path |
| logo | ReactNode | undefined | Custom logo component |
| onSearch | (query: string) => void | undefined | Search handler |
| user | User | undefined | User profile data |
| transparent | boolean | false | Transparent background |
| sticky | boolean | true | Sticky positioning |
| customMenu | ReactNode | undefined | Custom menu component |
| mobileBreakpoint | number | 768 | Mobile breakpoint |

## Navigation Items

```typescript
interface NavigationItem {
  label: string;
  path: string;
  icon?: ReactNode;
  children?: NavigationItem[];
  badge?: {
    text: string;
    variant: 'new' | 'updated' | 'beta';
  };
}
```

## Components

### Main Navigation
- Logo section
- Primary links
- Search bar
- User profile
- Notifications

### Mobile Menu
- Hamburger button
- Slide-out panel
- Touch gestures
- Animated transitions

### Search Bar
- Instant search
- Search suggestions
- Recent searches
- Clear button

### Profile Menu
- User avatar
- Dropdown menu
- Settings access
- Sign out option

## States

### Default
- Solid background
- Full navigation
- Search collapsed
- Profile menu closed

### Transparent
- No background
- Light text
- Gradient overlay
- Scroll transition

### Mobile
- Condensed header
- Menu button
- Slide-out panel
- Full-screen search

### Active
- Current route
- Hover effects
- Focus states
- Loading indicators

## Accessibility

### Keyboard Navigation
- Tab navigation
- Arrow key menus
- Escape handling
- Focus management

### Screen Readers
- ARIA landmarks
- Menu structure
- State changes
- Action descriptions

### Mobile Support
- Touch targets
- Swipe gestures
- Viewport scaling
- Orientation changes

## Implementation Details

### CSS Classes
```css
.nav-container {
  @apply fixed top-0 inset-x-0;
  @apply h-16;
  @apply transition-all duration-300;
  @apply z-50;
}

.nav-transparent {
  @apply bg-gradient-to-b from-black/80 to-transparent;
  @apply backdrop-blur-sm;
}

.nav-solid {
  @apply bg-gray-900;
  @apply shadow-lg;
}

.nav-mobile {
  @apply fixed inset-y-0 left-0;
  @apply w-[280px];
  @apply bg-gray-900;
  @apply transform transition-transform duration-300;
}
```

### Scroll Behavior
```typescript
const ScrollBehavior = {
  // Show/hide on scroll
  handleScroll: (direction: 'up' | 'down') => {
    if (direction === 'down') {
      hideNavigation();
    } else {
      showNavigation();
    }
  },

  // Transparent to solid
  handleBackgroundTransition: (scrollY: number) => {
    if (scrollY > 50) {
      setSolidBackground(true);
    } else {
      setSolidBackground(false);
    }
  }
};
```

## Testing

### Unit Tests
- Route handling
- Menu interactions
- Search functionality
- Profile actions

### Integration Tests
- Navigation flow
- State persistence
- Mobile behavior
- Scroll handling

### Visual Tests
- Responsive design
- Animation smoothness
- Theme consistency
- Loading states

## Best Practices

### Do
- Keep mobile in mind
- Handle all states
- Maintain accessibility
- Provide feedback

### Don't
- Block navigation
- Hide essential items
- Ignore touch devices
- Skip transitions

## Examples

### Basic Navigation
```tsx
const navigationItems = [
  { label: 'Home', path: '/' },
  { label: 'Movies', path: '/movies' },
  { label: 'TV Shows', path: '/tv' },
  { label: 'My List', path: '/my-list' }
];

<Navigation
  items={navigationItems}
  currentPath={router.pathname}
  onSearch={handleSearch}
  user={currentUser}
/>
```

### Transparent Hero Navigation
```tsx
<Navigation
  transparent
  items={navigationItems}
  logo={<LogoLight />}
  onScroll={handleNavScroll}
/>
```

### Mobile Navigation
```tsx
<Navigation
  items={navigationItems}
  mobileBreakpoint={768}
  customMenu={
    <MobileMenu
      items={navigationItems}
      onClose={handleMenuClose}
      user={currentUser}
    />
  }
/>
```

## Related Components
- [SearchBar](../search-bar/README.md)
- [ProfileMenu](../profile-menu/README.md)
- [MobileMenu](../mobile-menu/README.md)
- [Dropdown](../dropdown/README.md) 