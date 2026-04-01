/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'jungle-green': {
          50: '#e6f7f0',
          100: '#ccefe1',
          200: '#99dfc3',
          300: '#66cfa5',
          400: '#4cc791',
          500: '#34b27b', // your base
          600: '#2e9f6e',
          700: '#26845a',
          800: '#1f6a47',
          900: '#174f34',
        },
      },
    },
  },
  plugins: [],
}