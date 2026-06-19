import type { Recipe } from "./recipe";

export const vinho: Recipe = {
  id: "vinho",
  colors: { bg: "#fbf7f4", surface: "#f3e9e6", accent: "#8a1f3d", accentFg: "#ffffff", fg: "#2a1418", muted: "#8a7a7e" },
  fonts: { display: "Playfair Display", body: "Inter" },
  radius: "1rem", shadow: "0 12px 32px rgba(80,20,40,.12)",
  ease: "cubic-bezier(.22,1,.36,1)", duration: "600ms",
};
