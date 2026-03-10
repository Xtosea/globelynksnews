/** @type {import('tailwindcss').Config} */
const typography = require('@tailwindcss/typography');

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        accent1: "#fafafa",
        accent2: "#eaeaea",
        accent7: "#333",
        success: "#0070f3",
        cyan: "#79ffe1",
        blue500: "#2276fc",
        yellow100: "#fef7da",
      },
      letterSpacing: {
        tighter: "-0.04em",
      },
      lineHeight: {
        tight: "1.2",
      },
      fontSize: {
        "5xl": "2.5rem",
        "6xl": "2.75rem",
        "7xl": "4.5rem",
        "8xl": "6.25rem",
      },
      boxShadow: {
        small: "0 5px 10px rgba(0, 0, 0, 0.12)",
        medium: "0 8px 30px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [typography],
};