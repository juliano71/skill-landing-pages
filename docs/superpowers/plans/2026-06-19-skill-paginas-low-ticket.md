# Skill `criar-pagina-venda` — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir uma skill de projeto reutilizável que gera páginas de venda e captura low ticket em Next.js (copy + imagens IA + design único + animações), entregando um MVP end-to-end com uma página-demo que compila.

**Architecture:** Skill de projeto em `.claude/skills/criar-pagina-venda/` com `SKILL.md` (orquestrador de 5+1 passos) e docs de referência (`references/`). O código vive em `components/` (blocos React parametrizados por design tokens), `lib/images/` (provider de imagem plugável) e `pages-output/` (páginas geradas). Design tokens via CSS variables + Tailwind theme permitem que o mesmo bloco renderize visualmente diferente por página.

**Tech Stack:** Next.js 15 (App Router) + TypeScript + Tailwind CSS + framer-motion. Testes: Vitest + @testing-library/react + jsdom. Node ≥ 20 (fetch nativo).

## Global Constraints

- **Stack fixa:** Next.js (App Router) + TypeScript + Tailwind + framer-motion. Testes com Vitest + @testing-library/react.
- **Segredos:** `OPENAI_API_KEY` vem **só** de `.env` (já no `.gitignore`). Nunca hard-coded, nunca logado, nunca commitado.
- **Acessibilidade:** toda animação respeita `prefers-reduced-motion`. Toque ≥ 44px. Foco visível.
- **Anti-IA:** estilo dirigido por tokens (nunca cores/fontes hard-coded nos blocos); duas páginas seguidas não usam a mesma receita.
- **Idioma:** copy e UI em PT-BR.
- **Commits frequentes**, um por task no mínimo. Mensagens em PT-BR.
- **Providers de imagem:** huggsfield (MCP, em runtime pela skill) OU OpenAI `gpt-image-1` (script em `lib/images/`). O outro é fallback.

---

### Task 1: Scaffold do projeto Next.js + tooling de teste

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`, `tailwind.config.ts`, `vitest.config.ts`, `vitest.setup.ts`
- Create: `app/layout.tsx`, `app/globals.css`, `app/page.tsx`
- Create: `test/smoke.test.tsx`

**Interfaces:**
- Produces: projeto Next compilável; comando `npm test` (vitest) e `npm run build` (next build) funcionando.

- [ ] **Step 1: Criar `package.json`**

```json
{
  "name": "paginas-low-ticket",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "framer-motion": "^11.11.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.1.0",
    "@types/node": "^20.16.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.20",
    "jsdom": "^25.0.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.6.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Criar configs**

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`next.config.mjs`:
```js
/** @type {import('next').NextConfig} */
const nextConfig = { reactStrictMode: true };
export default nextConfig;
```

`postcss.config.mjs`:
```js
export default { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

`tailwind.config.ts`:
```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./pages-output/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        accent: "var(--color-accent)",
        "accent-fg": "var(--color-accent-fg)",
        fg: "var(--color-fg)",
        muted: "var(--color-muted)",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: { token: "var(--radius)" },
      boxShadow: { token: "var(--shadow)" },
      transitionTimingFunction: { token: "var(--ease)" },
      transitionDuration: { token: "var(--duration)" },
    },
  },
  plugins: [],
};
export default config;
```

`vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", setupFiles: ["./vitest.setup.ts"], globals: true },
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
});
```

`vitest.setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Criar app base**

`app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-bg: #ffffff; --color-surface: #f5f5f5; --color-accent: #e11d48;
  --color-accent-fg: #ffffff; --color-fg: #18181b; --color-muted: #71717a;
  --font-display: Georgia; --font-body: system-ui;
  --radius: 0.75rem; --shadow: 0 10px 30px rgba(0,0,0,.08);
  --ease: cubic-bezier(.22,1,.36,1); --duration: 600ms;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .001ms !important; transition-duration: .001ms !important; }
}
```

