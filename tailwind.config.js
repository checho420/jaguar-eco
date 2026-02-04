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
        'jaguar-gold': '#C68E3F',
        'jaguar-black': '#1A1714',
        'jaguar-brown': '#5C4033',
        'jaguar-cream': '#F5F5DC',
        primary: '#1a1a1a',
        accent: '#22c55e', // Verde para 'Eco'
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        jaguar: ['Cinzel', 'serif'],
        eco: ['Syne', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
