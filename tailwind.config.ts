import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        netflix: {
          red: "#E50914",
          black: "#121212",
          gray: "#1a1a1a",
        },
        pantheon: {
          // Colors from the lotus logo - refined for a more sophisticated look
          pink: '#E05A8C', // Less neon, more sophisticated
          purple: '#8A5EC8', // Deeper, more elegant
          blue: '#4A7FE0', // Slightly deeper blue
          orange: '#F09045', // Warmer, less bright
          gold: '#D4AF37',
          night: '#121620',
          light: '#FFFFFF',
          ethereal: '#E6E6FA',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      keyframes: {
        "movie-hover": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.05)" },
        },
        "ethereal-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        "sacred-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        }
      },
      animation: {
        "movie-hover": "movie-hover 0.3s ease-in-out forwards",
        "ethereal-float": "ethereal-float 3s ease-in-out infinite",
        "sacred-spin": "sacred-spin 20s linear infinite",
      },
      backgroundImage: {
        'gradient-lotus': 'linear-gradient(to right, #E05A8C, #8A5EC8, #4A7FE0, #F09045)',
        'gradient-cosmic': 'linear-gradient(to right, #1a2a6c, #b21f1f, #fdbb2d)',
        'gradient-earth': 'linear-gradient(to right, #134E5E, #71B280)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
