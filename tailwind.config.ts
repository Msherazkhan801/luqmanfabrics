import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gold: {
          50: "#FCF9EE",
          100: "#F7F0D6",
          200: "#EEDFA8",
          300: "#E3C973",
          400: "#D4AF37", // Primary luxury gold
          500: "#C5A059",
          600: "#A8833B",
          700: "#866629",
          800: "#6B5024",
          900: "#543F1F",
        },
        pearl: {
          50: "#FFFFFF",
          100: "#FAFAF8",
          200: "#F5F4F0",
          300: "#ECEAE4",
          400: "#DCD8CE",
          500: "#C3BDB0",
        },
        charcoal: {
          800: "#1E2022",
          900: "#121316",
          950: "#0A0B0D",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-outfit)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'luxury': '0 10px 40px -10px rgba(0, 0, 0, 0.05), 0 2px 10px -2px rgba(212, 175, 55, 0.05)',
        'luxury-hover': '0 20px 50px -10px rgba(0, 0, 0, 0.1), 0 5px 20px -3px rgba(212, 175, 55, 0.15)',
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.25)',
      },
      animation: {
        'shimmer': 'shimmer 2.5s infinite linear',
        'float': 'float 4s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 3s infinite ease-in-out',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
