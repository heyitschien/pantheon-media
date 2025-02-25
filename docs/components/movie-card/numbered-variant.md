# Numbered Movie Card Requirements & Specifications

## Current Working Elements
1. Base Card State
   - Large number overlay (1-10)
   - Movie poster with gradient
   - "Recently Added" badge
   - Clean transition to hover state

2. Hover State Visual (Working)
   ```tsx
   // Hover Card Dimensions
   width: 320px
   height: auto
   image height: 180px
   
   // Visual Elements
   - Movie poster image at top
   - Light gradient overlay (from-black/20 via-black/40 to-black)
   - Title, year, duration, rating grouped together
   - Genre tags in light background
   - Action buttons at bottom
   ```

## Layout Structure Issues
1. Complex Nesting Problem
   ```tsx
   TopTenRow
     └─ Container (px-12 sm:px-14 lg:px-16)
        └─ Flex Container (w-420px)
           └─ Number Container (w-270px)
              └─ Movie Container (w-180px, -ml-24)
                 └─ Hover Card
   ```

2. Positioning Challenges
   - Number overlay affects hover card positioning
   - Multiple negative margins create compound effects
   - Parent container width constraints
   - Left edge alignment issues with main content

## Visual Requirements for Rebuild

### Base State
```css
/* Number Typography */
font-size: 300px
font-weight: 900
color: gradient from white/40 to white/10
letter-spacing: -0.2em (for number 10)
transform: translateX(-15%) translateY(2%)

/* Movie Poster */
width: 180px
height: aspect-[2/3]
border-radius: lg
overflow: hidden

/* Recently Added Badge */
background: gradient-to-r from-red-600 via-orange-500 to-amber-500
padding: 2px 8px
border-radius: md
font-size: xs
font-weight: bold
```

### Hover State
```css
/* Container */
width: 320px
transform: scale(1.1)
z-index: 1000
background: black
border-radius: lg
ring: 1px white/10
shadow: 2xl

/* Image */
height: 180px
object-fit: cover

/* Content Spacing */
padding: 12px
gap: 6px

/* Typography */
title: text-lg font-bold
metadata: text-sm text-white/80
genres: text-xs bg-white/10 rounded
```

## Transition Requirements
```css
transition-all
duration-300
origin-bottom-left
```

## Key Interactions
1. Base to Hover
   - Scale up from bottom-left origin
   - Fade in expanded content
   - Maintain position relative to left content edge
   - Pop up above other content

2. Number to Poster Relationship
   - Number should be 270px wide
   - Poster should overlap number by -24px
   - Recently Added badge centered on poster

## Future Implementation Notes
1. Consider simplifying the container structure
2. Use absolute positioning relative to main content edge
3. Separate number rendering from card component
4. Implement proper z-index management
5. Use CSS Grid for more predictable layouts

## Current Working Example
```tsx
// Hover Card Structure (Working Part)
<div className={cn(
  "absolute w-[320px] transition-all duration-300",
  "origin-bottom-left overflow-visible",
  isHovered ? "z-[1000] scale-110 opacity-100" : "z-0 scale-90 opacity-0"
)}>
  <div className="rounded-lg shadow-2xl ring-1 ring-white/10 bg-black">
    <div className="relative">
      <img className="w-full h-[180px] object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black" />
    </div>
    // Content structure preserved as is
  </div>
</div>
```

## Next Steps for Rebuild
1. Start with simplified container structure
2. Implement hover card first
3. Add number overlay as separate layer
4. Fine-tune positioning and transitions
5. Implement responsive behavior # NumberedMovieCard Component: Fixing Layout Issues

## Problem Overview
We encountered several critical issues with the Top 10 row, particularly with card #10:
1. Inconsistent poster sizing between cards
2. Improper spacing between cards #9 and #10
3. Misaligned number "10" with other numbers
4. Conflicts between percentage-based and fixed-width layouts

## Root Causes Identified

### 1. Container Width Conflicts
```typescript
// Initial problematic setup
// TopTenRow.tsx
<div style={{ width: "450px" }}> // Fixed container width
  // NumberedMovieCard.tsx
  <div className="w-[40%]"> // Percentage-based width
```
The mix of fixed and percentage-based widths created inconsistent sizing across cards.

