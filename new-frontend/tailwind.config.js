/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        bakbak: ['"Bakbak One"', 'cursive'], // or 'sans-serif' if you prefer
        baloo: ['"Baloo 2"', 'cursive'],
      },
    },
  },
  plugins: [],
};