# Plan — issue-08: Painel do Bolao / Participante (P07)

> Issue: issue-08 em docs/ISSUES.md
> Data: 2026-04-16

## Resumo

Implementar o painel do participante em `/pool/[poolId]` com 3 tabs: Ranking, Palpites e Resultados. Subtask V usa dados mockados; Subtask F conecta a dados reais via Server Actions com queries Prisma. Requer adicionar modelos `Bet` e `Result` ao schema (ainda nao existem).

---

## Pesquisa Interna

### Design System (verificacao obrigatoria)

- **TabBar (C19):** `bg-surface-container` fundo, tab ativa `bg-surface-high text-primary`, inativas `text-on-surface-variant`. Borda `border-2 border-outline-variant`
- **UserPositionCard (C20):** Posicao em `font-pixel text-secondary` (dourado/yellow), pontuacao em `font-pixel text-primary` (verde), diff em `text-on-surface-variant`. Borda `border-accent-dim` (~tertiary dim), bg gradient sutil
- **RankingList (C21):** Posicao `font-pixel text-secondary`, nome `font-sans text-on-surface`, pontuacao `font-pixel text-primary`. Linha do usuario: `bg-primary/10` highlight. Card com `border-2 border-outline-variant`
- **BetCategoryCards (C22):** Borda esquerda 3px — `border-l-[3px] border-primary` (feito/verde), `border-l-[3px] border-destructive` (pendente/rosa). Badge "Feito" verde, "Pendente" rosa. Progress bar com `bg-primary`
- **ResultComparisonCards (C23):** Acertou = `text-primary` (verde), errou = `text-destructive` (rosa/vermelho)
- **Tipografia:** `font-pixel` para numeros/scores, `font-heading` para labels/badges, `font-sans` para body
- **Espacamento:** `p-5`, `gap-4`/`gap-6`
- **Border-radius:** `0px` em tudo (global)
- **Sombras:** `shadow-arcade-dark` nos cards

### Componentes ui/ a reutilizar

| Componente | Path | Uso |
|---|---|---|
| `Button` | `src/components/ui/button.tsx` | Navegacao, acoes |
| `toast` / Toaster | `src/components/ui/sonner.tsx` | "Palpites encerrados" (erro), feedback |
| `LoadingState` | `src/components/ui/loading-state.tsx` | Loading enquanto carrega dados |
| `ErrorState` | `src/components/ui/error-state.tsx` | Erro ao carregar painel |

### Componentes de layout a reutilizar

| Componente | Path | Uso |
|---|---|---|
| `DashboardTopBar` | `src/components/layouts/DashboardTopBar.tsx` | Header padrao |
| `BottomNavBar` | `src/components/layouts/BottomNavBar.tsx` | Nav bar com "Palpites" ativo |

### Hooks existentes

Nenhum em `src/hooks/`. Tab state vai com `useState` inline — nao justifica hook.

### Patterns do projeto

- **Auth em Server Component:** `const session = await auth()` + redirect se nao autenticado (pattern de `src/app/pool/[poolId]/created/page.tsx`)
- **Fetch direto no page.tsx:** Prisma queries diretamente no Server Component para leitura (pattern de `src/app/pool/[poolId]/created/page.tsx` e `src/app/pool/new/page.tsx`)
- **`params` e Promise no Next.js 16:** `const { poolId } = await params`
- **Toast:** `import { toast } from "sonner"` — sem hook customizado
- **Layout wrapper:** `<div className="flex min-h-dvh flex-col bg-background">` + DashboardTopBar + main + BottomNavBar (pattern consistente)
- **Pool actions existentes:** `src/actions/pool.ts` ja tem `getUserPools` e `getRankPosition` — ranking logic parcialmente existente

### Types existentes a reutilizar

- `PoolStatus` / `PoolMemberRole` em `src/types/pool.ts`
- `PoolCardData` — nao reutilizar (shape diferente), mas seguir o pattern Zod + interface

### Nada encontrado (precisa criar)

