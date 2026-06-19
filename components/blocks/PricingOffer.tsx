import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import type { PricingOfferProps } from "./types";

export function PricingOffer({ fromPrice, price, installments, ctaLabel, ctaHref }: PricingOfferProps) {
  return (
    <Section tone="surface">
      <Reveal>
        <div className="mx-auto max-w-md rounded-token bg-bg p-8 text-center shadow-token">
          {fromPrice && <p className="text-muted line-through">{fromPrice}</p>}
          <p className="font-display text-5xl text-accent">{price}</p>
          {installments && <p className="mt-1 text-sm text-muted">{installments}</p>}
          <div className="mt-6"><Button href={ctaHref} className="w-full">{ctaLabel}</Button></div>
        </div>
      </Reveal>
    </Section>
  );
}
