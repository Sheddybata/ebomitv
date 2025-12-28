import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        card: "rgba(var(--foreground), 0.03)",
        border: "rgba(var(--foreground), 0.1)",
        "ministry-red": {
          DEFAULT: "#911A29",
          light: "#B02A3C",
          dark: "#6D101D",
          deep: "#4A0B14",
        },
        "ministry-gold": {
          // Kept key for compatibility; this is now the primary brand BLUE
          DEFAULT: "#0201B4",
          light: "#6D6CFF",
          dark: "#01008A",
          muted: "#1E1DE6",
        },
        "ministry-dark": {
          DEFAULT: "#0F0F0F",
          soft: "#1A1A1A",
          accent: "#2D2D2D",
        },
        "ministry-light": {
          DEFAULT: "#FDFDFD",
          soft: "#F5F5F5",
          accent: "#E5E5E5",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;

