export type HeroProps = { headline: string; sub: string; ctaLabel: string; ctaHref: string; image?: string };
export type PricingOfferProps = { fromPrice?: string; price: string; installments?: string; ctaLabel: string; ctaHref: string };
export type GuaranteeProps = { days: number; text: string };
export type FaqProps = { items: { q: string; a: string }[] };
