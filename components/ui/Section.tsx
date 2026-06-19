import type { ReactNode } from "react";

export function Section({ children, tone = "bg", id, className = "" }: { children: ReactNode; tone?: "bg" | "surface"; id?: string; className?: string }) {
  const toneCls = tone === "surface" ? "bg-surface" : "bg-bg";
  return (
    <section id={id} className={`${toneCls} py-16 px-6 md:py-24 ${className}`}>
      <div className="mx-auto max-w-5xl">{children}</div>
    </section>
  );
}
