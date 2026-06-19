import { Section } from "@/components/ui/Section";
import type { FaqProps } from "./types";

export function FAQ({ items }: FaqProps) {
  return (
    <Section tone="surface">
      <h2 className="font-display text-3xl">Dúvidas frequentes</h2>
      <div className="mt-8 space-y-3">
        {items.map((it) => (
          <details key={it.q} className="rounded-token bg-bg p-5 shadow-token">
            <summary className="cursor-pointer font-semibold">{it.q}</summary>
            <p className="mt-3 text-muted">{it.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
