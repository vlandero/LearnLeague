/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        transparentOverlay:'rgba(0, 0, 0, 0.5)',
        navBlue:'#0A343D',
        navLightBlue:'#2E667E',
        lightBlue:'#3D8BA1'
      }
    },
  },
  plugins: [],
}