/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          500: '#ff6b00',
          600: '#e65a00',
          700: '#cc4d00',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
