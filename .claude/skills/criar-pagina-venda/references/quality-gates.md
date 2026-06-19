# Portões de Qualidade — `criar-pagina-venda`

Rode esta auditoria no **Passo 6** antes de declarar a página pronta.
Corrija todos os itens que falharem. Só então finalize e entregue.

---

## Portão 1 — Polish

Verificações de acabamento visual e de experiência percebida.

- [ ] **Microcopy completo:** todos os botões, labels, placeholders, mensagens de erro, tooltips e estados vazios têm texto real — nenhum "Lorem ipsum", "CTA aqui" ou campo sem label.
- [ ] **Alinhamento óptico:** textos, ícones e imagens alinhados visualmente, não apenas por grid matemático. Títulos com letras ascendentes (como "f", "h", "t") podem precisar de ajuste de `padding-top` para parecerem centrados.
- [ ] **Hierarquia de botões inequívoca:** o CTA primário (`accent` da receita, texto `accentFg`) é visualmente o elemento mais saliente da tela. CTAs secundários usam variante `outline` ou `ghost` — nunca a mesma cor do primário.
- [ ] **Estados úteis:** formulários e botões têm estado `loading` com feedback visual (spinner ou texto "Processando…"), estado `error` com mensagem acionável ("Tente novamente" > "Erro 500"), e estado `empty` com instrução clara quando aplicável.
- [ ] **Ritmo vertical:** espaçamento entre seções consistente e intencional. Seções longas têm `padding-top` e `padding-bottom` iguais entre si; seções curtas (como dividers) têm espaçamento reduzido proporcional.
- [ ] **Motion tokens consistentes:** todas as transições usam as variáveis CSS `--duration` e `--ease` definidas pela receita ativa. Não há valores de `transition` ou `animation` hardcoded (ex.: `300ms ease-in-out` inline) divergindo do token da receita.
- [ ] **Orquestração de entrada sem layout shift:** elementos animados por `Reveal` (`components/motion/Reveal.tsx`) têm dimensões definidas antes da animação. Não há salto de layout (CLS) ao entrar na viewport — verifique especialmente imagens sem `width`/`height` explícitos e listas que crescem ao revelar.

---

## Portão 2 — Acessibilidade

- [ ] **Contraste AA:** todo texto sobre fundo colorido tem razão de contraste ≥ 4,5:1 (texto normal) ou ≥ 3:1 (texto grande, ≥18pt ou ≥14pt bold). Verifique especialmente texto `muted` sobre `surface` e `accentFg` sobre `accent` — use a ferramenta de contraste do browser DevTools ou similar.
- [ ] **Foco visível:** todos os elementos interativos (botões, links, inputs, selects) têm `outline` visível no estado `:focus-visible`. Nunca remova `outline: none` sem substituir por alternativa equivalente.
- [ ] **Labels e alt text:** todos os `<img>` têm `alt` descritivo (ou `alt=""` se decorativa). Todos os `<input>` e `<textarea>` têm `<label>` associado via `htmlFor`/`id`. Ícones sem texto adjacente têm `aria-label`.
- [ ] **Navegação por teclado:** a página é completamente operável via Tab/Shift+Tab/Enter/Space. A ordem de foco segue a ordem visual da página. Modais e drawers aprisionam o foco enquanto abertos e o restituem ao elemento de origem ao fechar.
- [ ] **`prefers-reduced-motion` respeitado:** o componente `Reveal` em `components/motion/Reveal.tsx` já trata esse caso via `useReducedMotion()` do Framer Motion — quando a preferência está ativa, o componente renderiza o `children` diretamente sem animação. Verifique que nenhuma outra animação da página (keyframes CSS, `transition` em hover, carousels automáticos) ignora essa preferência. Adicione `@media (prefers-reduced-motion: reduce)` onde necessário.
- [ ] **Alvo de toque ≥ 44px:** botões, links e elementos clicáveis têm área de toque mínima de 44×44px em dispositivos touch. Use `min-height: 44px` e `padding` adequado — não confie apenas no tamanho visual do texto.

---

