# Spec — Skill `criar-pagina-venda` (páginas de venda e captura low ticket)

**Data:** 2026-06-19
**Autor:** Julia (com Claude Code)
**Status:** Aprovado para implementação (aguardando revisão final do spec)

## 1. Objetivo

Criar uma **skill reutilizável de projeto** que, a partir de um briefing de produto
low ticket, gera **páginas de venda e de captura** completas em React/Next.js, com:

- **Copy** persuasiva (frameworks de copywriting low ticket)
- **Imagens** geradas por IA (provider plugável: huggsfield ou OpenAI)
- **Design único** por página (paleta/tipografia/layout variados) — evitando "cara de IA"
- **Animações e efeitos** performáticos (reveal ao scroll, glow, count-up, marquee)
- **Código pronto** para deploy (componentes React/Next, responsivos)

A skill mistura **referências do usuário** (swipe-file curado) com **boas práticas
embutidas**, e pode pesquisar novas referências sob demanda.

### Não-objetivos (YAGNI)
- Não é um page builder visual / drag-and-drop.
- Não faz deploy automático (entrega o código pronto; deploy é passo manual).
- Não gerencia checkout/pagamento (apenas linka para o checkout informado no briefing).
- Não gera back-end; páginas são estáticas/SSG com formulários que apontam para
  um endpoint/integração informada no briefing.

## 2. Onde a skill mora

Skill de **projeto**, dentro de `paginas-low-ticket/`. Skill, biblioteca de blocos
e páginas geradas ficam no mesmo repositório, reutilizáveis a cada novo produto.

```
paginas-low-ticket/
├─ .claude/skills/criar-pagina-venda/
│  ├─ SKILL.md                      # orquestra o fluxo de 5 passos
│  └─ references/
│     ├─ copy-frameworks.md         # frameworks de copy low ticket
│     ├─ originality-audit.md       # anti-IA com veredito (ver §13)
│     ├─ design-recipes.md          # receitas de estilo/paleta/fonte
│     ├─ quality-gates.md           # auditorias: a11y, mobile, texto, polish (§13)
│     ├─ animations.md              # catálogo de efeitos + motion tokens
│     ├─ image-providers.md         # huggsfield vs OpenAI; como gerar
│     └─ swipe-file/
│        ├─ README.md               # análise de cada referência
│        ├─ ref-nutricionista.jpeg  # vinho/creme, feminino, e-book
│        ├─ ref-crc.jpeg            # dark + dourado, masculino, gift boxes
│        ├─ ref-curso.jpeg          # sage/oliva, serif editorial
│        ├─ ref-agencia.jpeg        # creme + bordô, institucional
│        ├─ ref-bio-izadora.jpeg    # dark neon, VSL, captura
│        └─ ref-bio-thiago.jpeg     # dark âmbar, bold, captura/bio
├─ components/
│  ├─ blocks/                       # blocos React reutilizáveis (ver §5)
│  ├─ motion/                       # wrappers de animação (framer-motion)
│  └─ ui/                           # primitivos (Button, Badge, Card, Section)
├─ lib/
│  └─ images/                       # scripts de geração de imagem (providers)
├─ pages-output/<produto>/          # cada página gerada vai aqui
├─ .env.example                     # OPENAI_API_KEY=...
└─ docs/superpowers/specs/          # este spec
```

> `.env` (com a key real) fica no `.gitignore`. `.env.example` é versionado.

## 3. Arquétipos de página

A skill pergunta no briefing qual arquétipo (ou ambos):

### A) Página de venda (long-form)
Estrutura clássica BR low ticket:
1. Hero (headline + promessa + CTA + prova/visual)
2. Problema / agitação
3. Apresentação da solução (o produto)
4. O que você vai aprender / receber
5. Bônus (stack com valor ancorado)
6. Sobre o autor / autoridade
7. Depoimentos / prova social
8. Oferta + preço (ancoragem: de R$X por R$Y, ou 12x)
9. Garantia (selo de N dias)
10. FAQ
11. CTA final + rodapé

### B) Página de captura / bio-link (short-form)
Foco em **uma ação** (lead, clique, VSL):
1. Hero compacto (foto/vídeo + headline + 1 CTA)
2. (Opcional) VSL embed
3. Bullets de benefício / prova rápida
4. CTA repetido
5. Rodapé mínimo

