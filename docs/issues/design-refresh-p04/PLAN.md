# Plan — design-refresh-p04: Wizard de criação (C10, C12, C14, C16 — C11/C13/C15 N/A) para Digital Arena

> Issue: design-refresh-p04 (follow-up de [design-refresh](../design-refresh/PLAN.md))
> Data: 2026-04-17
> Escopo: 100% visual em `src/components/features/wizard/*`. Zero mudança em `createPoolAction`, tipos ou state do wizard.

---

## Resumo

Migrar o wizard de criação de bolão (3 steps) para Digital Arena: canvas claro local, **`WizardProgressBar` vira pill flutuante** com dots, `ProductCard` vira card branco com crest circular, `PoolNameInput` e `CustomCategoryInput` usam `Input default` (borda visível para validação), `CategoryCheckCard` vira card branco com toggle editorial, `ReviewCard` em card branco com link "Editar" em neon, CTAs em `Button pill` / `pill-outline`.

---

## Pesquisa Interna

### Design System (verificação obrigatória)

Lido em [.claude/docs/design-system.md](../../../.claude/docs/design-system.md):

- **Canvas local**: `bg-background-light` só no container do wizard (não `layout.tsx`).
- **Cards**: `Card default` branco para ProductCard, CategoryCheckCard, ReviewCard.
- **Input**: `default` (com borda) para nome e custom category (precisam validação visual). `pill` aqui não cabe — wizard é form tradicional.
- **CTAs**: `Button variant="pill"` para "Próximo"/"Criar Bolão"; `pill-outline` para "Voltar".

### Componentes `ui/` reutilizados

| Componente | Uso |
|---|---|
| `Card` + subcomponentes | ProductCard, CategoryCheckCard, ReviewCard |
| `Button` | Navegação (pill, pill-outline), "Criar Bolão" (pill size pill-lg), "+ Adicionar categoria" (pill-outline) |
| `Input` | PoolNameInput, CustomCategoryInput (default com validação) |

Nenhum novo componente `ui/*`.

### Reconciliação MIGRATION-MAP vs. realidade

Confirmado via leitura de `src/components/features/wizard/*`:

| MIGRATION-MAP | Realidade no código |
|---|---|
| **C10 WizardShell** | existe — [WizardShell.tsx](../../../src/components/features/wizard/WizardShell.tsx) |
| **C11 AIChatBubble** | **N/A** — wizard é step-based (D13 issue-05 removeu IA) |
| **C12 ProductCard** | existe — [ProductCard.tsx](../../../src/components/features/wizard/ProductCard.tsx) |
| **C13 ChatInput** | **N/A** — sem chat |
| **C14 WizardStepper** | parcialmente coberto por [WizardProgressBar.tsx](../../../src/components/features/wizard/WizardProgressBar.tsx) (barras, não dots). Vai **ser reescrito** como pill flutuante com dots. |
| **C15 QuickReply** | **N/A** — sem chat/quick replies |
| **C16 SummaryCard** | existe como [ReviewCard.tsx](../../../src/components/features/wizard/ReviewCard.tsx) |

Componentes adicionais que **também precisam migrar** (não mapeados em MIGRATION-MAP mas existem): `WizardHeader`, `PoolNameInput`, `CategoryCheckCard`, `CustomCategoryInput`, `StepProduct`/`StepConfigure`/`StepReview`.

### Patterns preservados

- `"use client"` em `WizardShell` com `useState`, `useTransition`, `useRouter`.
- `createPoolAction` em [src/actions/wizard.ts](../../../src/actions/wizard.ts) — não tocar.
- Tipos em [src/types/wizard.ts](../../../src/types/wizard.ts) — não tocar.
- `toast.error` via `sonner` — preservado.

---

## Pesquisa Externa

### Referência Stitch

