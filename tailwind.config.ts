import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1340px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Royal Blue Palette (Bleu Roi Impérial)
        royal: {
          50: "#F0F4FA",
          100: "#D9E4F5",
          200: "#B0C8EB",
          300: "#7DA5DE",
          400: "#4B7ED1",
          500: "#235DC4",
          600: "#1A4AA6",
          700: "#133E87", // Deep Royal Blue
          800: "#0E2D64",
          900: "#0B2545", // Royal Navy
          950: "#06152B",
        },
        // Metallic Gold Palette (Or Métallique & Feuille d'Or)
        gold: {
          50: "#FCF9EE",
          100: "#F7F0D4",
          200: "#EFE0A8",
          300: "#E5CE7A",
          400: "#DCBE54",
          500: "#D4AF37", // Pure Metallic Gold
          600: "#C5A059", // Rich Gold
          700: "#9E7C32",
          800: "#745A25",
          900: "#4F3C18",
          950: "#2C200B",
        },
        // Pure White & Textured Canvas Tones
        pure: "#FFFFFF",
        ivory: "#FAFAF8",
        champagne: "#F7F4EB",
        paper: {
          DEFAULT: "#FFFFFF",
          warm: "#FDFDFD",
          textured: "#F9FAF8",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        script: ["var(--font-great-vibes)", "cursive"],
        sans: ["var(--font-plus-jakarta)", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        royalGlow: {
          "0%, 100%": { opacity: "0.3", transform: "scale(1) rotate(0deg)" },
          "50%": { opacity: "0.7", transform: "scale(1.08) rotate(3deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 4s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "royal-glow": "royalGlow 6s ease-in-out infinite",
      },
      boxShadow: {
        gold: "0 10px 30px -5px rgba(212, 175, 55, 0.28)",
        "gold-glow": "0 0 25px rgba(212, 175, 55, 0.45)",
        royal: "0 10px 30px -5px rgba(11, 37, 69, 0.22)",
        "royal-glow": "0 0 30px rgba(19, 62, 135, 0.35)",
        glass: "0 8px 32px 0 rgba(11, 37, 69, 0.06)",
        "glass-elevated": "0 20px 40px -15px rgba(11, 37, 69, 0.12), 0 0 20px rgba(212, 175, 55, 0.2)",
      },
    },
  },
  plugins: [],
};
export default config;
