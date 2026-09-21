import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#0A0A0A",
          surface: "#121212",
          elevated: "#18181B",
        },
        foreground: {
          DEFAULT: "#F5F5F5",
          muted: "#A1A1AA",
        },
        accent: {
          DEFAULT: "#7C3AED",
          strong: "#6D28D9",
          soft: "#A78BFA",
        },
        border: {
          DEFAULT: "#27272A",
        },
        status: {
          "nao-lido": "#3B82F6",
          lido: "#EAB308",
          corrigido: "#22C55E",
          "nao-corrigido": "#EF4444",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
