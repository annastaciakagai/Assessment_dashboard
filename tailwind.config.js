/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // THIS IS WHERE YOU ADD THE THEMES
      colors: {
        dashboard: {
          dark: '#0f1115',   // Main background
          card: '#181b21',   // Card background
          accent: '#ea580c', // Orange accent
          text: '#9ca3af',   // Muted text
        }
      }
    },
  },
  plugins: [],
}