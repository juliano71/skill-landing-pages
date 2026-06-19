import type { ReactNode } from "react";

type Props = { children: ReactNode; href?: string; variant?: "primary" | "ghost"; className?: string };

const base = "inline-flex items-center justify-center min-h-[44px] px-7 rounded-token font-semibold transition-colors duration-token ease-token";
const variants = {
  primary: "bg-accent text-accent-fg hover:opacity-90 shadow-token",
  ghost: "border border-accent text-accent hover:bg-accent hover:text-accent-fg",
};

export function Button({ children, href, variant = "primary", className = "" }: Props) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (href) return <a href={href} className={cls}>{children}</a>;
  return <button className={cls}>{children}</button>;
}
