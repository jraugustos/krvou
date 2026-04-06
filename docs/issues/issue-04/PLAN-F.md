# Plan — issue-04: Home / Dashboard (P03) — Subtask F

> Issue: issue-04 Subtask F em docs/ISSUES.md (linhas 215-244)
> Data: 2026-04-05
> Depende de: Subtask V desta issue (concluida)

## Resumo

Conectar o dashboard `/home` a dados reais — criar models Pool e PoolMember no Prisma, server action para listar boloes do usuario, navegacao contextual por role (admin vs participante) e status (aberto/andamento/encerrado), e garantir protecao de rota.

## Pesquisa Interna

### Design System (verificacao obrigatoria)

Nenhum componente visual novo nesta subtask. Componentes visuais ja criados na Subtask V serao reutilizados:
- `PoolCard` — recebe props e renderiza card (precisa de nova prop `href` para navegacao contextual)
- `EmptyState` — ja funcional
- `DashboardTopBar` — ja funcional (async, chama `auth()`)
- `BottomNavBar` — ja funcional (`usePathname`)

### Componentes reutilizaveis encontrados

- `src/components/features/home/PoolCard.tsx` — reutilizar, adicionar prop `href` para link contextual por role/status
- `src/components/features/home/EmptyState.tsx` — reutilizar sem alteracao
- `src/components/layouts/DashboardTopBar.tsx` — reutilizar sem alteracao
- `src/components/layouts/BottomNavBar.tsx` — reutilizar sem alteracao
- `src/lib/prisma.ts` — singleton PrismaClient com better-sqlite3 adapter
- `src/lib/auth.ts` — `auth()` para obter sessao (NextAuth v5, JWT strategy)

### Patterns do projeto

- **Server Actions:** `"use server"` + Zod validation + Prisma queries (pattern de `src/actions/auth.ts`)
- **Auth em Server Components:** `const session = await auth()` — DashboardTopBar ja faz isso
- **Tipos:** Zod schemas em `src/types/` + `z.infer<>` para tipos derivados (pattern de `src/types/auth.ts`)
- **Testes:** Vitest com `vi.mock()` para prisma/auth/bcryptjs (pattern de `tests/unit/auth-actions.test.ts`)
- **Proxy (middleware):** `src/proxy.ts` ja protege todas as rotas exceto `/`, `/auth` e `/api/auth/*` — `/home` ja esta protegida
- **Prisma output:** `src/generated/prisma` (configurado no schema)

### Nada encontrado (precisa criar)

| Item | Motivo |
|---|---|
| Model `Pool` em schema.prisma | Nao existe — apenas User e Account atualmente |
| Model `PoolMember` em schema.prisma | Nao existe — relacao usuario↔bolao |
| `src/actions/pool.ts` | Server action para fetch de pools do usuario |
| `src/types/pool.ts` | Tipos e schemas para Pool/PoolMember |
| `tests/unit/pool-actions.test.ts` | Testes da action getUserPools |

## Pesquisa Externa

### Next.js 16 — Data Fetching em Server Components

**Pattern confirmado:** Server Components podem chamar Prisma diretamente ou via server actions. Para leitura de dados na renderizacao, query direta no component e mais simples que server action (actions sao para mutacoes). Porem, como o projeto ja usa o pattern de actions para encapsular logica, manter consistencia com uma funcao de query separada.

**Decisao:** Usar funcao de query em `src/actions/pool.ts` (nao e uma "action" de mutacao, mas agrupa logica de dados do dominio Pool). A home page chama essa funcao diretamente como `async` Server Component.

### Auth.js v5 — Sessao em Server Components

Pattern ja validado na Subtask V:
```typescript
const session = await auth()
// session.user.id disponivel via callback jwt/session em src/lib/auth.ts
```

### Prisma 7 — SQLite com better-sqlite3

**Schema atual:** User + Account apenas. Precisa de migration para Pool + PoolMember.

**SQLite gotcha:** Enums nao existem nativamente em SQLite. Prisma mapeia como String. Usar `@default()` com o valor string.

### Documentacao consultada

- `node_modules/next/dist/docs/` — Server Components async, data fetching patterns
- `src/proxy.ts` — confirmado que `/home` ja e protegida (redireciona para `/auth` se sem sessao)
- `src/lib/auth.ts` — session shape com `user.id` adicionado via callbacks

## Cenarios

### Caminho feliz (B09)

1. Usuario logado acessa `/home`
2. Proxy valida sessao (ja implementado)
3. Page.tsx (async Server Component) chama `auth()` para obter `userId`
4. Chama `getUserPools(userId)` — query PoolMember WHERE userId, JOIN Pool, ORDER BY updatedAt DESC
5. Para cada pool, calcula:
   - `href` contextual: `/pool/[id]/admin` (se admin) ou `/pool/[id]` (se participante/encerrado)
   - `contextInfo` por status (ver secao Dados abaixo)
