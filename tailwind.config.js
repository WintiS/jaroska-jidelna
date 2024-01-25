/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      height: {
        '70': '70vh',
      },
      colors: {
        'blackg': "#0F0F0F"
      }
    },
  },
  plugins: [],
};