- `src/app/pool/[poolId]/page.tsx` — rota nao existe
- `src/components/features/pool/TabBar.tsx` — C19
- `src/components/features/pool/UserPositionCard.tsx` — C20
- `src/components/features/pool/RankingList.tsx` — C21
- `src/components/features/pool/BetCategoryCards.tsx` — C22
- `src/components/features/pool/ResultComparisonCards.tsx` — C23
- `src/components/features/pool/PoolPanelTabs.tsx` — Client Component orquestrador das tabs
- Types para os dados do painel em `src/types/pool.ts` (adicionar)

---

## Pesquisa Externa

### Next.js 16 — params como Promise

Confirmado no codebase existente (`src/app/pool/[poolId]/created/page.tsx`):

```typescript
export default async function Page({
  params,
}: {
  params: Promise<{ poolId: string }>
}) {
  const { poolId } = await params
}
```

### Schema ausente — Bet e Result

O data model do BRIEF (`docs/brief/data-model.mermaid`) define `BET`, `RESULT` e `SCORING_RULE` mas esses modelos **nao existem** no `prisma/schema.prisma` atual. A Subtask V nao precisa deles (dados mockados), mas a Subtask F sim.

Tambem `PoolCategory` nao tem campos `isLocked` nem `deadline` — o SPEC define que `BET_CATEGORY` (que no nosso schema e `PoolCategory`) deveria ter esses campos. Precisam ser adicionados.

---

## Cenarios

### Caminho feliz — Tab Ranking (B22, B23)

1. Usuario acessa `/pool/[poolId]`
2. Server Component: `await params` → poolId, `auth()` → sessao valida
3. Fetch Pool com members ordenados por `totalScore DESC`
4. Calcula rank (empates = mesma posicao)
5. Renderiza PoolPanelTabs com dados
6. Tab Ranking (default): UserPositionCard com posicao/pontos do usuario + RankingList com todos
7. Linha do usuario logado destacada com `bg-primary/10`

### Caminho feliz — Tab Palpites (B24)

1. Usuario clica tab "Palpites"
2. Lista de categorias do pool com status feito/pendente
3. Progress bar mostra X/Y categorias preenchidas
4. Tap em categoria aberta → navega para `/pool/[poolId]/bet/[categoryId]` (P08)

### Caminho feliz — Tab Resultados (B25)

1. Usuario clica tab "Resultados"
2. Lista de resultados ja inseridos pelo admin
3. Cada card mostra: resultado real vs palpite do usuario + pontuacao

### Edge cases

- **Empates no ranking:** Mesmo totalScore = mesma posicao (ex: 2 usuarios com 15pts ambos sao 1o, proximo e 3o)
- **Zero participantes alem do usuario:** Ranking com 1 pessoa — posicao 1o, sem diff para lider
- **Categoria trancada (isLocked=true):** Tap → Toast "Palpites encerrados para esta categoria" + nao navega
- **Deadline passou:** Mesmo comportamento de trancada
- **Sem palpites:** Todas categorias como "pendente", progress 0/Y
- **Sem resultados:** Empty state "Nenhum resultado inserido ainda"
- **Pool nao encontrado:** `notFound()` → 404
- **Usuario nao e membro:** Redirect para home ou 404

### Erros

- **poolId invalido:** `notFound()`
- **Sessao expirada:** `redirect("/auth")`
- **Prisma error:** catch → `notFound()` (comportamento seguro)

---

## Banco de Dados

### Tabelas envolvidas (leitura)

- `Pool` — READ: dados do bolao
- `PoolMember` — READ: ranking (totalScore, userId), verificar membership
- `PoolCategory` — READ: categorias do pool
- `User` — READ: nomes dos participantes

### Tabelas a CRIAR (para Subtask F)

