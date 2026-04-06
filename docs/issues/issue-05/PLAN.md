# Plan — issue-05: Wizard de Criacao (P04) — Subtask V

> Issue: issue-05 em docs/ISSUES.md
> Data: 2026-04-05

## Resumo

Criar as 4 telas do wizard de criacao de bolao (`/pool/new?step=1` ate `?step=4`) com todos os componentes visuais: progress bar, AI bubbles, template chips, category cards com toggle, scoring rules editaveis e review cards. Dados mockados, IA simulada com respostas fixas. Mobile-first.

## Pesquisa Interna

### Design System (verificacao obrigatoria)

- **Tokens:** surface hierarchy (#1f0438 → #472d60), primary #39ff14, secondary #fffeac, tertiary #bd00ff, destructive #ff3131, status-finished #ff6b9d
- **Tipografia:** Press Start 2P (pixel), Space Grotesk (headings), Inter (body)
- **Regras:** border-radius 0px, borders min 2px, shadow-arcade-* (4px offset), press animation, scanline overlay
- **Novos tokens necessarios:** gradient AIBubble (roxo→cyan translucido), cor cyan para links/destaques

**Componentes ui/ existentes:**
- `button.tsx` + `button-variants.ts` — variantes default, secondary, tertiary, destructive, outline, ghost
- `input.tsx` — campo de entrada com glow
- `alert-dialog.tsx` — modal de confirmacao
- `loading-state.tsx` — spinner pixel art
- `error-state.tsx` — estado de erro com retry
- `sonner.tsx` — toast notifications

**Componentes a reutilizar nesta issue:**
- `Button` — para navegacao (Voltar/Proximo), CTA "CRIAR BOLAO", "+ Adicionar"
- `Input` — para texto livre no step 1, input de nova categoria no step 2, input de rebalanceamento no step 3

### Componentes reutilizaveis encontrados

- `src/components/ui/button.tsx` — reutilizar para CTAs e navegacao
- `src/components/ui/input.tsx` — reutilizar para inputs de texto
- `src/components/layouts/BottomNavBar.tsx` — nav inferior (ja criada em issue-04)
- `src/components/layouts/DashboardTopBar.tsx` — top bar com avatar (ja criada em issue-04)
- `src/lib/utils.ts` — `cn()` para class merging

### Patterns do projeto

- Server Components por default, `'use client'` apenas quando necessario
- Props tipadas via interface
- Mobile-first com breakpoints Tailwind (sm, md, lg)
- Agrupamento por feature em `src/components/features/`
- Icones via `lucide-react`
- Design arcade: 0px radius, 4px offset shadows, press animation
- Forms usam `useActionState()` com Server Actions (pattern de issue-03)
- Next.js 16: `searchParams` e Promise — deve ser `await`ed em Server Components

### Nada encontrado (precisa criar)

| Item | Motivo |
|---|---|
| `src/app/pool/new/page.tsx` | Pagina /pool/new nao existe |
| `src/components/features/wizard/WizardShell.tsx` | Client Component orquestrador dos 4 steps |
| `src/components/features/wizard/WizardProgressBar.tsx` | C10 — barra de progresso |
| `src/components/features/wizard/WizardHeader.tsx` | C11 — header do step |
| `src/components/features/wizard/AIBubble.tsx` | C12 — balao de mensagem IA |
| `src/components/features/wizard/TemplateChips.tsx` | C13 — chips de template |
| `src/components/features/wizard/CategoryCheckCard.tsx` | C14 — card de categoria com checkbox |
| `src/components/features/wizard/ScoringRuleGroup.tsx` | C15 — grupo de regras de pontuacao |
| `src/components/features/wizard/ReviewCard.tsx` | C16 — card de revisao |
| `src/components/features/wizard/StepEvent.tsx` | Step 1 — composicao de C12 + input + C13 |
| `src/components/features/wizard/StepCategories.tsx` | Step 2 — composicao de C12 + C14 list |
| `src/components/features/wizard/StepScoring.tsx` | Step 3 — composicao de C12 + C15 |
| `src/components/features/wizard/StepReview.tsx` | Step 4 — composicao de C16 list + CTA |
| `src/types/wizard.ts` | Types para wizard state, categories, rules |

## Pesquisa Externa

### Next.js 16 (node_modules/next/dist/docs/)

**searchParams em page.tsx (breaking change):**
- `searchParams` e uma **Promise** — deve ser `await`ed
- Pattern para Server Component:
```typescript
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { step = '1' } = await searchParams
}
```

**useSearchParams em Client Components:**
- Import de `'next/navigation'`
- Retorna `URLSearchParams` read-only
- Deve ser wrapped em `<Suspense>` boundary
- `.get('step')` para extrair valor

**useRouter para navegacao programatica:**
- `router.push('/pool/new?step=2')` — adiciona ao historico
- `router.replace('/pool/new?step=2')` — substitui entrada atual

**Decisao arquitetural:**
- `page.tsx` sera Server Component que faz `await searchParams` e passa `step` como prop
- `WizardShell.tsx` sera Client Component (`'use client'`) que gerencia estado do wizard e renderiza o step correto
- Navegacao entre steps via `useRouter().push()` para manter historico do browser (Back funciona)

### Tailwind v4

- Novos tokens (gradient, cyan) devem ser adicionados em `:root {}` + mapeados em `@theme inline {}`
- `color-mix()` disponivel para translucidez
- Gradients via classes Tailwind: `bg-gradient-to-r from-[color] to-[color]`

### Documentacao consultada

- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md` — searchParams Promise
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-search-params.md` — useSearchParams
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-router.md` — useRouter
- Spec interna (`docs/SPEC.md`) — P04a-d, C10-C16, B11-B18

### Padroes adotados

- WizardShell como Client Component unico que gerencia state dos 4 steps (D03 — state client-side ate confirmacao)
- Navegacao entre steps via query params (`?step=N`) para que botao Back do browser funcione
- `useRouter().push()` em vez de `replace()` para manter historico
- Cada step e um componente separado (StepEvent, StepCategories, StepScoring, StepReview) para separacao de responsabilidade
- Dados mockados inline nos componentes de step, com comentario `// TODO: replace with AI data in Subtask F`

## Cenarios

### Caminho feliz

1. Usuario clica "CRIAR BOLAO" na /home
2. Navega para `/pool/new?step=1`
3. Progress bar mostra "STEP 1/4", header mostra "Evento"
4. AIBubble mostra mensagem inicial
5. Input de texto livre disponivel + 4 template chips
6. Usuario clica chip "Copa do Mundo" → pre-preenche input
7. Clica "Proximo" → navega para `?step=2`
8. Progress bar atualiza, AIBubble mostra categorias sugeridas
9. Cards de categoria com checkbox toggle on/off
10. Seleciona categorias, clica "Proximo" → `?step=3`
11. Regras de pontuacao agrupadas, valores clicaveis
12. Edita valor inline, clica "Proximo" → `?step=4`
13. Review cards mostram resumo, links "Editar" voltam ao step
14. CTA "CRIAR BOLAO" visivel (nesta subtask, apenas visual/mockado)

### Edge cases

- Acesso direto a `?step=3` sem passar por steps anteriores → renderiza step 3 com dados mockados (nesta subtask V nao ha validacao de fluxo)
- Step 1 com input vazio → botao "Proximo" habilitado (mock, sem validacao real)
- Step 2 com 0 categorias → visual permite mas botao nao desabilita (mock)
- Browser Back → volta ao step anterior com estado mantido via client state
- Mobile viewport → layout compacto, full-width cards
- Desktop → max-width container, layout centralizado

### Dados mockados

```typescript
// Step 1 — Templates
const MOCK_TEMPLATES = [
  { id: "copa", label: "Copa do Mundo" },
  { id: "champions", label: "Champions League" },
  { id: "brasileirao", label: "Brasileirao" },
  { id: "custom", label: "Personalizado" },
];

// Step 2 — Categorias
const MOCK_CATEGORIES = [
  {
    id: "1",
    name: "Campeao",
    description: "Quem sera o campeao do torneio",
    type: "single_choice" as const,
    selected: true,
  },
  {
    id: "2",
    name: "Artilheiro",
    description: "Jogador com mais gols no torneio",
    type: "free_text" as const,
    selected: true,
  },
  {
    id: "3",
    name: "Placar do Jogo",
    description: "Resultado exato de cada partida",
    type: "exact_score" as const,
    selected: true,
  },
  {
    id: "4",
    name: "Selecao Revelacao",
    description: "Selecao que vai surpreender",
    type: "single_choice" as const,
    selected: false,
  },
];

// Step 3 — Regras de Pontuacao
const MOCK_SCORING_RULES = [
  {
    group: "Resultados dos Jogos",
    groupColor: "cyan",
    rules: [
      { id: "1", name: "Placar exato", points: 25 },
      { id: "2", name: "Resultado certo (V/E/D)", points: 10 },
      { id: "3", name: "Gols de um time certo", points: 5 },
    ],
  },
  {
    group: "Categorias Especiais",
    groupColor: "gold",
    rules: [
      { id: "4", name: "Campeao certo", points: 50 },
      { id: "5", name: "Artilheiro certo", points: 30 },
      { id: "6", name: "Selecao revelacao certa", points: 20 },
    ],
  },
];

// Step 4 — Review
const MOCK_REVIEW = {
  poolName: "Copa do Mundo 2026",
  event: "Copa do Mundo FIFA 2026",
  categoriesCount: 3,
  categoriesNames: ["Campeao", "Artilheiro", "Placar do Jogo"],
  scoringRange: "5 — 50 pts",
  rulesCount: 6,
};
```

## Banco de Dados

Nao aplicavel nesta subtask (visual only, dados mockados). Schema de BetCategory e ScoringRule sera criado na Subtask F.

## Dependencias Externas

Nenhuma nova. Tudo ja instalado:
- `lucide-react` — icones (ChevronLeft, ChevronRight, Check, Plus, Pencil, Sparkles)
- `next/navigation` — useRouter, useSearchParams

## Arquivos — O Que Criar e Modificar

### Criar

| Arquivo | O que contem |
|---|---|
| `src/app/pool/new/page.tsx` | Server Component. Await searchParams, extrai step, renderiza WizardShell com DashboardTopBar e BottomNavBar. Suspense boundary |
| `src/components/features/wizard/WizardShell.tsx` | `'use client'`. Orquestrador principal. Recebe step inicial como prop. Gerencia wizard state (evento, categorias, regras). Renderiza step correto + WizardProgressBar + navegacao (Voltar/Proximo). Usa useRouter para navegacao entre steps |
| `src/components/features/wizard/WizardProgressBar.tsx` | C10. Barra de 4 segments. Preenchimento gradient primary→cyan ate step atual. Texto "STEP X/4" em font-pixel. Props: `{ currentStep: number, totalSteps: number }` |
| `src/components/features/wizard/WizardHeader.tsx` | C11. Step number em font-pixel text-primary + titulo em font-heading bold. Props: `{ stepNumber: number, title: string }` |
| `src/components/features/wizard/AIBubble.tsx` | C12. Background gradient translucido roxo→cyan. Border roxa sutil. Tag "IA" em font-pixel com bg roxo. Texto body. Props: `{ message: string }` |
| `src/components/features/wizard/TemplateChips.tsx` | C13. Grupo de chips clicaveis. Background surface-high, border outline. Texto on-surface-variant. Props: `{ templates: Template[], onSelect: (id) => void, selectedId?: string }` |
| `src/components/features/wizard/CategoryCheckCard.tsx` | C14. Card com checkbox visual. Selecionado: checkbox primary com check icon, borda primary, bg sutil. Nao selecionado: checkbox vazio, opacity reduzida. Badge tipo (Escolha unica/Placar exato/Texto livre). Props: `{ category: Category, selected: boolean, onToggle: () => void }` |
| `src/components/features/wizard/ScoringRuleGroup.tsx` | C15. Card agrupando regras. Titulo uppercase (cor customizada). Lista de rows: nome + valor em font-pixel com bg translucido verde. Valor clicavel para edicao inline (input numerico). Props: `{ group: ScoringGroup, onEditRule: (ruleId, value) => void }` |
| `src/components/features/wizard/ReviewCard.tsx` | C16. Card com label (small muted), titulo (bold), subtitle opcional, link "Editar" alinhado direita (cor cyan). Props: `{ label: string, title: string, subtitle?: string, editStep?: number, onEdit?: () => void }` |
| `src/components/features/wizard/StepEvent.tsx` | Composicao step 1: AIBubble + Input texto livre + TemplateChips. Gerencia estado local do input. Props: `{ eventText, onEventTextChange, onTemplateSelect }` |
| `src/components/features/wizard/StepCategories.tsx` | Composicao step 2: AIBubble + lista de CategoryCheckCards + botao "+ Adicionar". Props: `{ categories, onToggleCategory, onAddCategory }` |
| `src/components/features/wizard/StepScoring.tsx` | Composicao step 3: AIBubble + ScoringRuleGroups + input rebalanceamento. Props: `{ scoringRules, onEditRule, onRebalanceRequest }` |
| `src/components/features/wizard/StepReview.tsx` | Composicao step 4: ReviewCards + CTA "CRIAR BOLAO". Props: `{ review, onEdit, onCreate }` |
| `src/types/wizard.ts` | Types: WizardState, WizardStep, Template, Category, CategoryType, ScoringGroup, ScoringRule, ReviewData |

### Modificar

| Arquivo | O que mudar |
|---|---|
| `src/app/globals.css` | Adicionar tokens: --accent-cyan (cor cyan para links/destaques wizard), --ai-bubble-from / --ai-bubble-to (gradient cores), --scoring-cyan / --scoring-gold (cores grupo regras). Mapear em @theme inline |

### NAO tocar

Tudo que nao esta listado acima. Especialmente:
- `src/components/ui/*` — componentes base ja prontos
- `src/app/home/*` — dashboard, escopo issue-04
- `src/app/auth/*` — auth, escopo issue-03
- `src/app/page.tsx` — landing page
- `src/components/layouts/*` — layouts ja prontos (reutilizar, nao modificar)
- `src/actions/*` — server actions existentes
- `src/lib/*` — utilitarios ja prontos
- `prisma/*` — schema sera alterado na Subtask F

## Decisoes desta Issue

### D01 — WizardShell como Client Component unico orquestrador

**Contexto:** O wizard tem 4 steps com estado compartilhado (dados do evento, categorias selecionadas, regras). O estado deve persistir entre steps (D03 da spec).
**Decisao:** Criar `WizardShell.tsx` como `'use client'` que mantem todo o state via `useState`. Cada step e um componente filho que recebe dados e callbacks via props. A navegacao entre steps usa `useRouter().push()` para query params.
**Alternativas descartadas:** (1) Cada step como pagina separada com state em URL/sessionStorage — complexo demais para dados estruturados. (2) Context API — overhead desnecessario quando um componente pai resolve.

### D02 — Navegacao via query params com useRouter.push()

**Contexto:** Steps usam `?step=N` para permitir deep linking e browser Back.
**Decisao:** Usar `useRouter().push()` (nao `replace()`) para que cada step entre no historico do browser. O botao Back do browser volta ao step anterior naturalmente.
**Alternativas descartadas:** `replace()` — perderia historico, Back nao funcionaria entre steps.

### D03 — Componentes de step separados (StepEvent, StepCategories, etc.)

**Contexto:** Cada step tem UI e logica visual distinta.
**Decisao:** Criar componentes de composicao por step (StepEvent, StepCategories, StepScoring, StepReview) que agrupam os componentes primitivos (AIBubble, Cards, etc.) com dados mockados. Na Subtask F, a logica real substituira os mocks.
**Alternativas descartadas:** Tudo inline no WizardShell — ficaria gigante e dificil de manter.

### D04 — Tokens novos em globals.css para wizard

**Contexto:** A spec define cores especificas para o wizard (gradient AIBubble roxo→cyan, cor cyan para links "Editar", cores de grupo cyan/gold) que nao existem no design system atual.
**Decisao:** Adicionar tokens CSS em `:root` e mapear em `@theme inline`. Isso mantem o pattern do projeto (design system via CSS tokens).
**Alternativas descartadas:** Hardcoded inline — violaria o design system. Tailwind arbitrary values — menos mantenivel.

### D05 — page.tsx Server Component + WizardShell Client Component

**Contexto:** Next.js 16 requer `await searchParams` (Promise), que so funciona em Server/async Components. Mas o wizard precisa de client state.
**Decisao:** `page.tsx` e Server Component async que faz `await searchParams`, extrai `step`, e passa como prop para `WizardShell` (Client Component) dentro de `<Suspense>`. Separacao limpa de server/client.
**Alternativas descartadas:** page.tsx como Client Component com `useSearchParams()` — funcionaria mas perderia a oportunidade de Server Component pattern e precisaria de Suspense de qualquer forma.
