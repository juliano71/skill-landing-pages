# Catálogo de Animações

Referência de efeitos disponíveis para páginas de venda. Todos os movimentos respeitam
`prefers-reduced-motion` — veja a regra de acessibilidade no final.

---

## Reveal ao scroll

Use o componente `Reveal` (`components/motion/Reveal.tsx`). Ele usa `whileInView` do
framer-motion e desativa o movimento automaticamente quando `useReducedMotion()` retorna
`true` — sem nenhuma configuração extra.

```tsx
import { Reveal } from "@/components/motion/Reveal";

// Uso básico
<Reveal>
  <h2>Título da seção</h2>
</Reveal>

// Com delay (stagger manual: incrementar 0.1s por elemento)
<Reveal delay={0.0}><p>Benefício 1</p></Reveal>
<Reveal delay={0.1}><p>Benefício 2</p></Reveal>
<Reveal delay={0.2}><p>Benefício 3</p></Reveal>
```

O componente usa `viewport={{ once: true, margin: "-80px" }}` — o reveal dispara quando o
elemento entra 80 px antes da borda inferior da tela, e não repete ao scrollar para cima.
A transição padrão é `duration: 0.6, ease: [0.22, 1, 0.36, 1]` (a mesma curva de `--ease`).

**Stagger em listas:** para listas longas (cards de bônus, depoimentos), use delays
incrementais de 0.08–0.12 s por item. Acima de 6 itens, trave o delay máximo em ~0.5 s
para a sequência não parecer lenta demais.

---

## CTA glow/pulse

Botão principal pulsando com halo colorido no accent. Envolto em
`@media (prefers-reduced-motion: no-preference)` para não pulsar em dispositivos com
motion reduzido.

```css
@media (prefers-reduced-motion: no-preference) {
  @keyframes cta-glow {
    0%, 100% {
      box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-accent) 60%, transparent);
    }
    50% {
      box-shadow: 0 0 0 10px color-mix(in srgb, var(--color-accent) 0%, transparent);
    }
  }

  .cta-pulse {
    animation: cta-glow 2.4s ease-in-out infinite;
  }
}
```

Aplique a classe `cta-pulse` no `<button>` ou no wrapper do componente `Button` do projeto
(`components/ui/Button.tsx`).

---

## Count-up de números

Anima um número (ex.: "2.300 alunos", "R$ 47") ao entrar na viewport. Use
`IntersectionObserver` para disparar a contagem uma única vez.

```tsx
import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const triggered = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered.current) {
        triggered.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          setValue(Math.round(progress * target));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { ref, value };
}

// Uso
function StatNumber() {
  const { ref, value } = useCountUp(2300);
  return <span ref={ref}>{value.toLocaleString("pt-BR")}</span>;
}
```

Para respeitar reduced-motion, verifique `window.matchMedia("(prefers-reduced-motion: reduce)").matches`
antes de iniciar a animação — se verdadeiro, exiba o valor final diretamente.

---

## Marquee de avatares/logos

Fileira horizontal em loop contínuo (ex.: logos de mídia, avatares de alunos). A keyframe
move o container pelo eixo X de 0 até −50%, enquanto o HTML contém os itens duplicados
para criar o loop perfeito.

```css
@media (prefers-reduced-motion: no-preference) {
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  .marquee-track {
    display: flex;
    width: max-content;
    animation: marquee 28s linear infinite;
  }
}

/* Wrapper que esconde o overflow */
.marquee-viewport {
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
}
```

```tsx
// Duplique os itens para o loop contínuo
const items = [...logos, ...logos];
<div className="marquee-viewport">
  <div className="marquee-track">
    {items.map((src) => <img key={src} src={src} alt="" aria-hidden="true" />)}
  </div>
</div>
```

---

## Hover micro-interações

Use as CSS vars `--duration` e `--ease` (definidas em `app/globals.css`) para manter
consistência de timing com o resto da página.

```css
/* Scale sutil em card */
.card {
  transition: transform var(--duration) var(--ease),
              box-shadow var(--duration) var(--ease);
}
.card:hover {
  transform: translateY(-4px) scale(1.015);
  box-shadow: var(--shadow);
}

/* Mudança de cor em link interno */
.inline-link {
  color: var(--color-muted);
  transition: color var(--duration) var(--ease);
}
.inline-link:hover {
  color: var(--color-accent);
}

/* Botão: levantar ligeiramente */
.btn {
  transition: transform var(--duration) var(--ease),
              filter var(--duration) var(--ease);
}
.btn:hover  { transform: translateY(-2px); filter: brightness(1.06); }
.btn:active { transform: translateY(0);    filter: brightness(0.96); }
```

Os valores padrão são `--duration: 600ms` e `--ease: cubic-bezier(.22,1,.36,1)`. Para
micro-interações de hover, uma versão mais curta (ex.: `calc(var(--duration) * 0.4)`)
pode ser mais responsiva.

---

## Parallax suave

Aplique apenas em elementos decorativos de fundo (blobs SVG, gradientes, imagens de
textura) — nunca em texto. Use `transform: translateY()` via `onScroll` no cliente, com
um fator de 0.15–0.25× para manter o efeito sutil.

```tsx
"use client";
import { useEffect, useRef } from "react";

export function ParallaxBlob({ children }: { children: React.ReactNode }) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const handler = () => {
      if (!el.current) return;
      const y = window.scrollY * 0.18;
      el.current.style.transform = `translateY(${y}px)`;
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return <div ref={el}>{children}</div>;
}
```

Use `{ passive: true }` no listener para não bloquear o scroll do browser. Prefira
`will-change: transform` no CSS do elemento para promover a camada GPU com antecedência.

---

## Motion tokens

As variáveis `--duration` e `--ease` são definidas em `app/globals.css` e disponíveis
globalmente como CSS custom properties:

| Variável     | Valor padrão                    | Uso                                   |
|--------------|---------------------------------|---------------------------------------|
| `--duration` | `600ms`                         | Duração base de todas as transições   |
| `--ease`     | `cubic-bezier(.22,1,.36,1)`     | Curva padrão (ease-out expressivo)    |

Cada `Recipe` em `lib/design/recipe.ts` pode sobrescrever esses valores via
`recipeToCssVars()` — assim a animação acompanha o mood da receita. Por exemplo, a receita
`vinho` usa `ease: "cubic-bezier(.22,1,.36,1)"` e `duration: "600ms"`.

Sempre prefira referenciar `var(--duration)` e `var(--ease)` no CSS em vez de valores
hardcoded para que a troca de receita afete automaticamente todos os movimentos.

---

## Regra de acessibilidade

**Todo movimento deve respeitar `prefers-reduced-motion`.**

- O componente `Reveal` já trata: quando `useReducedMotion()` retorna `true`, renderiza
  um `<div>` estático sem nenhuma animação.
- Para keyframes CSS (glow, marquee, parallax), **sempre** envolva em:

```css
@media (prefers-reduced-motion: no-preference) {
  /* keyframes e classes de animação aqui */
}
```

- O `app/globals.css` já inclui uma regra global que zera `animation-duration` e
  `transition-duration` para `prefers-reduced-motion: reduce`, servindo como segunda
  camada de segurança.

Nunca dependa só da regra global — declare o `@media` explicitamente em cada keyframe
novo para que o código seja auto-documentado e portável.
