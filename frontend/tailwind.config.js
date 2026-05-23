/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      boxShadow: {
        soft: "0 10px 25px -12px rgba(0,0,0,0.25)",
      },
      colors: {
        brand: {
          50: "#f5f7ff",
          100: "#eef2ff",
          200: "#dfe7ff",
          300: "#c2d2ff",
          400: "#96b2ff",
          500: "#6b8cff",
          600: "#4a67ff",
          700: "#3450e6",
          800: "#2b42b8",
          900: "#263b91",
        },
      },
    },
  },
  plugins: [],
};

