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
        // Premium Wedding Palette
        gold: {
          50: "#FAF7F0",
          100: "#F4EDE0",
          200: "#E8D8BF",
          300: "#DBC29E",
          400: "#CAAB79",
          500: "#B89355", // Main champagne gold
          600: "#9C793F",
          700: "#7E5E2E",
          800: "#604722",
          900: "#443217",
          950: "#271C0B",
        },
        sage: {
          50: "#F4F6F4",
          100: "#E5EBE5",
          200: "#CBD8CC",
          300: "#ABC1AD",
          400: "#8CA98F",
          500: "#6E9072",
          600: "#557359",
          700: "#415844",
          800: "#304132",
          900: "#212D22",
        },
        blush: {
          50: "#FDF8F7",
          100: "#F9EDE9",
          200: "#F3D8D0",
          300: "#E9BDB2",
          400: "#DE9F91",
          500: "#CE7C6C",
          600: "#B25E4D",
          700: "#8D4739",
          800: "#6A352B",
          900: "#4A241D",
        },
        ivory: "#FDFBF7",
        champagne: "#F7F3E9",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 4s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
      },
      boxShadow: {
        gold: "0 10px 30px -5px rgba(184, 147, 85, 0.25)",
        "gold-glow": "0 0 25px rgba(202, 171, 121, 0.4)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        "glass-elevated": "0 20px 40px -15px rgba(0, 0, 0, 0.1), 0 0 15px rgba(184, 147, 85, 0.15)",
      },
    },
  },
  plugins: [],
};
export default config;
