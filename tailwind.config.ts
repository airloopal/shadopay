import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      colors: {
        // ShadoPay premium palette. Token names are kept stable so existing
        // components (which reference bg-surface, text-muted-foreground,
        // etc.) restyle automatically — only the values changed.
        background: "#0A0A0A",
        surface: "#111111",
        "surface-raised": "#18181B",
        card: "#18181B",
        border: "rgba(255,255,255,0.08)",
        foreground: "#FFFFFF",
        muted: {
          DEFAULT: "#18181B",
          foreground: "rgba(255,255,255,0.65)",
        },
        primary: {
          DEFAULT: "#111111",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#D4AF37",
          foreground: "#0A0A0A",
          muted: "rgba(212,175,55,0.12)",
        },
        success: {
          DEFAULT: "#22C55E",
          foreground: "#052E14",
          muted: "rgba(34,197,94,0.12)",
        },
        danger: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
          muted: "rgba(239,68,68,0.12)",
        },
        warning: {
          DEFAULT: "#F59E0B",
          foreground: "#241800",
          muted: "rgba(245,158,11,0.12)",
        },
      },
      borderRadius: {
        lg: "18px",
        md: "14px",
        sm: "10px",
        xl: "22px",
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(0 0 0 / 0.4), 0 1px 3px 1px rgb(0 0 0 / 0.24)",
        raised: "0 8px 24px -6px rgb(0 0 0 / 0.5)",
        glass: "0 12px 40px 0 rgb(0 0 0 / 0.45)",
        "glow-accent": "0 0 0 1px rgba(212,175,55,0.15), 0 8px 24px -8px rgba(212,175,55,0.25)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        shimmer: { "0%": { backgroundPosition: "-400px 0" }, "100%": { backgroundPosition: "400px 0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
