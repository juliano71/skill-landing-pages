# Design Recipes — `criar-pagina-venda`

Seis receitas prontas para uso, cada uma derivada de uma referência do swipe-file.
Todas obedecem o tipo `Recipe` de `lib/design/recipe.ts`.

---

## Como escolher uma receita

1. Leia o arquivo `pages-output/<produto>/.recipe` — ele registra o `id` da última receita usada.
2. **Nunca repita** a receita do arquivo `.recipe`. Escolha qualquer outra das seis.
3. Após gerar a página, atualize (ou crie) `pages-output/<produto>/.recipe` com o `id` escolhido.

---

## As 6 receitas

### 1. `vinho` — inspirada em ref-nutricionista.jpeg

Paleta feminina e acolhedora. Vinho como cor principal, creme no fundo, magenta/rosa nos CTAs.
Ideal para: e-books de saúde, nutrição, bem-estar feminino.

```ts
const recipe: Recipe = {
  id: "vinho",
  colors: {
    bg: "#fbf7f4",
    surface: "#f3e9e6",
    accent: "#8a1f3d",
    accentFg: "#ffffff",
    fg: "#2a1418",
    muted: "#8a7a7e",
  },
  fonts: {
    display: "Playfair Display",
    body: "Inter",
  },
  radius: "1rem",
  shadow: "0 12px 32px rgba(80,20,40,.12)",
  ease: "cubic-bezier(.22,1,.36,1)",
  duration: "600ms",
};
```

---

### 2. `dark-gold` — inspirada em ref-crc.jpeg

Paleta sóbria e de autoridade. Dark marrom quase preto como fundo, dourado/âmbar nos destaques.
Ideal para: cursos profissionais, certificações, mercado B2B masculino.

```ts
const recipe: Recipe = {
  id: "dark-gold",
  colors: {
    bg: "#1a1410",
    surface: "#27201a",
    accent: "#c8962a",
    accentFg: "#0e0b07",
    fg: "#f2ead8",
    muted: "#8a7050",
  },
  fonts: {
    display: "Sora",
    body: "Inter",
  },
  radius: "0.5rem",
  shadow: "0 2px 16px 0 rgba(200,150,42,0.18)",
  ease: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  duration: "280ms",
};
```

---

### 3. `sage-editorial` — inspirada em ref-curso.jpeg

Paleta sofisticada e editorial. Verde-oliva/sage + creme, muito espaço branco, tipografia serif gigante.
Ideal para: cursos de criação de conteúdo, marcas pessoais, produtos premium com ancoragem de preço.

```ts
const recipe: Recipe = {
  id: "sage-editorial",
  colors: {
    bg: "#f3f1ea",
    surface: "#e9e6db",
    accent: "#6b7250",
    accentFg: "#ffffff",
    fg: "#2a2c24",
    muted: "#9a9d85",
  },
  fonts: {
    display: "Cormorant Garamond",
    body: "Nunito Sans",
  },
  radius: "0.25rem",
  shadow: "0 1px 8px 0 rgba(107,114,80,0.10)",
  ease: "cubic-bezier(0.16, 1, 0.3, 1)",
  duration: "400ms",
};
```

---

### 4. `cream-bordeaux` — inspirada em ref-agencia.jpeg

Paleta institucional limpa. Creme/bege quente no fundo, bordô/vinho em acentos e tipografia.
Ideal para: serviços, agências, consultorias, produtos com foto de equipe ou lifestyle quente.

```ts
const recipe: Recipe = {
  id: "cream-bordeaux",
  colors: {
    bg: "#efe9e1",
    surface: "#e4dcd2",
    accent: "#6e1023",
    accentFg: "#ffffff",
    fg: "#1c0a10",
    muted: "#a07060",
  },
  fonts: {
    display: "Fraunces",
    body: "Inter",
  },
  radius: "0.375rem",
  shadow: "0 2px 12px 0 rgba(110,16,35,0.10)",
  ease: "cubic-bezier(0.4, 0, 0.2, 1)",
  duration: "320ms",
};
```

---

### 5. `dark-neon` — inspirada em ref-bio-izadora.jpeg

Paleta energética e urgente. Dark navy no fundo, verde neon nos CTAs com efeito glow.
Ideal para: VSL de captura, TikTok Shop, afiliados, infoprodutos de resultado rápido.

```ts
const recipe: Recipe = {
  id: "dark-neon",
  colors: {
    bg: "#0b1220",
    surface: "#131d30",
    accent: "#1fd67a",
    accentFg: "#061008",
    fg: "#e8f0fe",
    muted: "#4a6080",
  },
  fonts: {
    display: "Space Grotesk",
    body: "Inter",
  },
  radius: "0.5rem",
  shadow: "0 0 20px 0 rgba(31,214,122,0.30)",
  ease: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  duration: "260ms",
};
```

---

### 6. `dark-amber` — inspirada em ref-bio-thiago.jpeg

Paleta masculina e de alta performance. Dark puro no fundo, âmbar/dourado vibrante, headline condensada.
Ideal para: marketing digital, tráfego pago, trading, bio pages com dashboard de métricas.

```ts
const recipe: Recipe = {
  id: "dark-amber",
  colors: {
    bg: "#121212",
    surface: "#1e1e1e",
    accent: "#e8a93c",
    accentFg: "#0c0800",
    fg: "#f5f0e8",
    muted: "#5c5040",
  },
  fonts: {
    display: "Anton",
    body: "Inter",
  },
  radius: "0.375rem",
  shadow: "0 2px 18px 0 rgba(232,169,60,0.20)",
  ease: "cubic-bezier(0.4, 0, 0.2, 1)",
  duration: "300ms",
};
```

---

## Regra anti-repetição (resumo)

```
pages-output/
  <produto>/
    .recipe        ← contém somente o id da última receita usada (ex: "dark-amber")
    page.tsx
    ...
```

Ao gerar uma nova página para o mesmo produto, leia `.recipe`, exclua esse `id` das opções e escolha uma das cinco restantes. Ao terminar, escreva o novo `id` em `.recipe`.

---

## Gerando uma receita NOVA (quando as 6 não servem)

1. Acione o skill `ui-ux-pro-max` com a ação **`design`** descrevendo o nicho, mood e público-alvo. Peça: paleta de cores (bg, surface, accent, fg, muted + hex exatos), par tipográfico (display + body, Google Fonts), border-radius, shadow CSS e easing.
2. Preencha os campos do tipo `Recipe` com os valores retornados. Dê um `id` em kebab-case descritivo.
3. Valide a originalidade consultando `originality-audit.md` na mesma pasta: a nova receita não deve ter accent, bg e display font iguais a nenhuma das seis existentes.
4. Adicione a nova receita a este arquivo antes de usá-la.