## Portão 3 — Mobile-First

- [ ] **Validação começa no mobile:** abra a página primeiro em 360–390px de largura (tamanho de smartphone médio brasileiro). Só valide desktop depois que o mobile estiver aprovado.
- [ ] **Sem overflow horizontal:** nenhum elemento ultrapassa a largura da viewport em 360px. Verifique tabelas, imagens sem `max-width: 100%`, textos com `white-space: nowrap`, e elementos com largura fixa em `px`.
- [ ] **Tipografia legível em mobile:** o corpo do texto tem `font-size` mínimo de 16px em mobile (nunca abaixo disso). Headlines responsivas usam `clamp()` ou breakpoints explícitos — sem texto que transborde ou fique minúsculo em telas pequenas.
- [ ] **CTAs alcançáveis com o polegar:** botões de CTA primário posicionados na zona de alcance do polegar em mobile (parte inferior/central da tela quando possível). CTAs sticky no rodapé mobile são válidos e recomendados para páginas long-form.
- [ ] **Imagens otimizadas:** use o componente `<Image>` do Next.js com `sizes` adequado ao breakpoint. Imagens hero não causam LCP acima de 2,5s em conexão 4G simulada.
- [ ] **Espaçamentos adequados em mobile:** margens laterais de pelo menos 16px em ambos os lados. Seções com `padding` reduzido mas não colapsado — o conteúdo respira mesmo em tela pequena.

---

## Portão 4 — Integridade de Texto

- [ ] **Sem "tells" de IA — frases genéricas e infladas:** releia o copy inteiro procurando frases que poderiam aparecer em qualquer página do nicho. Exemplos a eliminar: "no mundo de hoje", "em um mercado cada vez mais competitivo", "solução completa e abrangente", "transforme sua vida", "dê o próximo passo na sua jornada", "descubra o poder de". Substitua por linguagem específica do produto e do público.
- [ ] **Sem repetição estrutural:** parágrafos de abertura de seções diferentes não começam com o mesmo padrão ("Você sabia que…", "Imagine…", "Se você…" repetidos). Varie a construção das frases.
- [ ] **Ortografia PT-BR:** revise acordo ortográfico vigente. Atenção a trema (não existe mais em "quê", "frequente"), hífen em compostos, e diferenças de vocabulário PT-BR vs PT-PT ("celular" não "telemóvel", "ônibus" não "autocarro", "você" não "tu" a menos que o briefing peça).
- [ ] **Terminologia consistente em toda a página:** o nome do produto é idêntico do hero ao CTA final — sem variações não intencionais ("Planilha Mestre" vs "Planilha Master" vs "o produto"). O preço aparece igual em todas as menções (âncora, oferta, CTA). Os bônus têm os mesmos nomes em todos os lugares onde aparecem.
- [ ] **Nenhum placeholder sobrevivente:** faça uma busca (`Ctrl+F` ou `grep`) por: `TBD`, `TODO`, `Lorem`, `Ipsum`, `[PRODUTO]`, `[PREÇO]`, `[NOME]`, `[LINK]`, `exemplo.com`, `#`. Nenhum deve aparecer na versão final.
- [ ] **Tom consistente com o briefing:** se o briefing definiu tom direto e informal, não há parágrafos formais no meio. Se o tom é autoridade técnica, não há gírias fora de lugar. Releia com o arquétipo do produto em mente.

---

## Como Usar Esta Auditoria

1. Após concluir o Passo 5 (código gerado e build passando), abra esta auditoria.
2. Percorra os 4 portões na ordem. Marque cada item como aprovado ou reprovado.
3. Para cada item reprovado: corrija o código ou copy antes de avançar.
4. Rode `npm run build` novamente após correções para confirmar que nada quebrou.
5. Quando todos os portões estiverem com todos os itens marcados: declare a página pronta.

---

## Crédito

Princípios de `polish-phase` e auditorias adaptados do projeto **claude-design-premium**
([github.com/oalanicolas/claude-design-premium](https://github.com/oalanicolas/claude-design-premium), licença MIT).
