/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        harbor: {
          // Deep Cosmic Purple-Black Dark Foundation (Matches the logo's background)
          dark: '#0A0713',          // Primary Obsidian Purple-Black
          slateDark: '#0E0A1C',     // Dark slate container
          surface: '#140F28',       // Futuristic elevated card surface
          surfaceLight: '#1C1636',  // Elevated secondary container
          steel: '#322659',         // Purple-slate border/sub-element
          silver: '#C4B5FD',        // Soft metallic lavender-silver
          ice: '#F8FAFC',           // Crisp White

          // Logo Palette: Vibrant Electric Purple, Soft Lavender, Pure White
          purple: '#9333EA',        // Brand Primary Purple (from CoderHarbor logo)
          purpleLight: '#A855F7',   // Electric Violet
          purpleGlow: '#C084FC',    // Radiant Lavender Glow
          lavender: '#C084FC',      // Soft Lavender Accent
          white: '#FFFFFF',         // Pure White (from Coder logo text)
          chartreuse: '#A855F7',    // Mapped to Purple for consistency
          tomato: '#8B5CF6',        // Mapped to Electric Purple

          // Dynamic Mappings for UI Accents
          neon: '#A855F7',          // Primary action & glow (Electric Purple)
          cyan: '#C084FC',          // Secondary lavender tone
          electric: '#9333EA',      // Brand Royal Purple
          blue: '#38BDF8',          // Ship Cyan/Blue from logo center
          
          // Legacy mappings mapped into Purple & White ecosystem
          navy: '#0A0713',
          navyDark: '#06040C',
          navyLight: '#140F28',
          blueDark: '#7C3AED',
          blueLight: '#C084FC',
          cyanDark: '#8B5CF6',
          cyanLight: '#A855F7',
          lightBg: '#0A0713',
          gold: '#C084FC',
          goldLight: '#DDD6FE',
          border: '#322659',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'harbor-sm': '0 2px 10px -2px rgba(147, 51, 234, 0.25), 0 1px 4px -1px rgba(0, 0, 0, 0.5)',
        'harbor-md': '0 8px 30px -4px rgba(147, 51, 234, 0.3), 0 4px 16px -2px rgba(0, 0, 0, 0.6)',
        'harbor-lg': '0 16px 40px -6px rgba(168, 85, 247, 0.35), 0 8px 24px -4px rgba(0, 0, 0, 0.7)',
        'harbor-glow': '0 0 35px -5px rgba(168, 85, 247, 0.5)',
        'neon-glow': '0 0 25px rgba(168, 85, 247, 0.55)',
        'purple-glow': '0 0 30px rgba(147, 51, 234, 0.5)',
        'white-glow': '0 0 20px rgba(255, 255, 255, 0.35)',
        'blue-glow': '0 0 30px rgba(56, 189, 248, 0.4)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(to right, rgba(147, 51, 234, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(147, 51, 234, 0.08) 1px, transparent 1px)',
      }
    },
  },
  plugins: [],
}
