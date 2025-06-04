/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "fade-delayed": "fadeDelayed 2.5s ease-out forwards",
      },
      keyframes: {
        fadeDelayed: {
          "0%": { opacity: 1 },
          "70%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
      },
    },
  },
  plugins: [],
};