`app/layout.tsx`:
```tsx
import "./globals.css";
import type { ReactNode } from "react";

export const metadata = { title: "Páginas Low Ticket" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-bg text-fg font-body">{children}</body>
    </html>
  );
}
```

`app/page.tsx`:
```tsx
export default function Home() {
  return <main className="p-8"><h1 className="font-display text-3xl">Páginas Low Ticket</h1></main>;
}
```

- [ ] **Step 4: Escrever o smoke test**

`test/smoke.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

test("home renderiza o título", () => {
  render(<Home />);
  expect(screen.getByText("Páginas Low Ticket")).toBeInTheDocument();
});
```

- [ ] **Step 5: Instalar deps e rodar o teste (deve passar)**

Run: `npm install && npm test`
Expected: 1 passed.

- [ ] **Step 6: Verificar build**

Run: `npm run build`
Expected: build conclui sem erros.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js + Tailwind + framer-motion + Vitest"
```

---

### Task 2: Sistema de design tokens (tipos + aplicação de receita)

**Files:**
- Create: `lib/design/recipe.ts`
- Test: `test/design/recipe.test.ts`

**Interfaces:**
- Produces:
  - `type Recipe = { id: string; colors: { bg: string; surface: string; accent: string; accentFg: string; fg: string; muted: string }; fonts: { display: string; body: string }; radius: string; shadow: string; ease: string; duration: string }`
  - `function recipeToCssVars(r: Recipe): Record<string, string>` — mapeia para `--color-bg` etc.
  - `function recipeToStyle(r: Recipe): React.CSSProperties` — objeto de style inline com as CSS vars.

- [ ] **Step 1: Escrever o teste que falha**

`test/design/recipe.test.ts`:
```ts
import { recipeToCssVars, recipeToStyle, type Recipe } from "@/lib/design/recipe";

const r: Recipe = {
  id: "vinho", colors: { bg: "#fff", surface: "#f5f5f5", accent: "#7a1f2b", accentFg: "#fff", fg: "#1a1a1a", muted: "#777" },
  fonts: { display: "Playfair Display", body: "Inter" },
  radius: "1rem", shadow: "0 8px 24px rgba(0,0,0,.1)", ease: "cubic-bezier(.22,1,.36,1)", duration: "600ms",
};

test("recipeToCssVars mapeia cores e fontes para CSS vars", () => {
  const v = recipeToCssVars(r);
  expect(v["--color-accent"]).toBe("#7a1f2b");
  expect(v["--font-display"]).toBe("Playfair Display");
  expect(v["--duration"]).toBe("600ms");
});

