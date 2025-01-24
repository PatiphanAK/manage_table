/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'blue-card': '#5071d4',
        "red-text": "#b20808"
      }
    },
  },
  plugins: [require("daisyui")],
}