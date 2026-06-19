# Auditoria de Originalidade — `criar-pagina-venda`

Rode esta auditoria no **Passo 3** sobre a direção de arte escolhida, antes de gerar imagens ou código.

---

## Propósito

Garantir que a página tem ponto de vista próprio — parece feita para *este* produto, não uma saída genérica de IA que poderia servir para qualquer coisa no mesmo nicho.

---

## Veredito

Atribua um dos três níveis após rodar os testes abaixo:

| Nível | Significado | Ação |
|---|---|---|
| `distinctive` | Direção de arte reconhecível e coerente com o produto específico. | Prossiga para o Passo 4. |
| `acceptable but safe` | Não é genérica, mas não surpreende. Aceitável se o nicho exige conservadorismo. | Prossiga com ressalva: documente o motivo da escolha segura. |
| `generic-blocking` | Paleta, layout ou tipografia poderiam pertencer a qualquer página do nicho. | **Bloqueado.** Troque a receita ou ajuste antes de continuar. |

---

## Teste do Reflexo de Categoria

Pergunta central: **a paleta, o layout, a tipografia e o hero poderiam ser adivinhados por alguém que soubesse apenas o nicho — sem ver o produto?**

Exemplos de resposta afirmativa (= `generic-blocking`):
- Nicho nutrição → fundo branco, verde-menta, Poppins, foto de salada → qualquer site de dieta teria isso.
- Nicho marketing digital → dark com gradiente roxo/azul, fonte bold geométrica, dashboard flutuante → sem distinção alguma.
- Nicho finanças → azul corporativo, Inter, gráfico de barras → poderia ser qualquer fintech.

Se a resposta for "sim, dá para adivinhar", o veredito é `generic-blocking`.

---

## Teste da Anti-Referência

Evitar o clichê óbvio não é suficiente — é preciso verificar se a escolha caiu num **segundo clichê**.

Exemplos de segundo clichê:
- Fugiu do verde-menta (nutrição) → foi para roxo pastel → segundo clichê de "feminino wellness".
- Fugiu do azul corporativo (finanças) → foi para dark com neon verde → segundo clichê de "fintechs Discord-core".
- Fugiu do branco minimalista → foi para glassmorphism translúcido → ainda genérico, só num estilo diferente.

Se a direção de arte escapou do primeiro clichê mas caiu num segundo, revise antes de classificar como `distinctive`.

---

## Declaração de Ponto de Vista

Escreva **uma frase** que complete: "Esta página parece de *[produto específico]* e não de *[categoria genérica]* porque ___."

Esta frase deve ser escrita e aprovada antes de prosseguir. Se não conseguir completá-la com algo concreto, o veredito é `generic-blocking`.

**Exemplos de declaração válida:**
- "Esta página parece do *Planilha Mestre* e não de *curso de finanças genérico* porque usa paleta vinho-creme com Playfair Display grande, remetendo à sensação de um caderno premium e não à frieza de uma planilha."
- "Esta página parece do *Método 21 Dias* e não de *programa de emagrecimento* porque o dark navy com verde neon e Space Grotesk condensado sugere resultado técnico e urgência, não motivação vaga."

---

## Anti-Padrões a Evitar

Presença de qualquer item abaixo é sinal de alerta — dois ou mais itens = `generic-blocking` automático.

- Gradiente roxo/azul como fundo ou destaque principal
- Texto com gradiente decorativo (clip-path rainbow)
- Composição totalmente centralizada em todas as seções
- Fonte única em todo o projeto (só Inter, só Poppins)
- Hero com headline grande + grid de 3 stats abaixo — composição padrão de SaaS
- Grids infinitos de cards iguais em tamanho, espaçamento e peso visual
- Glass panels com `backdrop-filter: blur()` sem função narrativa
- Labels em caixa-alta com `letter-spacing` exagerado como único elemento de hierarquia
- Blobs ou formas orgânicas aleatórias como decoração de fundo
- Sombras uniformes em todos os elementos (mesmo `box-shadow` em tudo)
- Spam de emoji no corpo do texto ou nos bullets
- Motion decorativo sem função: elementos que pulsam, giram ou flutuam sem comunicar nada

---

## O Que Fazer (Direção Positiva)

- **Paleta restrita e quente/coesa:** 2–3 cores com relação clara (fundo, superfície, acento). Prefira tons quentes ou matizados às cores primárias puras. Consulte as 6 receitas em `design-recipes.md` — todas usam paletas restritas com intenção.
- **Mix tipográfico:** combine serif ou display serif com sans-serif. Use a fonte display em tamanho grande nas headlines; não aplique em todo o corpo. Exemplos presentes nas receitas: Playfair Display + Inter, Cormorant Garamond + Nunito Sans, Fraunces + Inter.
- **Fotografia real com tratamento consistente:** tom de cor, crop e enquadramento coerentes entre todas as imagens. Evite mixes de estilos (foto realista + ilustração flat + ícone 3D na mesma seção).
- **Mockups 3D e selos:** mockup do produto (e-book, planilha, dashboard) em perspectiva 3D aumenta percepção de valor. Selos de garantia e bônus têm função tátil — use com moderação.
- **Layout assimétrico/editorial:** alterne colunas (texto esquerda, imagem direita; imagem full-bleed, texto sobreposto). Evite simetria perfeita em todas as seções.
- **Ritmo de seções:** alterne seções claras e escuras ao longo da página para criar respiração visual e delimitar blocos de argumento.
- **Micro-detalhes táteis:** badges de bônus, gift boxes, dashboards de resultado, ícones de nicho específicos. Esses elementos ancoram a página no produto real.

**Regra de ouro:** originalidade tem que **melhorar** clareza, confiança ou hierarquia — nunca ser esquisitice gratuita. Se um detalhe criativo dificulta a leitura ou confunde o CTA, remova.

---

## Como Usar Esta Auditoria

1. Selecione ou sorteie uma receita de `design-recipes.md` seguindo a regra anti-repetição.
2. Rode os dois testes (Reflexo de Categoria + Anti-Referência) sobre a receita escolhida.
3. Escreva a Declaração de Ponto de Vista.
4. Atribua o veredito.
5. Se `generic-blocking`: troque a receita ou ajuste paleta/tipografia/composição e repita.
6. Se `acceptable but safe` ou `distinctive`: documente o veredito no briefing e prossiga para o Passo 4.

---

## Crédito

Princípios adaptados de `visual-originality-audit` do projeto **claude-design-premium**
([github.com/oalanicolas/claude-design-premium](https://github.com/oalanicolas/claude-design-premium), licença MIT).