## 4. Fluxo de execução (SKILL.md)

A skill executa **5 passos**, confirmando com o usuário nos pontos de decisão:

1. **Briefing** — coleta: produto, nicho, preço/ancoragem, público, promessa
   central, oferta/bônus, autoridade/depoimentos, link de checkout, arquétipo
   (venda/captura), provider de imagem preferido, e referência de estilo (deixar
   a skill sortear OU apontar para um item do swipe-file OU dar uma URL nova).

2. **Copy** — gera a copy seção a seção usando `copy-frameworks.md`. Saída revisável
   antes de virar código.

3. **Direção de arte** — escolhe/sorteia uma "receita" de `design-recipes.md`
   (paleta + par tipográfico + densidade + tratamento de imagem + estilo de
   animação) e valida contra `originality-audit.md` (teste do reflexo de categoria
   + anti-referência → veredito). Apresenta a direção (cores, fontes, mood) para
   aprovação rápida.

4. **Imagens** — gera os assets via `image-providers.md` (provider escolhido),
   seguindo a paleta e o mood definidos. Salva em `pages-output/<produto>/assets/`.

5. **Código** — monta os blocos React/Next variando a composição, aplica a receita
   de estilo via design tokens (CSS variables/Tailwind theme), adiciona animações
   via `components/motion/`, e entrega responsivo em `pages-output/<produto>/`.

6. **Polish + portões de qualidade** — passa a página pelas auditorias de
   `quality-gates.md`: polish (microcopy, hierarquia de botões, estados
   vazio/loading/erro, motion tokens), acessibilidade, mobile-first e integridade
   de texto. Corrige o que falhar antes de declarar pronto.

## 5. Biblioteca de blocos (`components/blocks/`)

Blocos parametrizados por conteúdo (props) e estilizados por tokens (não hard-coded),
para que o mesmo bloco renderize visualmente diferente conforme a receita:

- `Hero` (variantes: split, centered, com-VSL, com-dashboard)
- `ProblemAgitation`
- `SolutionIntro`
- `FeatureList` / `Curriculum` (grade de tópicos com imagem)
- `BonusStack` (cards/gift boxes com valor ancorado)
- `AuthorBio`
- `Testimonials` (cards com foto)
- `PricingOffer` (ancoragem de preço, parcelamento)
- `Guarantee` (selo de N dias)
- `FAQ` (accordion)
- `FinalCTA`
- `Footer`
- `VSLEmbed` (para captura)
- `MetricDashboard` (mockup animado de números — estilo Thiago/MVR)
- `AvatarMarquee` (fileira/carrossel de avatares de prova social)

Cada bloco recebe estilo via tokens: `--color-bg`, `--color-accent`,
`--font-display`, `--font-body`, `--radius`, `--shadow`, etc.

## 6. Sistema de estilo / design tokens

- **Tema por página** via CSS variables + Tailwind theme extension.
- **`design-recipes.md`** define 6+ receitas iniciais (uma por referência do swipe-file)
  + regras para gerar novas combinando paleta/fonte/layout via `ui-ux-pro-max`.
- Regra anti-repetição: a skill não usa a mesma receita duas vezes seguidas e
  registra a última usada.

## 7. `originality-audit.md` (resumo do conteúdo)

Auditoria anti-IA com **veredito**: `distinctive` / `acceptable but safe` /
`generic-blocking`. Princípios traduzidos do `visual-originality-audit` do
claude-design-premium (MIT — ver §14).

**Testes:**
- **Reflexo de categoria:** a paleta/layout/tipografia/hero poderiam ser adivinhados
  só sabendo o nicho? Se sim → `blocking`.
- **Anti-referência:** evitou o clichê óbvio mas caiu num segundo clichê?
- **Ponto de vista:** em 1 frase, o que faz esta página parecer *deste produto*, e
  não *desta categoria*.

**Anti-padrões a evitar:** gradiente roxo/azul genérico; texto com gradiente
decorativo; tudo centralizado; fonte única (só Inter); hero+stats genérico; grids
infinitos de cards iguais; painéis "glass" genéricos; labels minúsculas em
caixa-alta; blobs aleatórios; sombras uniformes; spam de emoji; motion decorativo
sem função.

