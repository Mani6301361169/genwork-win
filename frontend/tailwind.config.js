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
        // Black and White / Greyscale Palette
        brand: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b', // Pure Off-Black
          950: '#09090b', // Pitch Black
        },
        accent: {
          50: '#ffffff',
          100: '#f5f5f5',
          500: '#000000', // Pure Black primary accent
          600: '#171717',
          700: '#262626',
        },
        navy: {
          800: '#171717',
          900: '#0a0a0a',
          950: '#000000',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 20px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
}
