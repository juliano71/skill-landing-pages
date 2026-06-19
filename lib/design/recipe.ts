export type Recipe = {
  id: string;
  colors: { bg: string; surface: string; accent: string; accentFg: string; fg: string; muted: string };
  fonts: { display: string; body: string };
  radius: string; shadow: string; ease: string; duration: string;
};

export function recipeToCssVars(r: Recipe): Record<string, string> {
  return {
    "--color-bg": r.colors.bg,
    "--color-surface": r.colors.surface,
    "--color-accent": r.colors.accent,
    "--color-accent-fg": r.colors.accentFg,
    "--color-fg": r.colors.fg,
    "--color-muted": r.colors.muted,
    "--font-display": r.fonts.display,
    "--font-body": r.fonts.body,
    "--radius": r.radius,
    "--shadow": r.shadow,
    "--ease": r.ease,
    "--duration": r.duration,
  };
}

export function recipeToStyle(r: Recipe): React.CSSProperties {
  return recipeToCssVars(r) as React.CSSProperties;
}
