/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        docs: {
          bg: '#f8f9fa',
          hover: '#f1f3f4',
          active: '#e8f0fe',
          blue: '#1a73e8',
          'blue-hover': '#1765cc',
          border: '#dadce0',
          'border-light': '#e8eaed',
          text: '#202124',
          muted: '#5f6368',
          sidebar: '#f9fbfd',
        }
      },
      boxShadow: {
        'doc': '0 1px 3px 1px rgba(60,64,67, 0.15), 0 1px 2px 0 rgba(60,64,67, 0.30)',
        'dropdown': '0 2px 6px 2px rgba(60,64,67, 0.15)',
        'modal': '0 4px 16px rgba(0,0,0,0.2)',
      }
    },
  },
  plugins: [],
}
