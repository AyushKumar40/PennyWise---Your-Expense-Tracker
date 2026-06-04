/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ink: {
          50: "#f7f6f3",
          100: "#ede9e1",
          200: "#ddd6c8",
          300: "#c8bfaa",
          400: "#ada086",
          500: "#96856b",
          600: "#7d6c57",
          700: "#655748",
          800: "#54483d",
          900: "#473d35",
          950: "#261f19",
        },
        emerald: {
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
        },
        rose: {
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
        },
        amber: {
          400: "#fbbf24",
          500: "#f59e0b",
        },
        sky: {
          400: "#38bdf8",
          500: "#0ea5e9",
        },
        violet: {
          400: "#a78bfa",
          500: "#8b5cf6",
        },
      },
    },
  },
  plugins: [],
};
