# Plan — issue-04: Home / Dashboard (P03) — Subtask V

> Issue: issue-04 em docs/ISSUES.md
> Data: 2026-04-05

## Resumo

Criar a interface do dashboard principal (`/home`) com TopBar autenticada, lista de PoolCards com dados mockados, EmptyState, BottomNavBar fixa e CTA "CRIAR BOLAO". Mobile-first, apenas visual (dados mockados).

## Pesquisa Interna

### Design System (verificacao obrigatoria)

- **Tokens:** surface hierarchy (#1f0438 → #472d60), primary #39ff14, secondary #fffeac, tertiary #bd00ff, destructive #ff3131
- **Tipografia:** Press Start 2P (pixel), Space Grotesk (headings), Inter (body)
- **Regras:** border-radius 0px, borders min 2px, shadow-arcade-* (4px offset), press animation, scanline overlay
- **Badges:** Aberto = primary/verde, Em andamento = secondary-container/amarelo, Encerrado = rosa/destructive

**Componentes ui/ existentes:**
- `button.tsx` + `button-variants.ts` — variantes default, secondary, tertiary, destructive, outline, ghost
- `input.tsx` — campo de entrada com glow
- `alert-dialog.tsx` — modal de confirmacao
- `loading-state.tsx` — spinner pixel art
- `error-state.tsx` — estado de erro com retry
- `sonner.tsx` — toast notifications

**Componentes a reutilizar nesta issue:**
- `Button` — para CTA "CRIAR BOLAO", botoes do EmptyState
- `LoadingState` — se necessario para skeleton

### Componentes reutilizaveis encontrados

- `src/components/layouts/TopBar.tsx` — existe mas e a TopBar da landing (hamburger + nav links desktop + bell). Para o dashboard precisa de variante com avatar do usuario em vez de bell/hamburger
- `src/components/ui/button.tsx` — reutilizar para CTAs
- `src/lib/utils.ts` — `cn()` para class merging

### Patterns do projeto

- Server Components por default, `'use client'` apenas quando necessario (interatividade)
- Props tipadas via interface
- Mobile-first com breakpoints Tailwind (sm, md, lg)
- Agrupamento por feature em `src/components/features/`
- Icones via `lucide-react` (ja instalado)
- Design arcade: 0px radius, 4px offset shadows, press animation

### Nada encontrado (precisa criar)

| Item | Motivo |
|---|---|
| `src/app/home/page.tsx` | Pagina /home nao existe |
| `src/components/features/home/PoolCard.tsx` | C08 — card de bolao |
| `src/components/features/home/EmptyState.tsx` | C09 — estado vazio |
| `src/components/layouts/BottomNavBar.tsx` | C06 — nav inferior global |
| `src/components/layouts/DashboardTopBar.tsx` | TopBar do dashboard com avatar |

## Pesquisa Externa

### Next.js 16 (node_modules/next/dist/docs/)

**Breaking changes relevantes para esta issue:**
- **`params` e `searchParams` sao Promise** — devem ser `await`ed. Nao afeta diretamente esta issue (nenhuma rota dinamica), mas importante saber
- **`middleware` renomeado para `proxy`** — ja feito no projeto (src/proxy.ts)
- **Server Components sao async por default** — DashboardTopBar pode ser `async function` para chamar `await auth()`
- **`usePathname()`** — continua sendo Client Component hook, requer `'use client'`. Retorna pathname sem query strings
- **Link component** — mesma API, prefetch automatico para rotas estaticas
- **Turbopack e o bundler default** — nenhuma acao necessaria

**Patterns confirmados:**
- `page.tsx` define rota publica, `layout.tsx` para UI compartilhada
- Route groups `(folderName)` nao afetam URL — util para agrupar rotas autenticadas no futuro
- Server Components podem fazer fetch direto (ou chamar `auth()`)

### Auth.js v5 — Sessao em Server Components

**Como obter sessao:**
```typescript
import { auth } from "@/lib/auth";

export async function DashboardTopBar() {
  const session = await auth();
  // session?.user?.name, session?.user?.image, session?.user?.email
}
```

**Shape do Session:**
```typescript
{
  user?: {
    id?: string;        // adicionado pelos callbacks jwt/session do projeto
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  expires: string;      // ISO date
}
```

**Implicacao:** DashboardTopBar deve ser `async` Server Component. Como chama `await auth()`, NAO pode ser Client Component. Isso e bom — evita enviar logica de auth para o client.

### Tailwind v4 — Configuracao CSS-based

**Diferenca principal:** Nao existe `tailwind.config.js`. Tudo configurado via CSS:
- Tokens definidos em `:root { }` no `globals.css`
- Mapeados para Tailwind via `@theme inline { }` com prefixos `--color-*`, `--shadow-*`, `--font-*`
- Variante dark: `@custom-variant dark (&:is(.dark *));`
- Radius: `--radius: 0rem` (tudo quadrado por design)

**Shadows custom disponiveis:**
- `shadow-arcade-primary` / `shadow-arcade-secondary` / `shadow-arcade-dark` — 4px offset
- `shadow-glow-primary` / `shadow-glow-destructive` — efeito neon
- `shadow-arcade-toast` — offset leve para toasts

**Gotchas:**
- Para adicionar novos tokens: CSS variable em `:root` + mapeamento em `@theme inline`
- `color-mix()` usado para shadows com transparencia
- Responsive classes (`md:hidden`, `lg:flex`) funcionam igual ao v3
- Arbitrary values com CSS vars funcionam: `drop-shadow-[2px_2px_0px_var(--surface-container)]`

### Documentacao consultada

- `node_modules/next/dist/docs/01-app/` — routing, server components, Link, usePathname, upgrade v16
- Spec interna (`docs/SPEC.md`) — definicoes completas de P03, C06, C08, C09, B03, B08, B09, B10
- `src/lib/auth.ts` + `src/proxy.ts` — pattern de uso do `auth()` ja estabelecido no projeto
- Lucide React — icones para BottomNavBar (Home, Plus, Target, Trophy disponiveis)

### Padroes adotados

- BottomNavBar usa `lucide-react` em vez de Material Symbols (projeto ja usa lucide, manter consistencia)
- TopBar do dashboard e `async` Server Component (chama `await auth()` para avatar)
- TopBar do dashboard e componente separado do TopBar da landing (contextos diferentes)
- PoolCard e Server Component (nao precisa de estado client)
- BottomNavBar e Client Component (precisa de `usePathname()` para item ativo)
- Tailwind v4: usar tokens existentes do `@theme inline`, nao criar tailwind.config.js

## Cenarios

### Caminho feliz

1. Usuario logado acessa `/home`
2. Pagina renderiza com DashboardTopBar (logo + avatar)
3. CTA "CRIAR BOLAO" visivel abaixo do top bar
4. Lista de 3+ PoolCards mockados com status variados (Aberto, Em andamento, Encerrado)
5. Cada card mostra titulo, participantes, badge colorido, info contextual
6. BottomNavBar fixa no bottom com "Home" ativo
7. Scroll da lista funciona sem colidir com top bar ou bottom nav

### Edge cases

- Lista vazia → EmptyState com botoes "Criar Bolao" e "Tenho um convite"
- Card encerrado → opacity reduzida (opacity-60)
- Mobile viewport → BottomNavBar visivel, layout compacto
- Desktop viewport → BottomNavBar oculta (mobile only conforme spec)

### Dados mockados

```typescript
const MOCK_POOLS = [
  {
    id: "1",
    title: "Copa do Mundo 2026",
    participantCount: 12,
    status: "open" as const,
    contextInfo: "Palpites pendentes: 3 categorias",
  },
  {
    id: "2",
    title: "Champions League 25/26",
    participantCount: 8,
    status: "in_progress" as const,
    contextInfo: "Sua posicao: 2o — 45 pts",
  },
  {
    id: "3",
    title: "Brasileirao 2025",
    participantCount: 15,
    status: "finished" as const,
    contextInfo: "Resultado final: 3o lugar",
  },
];
```

## Banco de Dados

Nao aplicavel nesta subtask (visual only, dados mockados). Schema de Pool sera criado na Subtask F.

## Dependencias Externas

Nenhuma nova. Tudo ja instalado:
- `lucide-react` — icones (Home, Plus, Target, Trophy, User)
- `next/link` — navegacao
- `next/navigation` — `usePathname()` para BottomNavBar

## Arquivos — O Que Criar e Modificar

### Criar

| Arquivo | O que contem |
|---|---|
| `src/app/home/page.tsx` | Pagina Server Component. Importa DashboardTopBar, CTA, lista de PoolCards ou EmptyState, BottomNavBar. Dados mockados inline |
| `src/components/features/home/PoolCard.tsx` | C08 — Card com titulo, participantes, badge status, info contextual. Props: `{ id, title, participantCount, status, contextInfo }`. Badge cores por status. Encerrado com opacity-60. Link wrapper (href mockado) |
| `src/components/features/home/EmptyState.tsx` | C09 — Mensagem + 2 botoes (Criar Bolao, Tenho um convite). Centralizado. Botao primario arcade + botao outline |
| `src/components/layouts/DashboardTopBar.tsx` | `async` Server Component. Chama `await auth()` para obter sessao. Logo KRVOU (link /home) + avatar do usuario (session.user.image com fallback para icone User com bg surface-high). Fixed top, z-40, h-16, border-b-4 |
| `src/components/layouts/BottomNavBar.tsx` | C06 — Nav fixa inferior. 4 itens (Home, Criar, Meus Palpites, Ranking). `'use client'` para usePathname. Item ativo: bg-primary text-background. Icons lucide. Border-top-4. md:hidden (mobile only) |

### Modificar

| Arquivo | O que mudar |
|---|---|
| Nenhum | Subtask visual nao altera arquivos existentes |

### NAO tocar

Tudo que nao esta listado acima. Especialmente:
- `src/components/ui/*` — componentes base ja prontos
- `src/app/page.tsx` — landing page, escopo diferente
- `src/components/layouts/TopBar.tsx` — TopBar da landing, manter separada
- `src/lib/*` — utilitarios ja prontos
- `src/actions/*` — server actions existentes
- `prisma/*` — schema sera alterado na Subtask F

## Decisoes desta Issue

### D01 — TopBar separada para dashboard vs landing (async Server Component)

**Contexto:** A TopBar existente (`TopBar.tsx`) tem hamburger, nav links desktop e bell icon — contexto de landing page publica. O dashboard precisa de logo + avatar do usuario, e deve chamar `await auth()` para obter a sessao (Auth.js v5 pattern).
**Decisao:** Criar `DashboardTopBar.tsx` como `async` Server Component separado. Chama `await auth()` diretamente, exibe `session.user.image` se disponivel (Google OAuth) ou fallback com icone User.
**Alternativas descartadas:** Adicionar props condicionais na TopBar existente — aumentaria complexidade sem beneficio, sao contextos fundamentalmente diferentes. Tambem descartado fazer Client Component com `useSession()` — desnecessario, Server Component pode acessar sessao diretamente.

### D02 — Lucide icons em vez de Material Symbols para BottomNavBar

**Contexto:** A spec menciona "Icones Material Symbols" para C06, mas o projeto ja usa `lucide-react` em todos os componentes.
**Decisao:** Usar lucide-react (Home, PlusCircle, Target, Trophy) para manter consistencia com o resto do projeto.
**Alternativas descartadas:** Instalar @material-symbols/react — adicionaria dependencia desnecessaria, lucide tem equivalentes adequados.

### D03 — BottomNavBar como componente de layout global

**Contexto:** A BottomNavBar sera usada em multiplas paginas alem do dashboard (todas as paginas autenticadas).
**Decisao:** Colocar em `src/components/layouts/` (nao em `features/home/`) para indicar que e um componente de layout reutilizavel. Nesta subtask, incluir apenas na pagina `/home`. Em issues futuras, mover para um layout compartilhado se necessario.
**Alternativas descartadas:** Incluir no root layout — prematuro, nem toda rota autenticada precisa de bottom nav.

### D04 — EmptyState como componente de feature (nao ui/)

**Contexto:** EmptyState do dashboard tem conteudo especifico (mensagem sobre boloes, CTAs especificos).
**Decisao:** Colocar em `src/components/features/home/` pois e especifico do contexto home. Se surgir necessidade de EmptyState generico no futuro, extrair para ui/.
**Alternativas descartadas:** Criar um EmptyState generico em ui/ — over-engineering para um unico uso atual.

### D05 — Dados mockados inline na pagina

**Contexto:** Subtask V usa dados mockados. Precisamos decidir onde colocar os mocks.
**Decisao:** Array `MOCK_POOLS` diretamente no `page.tsx`, com comentario `// TODO: replace with real data in Subtask F`. Simples, facil de substituir.
**Alternativas descartadas:** Arquivo separado de mocks — overhead desnecessario para dados temporarios.

## Divergencias (atualizacoes durante /execute)

### DIV-01 — Token rosa para badge "Encerrado"
**Data:** 2026-04-05
**PLAN original:** Badge "Encerrado" usaria `bg-destructive/80` (vermelho)
**Realidade encontrada:** Spec diz "Encerrado = rosa" mas nao existia token rosa no design system
**Mudanca feita:** Criados tokens `--status-finished: #ff6b9d` e `--status-finished-foreground: #3a0018` em globals.css. Badge agora usa `bg-status-finished text-status-finished-foreground`
**Aprovado pelo usuario:** sim

### DIV-02 — Shadow arcade invertido no BottomNavBar
**Data:** 2026-04-05
**PLAN original:** Apenas `border-t-4` no BottomNavBar
**Realidade encontrada:** Spec C06 diz "box-shadow arcade invertido" alem da borda
**Mudanca feita:** Criado token `--shadow-arcade-dark-invert: 0px -4px 0px 0px rgba(0, 0, 0, 0.5)` em globals.css. BottomNavBar agora usa `shadow-arcade-dark-invert`
**Aprovado pelo usuario:** sim

### DIV-03 — globals.css modificado (fora do PLAN original)
**Data:** 2026-04-05
**PLAN original:** "NAO tocar" nao listava globals.css mas tambem nao listava como "Modificar"
**Realidade encontrada:** Precisou de novos tokens (rosa + shadow invertido) para atender a spec
**Mudanca feita:** Adicionados 3 tokens em `:root` e mapeados em `@theme inline`
**Aprovado pelo usuario:** sim
