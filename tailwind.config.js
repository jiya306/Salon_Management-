/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F9F7F3',
          surface: '#F3F0E8',
        },
        brand: {
          light: '#B8E7FA',
          DEFAULT: '#7CCBEE',
          deep: '#42A9D8',
          dark: '#1D76A0',
        },
        ink: {
          primary: '#202020',
          body: '#3A3A3A',
          secondary: '#575757',
          muted: '#646464',
          black: '#000000',
        },
        accent: {
          success: '#2B9A66',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'serif', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.03)',
        'float': '0 8px 30px rgba(32, 32, 32, 0.06)',
        'blue-glow': '0 0 20px rgba(124, 203, 238, 0.35)',
      },
      borderRadius: {
        'pill': '9999px',
        'card': '14px',
      },
    },
  },
  plugins: [],
}
