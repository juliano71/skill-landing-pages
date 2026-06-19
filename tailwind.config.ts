import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./pages-output/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        accent: "var(--color-accent)",
        "accent-fg": "var(--color-accent-fg)",
        fg: "var(--color-fg)",
        muted: "var(--color-muted)",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: { token: "var(--radius)" },
      boxShadow: { token: "var(--shadow)" },
      transitionTimingFunction: { token: "var(--ease)" },
      transitionDuration: { token: "var(--duration)" },
    },
  },
  plugins: [],
};
export default config;