[/tmp/stitch-krvou/biblioteca.png](file:///tmp/stitch-krvou/biblioteca.png) — pill flutuante de step indicator no topo de páginas de onboarding.

Nenhuma dependência nova.

---

## Cenários

### Caminho feliz

1. Usuário em `/pool/new?step=1` vê canvas claro, progress pill flutuante no topo ("1 • 2 • 3" com dot 1 ativo neon), StepProduct com 3 ProductCards brancos.
2. Seleciona "Copa do Mundo 2026" → card selecionado ganha ring primary + check neon canto superior.
3. Clica "Próximo" (pill). Navega `?step=2`. Dots atualizam.
4. Preenche `PoolNameInput` (`Input default` com contador X/60) + toggles `CategoryCheckCard` (cards brancos).
5. Adiciona categoria custom via `CustomCategoryInput` (expande em card branco com `Input default`).
6. Clica "Próximo". Dots → passo 3.
7. Em `ReviewCard` branco, confere dados; links "Editar" em `text-primary underline` voltam ao step correspondente.
8. Clica "Criar Bolão" (pill size pill-lg). `createPoolAction` roda, redireciona server-side para `/pool/[poolId]/created`.

### Edge cases

- Step 1 sem produto selecionado → "Próximo" disabled (estado preservado).
- Step 2 nome vazio ou > 60 → "Próximo" disabled; contador `X/60` fica vermelho acima de 55.
- Step 2 zero categorias ativas → "Próximo" disabled.
- Voltar no step 1 → `router.push("/home")` (preservado).
- Pending → "Criar Bolão" mostra `<Loader2 className="animate-spin" />` (preservado, mas em pill).
- Scroll longo no step 2 (muitas categorias) → progress pill permanece sticky no topo (`sticky top-4 z-20`).

### Erros

- `createPoolAction` retorna `{ success: false, error }` → `toast.error(result.error)` (preservado).
- Sessão expirada → redirect server-side (preservado).

---

## Banco de Dados

**Nenhuma alteração.**

---

## Dependências Externas

**Nenhuma nova.**

---

## Arquivos — O Que Criar e Modificar

### Criar

Nenhum.

### Modificar

| Arquivo | O que mudar |
|---|---|
| [src/components/features/wizard/WizardShell.tsx](../../../src/components/features/wizard/WizardShell.tsx) | Container root: `bg-background-light min-h-screen px-4 pt-6 pb-32`. Navegação: `Voltar` → `Button variant="pill-outline"`, `Próximo` → `Button variant="pill"`. Espaçamentos/sticky do progress. |
| [src/components/features/wizard/WizardProgressBar.tsx](../../../src/components/features/wizard/WizardProgressBar.tsx) | Reescrever como **pill flutuante**: `sticky top-4 z-20 mx-auto inline-flex items-center gap-2 rounded-pill bg-hero-surface/95 backdrop-blur px-4 py-2 shadow-drop-soft-md`. Dots: 3 × `size-2 rounded-full bg-white/20` com ativo/completo em `bg-primary shadow-neon-glow-sm`. Label "Passo X/3" em `font-heading text-[10px] text-on-surface-variant uppercase tracking-widest`. Remover `font-pixel`. |
| [src/components/features/wizard/WizardHeader.tsx](../../../src/components/features/wizard/WizardHeader.tsx) | Trocar classes arcade para `font-heading` + `text-on-surface-light`. Número do step em `size-8 rounded-full bg-primary text-hero-surface font-pixel`. |
| [src/components/features/wizard/ProductCard.tsx](../../../src/components/features/wizard/ProductCard.tsx) | Envelopar em `<Card>` default. Crest circular (`size-12 rounded-full bg-primary/10 text-primary font-pixel` com inicial do nome). Selected: `ring-2 ring-primary` no Card + check neon absoluto. Disabled (em breve): `opacity-50 pointer-events-none` + badge `rounded-pill bg-surface-high-light`. Remover `active:translate-x-[2px]`. |
| [src/components/features/wizard/StepProduct.tsx](../../../src/components/features/wizard/StepProduct.tsx) | Grid 1 coluna mobile, 2 colunas desktop; gap ajustado. Título em `font-heading`. |
| [src/components/features/wizard/PoolNameInput.tsx](../../../src/components/features/wizard/PoolNameInput.tsx) | Input `variant="default"` (borda visível). Label em `font-heading uppercase`. Contador X/60 em `text-on-surface-variant-light`. |
| [src/components/features/wizard/CategoryCheckCard.tsx](../../../src/components/features/wizard/CategoryCheckCard.tsx) | Envelope `<Card>` default. Toggle visual via `bg-primary/10 border-primary` quando ativo; `bg-surface-lowest-light border-outline-variant-light` quando inativo. Badge de tipo em `rounded-pill`. |
| [src/components/features/wizard/CustomCategoryInput.tsx](../../../src/components/features/wizard/CustomCategoryInput.tsx) | Botão expandir: `Button variant="pill-outline"`. Form interno em `<Card>` default. Input `variant="default"`. |
| [src/components/features/wizard/StepConfigure.tsx](../../../src/components/features/wizard/StepConfigure.tsx) | Spacing + typography ajustes; títulos de seção em `font-heading`. |
| [src/components/features/wizard/ReviewCard.tsx](../../../src/components/features/wizard/ReviewCard.tsx) | Envelope `<Card>` default. Link "Editar" em `text-primary underline-offset-4 hover:underline`. Cabeçalhos em `font-heading uppercase`. |
| [src/components/features/wizard/StepReview.tsx](../../../src/components/features/wizard/StepReview.tsx) | CTA "Criar Bolão" em `Button variant="pill" size="pill-lg"`. Spinner `<Loader2 />` preservado. |

### NÃO tocar

- [src/actions/wizard.ts](../../../src/actions/wizard.ts) — `createPoolAction` preservada.
- [src/types/wizard.ts](../../../src/types/wizard.ts) — tipos preservados.
- `src/app/pool/new/page.tsx` — só renderiza `<WizardShell>`; nenhuma alteração.
- Layouts, landing, auth, home, pool panel, admin.

---

## Decisões desta Issue

### D01 — C11 / C13 / C15 marcados como N/A

**Contexto:** MIGRATION-MAP assume o wizard antigo com IA/chat. A issue-05 (D13) removeu a IA; o wizard é step-based.
**Decisão:** Deletar essas 3 linhas do escopo. Documentar na tabela acima.
**Alternativas descartadas:** Criar componentes vazios para "preservar futuro chat" — especulação desnecessária.

### D02 — `WizardProgressBar` reescrito, não substituído por novo `WizardStepper.tsx`

**Contexto:** MIGRATION-MAP lista C14 `WizardStepper` (novo). Criar arquivo novo fragmenta a API.
**Decisão:** Reescrever `WizardProgressBar` com dots + pill flutuante. Preserva imports existentes.
**Alternativas descartadas:** Criar `WizardStepper.tsx` novo e deletar `WizardProgressBar.tsx` — piora `git blame` + quebra imports.

### D03 — Canvas claro local, não global

**Contexto:** Consistente com D01 de design-refresh-p03.
**Decisão:** `bg-background-light` no container do WizardShell apenas.
**Alternativas descartadas:** Canvas global — regressão nas outras rotas.

### D04 — `PoolNameInput` / `CustomCategoryInput` em `Input variant="default"`, não pill

**Contexto:** Forms tradicionais; erros de validação ficam mais legíveis com borda visível.
**Decisão:** `default`. Pill fica reservado para chat/messenger.
**Alternativas descartadas:** Pill — `ring-destructive` em pill é menos destacado.

### D05 — Crest circular com inicial (placeholder)

**Contexto:** `Product.name` sem asset de logo no schema.
**Decisão:** Inicial do nome em `font-pixel` dentro de círculo `bg-primary/10`. Mesmo padrão de `design-refresh-p03`.
**Alternativas descartadas:** Ícone genérico único; baixar SVGs externos.

### D06 — "Editar" no ReviewCard é link texto neon, não pill

**Contexto:** "Editar" é secundário; pill desperdiça destaque visual.
**Decisão:** `text-primary underline-offset-4 hover:underline`.
**Alternativas descartadas:** Button pill — polui hierarquia.

### D07 — Remover `font-pixel` do label "Passo X/3"

**Contexto:** Pixel só para display/scores. Labels viram Space Grotesk.
**Decisão:** `font-heading uppercase tracking-widest`.
**Alternativas descartadas:** Manter pixel — quebra D05 do design-system.md.

### D08 — Progress pill `sticky top-4`, não `fixed`

**Contexto:** Fixed cobre conteúdo ao scroll; sticky grudado no topo do container é mais natural aqui.
**Decisão:** `sticky top-4 z-20`.
**Alternativas descartadas:** `fixed` — exige padding-top artificial.

---

## Critérios de Aceitação

- [ ] Canvas `bg-background-light` aplicado no WizardShell
- [ ] Progress pill flutuante com dots (3 passos); ativo/completo em neon
- [ ] ProductCard em Card branco com crest circular, selected com ring + check
- [ ] "Em breve" estilizado como pill sem `active:translate-*`
- [ ] CategoryCheckCard em Card branco com toggle editorial
- [ ] PoolNameInput/CustomCategoryInput em `Input default`
- [ ] ReviewCard em Card branco com link "Editar" neon
- [ ] CTAs em pill / pill-outline
- [ ] `createPoolAction` preservada (não tocada)
- [ ] Fluxo funcional: seleciona produto → configura → revisa → cria → redireciona
- [ ] `pnpm build` + `pnpm typecheck` passam
- [ ] Landing inalterada

---

## Observações para Implementação

- Agent sugerido: **component-writer**.
- Rodar `/dev` (não tem seção wizard? então validar diretamente em `/pool/new?step=1`).
- Comparar com [/tmp/stitch-krvou/biblioteca.png](file:///tmp/stitch-krvou/biblioteca.png) (seção Product Cards + Stepper).
- `design-refresh-layouts` pode estar mexendo no TopBar/BottomNav em paralelo — validar overlap visual no QA final.
