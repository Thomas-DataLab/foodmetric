import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#F8FAFC",
        surface: {
          DEFAULT: "#FFFFFF",
          elevated: "#F1F5F9",
        },
        border: {
          subtle: "#E2E8F0",
          highlight: "#CBD5E1",
        },
        accent: {
          emerald: "#059669",
          amber: "#D97706",
          rose: "#E11D48",
          blue: "#2563EB",
        },
        text: {
          primary: "#0F172A",
          secondary: "#475569",
          muted: "#94A3B8",
        },
      },
      maxWidth: {
        container: "1440px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        lexend: ["var(--font-lexend)", "Lexend", "sans-serif"],
        mono: ["var(--font-lexend)", "Lexend", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
