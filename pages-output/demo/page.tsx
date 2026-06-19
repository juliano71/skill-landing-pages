import { recipeToStyle } from "@/lib/design/recipe";
import { vinho } from "@/lib/design/recipes.sample";
import { Hero } from "@/components/blocks/Hero";
import { PricingOffer } from "@/components/blocks/PricingOffer";
import { Guarantee } from "@/components/blocks/Guarantee";
import { FAQ } from "@/components/blocks/FAQ";

export default function DemoPage() {
  return (
    <main style={recipeToStyle(vinho)} className="bg-bg text-fg font-body">
      <Hero
        headline="Reverta o quadro com um plano alimentar de verdade"
        sub="O e-book que já ajudou centenas de pessoas a recuperar a saúde com comida real."
        ctaLabel="Quero meu e-book"
        ctaHref="#oferta"
      />
      <PricingOffer fromPrice="R$57,00" price="R$19,90" installments="ou 3x de R$6,63" ctaLabel="Garantir agora" ctaHref="https://checkout.exemplo" />
      <Guarantee days={7} text="Se em 7 dias você achar que não é pra você, devolvemos 100% do valor. Sem perguntas." />
      <FAQ items={[
        { q: "Como recebo o material?", a: "Por e-mail, logo após a compra." },
        { q: "Tem garantia?", a: "Sim, 7 dias incondicional." },
      ]} />
    </main>
  );
}
