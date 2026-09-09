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
        // Cinematic Pro Advanced Palette
        emerald: {
          deep: '#064e3b',   // Deep Emerald Primary
          dark: '#042f2e',
          medium: '#047857',
          light: '#10b981',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          400: '#fbbf24',
          500: '#f59e0b',   // Metallic Gold / Amber
          600: '#d97706',
          700: '#b45309',
        },
        crimson: {
          50: '#fff1f2',
          100: '#ffe4e6',
          400: '#f43f5e',
          500: '#e11d48',   // Crimson Rose Accent
          600: '#be123c',
          700: '#9f1239',
        },
        teal: {
          deep: '#042f2e',   // Dark Teal Metallic
          dark: '#134e4a',
          medium: '#0f766e',
          metallic: '#0d9488',
          light: '#14b8a6',
        },
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#064e3b', // Deep Emerald
          600: '#047857',
          700: '#065f46',
          800: '#064e3b',
          900: '#022c22',
        },
        accent: {
          500: '#f59e0b', // Metallic Gold
          600: '#e11d48', // Crimson Rose
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 30px -10px rgba(6, 78, 59, 0.15)',
        'gold-glow': '0 0 25px rgba(245, 158, 11, 0.35)',
        'emerald-glow': '0 0 25px rgba(6, 78, 59, 0.45)',
        'crimson-glow': '0 0 25px rgba(225, 29, 72, 0.35)',
      }
    },
  },
  plugins: [],
}
