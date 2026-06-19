# paginas-low-ticket

Gerador de páginas de venda e captura low-ticket via skill do Claude Code.

A skill `criar-pagina-venda` orquestra todo o processo: coleta o briefing do produto, gera copy persuasivo baseado em frameworks validados (AIDA, PAS, FAB), cria imagens únicas via IA, aplica uma receita de design exclusiva e entrega um componente Next.js pronto para deploy.

---

## Setup

```bash
npm install
```

Copie o arquivo de exemplo de variáveis de ambiente e preencha com sua chave:

```bash
cp .env.example .env
```

Abra `.env` e preencha:

```
OPENAI_API_KEY=sk-...
```

> A `OPENAI_API_KEY` é usada pelo provider `gpt-image-1` para gerar imagens.
> Se preferir usar o Huggsfield via MCP (integrado ao Claude Code), a variável é opcional — as imagens serão geradas via ferramenta MCP durante a execução da skill.

---

## Como usar a skill

No Claude Code, invoque:

```
/criar-pagina-venda
```

A skill conduz você por **6 passos interativos**:

1. **Briefing** — produto, público-alvo, preço, promessa principal.
2. **Arquétipo** — venda direta ou captura de leads.
3. **Receita de design** — escolha um dos 6 estilos visuais (ex: `vinho-premium`, `neon-tech`).
4. **Geração de copy** — headlines, subtítulos, CTA, prova social.
5. **Geração de imagens** — hero e suporte via IA (OpenAI ou Huggsfield).
6. **Entrega do código** — componente Next.js + CSS tokens + arquivo de receita.

### Onde as páginas são criadas

Cada página gerada fica em:

```
pages-output/<produto>/
  page.tsx        ← componente principal
  recipe.ts       ← receita de design usada
  images/         ← imagens geradas pela IA
```

Para que a página apareça no Next.js, crie o shim em `app/<produto>/page.tsx`:

```tsx
export { default } from "@/pages-output/<produto>/page";
```

Veja o exemplo em [`app/demo/page.tsx`](app/demo/page.tsx).

---

## Comandos

```bash
npm run dev      # servidor de desenvolvimento (acesse /demo para ver a página de exemplo)
npm test         # suite de testes com Vitest
npm run build    # build de produção Next.js
npm start        # serve o build de produção
```

---

## Deploy

### Vercel

1. Importe o repositório no [Vercel](https://vercel.com).
2. Adicione a variável de ambiente `OPENAI_API_KEY` nas configurações do projeto.
3. Clique em **Deploy**.

### Netlify

1. Importe o repositório no [Netlify](https://netlify.com).
2. Defina o build command como `npm run build` e o publish directory como `.next`.
3. Adicione `OPENAI_API_KEY` nas variáveis de ambiente do site.
4. Clique em **Deploy site**.

---

## Estrutura de pastas

```
.claude/skills/criar-pagina-venda/   ← skill orquestradora (SKILL.md + refs)
components/                          ← blocos reutilizáveis (HeroBlock, CTABlock, etc.)
lib/                                 ← utilitários (design tokens, image providers, types)
pages-output/                        ← páginas geradas pela skill
docs/superpowers/                    ← spec e plano do projeto
```

---

## Documentação técnica

- **Spec de design:** [`docs/superpowers/specs/2026-06-19-skill-paginas-low-ticket-design.md`](docs/superpowers/specs/2026-06-19-skill-paginas-low-ticket-design.md)
- **Plano de implementação:** [`docs/superpowers/plans/2026-06-19-skill-paginas-low-ticket.md`](docs/superpowers/plans/2026-06-19-skill-paginas-low-ticket.md)
