# Pantheon Media Platform

A modern media platform built with React, TypeScript, and Tailwind CSS, featuring cinematic storytelling, regenerative lifestyle content, and immersive video experiences.

## 🎯 Features

- Immersive Video Experience
  - Custom video controls with mute/unmute functionality
  - Smooth video transitions and loading states
  - High-quality video playback
  - Elegant hover preview functionality
- Modern Gradient-Based Visual Identity
  - Sophisticated orange and gold accents
  - Sacred geometry-inspired patterns
  - Elegant glass effects
  - Dynamic light/dark mode support
- Regenerative Lifestyle Focus
  - Content highlighting sustainable practices
  - Emotional storytelling elements
  - Impact-driven narratives
- Responsive Design
  - Mobile-first approach
  - Smooth animations and transitions
  - Optimized video playback across devices

## 🎨 Visual System

Our visual identity is built on a sophisticated gradient system:

1. **Brand Colors**
   ```css
   colors: {
     pantheon: {
       pink: '#E05A8C',
       purple: '#8A5EC8',
       blue: '#4A7FE0',
       orange: '#F09045',
       gold: '#D4AF37',
       night: '#121620',
       light: '#FFFFFF',
       ethereal: '#E6E6FA',
     }
   }
   ```

2. **Gradient System**
   ```css
   gradients: {
     lotus: 'linear-gradient(to right, #E05A8C, #8A5EC8, #4A7FE0, #F09045)',
     cosmic: 'linear-gradient(to right, #1a2a6c, #b21f1f, #fdbb2d)',
     earth: 'linear-gradient(to right, #134E5E, #71B280)'
   }
   ```

3. **Glass Effects**
   - Light: `bg-white/10 backdrop-blur-md`
   - Dark: `bg-black/20 backdrop-blur-md`

## 🏗 Project Structure

```
src/
├── components/
│   ├── hero/                     # Hero section with video background
│   ├── ui/                       # Reusable UI components
│   │   ├── movie-card.tsx       # Project card component
│   │   ├── movie-info-modal.tsx # Project detail modal
│   │   └── badges/              # Badge components
│   ├── navbar.tsx               # Navigation component
│   └── movie-row.tsx            # Project row container
├── config/                      # Configuration files
│   └── theme.ts                # Theme configuration
├── data/                       # Content and data
├── lib/                       # Utility functions
└── services/                  # External services integration
```

## 🛠 Development

1. **Setup**
   ```bash
   # Clone the repository
   git clone https://github.com/heyitschien/pantheon-media
   
   # Install dependencies
   bun install
   
   # Start development server
   bun run dev
   ```

2. **Key Commands**
   ```bash
   bun run dev    # Start development server
   bun run build  # Build for production
   bun run test   # Run tests
   ```

## 🎯 Current Status

### Implemented Features ✅
- Modern UI with Pantheon Media branding
  - Sophisticated gradient system
  - Custom video player
  - Elegant animations
- Hero section with video background
  - Mute/unmute controls
  - Smooth transitions
  - Loading states
- Project showcase system
  - Rich metadata display
  - Video previews
  - Detailed information modals
- Responsive layout (desktop optimized)
- Dark/light mode support

### In Development 🚧
1. **Mobile Optimization**
   - Touch interactions
   - Responsive refinements
   - Performance optimization

2. **Content Management**
   - Project organization
   - Media asset management
   - Content filtering

## 🚀 Next Steps

1. **Enhanced Mobile Experience**
   - Touch-optimized interactions
   - Mobile-specific features
   - Performance improvements

2. **Content Features**
   - Advanced filtering
   - Search functionality
   - Category organization

3. **Performance Optimization**
   - Image/video optimization
   - Loading performance
   - Caching strategies

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from modern streaming platforms
- UI components from shadcn/ui
- Icons from Lucide Icons
- Video integration with Pexels API