6. Renderiza PoolCards com dados reais
7. Click em card navega para href contextual

### Edge cases

- **Sem boloes (B10):** `getUserPools` retorna array vazio → EmptyState renderiza com CTAs
- **Pool encerrada:** href = `/pool/[id]` (mesmo para admin — P10 e layout unico), opacity-60 ja tratado no PoolCard
- **"Criar Bolao" (B08):** Link ja aponta para `/pool/new?step=1` (implementado na Subtask V)
- **"Tenho um convite":** Nao implementar input modal nesta issue — manter `href="#"` como placeholder (escopo de issue futura)
- **BottomNav sem auth (B03):** Proxy ja redireciona para `/auth` — nenhuma mudanca necessaria

### Erros

- Sessao expirada → proxy redireciona para `/auth` (ja tratado)
- Erro Prisma na query → deixar o error boundary do Next.js tratar (error.tsx se existir) ou exibir `ErrorState`
- User sem `id` na sessao → retornar array vazio (defensivo)

## Banco de Dados

### Schema necessario

```prisma
model Pool {
  id          String   @id @default(cuid())
  name        String
  description String?
  status      String   @default("open") // "open" | "in_progress" | "finished"
  inviteCode  String   @unique @default(cuid())
  creatorId   String
  creator     User     @relation("PoolCreator", fields: [creatorId], references: [id])
  members     PoolMember[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model PoolMember {
  id         String   @id @default(cuid())
  role       String   @default("participant") // "admin" | "participant"
  totalScore Int      @default(0)
  userId     String
  poolId     String
  user       User     @relation(fields: [userId], references: [id])
  pool       Pool     @relation(fields: [poolId], references: [id], onDelete: Cascade)
  joinedAt   DateTime @default(now())

  @@unique([userId, poolId])
  @@index([userId])
  @@index([poolId])
}
```

**Nota sobre SQLite:** Enums nao sao suportados nativamente. Usar `String` com valores convencionados e validacao via Zod nos tipos TypeScript.

**Relacoes no User (adicionar):**
```prisma
model User {
  // ... campos existentes ...
  createdPools Pool[]       @relation("PoolCreator")
  memberships  PoolMember[]
}
```

### Tabelas envolvidas

- `Pool` — READ (listar boloes)
- `PoolMember` — READ (relacao usuario↔bolao, role, score)
- `User` — READ (sessao para obter userId)

### Migration

```bash
npx prisma migrate dev --name add_pool_and_pool_member
```

## Dados — Calculo de contextInfo

### Por status do Pool

| Status | contextInfo | Calculo |
|---|---|---|
| `open` | "Palpites pendentes: X categorias" | **Problema:** BetCategory ainda nao existe (issue-05). Simplificar para "Aguardando inicio" nesta issue. Quando BetCategory existir, atualizar para contagem real |
| `in_progress` | "Sua posicao: Xo — Y pts" | Ordenar PoolMembers por `totalScore` DESC, encontrar posicao do usuario. `totalScore` inicia em 0, sera atualizado quando scoring existir |
| `finished` | "Resultado final: Xo lugar" ou "Campeao!" | Mesma logica de ranking. Se posicao == 1, "Campeao!" |

### Funcao de calculo

```typescript
function getContextInfo(
  status: string,
  role: string,
  totalScore: number,
  rankPosition: number
): string {
  switch (status) {
    case "open":
      return "Aguardando inicio";
    case "in_progress":
      return `Sua posicao: ${rankPosition}o — ${totalScore} pts`;
    case "finished":
      return rankPosition === 1
        ? "Resultado final: Campeao!"
        : `Resultado final: ${rankPosition}o lugar`;
    default:
      return "";
  }
}
```

### Calculo de ranking (posicao)

Query todos os PoolMembers do pool, ordena por `totalScore` DESC, encontra indice do usuario + 1. Fazer isso em uma unica query com subconsulta ou no JS apos fetch.

**Abordagem pragmatica:** Como `totalScore` comeca em 0 para todos, o ranking inicial mostrara empate (posicao 1 para todos). Isso e aceitavel ate que o scoring system exista (issue futura).

## Dependencias Externas

Nenhuma nova. Tudo ja instalado:
- `@prisma/client` + `prisma` — ORM
- `next-auth` — autenticacao
- `zod` — validacao de tipos

## Arquivos — O Que Criar e Modificar

### Criar