```prisma
model Bet {
  id             String       @id @default(cuid())
  value          String
  pointsEarned   Int?
  userId         String
  poolId         String
  poolCategoryId String
  user           User         @relation(fields: [userId], references: [id])
  pool           Pool         @relation(fields: [poolId], references: [id], onDelete: Cascade)
  poolCategory   PoolCategory @relation(fields: [poolCategoryId], references: [id], onDelete: Cascade)
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  @@unique([userId, poolCategoryId])
  @@index([userId])
  @@index([poolId])
  @@index([poolCategoryId])
}

model Result {
  id             String       @id @default(cuid())
  value          String
  poolCategoryId String       @unique
  poolCategory   PoolCategory @relation(fields: [poolCategoryId], references: [id], onDelete: Cascade)
  enteredById    String
  enteredBy      User         @relation("ResultEnteredBy", fields: [enteredById], references: [id])
  createdAt      DateTime     @default(now())

  @@index([poolCategoryId])
}

model ScoringRule {
  id             String       @id @default(cuid())
  name           String
  condition      String
  points         Int
  sortOrder      Int          @default(0)
  poolId         String
  pool           Pool         @relation(fields: [poolId], references: [id], onDelete: Cascade)
  poolCategoryId String?
  poolCategory   PoolCategory? @relation(fields: [poolCategoryId], references: [id], onDelete: Cascade)

  @@index([poolId])
  @@index([poolCategoryId])
}
```

### Campos a ADICIONAR em PoolCategory

```prisma
// Adicionar a PoolCategory:
isLocked  Boolean   @default(false)
deadline  DateTime?
```

### Relations a adicionar em models existentes

```prisma
// User: adicionar
bets            Bet[]
enteredResults  Result[]  @relation("ResultEnteredBy")

// Pool: adicionar
bets         Bet[]
scoringRules ScoringRule[]

// PoolCategory: adicionar
bets         Bet[]
result       Result?
scoringRules ScoringRule[]
```

### Queries principais (Subtask F)

**Ranking:**
```typescript
const pool = await prisma.pool.findUnique({
  where: { id: poolId },
  include: {
    members: {
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { totalScore: "desc" },
    },
  },
})
```

**Palpites:**
```typescript
const categories = await prisma.poolCategory.findMany({
  where: { poolId, isActive: true },
  include: {
    productCategory: { select: { name: true, type: true, description: true } },
    bets: { where: { userId } },
  },
  orderBy: { productCategory: { sortOrder: "asc" } },
})
```

**Resultados:**
```typescript
const categories = await prisma.poolCategory.findMany({
  where: { poolId, isActive: true, result: { isNot: null } },
  include: {
    productCategory: { select: { name: true } },
    result: true,
    bets: { where: { userId } },
  },
})
```

---

## Dependencias Externas

Nenhuma nova. Tudo ja esta no projeto:
- Prisma (queries)
- next/navigation (notFound, redirect, useRouter)
- sonner (toast)
- lucide-react (icones)

---

## Arquivos — O Que Criar e Modificar

### Criar

| Arquivo | O que contem |
|---|---|
| `src/app/pool/[poolId]/page.tsx` | Server Component: auth → fetch pool + members + categories + bets + results → renderiza PoolPanelTabs com layout (DashboardTopBar + BottomNavBar). Subtask V: dados mockados. Subtask F: dados reais |
| `src/components/features/pool/PoolPanelTabs.tsx` | Client Component orquestrador: `useState` para tab ativa, renderiza TabBar + conteudo da tab selecionada. Recebe todos os dados como props |
| `src/components/features/pool/TabBar.tsx` | Client Component (C19): 3 tabs (Ranking, Palpites, Resultados), tab ativa com bg elevated + cor primary |
| `src/components/features/pool/UserPositionCard.tsx` | Server/Client Component (C20): posicao (pixel dourado), pontuacao (pixel verde), diff para lider |
| `src/components/features/pool/RankingList.tsx` | Component (C21): lista de participantes com posicao, nome, pontuacao. Highlight na linha do usuario |
| `src/components/features/pool/BetCategoryCards.tsx` | Client Component (C22): cards de categoria com borda colorida por status + progress bar. Tap navega para P08 (ou toast se trancada) |
| `src/components/features/pool/ResultComparisonCards.tsx` | Component (C23): resultado real vs palpite, pontuacao com cor acerto/erro. Empty state se sem resultados |

