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
          // Exact colors from client reference images (NovaTech & Azul Ciano palette)
          dark: '#0B0F1A',          // NovaTech Deep Midnight Base
          slateDark: '#0F172A',     // Image 1: #0F172A Primary Dark Slate
          surface: '#131B2E',       // Futuristic elevated card surface
          surfaceLight: '#1E293B',  // Elevated secondary container
          steel: '#334155',         // Image 1: #334155 Slate border/sub-element
          electric: '#0EA5E9',      // Image 1: #0EA5E9 Electric Blue
          blue: '#0A84FF',          // NovaTech Electric Blue #0A84FF
          cyan: '#22D3EE',          // Image 1: #22D3EE Cyan
          neon: '#00FFC6',          // NovaTech Neon Cyan #00FFC6
          silver: '#C0C7D1',        // NovaTech Metallic Silver #C0C7D1
          ice: '#E2E8F0',           // Image 1: #E2E8F0 Ice Light White
          // Backward compatibility mappings
          navy: '#0B0F1A',
          navyDark: '#070A12',
          navyLight: '#131B2E',
          blueDark: '#0284C7',
          blueLight: '#38BDF8',
          cyanDark: '#06B6D4',
          cyanLight: '#67E8F9',
          lightBg: '#0B0F1A',       // Modern futuristic generation dark theme
          gold: '#FFB03E',
          goldLight: '#FFC36E',
          border: '#1E293B',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'harbor-sm': '0 2px 10px -2px rgba(14, 165, 233, 0.1), 0 1px 4px -1px rgba(0, 0, 0, 0.4)',
        'harbor-md': '0 8px 30px -4px rgba(14, 165, 233, 0.15), 0 4px 16px -2px rgba(0, 0, 0, 0.5)',
        'harbor-lg': '0 16px 40px -6px rgba(34, 211, 238, 0.2), 0 8px 24px -4px rgba(0, 0, 0, 0.6)',
        'harbor-glow': '0 0 35px -5px rgba(34, 211, 238, 0.35)',
        'neon-glow': '0 0 25px rgba(0, 255, 198, 0.35)',
        'blue-glow': '0 0 30px rgba(10, 132, 255, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(to right, rgba(34, 211, 238, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(34, 211, 238, 0.05) 1px, transparent 1px)',
      }
    },
  },
  plugins: [],
}
