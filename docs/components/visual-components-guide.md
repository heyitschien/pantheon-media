# Pantheon Media Visual Components Guide

## Overview
This document maps out all visual components in the Pantheon Media platform, focusing on media presentation components, modals, and their interactions.

## Component Hierarchy

### 1. Featured Projects Section
```
Featured Projects
└── MovieRow (src/components/movie-row.tsx)
    └── PantheonMediaContainer (src/components/media/PantheonMediaContainer.tsx)
        ├── PantheonCard (src/components/media/PantheonCard.tsx)
        └── PantheonPreview (src/components/media/PantheonPreview.tsx)
```

### 2. Hero Section
```
Hero Section
└── Hero (src/components/hero.tsx)
    └── HeroVideo
        └── Uses Bunny.net Stream Integration
```

## Component Details

### 1. Base Card Components

#### PantheonCard (src/components/media/PantheonCard.tsx)
- **Purpose**: Base card display for featured projects
- **Features**:
  - Project thumbnail
  - Title overlay
  - Pantheon Original badge
  - Hover trigger for preview
- **Dimensions**: 300px width, 176px height
- **Visual Elements**:
  - Gradient overlay
  - Pantheon badge (purple to pink gradient)
  - Brightness enhancement (110%)

#### PantheonPreview (src/components/media/PantheonPreview.tsx)
- **Purpose**: Hover preview popup with video
- **Features**:
  - HLS video preview
  - Project metadata
  - Genre tags
  - Rating badge
- **Dimensions**: 360px width
- **States**:
  - Loading
  - Error
  - Playing
  - Hidden

### 2. Container Components

#### PantheonMediaContainer (src/components/media/PantheonMediaContainer.tsx)
- **Purpose**: State management for card and preview
- **Features**:
  - Hover state management
  - Z-index handling
  - Component coordination
- **Interactions**:
  - Triggers preview on hover
  - Manages video loading
  - Handles mouse events

#### MovieRow (renamed to FeaturedProjectsRow)
- **Purpose**: Horizontal scrollable project list
- **Features**:
  - Smooth scrolling
  - Dynamic arrow visibility
  - Responsive layout
- **Controls**:
  - Left/Right navigation
  - Touch/mouse scroll support

## Visual States & Transitions

### Card States
1. **Default**
   - Static image
   - Title visible
   - Pantheon badge visible

2. **Hover**
   - Card scales slightly
   - Preview modal appears
   - Z-index increases

3. **Preview Active**
   - Video loads and plays
   - Metadata appears
   - Smooth opacity transition

### Modal Types

1. **Preview Modal**
   ```
   ┌────────────────────┐
   │      Video         │
   │                    │
   ├────────────────────┤
   │ Year • Duration • R│
   │ [Genre Tags]       │
   └────────────────────┘
   ```

2. **Full Info Modal** (Future Implementation)
   ```
   ┌────────────────────────┐
   │     Large Video        │
   │                        │
   ├────────────────────────┤
   │ Title                  │
   │ Description            │
   │ Metadata              │
   │ Related Projects       │
   └────────────────────────┘
   ```

## Naming Conventions

### Component Naming
- Prefix all main components with `Pantheon`
- Use descriptive suffixes:
  - `Card` for base displays
  - `Preview` for hover states
  - `Modal` for full-screen overlays
  - `Container` for state management wrappers

### Props Naming
- Use `media` prefix for content-related props
- Use `is` prefix for boolean states
- Use clear action names for handlers:
  - `onHover`
  - `onClose`
  - `onPlay`

### CSS Classes
- Use `pantheon-` prefix for custom classes
- Follow Tailwind conventions
- Use semantic class names:
  - `pantheon-card`
  - `pantheon-preview`
  - `pantheon-badge`

## Integration Points

### Bunny.net Stream Integration
- **Service File**: `src/services/bunny-stream.ts`
- **Key Functions**:
  - `getPreviewVideo`: Loads preview content
  - `getHeroVideo`: Loads hero section video
  - `generateVideoUrls`: Creates streaming URLs

### Data Structure
```typescript
interface PantheonMedia {
  mediaId: string;          // Bunny.net video ID
  title: string;           // Project title
  coverImage: string;      // Thumbnail path
  isPantheonOriginal: boolean;
  description: string;
  rating: string;
  duration: string;
  year: string;
  genres?: string[];
}
```

## Future Enhancements

1. **Full Project Modal**
   - Detailed project information
   - Related projects grid
   - Call-to-action buttons

2. **Enhanced Preview Features**
   - Quality selection
   - Audio preview
   - Interactive thumbnails

3. **Accessibility Improvements**
   - Keyboard navigation
   - Screen reader support
   - ARIA labels

## File Structure
```
src/
├── components/
│   ├── media/
│   │   ├── PantheonCard.tsx
│   │   ├── PantheonPreview.tsx
│   │   └── PantheonMediaContainer.tsx
│   ├── movie-row.tsx (to be renamed: FeaturedProjectsRow.tsx)
│   └── hero.tsx
├── services/
│   └── bunny-stream.ts
└── data/
    └── movies.ts (to be renamed: featured-projects.ts)
```

## Testing Considerations

Refer to `docs/testing/hover-card-testing-strategy.md` for detailed testing approach and implementation status. 