import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import type { HeroProps } from "./types";

export function Hero({ headline, sub, ctaLabel, ctaHref, image, altText }: HeroProps) {
  return (
    <Section className="grid items-center gap-10 md:grid-cols-2">
      <Reveal>
        <h1 className="font-display text-4xl leading-tight md:text-6xl">{headline}</h1>
        <p className="mt-6 text-lg text-muted">{sub}</p>
        <div className="mt-8"><Button href={ctaHref}>{ctaLabel}</Button></div>
      </Reveal>
      {image && (
        <Reveal delay={0.1}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={altText ?? ""} className="w-full rounded-token shadow-token" />
        </Reveal>
      )}
    </Section>
  );
}
