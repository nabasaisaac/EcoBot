/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#165539',
          dark: '#11422c',
          light: '#e8f5ee',
        },
        'background-light': '#f6f8f7',
        'background-dark': '#131f1a',
        success: '#00C853',
        warning: '#FFAB00',
        critical: '#D50000',
        info: '#3498DB',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
}