**Fazer:** paleta restrita e quente/coesa (2–3 cores); mix serif + sans, às vezes
display serif grande; fotografia real com tratamento consistente; mockups 3D
(e-book/curso) e selos; layout assimétrico/editorial; ritmo de seções (alterna
claro/escuro); micro-detalhes táteis (badges, gift boxes, dashboards). Regra: a
originalidade tem que **melhorar** clareza/confiança/hierarquia — nunca esquisitice
gratuita.

## 8. `animations.md` (resumo do conteúdo)

- **Reveal ao scroll**: framer-motion `whileInView` (fade + slide-up, stagger).
- **CTA glow/pulse**: keyframes CSS.
- **Count-up**: números animando ao entrar na viewport.
- **Marquee**: avatares/logos em loop CSS.
- **Parallax suave** e **hover micro-interações**.
- **Acessibilidade**: tudo respeita `prefers-reduced-motion` (desliga/reduz).

## 9. Geração de imagem — provider plugável (`image-providers.md` + `lib/images/`)

- **huggsfield**: via ferramentas MCP nativas (`generate_image`).
- **OpenAI**: script Node em `lib/images/` que chama `gpt-image-1` lendo
  `OPENAI_API_KEY` do `.env`. **A key nunca é colada no chat nem versionada.**
- A skill escolhe o provider por página (briefing) ou alterna entre páginas para
  variar o "look"; usa o outro como fallback se um falhar.
- Prompts de imagem derivam da paleta/mood da receita de estilo.

## 10. Stack técnico

- **Next.js** (App Router) + **TypeScript** + **Tailwind CSS**.
- **framer-motion** para animações.
- Páginas estáticas (SSG); formulários de captura apontam para endpoint do briefing.
- Deploy alvo: Vercel/Netlify (manual, fora do escopo da skill).

## 11. Critérios de sucesso

1. Rodar a skill com um briefing produz uma página completa, responsiva e funcional
   em `pages-output/<produto>/` que `next build` compila sem erros.
2. Duas páginas geradas em sequência têm **visual claramente distinto** (paleta,
   tipografia, layout) — recebem veredito `distinctive`/`acceptable` no originality-audit.
3. Copy cobre todas as seções do arquétipo escolhido.
4. Imagens geradas seguem a paleta e podem usar qualquer um dos dois providers.
5. Animações funcionam e respeitam `prefers-reduced-motion`.

## 12. Riscos / questões em aberto

- **OpenAI key**: requer `.env` configurado pelo usuário antes de usar esse provider.
- **VSL**: a skill insere o embed; o vídeo em si é fornecido pelo usuário.
- **Fotos reais do autor**: IA gera mockups/cenas; foto real do profissional, se
  necessária, é fornecida pelo usuário (IA pode gerar avatar/cenário genérico).
- **Git**: o projeto ainda não é um repositório git; recomendar `git init` para
  versionar skill + páginas.

## 13. Camada de qualidade — `quality-gates.md` (resumo)

Auditorias rodadas no passo 6 do fluxo, com princípios traduzidos do
claude-design-premium (MIT — §14):

- **Polish**: microcopy, alinhamento óptico, hierarquia de botões (primário vs
  secundário inequívocos), estados vazio/loading/erro úteis, ritmo vertical,
  **motion tokens** (duração + easing consistentes), orquestração de entrada sem
  layout shift.
- **Acessibilidade**: contraste, foco visível, labels, navegação por teclado,
  `prefers-reduced-motion`.
- **Mobile-first**: layout valida primeiro no mobile; toque ≥ 44px; sem overflow.
- **Integridade de texto**: copy sem "tells" de IA (frases genéricas, repetição,
  placeholders), ortografia, consistência de terminologia.

> Os **scripts** do claude-design-premium miram o runtime "Claude Design Web"
> (`*.dc.html`), não Next.js — por isso adaptamos os **princípios** como checklists
> aplicáveis ao nosso código React, sem depender dos scripts deles.

## 14. Créditos / licenças de terceiros

- **claude-design-premium** (github.com/oalanicolas/claude-design-premium, MIT):
  princípios de `visual-originality-audit` e `polish-phase` adaptados para
  `originality-audit.md` e `quality-gates.md`. Auditado como seguro em 2026-06-19
  (0 deps npm, sem rede/exec/acesso a segredos nos scripts).
- **framer-motion** (MIT) — animações.
- **ui-ux-pro-max** (skill) — geração de receitas de design.
