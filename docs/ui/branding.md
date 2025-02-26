# UI Branding Guidelines

## Brand Identity

### Logo and Favicon
- **Favicon**: Gradient "P" using brand colors
  - Implementation: SVG with viewBox 24x24
  - Colors: Linear gradient from `#FF0080` to `#7928CA`
  - Font: Arial Black, extra bold weight
  - Size: Optimized for browser tab visibility

### Page Titles
- Format: `[Page Name] - Pantheon`
- Example: `Home - Pantheon`

### Color Scheme
- Primary Gradient:
  - Start: `#FF0080` (Pink)
  - End: `#7928CA` (Purple)
- Usage:
  - Brand elements
  - Interactive components
  - Accent highlights

### Typography
- Primary Font: Arial Black for branding elements
- UI Font: System font stack for general interface

## Implementation Details

### Favicon Implementation
```svg
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FF0080"/>
      <stop offset="100%" style="stop-color:#7928CA"/>
    </linearGradient>
  </defs>
  <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" 
        font-family="Arial Black, sans-serif" font-size="30" font-weight="900" fill="url(#gradient)">
    P
  </text>
</svg>
```

### HTML Head Configuration
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<title>Home - Pantheon</title>
```

## Component Guidelines

### Buttons
- Consistent styling across movie cards and modals
- Gradient hover effects
- Uniform size and spacing

### Movie Cards
- Gradient overlay: 20% opacity black to transparent
- Consistent button placement and styling
- Hover animations for interactive elements

## Recent Updates
1. Simplified favicon to gradient "P" for better visibility
2. Standardized page title format
3. Updated movie card gradient opacity for better visibility
4. Unified button styling across components 