export const theme = {
  gradients: {
    brand: {
      primary: "bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500",
      accent: "bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500",
      interactive: "bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500"
    },
    badges: {
      top10: "bg-gradient-to-r from-red-700 via-red-500 to-red-400",
      new: "bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400",
      award: "bg-gradient-to-r from-amber-700 via-amber-500 to-amber-300"
    },
    glass: {
      light: "bg-white/10 backdrop-blur-md border border-white/20",
      dark: "bg-black/20 backdrop-blur-md border border-white/10"
    }
  },
  effects: {
    hover: {
      scale: "hover:scale-105 transition-transform duration-300",
      glow: "hover:shadow-lg hover:shadow-white/10 transition-shadow duration-300",
      gradient: "hover:opacity-90 transition-opacity duration-300"
    },
    animation: {
      timing: {
        fast: "duration-200",
        normal: "duration-300",
        slow: "duration-500"
      },
      easing: "ease-in-out"
    }
  },
  typography: {
    brand: "font-extrabold tracking-tight",
    heading: "font-bold tracking-tight",
    body: "font-normal leading-relaxed"
  }
} as const;

export type Theme = typeof theme; 