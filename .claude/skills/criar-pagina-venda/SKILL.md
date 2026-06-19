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

> **OBRIGATÓRIO — shim de roteamento App Router:**
> O diretório `pages-output/` é desacoplado do roteamento do Next.js. Para que a página
> seja acessível no browser, crie também o arquivo de shim em `app/<slug>/page.tsx`
> com exatamente uma linha:
>
> ```tsx
> export { default } from "@/pages-output/<slug>/page";
> ```
>
> Substitua `<slug>` pelo nome do produto (ex.: `app/meu-produto/page.tsx`).
> Veja o exemplo existente em `app/demo/page.tsx`.

Rode `npm run build`.

## Passo 6 — Polish + qualidade

Aplique `references/quality-gates.md` (polish, a11y, mobile-first, integridade de texto).
Corrija o que falhar. Só então declare pronto.
