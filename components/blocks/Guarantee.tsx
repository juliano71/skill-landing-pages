import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import type { GuaranteeProps } from "./types";

export function Guarantee({ days, text }: GuaranteeProps) {
  return (
    <Section className="text-center">
      <Reveal>
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-accent font-display text-xl text-accent">
          {days} dias
        </div>
        <p className="mx-auto mt-6 max-w-xl text-muted">{text}</p>
      </Reveal>
    </Section>
  );
}
