/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Ensure Tailwind scans all relevant files
  ],
  theme: {
    extend: {
      fontFamily: {
        hachi: ["'Hachi Maru Pop'", "cursive"], // Add the custom font
      },
    },
  },
  plugins: [],
};