| Arquivo | O que contem |
|---|---|
| `src/types/pool.ts` | Tipos TypeScript: `PoolStatus` (union type), `PoolMemberRole` (union type), `PoolCardData` (interface para dados passados ao PoolCard), Zod schemas correspondentes |
| `src/actions/pool.ts` | Funcao `getUserPools(userId: string): Promise<PoolCardData[]>` — query PoolMember→Pool com calculo de contextInfo e href contextual |
| `tests/unit/pool-actions.test.ts` | Testes unitarios: getUserPools retorna pools do usuario, calcula contextInfo por status, calcula ranking, retorna vazio se sem pools, href contextual por role/status |

### Modificar

| Arquivo | O que mudar |
|---|---|
| `prisma/schema.prisma` | Adicionar models Pool e PoolMember + relacoes no User existente |
| `src/app/home/page.tsx` | Tornar `async`, remover MOCK_POOLS, chamar `auth()` + `getUserPools()`, passar dados reais aos PoolCards |
| `src/components/features/home/PoolCard.tsx` | Adicionar prop `href` opcional (default `/pool/${id}`). Usar `href` no Link em vez de path hardcoded |

### NAO tocar

Tudo que nao esta listado acima. Especialmente:
- `src/components/features/home/EmptyState.tsx` — ja funcional
- `src/components/layouts/DashboardTopBar.tsx` — ja funcional
- `src/components/layouts/BottomNavBar.tsx` — ja funcional
- `src/components/ui/*` — componentes base ja prontos
- `src/lib/auth.ts` — setup de auth ja funcional
- `src/lib/prisma.ts` — singleton ja funcional
- `src/proxy.ts` — protecao de rotas ja funcional
- `src/actions/auth.ts` — actions de auth ja prontas
- `src/app/globals.css` — tokens ja definidos

## Decisoes desta Issue

### D01 — String em vez de Enum para status/role no Prisma (SQLite)

**Contexto:** SQLite nao suporta enums nativamente. Prisma mapeia `enum` como String no SQLite, mas gera warnings.
**Decisao:** Usar `String` com `@default("open")` / `@default("participant")` no schema. Validacao de valores via Zod union types em `src/types/pool.ts`.
**Alternativas descartadas:** Usar `enum` do Prisma — funciona mas gera inconsistencia conceitual com SQLite. Tabela lookup separada — over-engineering para 2-3 valores fixos.

### D02 — contextInfo simplificado para pools "open" (sem BetCategory)

**Contexto:** A spec diz "Palpites pendentes: X categorias", mas BetCategory sera criado apenas na issue-05 (wizard). Nao faz sentido criar o model agora so para contagem.
**Decisao:** Pools com status "open" mostram "Aguardando inicio" nesta issue. Quando BetCategory existir (issue-05+), atualizar `getContextInfo` para mostrar contagem real de categorias pendentes.
**Alternativas descartadas:** Criar BetCategory antecipadamente — violaria escopo da issue e criaria model sem uso real.

### D03 — Query direta no Server Component via funcao (nao server action)

**Contexto:** `getUserPools` e uma leitura de dados, nao uma mutacao. Server actions (`"use server"`) sao projetadas para mutacoes com `useFormState`/`useActionState`.
**Decisao:** Criar `getUserPools` em `src/actions/pool.ts` como funcao `"use server"` mesmo assim, para manter consistencia com o agrupamento de logica de dominio em `src/actions/`. A page chama diretamente como funcao async.
**Alternativas descartadas:** Criar em `src/lib/pool.ts` — quebraria o pattern de dominio em actions. Fazer query inline no page.tsx — misturaria logica de dados com apresentacao.

### D04 — Prop `href` no PoolCard para navegacao contextual

**Contexto:** B09 requer navegacao diferente por role (admin→`/pool/[id]/admin`, participante→`/pool/[id]`). Atualmente PoolCard tem href hardcoded como `/pool/${id}`.
**Decisao:** Adicionar prop `href` ao PoolCard. O calculo do href acontece em `getUserPools` (server-side), nao no componente. Mantem PoolCard como componente puro de apresentacao.
**Alternativas descartadas:** Calcular href dentro do PoolCard (precisaria de prop `role` + logica) — polui componente visual com logica de negocio. Usar onClick com router.push — transformaria em Client Component desnecessariamente.

### D05 — Ranking position calculado em JS (nao SQL)

**Contexto:** Para contextInfo de pools "in_progress" e "finished", precisamos da posicao do usuario no ranking.
**Decisao:** Na query, incluir todos os members do pool com totalScore. Calcular posicao em JS (sort + findIndex). Simples e performante para o tamanho esperado de pools (< 100 membros).
**Alternativas descartadas:** Window function SQL — SQLite suporta mas Prisma nao expoe facilmente. Raw query — complexidade desnecessaria para dados pequenos.