test("recipeToStyle retorna objeto usável como style inline", () => {
  const s = recipeToStyle(r) as Record<string, string>;
  expect(s["--color-bg"]).toBe("#fff");
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run test/design/recipe.test.ts`
Expected: FAIL (módulo não existe).

- [ ] **Step 3: Implementar**

`lib/design/recipe.ts`:
```ts
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
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run test/design/recipe.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/design/recipe.ts test/design/recipe.test.ts
git commit -m "feat: sistema de design tokens (Recipe + CSS vars)"
```

---

### Task 3: Componente de animação `Reveal` (reduced-motion safe)

**Files:**
- Create: `components/motion/Reveal.tsx`
- Test: `test/motion/Reveal.test.tsx`

**Interfaces:**
- Consumes: framer-motion.
- Produces: `<Reveal as?="div" delay?={number} className?>children</Reveal>` — anima fade+slide-up ao entrar na viewport; renderiza o conteúdo sempre (visível mesmo sem JS/motion).

- [ ] **Step 1: Escrever o teste que falha**

`test/motion/Reveal.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { Reveal } from "@/components/motion/Reveal";

test("Reveal renderiza os filhos", () => {
  render(<Reveal><p>conteúdo revelado</p></Reveal>);
  expect(screen.getByText("conteúdo revelado")).toBeInTheDocument();
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run test/motion/Reveal.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implementar**

`components/motion/Reveal.tsx`:
```tsx
"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run test/motion/Reveal.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/motion/Reveal.tsx test/motion/Reveal.test.tsx
git commit -m "feat: componente Reveal com suporte a prefers-reduced-motion"
```

---

### Task 4: Primitivos de UI (`Button`, `Section`)

**Files:**
- Create: `components/ui/Button.tsx`, `components/ui/Section.tsx`
- Test: `test/ui/Button.test.tsx`

**Interfaces:**
- Produces:
  - `<Button href?={string} variant?="primary"|"ghost" className?>children</Button>` — pill, min-h 44px, usa `bg-accent`/`text-accent-fg`.
  - `<Section tone?="bg"|"surface" id? className?>children</Section>` — wrapper de seção com padding e alternância de fundo.

- [ ] **Step 1: Escrever o teste que falha**

`test/ui/Button.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/Button";

test("Button como link quando há href", () => {
  render(<Button href="https://checkout.x">Comprar agora</Button>);
  const el = screen.getByRole("link", { name: "Comprar agora" });
  expect(el).toHaveAttribute("href", "https://checkout.x");
});

test("Button tem altura mínima de toque (min-h-[44px])", () => {
  render(<Button href="#">CTA</Button>);
  expect(screen.getByRole("link")).toHaveClass("min-h-[44px]");
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run test/ui/Button.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implementar**

`components/ui/Button.tsx`:
```tsx
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
```

`components/ui/Section.tsx`:
```tsx
import type { ReactNode } from "react";

export function Section({ children, tone = "bg", id, className = "" }: { children: ReactNode; tone?: "bg" | "surface"; id?: string; className?: string }) {
  const toneCls = tone === "surface" ? "bg-surface" : "bg-bg";
  return (
    <section id={id} className={`${toneCls} py-16 px-6 md:py-24 ${className}`}>
      <div className="mx-auto max-w-5xl">{children}</div>
    </section>
  );
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run test/ui/Button.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/ui test/ui
git commit -m "feat: primitivos Button e Section dirigidos por tokens"
```

---

### Task 5: Blocos núcleo — `Hero`, `PricingOffer`, `Guarantee`, `FAQ`

**Files:**
- Create: `components/blocks/Hero.tsx`, `components/blocks/PricingOffer.tsx`, `components/blocks/Guarantee.tsx`, `components/blocks/FAQ.tsx`
- Create: `components/blocks/types.ts`
- Test: `test/blocks/PricingOffer.test.tsx`, `test/blocks/FAQ.test.tsx`

**Interfaces:**
- Consumes: `Button`, `Section`, `Reveal`.
- Produces (props em `components/blocks/types.ts`):
  - `HeroProps = { headline: string; sub: string; ctaLabel: string; ctaHref: string; image?: string }`
  - `PricingOfferProps = { fromPrice?: string; price: string; installments?: string; ctaLabel: string; ctaHref: string }`
  - `GuaranteeProps = { days: number; text: string }`
  - `FaqProps = { items: { q: string; a: string }[] }`

- [ ] **Step 1: Escrever os testes que falham**

`test/blocks/PricingOffer.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { PricingOffer } from "@/components/blocks/PricingOffer";

test("mostra preço ancorado e CTA", () => {
  render(<PricingOffer fromPrice="R$57,00" price="R$19,90" ctaLabel="Quero agora" ctaHref="#c" />);
  expect(screen.getByText("R$57,00")).toBeInTheDocument();
  expect(screen.getByText("R$19,90")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Quero agora" })).toHaveAttribute("href", "#c");
});
```

`test/blocks/FAQ.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { FAQ } from "@/components/blocks/FAQ";

test("renderiza perguntas como elementos de detalhe", () => {
  render(<FAQ items={[{ q: "Tem garantia?", a: "Sim, 7 dias." }]} />);
  expect(screen.getByText("Tem garantia?")).toBeInTheDocument();
  expect(screen.getByText("Sim, 7 dias.")).toBeInTheDocument();
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run test/blocks`
Expected: FAIL.

- [ ] **Step 3: Implementar `types.ts` e os 4 blocos**

`components/blocks/types.ts`:
```ts
export type HeroProps = { headline: string; sub: string; ctaLabel: string; ctaHref: string; image?: string };
export type PricingOfferProps = { fromPrice?: string; price: string; installments?: string; ctaLabel: string; ctaHref: string };
export type GuaranteeProps = { days: number; text: string };
export type FaqProps = { items: { q: string; a: string }[] };
```

`components/blocks/Hero.tsx`:
```tsx
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import type { HeroProps } from "./types";

export function Hero({ headline, sub, ctaLabel, ctaHref, image }: HeroProps) {
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
          <img src={image} alt="" className="w-full rounded-token shadow-token" />
        </Reveal>
      )}
    </Section>
  );
}
```

`components/blocks/PricingOffer.tsx`:
```tsx
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
```

`components/blocks/Guarantee.tsx`:
```tsx
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
```

`components/blocks/FAQ.tsx`:
```tsx
import { Section } from "@/components/ui/Section";
import type { FaqProps } from "./types";

export function FAQ({ items }: FaqProps) {
  return (
    <Section tone="surface">
      <h2 className="font-display text-3xl">Dúvidas frequentes</h2>
      <div className="mt-8 space-y-3">
        {items.map((it, i) => (
          <details key={i} className="rounded-token bg-bg p-5 shadow-token">
            <summary className="cursor-pointer font-semibold">{it.q}</summary>
            <p className="mt-3 text-muted">{it.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run test/blocks`
Expected: PASS (2 arquivos).

- [ ] **Step 5: Commit**

```bash
git add components/blocks test/blocks
git commit -m "feat: blocos núcleo Hero, PricingOffer, Guarantee, FAQ"
```

---

### Task 6: Provider de imagem OpenAI (`gpt-image-1`) com teste mockado

**Files:**
- Create: `lib/images/openai.mjs`, `lib/images/index.mjs`
- Test: `test/images/openai.test.mjs`

**Interfaces:**
- Produces:
  - `lib/images/openai.mjs`: `export async function generateOpenAIImage({ prompt, size = "1024x1024", apiKey, fetchImpl = fetch }): Promise<{ b64: string }>` — chama `POST https://api.openai.com/v1/images/generations`, modelo `gpt-image-1`, retorna `data[0].b64_json`. Lança erro claro se `apiKey` faltar.
  - `lib/images/index.mjs`: `export async function generateImage({ provider, prompt, ... })` — despacha para openai (e, em runtime real, huggsfield via MCP — documentado em `image-providers.md`, fora deste teste).

- [ ] **Step 1: Escrever o teste que falha**

`test/images/openai.test.mjs`:
```js
import { describe, it, expect } from "vitest";
import { generateOpenAIImage } from "@/lib/images/openai.mjs";

describe("generateOpenAIImage", () => {
  it("monta a requisição correta e retorna b64", async () => {
    let captured;
    const fakeFetch = async (url, opts) => {
      captured = { url, opts };
      return { ok: true, json: async () => ({ data: [{ b64_json: "ABC123" }] }) };
    };
    const res = await generateOpenAIImage({ prompt: "hero vinho", apiKey: "sk-test", fetchImpl: fakeFetch });
    expect(res.b64).toBe("ABC123");
    expect(captured.url).toBe("https://api.openai.com/v1/images/generations");
    expect(JSON.parse(captured.opts.body).model).toBe("gpt-image-1");
    expect(captured.opts.headers.Authorization).toBe("Bearer sk-test");
  });

  it("lança erro se faltar apiKey", async () => {
    await expect(generateOpenAIImage({ prompt: "x" })).rejects.toThrow(/apiKey/i);
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run test/images/openai.test.mjs`
Expected: FAIL.

- [ ] **Step 3: Implementar**

`lib/images/openai.mjs`:
```js
export async function generateOpenAIImage({ prompt, size = "1024x1024", apiKey, fetchImpl = fetch }) {
  if (!apiKey) throw new Error("apiKey ausente: defina OPENAI_API_KEY no .env");
  const res = await fetchImpl("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: "gpt-image-1", prompt, size, n: 1 }),
  });
  if (!res.ok) throw new Error(`OpenAI image falhou: HTTP ${res.status}`);
  const json = await res.json();
  return { b64: json.data[0].b64_json };
}
```

`lib/images/index.mjs`:
```js
import { generateOpenAIImage } from "./openai.mjs";

// huggsfield é chamado em runtime pela skill via ferramentas MCP (ver references/image-providers.md).
export async function generateImage({ provider = "openai", prompt, size, apiKey }) {
  if (provider === "openai") return generateOpenAIImage({ prompt, size, apiKey });
  throw new Error(`provider '${provider}' não suportado neste script (use a skill p/ huggsfield)`);
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run test/images/openai.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/images test/images
git commit -m "feat: provider de imagem OpenAI gpt-image-1 (testado com fetch mockado)"
```

---

### Task 7: Página-demo + verificação de build

**Files:**
- Create: `pages-output/demo/page.tsx`
- Create: `lib/design/recipes.sample.ts`

**Interfaces:**
- Consumes: `Recipe`, `recipeToStyle`, blocos da Task 5.
- Produces: rota `/demo` que monta uma página de venda completa com uma receita aplicada; serve de smoke-test end-to-end.

- [ ] **Step 1: Criar uma receita de exemplo**

`lib/design/recipes.sample.ts`:
```ts
import type { Recipe } from "./recipe";

export const vinho: Recipe = {
  id: "vinho",
  colors: { bg: "#fbf7f4", surface: "#f3e9e6", accent: "#8a1f3d", accentFg: "#ffffff", fg: "#2a1418", muted: "#8a7a7e" },
  fonts: { display: "Playfair Display", body: "Inter" },
  radius: "1rem", shadow: "0 12px 32px rgba(80,20,40,.12)",
  ease: "cubic-bezier(.22,1,.36,1)", duration: "600ms",
};
```

- [ ] **Step 2: Criar a página-demo**

`pages-output/demo/page.tsx`:
```tsx
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
```

- [ ] **Step 3: Verificar build**

Run: `npm run build`
Expected: build conclui sem erros; rota `/demo` presente no output.

- [ ] **Step 4: Verificação visual rápida (manual)**

Run: `npm run dev` e abrir `http://localhost:3000/demo`
Expected: página com paleta vinho, hero + preço ancorado + selo de garantia + FAQ funcional.

- [ ] **Step 5: Commit**

```bash
git add pages-output/demo lib/design/recipes.sample.ts
git commit -m "feat: página-demo end-to-end com receita vinho"
```

---

### Task 8: `SKILL.md` (orquestrador) + `references/copy-frameworks.md`

**Files:**
- Create: `.claude/skills/criar-pagina-venda/SKILL.md`
- Create: `.claude/skills/criar-pagina-venda/references/copy-frameworks.md`

**Interfaces:**
- Produces: a skill invocável que orquestra os 5+1 passos do spec, referenciando os docs e o código construído nas Tasks 1–7.

- [ ] **Step 1: Escrever `SKILL.md`**

Conteúdo obrigatório (frontmatter + corpo):
```markdown
---
name: criar-pagina-venda
description: Use ao criar páginas de venda ou captura low ticket — gera copy, imagens (IA), design único (anti-IA) e código React/Next pronto.
---

# Criar Página de Venda/Captura (low ticket)

Executa 6 passos. Confirme com o usuário nos pontos de decisão.

## Passo 1 — Briefing
Pergunte (uma de cada vez quando fizer sentido): produto, nicho, preço/ancoragem,
público, promessa central, oferta/bônus, autoridade/depoimentos, link de checkout,
arquétipo (venda long-form OU captura/bio), provider de imagem (huggsfield/openai),
referência de estilo (sortear / item do swipe-file / URL nova).

## Passo 2 — Copy
Gere a copy seção a seção usando `references/copy-frameworks.md`. Mostre para revisão.

## Passo 3 — Direção de arte
Escolha/sorteie uma receita (`references/design-recipes.md`) — não repita a última
(registre em `pages-output/<produto>/.recipe`). Valide com `references/originality-audit.md`.
Apresente cores/fontes/mood para aprovação.

## Passo 4 — Imagens
Gere assets via `references/image-providers.md` (provider escolhido), seguindo a paleta.
Salve em `pages-output/<produto>/assets/`.

## Passo 5 — Código
Monte os blocos de `components/blocks/` variando a composição; aplique a receita via
`recipeToStyle` (`lib/design/recipe.ts`); entregue em `pages-output/<produto>/page.tsx`.
Rode `npm run build`.

## Passo 6 — Polish + qualidade
Aplique `references/quality-gates.md` (polish, a11y, mobile-first, integridade de texto).
Corrija o que falhar. Só então declare pronto.
```

- [ ] **Step 2: Escrever `references/copy-frameworks.md`**

Deve conter, com exemplos PT-BR concretos (não placeholders): estrutura de página de
venda low ticket (hero→problema→agitação→solução→o que recebe→bônus→autoridade→
depoimentos→oferta/ancoragem→garantia→FAQ→CTA final); frameworks PAS e AIDA; regras de
headline (promessa + especificidade); construção de oferta (ancoragem de preço, stack de
bônus com valor, garantia, escassez ética); tratamento de objeções; e diferenças para o
arquétipo captura/bio (1 ação, VSL, copy curta).

- [ ] **Step 3: Verificar a skill aparece**

Run: confirmar que `.claude/skills/criar-pagina-venda/SKILL.md` tem frontmatter `name` e `description` válidos (sem erro de parse).
Expected: arquivo válido.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/criar-pagina-venda/SKILL.md .claude/skills/criar-pagina-venda/references/copy-frameworks.md
git commit -m "feat: SKILL.md orquestrador + copy-frameworks"
```

---

### Task 9: Docs de referência restantes

**Files:**
- Create: `.claude/skills/criar-pagina-venda/references/design-recipes.md`
- Create: `.claude/skills/criar-pagina-venda/references/originality-audit.md`
- Create: `.claude/skills/criar-pagina-venda/references/animations.md`
- Create: `.claude/skills/criar-pagina-venda/references/image-providers.md`
- Create: `.claude/skills/criar-pagina-venda/references/quality-gates.md`
- Create: `.claude/skills/criar-pagina-venda/references/swipe-file/README.md`

**Interfaces:**
- Consumes: os screenshots já presentes em `references/swipe-file/`.
- Produces: os 6 docs de referência, com conteúdo real conforme §7, §8, §9, §13 do spec.

- [ ] **Step 1: `design-recipes.md`** — 6 receitas iniciais (uma por referência do swipe-file: vinho/creme, dark-dourado, sage-editorial, creme-bordô, dark-neon, dark-âmbar) no formato do tipo `Recipe` (cores hex, par de fontes, radius/shadow/ease/duration). Mais regras para gerar novas via `ui-ux-pro-max` e a regra anti-repetição.

- [ ] **Step 2: `originality-audit.md`** — conforme §7 do spec: veredito (distinctive/safe/generic-blocking), teste do reflexo de categoria, teste da anti-referência, lista de anti-padrões, lista de "fazer". Crédito ao claude-design-premium (MIT).

- [ ] **Step 3: `animations.md`** — conforme §8: reveal (framer-motion whileInView), CTA glow/pulse (keyframes CSS), count-up, marquee, hover; motion tokens (duração+easing); regra de `prefers-reduced-motion`.

- [ ] **Step 4: `image-providers.md`** — huggsfield (via ferramentas MCP `generate_image` em runtime) vs OpenAI (`lib/images/openai.mjs`, lê `OPENAI_API_KEY` do `.env`); como derivar o prompt da paleta/mood; alternância e fallback; aviso de nunca expor a key.

- [ ] **Step 5: `quality-gates.md`** — conforme §13: polish, acessibilidade, mobile-first, integridade de texto. Crédito ao claude-design-premium (MIT).

- [ ] **Step 6: `swipe-file/README.md`** — análise de cada um dos 6 screenshots (paleta, tipografia, estrutura, mood) já capturada na conversa, mais os links originais.

- [ ] **Step 7: Commit**

```bash
git add .claude/skills/criar-pagina-venda/references
git commit -m "docs: design-recipes, originality-audit, animations, image-providers, quality-gates, swipe-file"
```

---

### Task 10: README do projeto + push final

**Files:**
- Create: `README.md`

**Interfaces:**
- Produces: instruções de uso (instalar, configurar `.env`, invocar a skill, build/deploy).

- [ ] **Step 1: Escrever `README.md`** — o que é o projeto, setup (`npm install`, copiar `.env.example`→`.env` e preencher `OPENAI_API_KEY`), como invocar a skill `criar-pagina-venda`, onde as páginas saem (`pages-output/`), como buildar e fazer deploy na Vercel/Netlify. Linkar o spec e o plano.

- [ ] **Step 2: Rodar a suíte completa e o build**

Run: `npm test && npm run build`
Expected: todos os testes passam; build sem erros.

- [ ] **Step 3: Commit e push**

```bash
git add README.md
git commit -m "docs: README com setup e uso da skill"
git push
```

---

## Follow-up tasks (fora do MVP — implementar depois conforme necessidade)

Cada um segue o mesmo padrão TDD das Tasks 5/6:

- **Blocos adicionais:** `ProblemAgitation`, `SolutionIntro`, `FeatureList`/`Curriculum`, `BonusStack` (gift boxes), `AuthorBio`, `Testimonials`, `FinalCTA`, `Footer`, `VSLEmbed`, `MetricDashboard`, `AvatarMarquee`.
- **Animações avançadas:** componentes `CountUp`, `Marquee`, glow CSS reutilizável.
- **Provider huggsfield em script:** caso se queira gerar imagens fora da skill (hoje é via MCP em runtime).
- **CLI/helper de scaffold** de uma nova `pages-output/<produto>/` a partir de um JSON de briefing.

---

## Self-Review

**Cobertura do spec:**
- §2 estrutura de arquivos → Tasks 1, 8, 9 (skill + refs), 2/3/4/5/6 (components/lib). ✅
- §3 arquétipos (venda/captura) → copy-frameworks (Task 8) + SKILL passo 1; blocos de captura (VSLEmbed) em follow-up. ✅ (MVP cobre venda; captura documentada)
- §4 fluxo 6 passos → SKILL.md (Task 8). ✅
- §5 biblioteca de blocos → núcleo nas Tasks 4/5; restante em follow-up. ✅
- §6 tokens → Task 2. ✅
- §7 originality-audit → Task 9. ✅
- §8 animations → Tasks 3 + 9. ✅
- §9 image providers → Tasks 6 + 9. ✅
- §10 stack → Task 1. ✅
- §11 critérios de sucesso → demo (Task 7) + build (Tasks 7/10). ✅
- §13 quality-gates → Task 9. ✅
- §14 créditos → originality-audit + quality-gates (Task 9). ✅

**Placeholder scan:** docs (Tasks 8/9) descritos por conteúdo-requerido concreto; passos de código têm o código completo. ✅

**Type consistency:** `Recipe`/`recipeToStyle` (Task 2) usados igual na Task 7; props dos blocos definidas em `types.ts` (Task 5) e consumidas na demo (Task 7) com os mesmos nomes. ✅
