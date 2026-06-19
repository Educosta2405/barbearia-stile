import type { Config } from "tailwindcss";

export default {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Preto profundo (fundos)
        ink: {
          950: "#070708",
          900: "#0b0b0d",
          850: "#0f1013",
          800: "#15161a",
          700: "#1c1d22",
          600: "#24262c",
        },
        // Nardo Gray (superfícies / bordas)
        nardo: {
          DEFAULT: "#6f7479",
          dark: "#2a2c31",
          line: "#34373d",
        },
        // Prata metálico (textos)
        silver: {
          DEFAULT: "#c7ccd1",
          bright: "#edeff1",
          dim: "#9aa0a6",
        },
        // Dourado premium (destaque)
        gold: {
          DEFAULT: "#c8a24a",
          deep: "#8a6a2b",
          soft: "#d8b86a",
          glow: "#ecd594",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(200,162,74,0.30), 0 8px 40px -12px rgba(200,162,74,0.40)",
        card: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 12px 40px -16px rgba(0,0,0,0.8)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "blur-in": {
          from: { opacity: "0", filter: "blur(12px)", transform: "translateY(8px)" },
          to: { opacity: "1", filter: "blur(0)", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.97)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease forwards",
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
        "blur-in": "blur-in 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        "scale-in": "scale-in 0.4s ease forwards",
      },
    },
  },
  plugins: [],
} satisfies Config;
