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
        'logo-energy-gold': '#C68E3F',
        'logo-energy-black': '#1A1714',
        'logo-energy-brown': '#5C4033',
        'logo-energy-cream': '#F5F5DC',
        primary: '#1a1a1a',
        accent: '#22c55e', // Verde para 'Energy'
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        logoEnergy: ['Cinzel', 'serif'],
        eco: ['Syne', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
