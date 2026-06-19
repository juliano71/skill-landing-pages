# Providers de Imagem

Como gerar os assets visuais da página (hero, mockup do produto, avatares, fundos).

---

## Dois providers disponíveis

### huggsfield (via MCP)

Chamado **em runtime pela skill** usando a ferramenta MCP `generate_image`. O agente
invoca a ferramenta diretamente durante a execução do Passo 4 — não há script local
para chamar.

**Quando preferir:** fotos realistas, cenas com pessoas, mockups variados,
retratos de personas. O modelo responde bem a prompts descritivos com ambiente, luz
e composição.

Exemplo de chamada (feita pelo agente durante a skill):

```
generate_image({
  prompt: "Professional nutrition ebook cover, flat lay on cream linen cloth,
           wine-red accent ribbon, warm natural light, top view,
           soft shadows, high-end editorial photography",
  aspect_ratio: "1:1"
})
```

Salve o resultado retornado em `pages-output/<produto>/assets/hero.png` (ou `.webp`).

---

### OpenAI (script Node local)

**Arquivo:** `lib/images/openai.mjs`
**Função:** `generateOpenAIImage({ prompt, size, apiKey })`
**Modelo:** `gpt-image-1`
**Retorno:** `{ b64: string }` — imagem em Base64

**Arquivo de entrada unificado:** `lib/images/index.mjs`
**Função:** `generateImage({ provider, prompt, size, apiKey })`

#### Exemplo completo de uso via Node

```js
// scripts/gen-assets.mjs
import { writeFileSync, mkdirSync } from "fs";
import { generateImage } from "../lib/images/index.mjs";
import "dotenv/config"; // carrega .env automaticamente (npm i dotenv)

const produto = "meu-ebook-nutricao";
const outputDir = `pages-output/${produto}/assets`;
mkdirSync(outputDir, { recursive: true });

const { b64 } = await generateImage({
  provider: "openai",
  prompt:
    "Ebook cover for a Brazilian nutrition guide, flat lay on cream linen, " +
    "wine-red ribbon accent, warm soft light, editorial photography, top view",
  size: "1024x1024",
  apiKey: process.env.OPENAI_API_KEY,
});

writeFileSync(`${outputDir}/hero.png`, Buffer.from(b64, "base64"));
console.log(`Salvo em ${outputDir}/hero.png`);
```

Execute com:

```bash
node scripts/gen-assets.mjs
```

`generateImage` delega para `generateOpenAIImage` (em `lib/images/openai.mjs`) quando
`provider === "openai"`. Para huggsfield, use a ferramenta MCP diretamente via skill
(o script lança um erro explícito se provider diferente for passado).

---

## Como derivar o prompt da receita

A receita (`lib/design/recipe.ts`) define paleta, humor e estilo tipográfico da página.
O prompt de imagem deve espelhar esses atributos para criar coerência visual.

**Template de prompt:**

```
[Tipo de asset]: [Objeto principal do produto] — [suporte/contexto físico].
Paleta: [cor de fundo da receita] com acento [cor de destaque].
Iluminação: [descrição de luz coerente com o mood].
Estilo fotográfico: [editorial / lifestyle / flat lay / retrato].
Composição: [ângulo, enquadramento].
Qualidade: high-end, sharp details, no text.
```

**Exemplo preenchido — hero de e-book de nutrição, receita `vinho`:**

```
Ebook cover flat lay on cream (#fbf7f4) linen cloth, wine-red (#8a1f3d) ribbon
accent. Warm natural window light from the left. Editorial top-view composition,
generous negative space on the right for headline overlay. High-end food-styling
aesthetic, sharp details, no visible text on the book cover.
```

Referência da receita `vinho` (`lib/design/recipes.sample.ts`):
- `bg: "#fbf7f4"` → creme quente
- `surface: "#f3e9e6"` → rosado suave
- `accent: "#8a1f3d"` → vinho escuro
- Fonte display: Playfair Display → tom clássico/elegante

Deixe esses tokens guiarem adjetivos de ambiente, materiais e paleta no prompt.

---

## Alternância e fallback

- **Por página:** escolha o provider no briefing (Passo 1 da skill). Registre em
  `pages-output/<produto>/.recipe` junto com a receita para não repetir a combinação.
- **Variedade entre páginas:** alterne huggsfield e OpenAI entre projetos diferentes
  para que o portfólio de páginas não fique com look homogêneo.
- **Fallback:** se huggsfield retornar erro (job falhou, créditos esgotados), use
  `generateImage` via OpenAI com o mesmo prompt. Se OpenAI falhar (quota, chave inválida),
  use huggsfield. Documente no chat qual provider foi usado de fato.

---

## Aviso de segurança

> **NUNCA cole a `OPENAI_API_KEY` diretamente no chat.**
>
> A key deve viver exclusivamente no arquivo `.env` na raiz do projeto.
> O `.env` já está no `.gitignore` (confirmado no repositório) e **nunca deve ser
> commitado**.
>
> Se a key vazar (enviada acidentalmente no chat, commitada, exposta em log):
> 1. Acesse <https://platform.openai.com/api-keys> imediatamente.
> 2. Revogue a key comprometida.
> 3. Gere uma nova key e atualize o `.env` local.
>
> O script `lib/images/openai.mjs` lê `apiKey` como parâmetro — nunca hardcode o valor
> no código-fonte; sempre passe `process.env.OPENAI_API_KEY`.
