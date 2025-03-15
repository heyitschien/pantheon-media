# Pantheon Media Card Refactoring Plan

## Overview
Split current `MovieCard` into focused components to improve maintainability and fix preview functionality.

## Current Issues
- Mixed responsibilities in MovieCard component
- Complex state management
- Unclear separation between base card and preview
- Outdated badge system

## New Structure

### 1. Components
```typescript
// PantheonCard.tsx (Base Card)
interface PantheonCardProps {
  mediaId: string;
  title: string;
  coverImage: string;
  isPantheonOriginal: boolean;
  onHover: () => void;
}

// PantheonPreview.tsx (Preview Popup)
interface PantheonPreviewProps {
  mediaId: string;
  title: string;
  description: string;
  rating: string;
  duration: string;
  year: string;
  genres?: string[];
  isVisible: boolean;
  onClose: () => void;
}

// PantheonMediaContainer.tsx (State Management)
interface PantheonMediaContainerProps {
  media: {
    mediaId: string;
    title: string;
    coverImage: string;
    isPantheonOriginal: boolean;
    description: string;
    rating: string;
    duration: string;
    year: string;
    genres?: string[];
  };
}
```

### 2. File Structure