### Modificar

| Arquivo | O que mudar |
|---|---|
| `prisma/schema.prisma` | Adicionar models Bet, Result, ScoringRule. Adicionar campos isLocked/deadline em PoolCategory. Adicionar relations em User, Pool, PoolCategory |
| `src/types/pool.ts` | Adicionar interfaces: RankingMember, BetCategoryData, ResultComparisonData, PoolPanelData |

### NAO tocar

- `src/actions/pool.ts` — getUserPools e getRankPosition sao para o dashboard, nao para o painel. Queries do painel ficam no page.tsx (leitura direta) ou em actions novas se necessario
- `src/components/ui/*` — componentes base prontos
- `src/components/features/wizard/*` — wizard intacto
- `src/components/features/pool/SuccessScreen.tsx` — issue-06, intacto
- `src/components/features/invite/*` — issue-07, intacto
- `src/components/features/home/*` — issue-04, intacto
- `src/app/pool/[poolId]/created/*` — rota de sucesso intacta
- `src/app/pool/new/*` — wizard intacto
- `src/app/home/*` — dashboard intacto

---

## Decisoes desta Issue

### D01 — Tab state com useState (nao URL searchParams)

**Contexto:** Estado da tab ativa pode ficar em React state ou em `?tab=ranking` na URL.
**Decisao:** `useState` simples no PoolPanelTabs. Tab default = Ranking.
**Alternativas descartadas:** URL searchParams — adiciona complexidade (shallow routing, history entries) sem beneficio claro no MVP. Se o usuario compartilhar link, sempre abre na tab Ranking (comportamento previsivel).

### D02 — Dados carregados upfront no Server Component (nao lazy por tab)

**Contexto:** Podemos carregar todos os dados no Server Component e passar como props, ou lazy-load cada tab quando clicada (com Server Actions ou fetch).
**Decisao:** Carregar tudo no page.tsx (Server Component) e passar para PoolPanelTabs. Simplifica a implementacao e evita loading states por tab.
**Alternativas descartadas:** Lazy loading por tab — adiciona complexidade (Suspense boundaries, loading per tab, race conditions) sem beneficio real para o volume de dados esperado (dezenas de membros/categorias, nao milhares).

### D03 — Ranking calculado no servidor com posicoes de empate

**Contexto:** Empates precisam resultar na mesma posicao (ex: 2 com 15pts = ambos 1o, proximo = 3o).
**Decisao:** Calcular rank no Server Component iterando members ordenados por totalScore DESC. Se score == anterior, mesma posicao. Logica simples, sem necessidade de window functions SQL.
**Alternativas descartadas:** `ROW_NUMBER` / `DENSE_RANK` no SQL — SQLite nao tem suporte nativo robusto, e a logica em JS e trivial para o volume.

### D04 — Schema Bet/Result/ScoringRule adicionados nesta issue

**Contexto:** Esses modelos nao existem no schema atual mas sao necessarios para Subtask F. Poderiam ser issue separada.
**Decisao:** Adicionar como parte desta issue. Subtask V nao depende deles (dados mockados), mas Subtask F sim. Manter tudo junto evita issue de "schema only" sem UI.
**Alternativas descartadas:** Issue separada so para schema — overhead de processo sem ganho; os modelos so fazem sentido quando consumidos pela UI.

### D05 — PoolPanelTabs como Client Component orquestrador

**Contexto:** Precisa de useState para tab ativa e onClick handlers para navegacao. Server Components nao suportam interatividade.
**Decisao:** page.tsx (Server Component) faz todo o fetch e passa dados via props para PoolPanelTabs (Client Component). PoolPanelTabs gerencia tab state e renderiza os sub-componentes.
**Alternativas descartadas:** Cada tab como Server Component com Suspense — possivel mas over-engineered para MVP. A arquitetura "fetch no server, render no client" e o pattern mais simples e ja usado no projeto.