### 2. Positioning System Conflicts
```typescript
// Initial approach - mixing different positioning strategies
number === 10 ? "w-[60%] translate-x-8 translate-y-4" : "w-[60%]"
```
Using percentage-based widths with fixed translations led to inconsistent spacing.

## Solutions Implemented

### 1. Standardized Fixed Widths
```typescript
// TopTenRow.tsx
<div style={{
  marginLeft: index === 0 ? "0" : "-80px",
  width: "420px",  // Consistent container width
  paddingRight: index === movies.length - 1 ? "100px" : "0"
}}>

// NumberedMovieCard.tsx
<div className={cn(
  "relative aspect-[1/1.5]",
  "w-[270px]"  // Fixed width for number section
)}>
<div className={cn(
  "relative aspect-[2/3]",
  "w-[180px]"  // Fixed width for poster
)}>
```

### 2. Precise Positioning for Card #10
```typescript
// Number positioning
number === 10 ? "w-[270px] translate-x-24" : "w-[270px]"
number === 10 ? "-translate-x-[45%] tracking-[-0.2em]" : "-translate-x-[15%]"

// Poster positioning
number === 10 ? "-ml-32 translate-x-24" : "-ml-24"
```

## Key Learnings

1. **Width Management**
   - Use fixed widths for predictable sizing
   - Avoid mixing percentage and fixed units
   - Maintain consistent aspect ratios

2. **Spacing Strategy**
   - Use negative margins for card overlap
   - Use translations for fine-tuned positioning
   - Keep consistent spacing values

3. **Number Positioning**
   - Use tracking for letter spacing in double digits
   - Maintain consistent vertical alignment
   - Use fixed translations for predictable placement

## Current Component Structure

### TopTenRow Component
```typescript
<div className="relative group/row">
  <h2>Title</h2>
  <div className="relative">
    {/* Scroll Arrows */}
    <div className="overflow-x-auto overflow-y-visible">
      <div className="flex">
        {/* Fixed-width card containers */}
      </div>
    </div>
  </div>
</div>
```

### NumberedMovieCard Component
```typescript
<div className="relative h-[300px]">
  <div className="absolute w-full">
    {/* Base State */}
    <div className="flex items-center">
      {/* Number Section: 270px */}
      {/* Poster Section: 180px */}
    </div>
    
    {/* Hover State */}
    <div className="w-[300px]">
      {/* Hover content */}
    </div>
  </div>
</div>
```

## Critical Measurements

1. **Container Widths**
   - Card container: 420px
   - Number section: 270px
   - Poster section: 180px
   - Hover card: 300px

2. **Spacing Values**
   - Base card overlap: -80px
   - Number-poster overlap: -24px (standard), -32px (card #10)
   - Right padding: 100px (last card)

3. **Translations**
   - Card #10 shift: translate-x-24
   - Number alignment: -translate-x-[45%] (card #10)
   - Vertical alignment: translate-y-[2%]

## Testing Checklist

- [x] All posters maintain consistent size
- [x] Card #10 properly spaced from card #9
- [x] Numbers horizontally aligned
- [x] Hover states work correctly
- [x] Smooth transitions maintained
- [x] Proper spacing throughout row
- [x] Responsive behavior intact

## Repository State

Current implementation represents a stable state with:
1. Consistent sizing across all cards
2. Proper spacing and alignment
3. Smooth transitions and hover effects
4. Well-documented component structure

### Recommended Git Actions
```bash
# Create a feature branch
git checkout -b feature/top-10-row-fixes

# Commit changes with detailed message
git add .
git commit -m "Fix: Top 10 row card sizing and alignment

- Standardize card widths and spacing
- Fix card #10 positioning and alignment
- Update documentation with solutions
- Add comprehensive testing checklist"

# Push changes
git push origin feature/top-10-row-fixes
```

## Future Considerations

1. **Responsive Adjustments**
   - Consider breakpoint-specific sizing
   - Maintain aspect ratios at different screens

2. **Performance Optimization**
   - Monitor transition performance
   - Consider lazy loading for off-screen cards

3. **Accessibility**
   - Ensure proper focus management
   - Add keyboard navigation support

4. **Maintenance**
   - Keep documentation updated
   - Monitor for regression issues
   - Regular testing across browsers 