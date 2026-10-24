/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F2F4F2",
        "background-dark": "#0D1110",
        charcoal: "#1F2320",
        "charcoal-dark": "#131614",
        sage: "#5B735D",
        "sage-light": "#7D967F",
        "sage-dark": "#405442",
        stone: "#B0AAA0",
        beige: "#EAE7DF",
        "beige-dark": "#D8D4C8",
        muted: "#8A8780",
        "muted-light": "#C8C5BF",
        glass: "rgba(255, 255, 255, 0.65)",
        "glass-card": "rgba(255, 255, 255, 0.72)",
        "glass-hover": "rgba(255, 255, 255, 0.85)",
        "glass-dark": "rgba(19, 22, 20, 0.75)",
        "glass-dark-card": "rgba(26, 30, 27, 0.82)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(36, 38, 34, 0.05), 0 2px 6px -1px rgba(36, 38, 34, 0.03)",
        "card-hover": "0 12px 30px -4px rgba(36, 38, 34, 0.12), 0 4px 10px -2px rgba(36, 38, 34, 0.06)",
        sidebar: "2px 0 16px rgba(0, 0, 0, 0.08)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.06), inset 0 1px 1px 0 rgba(255, 255, 255, 0.85)",
        "glass-hover": "0 14px 40px 0 rgba(31, 38, 135, 0.11), inset 0 1px 2px 0 rgba(255, 255, 255, 0.95)",
        "glass-dark": "0 12px 36px 0 rgba(0, 0, 0, 0.35), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)",
        "glass-sm": "0 4px 16px 0 rgba(0, 0, 0, 0.04), inset 0 1px 1px 0 rgba(255, 255, 255, 0.7)",
      },
      backdropBlur: {
        xs: "2px",
      },
      borderColor: {
        DEFAULT: "#E2DED8",
        glass: "rgba(255, 255, 255, 0.6)",
        "glass-dark": "rgba(255, 255, 255, 0.12)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
