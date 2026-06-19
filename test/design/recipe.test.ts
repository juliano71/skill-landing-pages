import { recipeToCssVars, recipeToStyle, type Recipe } from "@/lib/design/recipe";

const r: Recipe = {
  id: "vinho", colors: { bg: "#fff", surface: "#f5f5f5", accent: "#7a1f2b", accentFg: "#fff", fg: "#1a1a1a", muted: "#777" },
  fonts: { display: "Playfair Display", body: "Inter" },
  radius: "1rem", shadow: "0 8px 24px rgba(0,0,0,.1)", ease: "cubic-bezier(.22,1,.36,1)", duration: "600ms",
};

test("recipeToCssVars mapeia cores e fontes para CSS vars", () => {
  const v = recipeToCssVars(r);
  expect(v["--color-accent"]).toBe("#7a1f2b");
  expect(v["--font-display"]).toBe("Playfair Display");
  expect(v["--duration"]).toBe("600ms");
});

test("recipeToStyle retorna objeto usável como style inline", () => {
  const s = recipeToStyle(r) as Record<string, string>;
  expect(s["--color-bg"]).toBe("#fff");
});
