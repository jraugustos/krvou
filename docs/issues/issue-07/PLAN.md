# Plan — issue-07: Pagina de Convite (P06)

> Issue: issue-07 em docs/ISSUES.md
> Data: 2026-04-14

## Resumo

Implementar a página pública `/join/[inviteCode]` com o InviteCard (C18) que exibe os dados do bolão para visitantes não autenticados, e processa a entrada no bolão — criando o PoolMember — para usuários logados. Inclui o fluxo de auth intermediário: salvar inviteCode em cookie, redirecionar para `/auth`, e processar o convite automaticamente após login.

---

## Pesquisa Interna

### Design System (verificação obrigatória)

- **Tipografia título:** `font-pixel text-primary` (Press Start 2P, neon green) para "VOCE FOI CONVIDADO PARA"
- **Nome do bolão:** `font-heading` em tamanho grande, `text-on-surface` (Space Grotesk bold)
- **Card interno de categorias:** `bg-surface-container border-2 border-outline-variant`
- **Bullets dourados:** `text-secondary` (Electric Yellow `#fffeac`) — "bullets dourados" = bullets com cor secondary
- **CTA arcade:** Button variante `default` size `xl` com `shadow-arcade-primary` (4px offset neon green)
- **Texto secundário:** `text-on-surface-variant font-heading uppercase tracking-wide text-sm`
- **Nota rodapé:** `text-on-surface-variant text-xs`
- **Padding mobile:** `p-5`, gaps `gap-4` / `gap-6`
- **Border-radius:** `0px` global (CSS já configurado)
- **Shadow glow:** Não usar em elementos informativos — reservado para títulos hero e estados de foco
- **Separação:** tonal shifts (surface-lowest → surface-low → surface-container → surface-high)

### Componentes ui/ a reutilizar

| Componente | Path | Uso |
|---|---|---|
| `Button` | `src/components/ui/button.tsx` | CTA "ENTRAR NO BOLAO" (variante `default`, size `xl`) |
| `Toaster` | `src/components/ui/sonner.tsx` | `toast.warning("Voce ja participa desse bolao")` — já no layout global |
| `LoadingState` | `src/components/ui/loading-state.tsx` | Estado de loading durante o join (botão desabilitado + spinner) |

### Componentes de layout

Página pública e focada — sem `DashboardTopBar` nem `BottomNavBar`. Layout centrado fullscreen similar ao `/auth` (sem topbar). O `BottomNavBar` é mobile-only para usuários autenticados — não cabe aqui.

### Patterns do projeto

- **Rota pública com auth opcional:** `auth()` é chamado mas `redirect("/auth")` NÃO é disparado se sessão ausente — a presença de sessão apenas condiciona o comportamento do botão
- **`params` é Promise no Next.js 16:** `const { inviteCode } = await params` — breaking change (confirmado em issue-06/PLAN.md)
- **Fetch direto no page.tsx:** `prisma.pool.findUnique()` sem Server Action intermediária (pattern de leitura do projeto)
- **`notFound()`:** Para inviteCode inválido — sem `not-found.tsx` próprio no projeto
- **Server Actions:** Validação com Zod, `"use server"` no topo do arquivo, retorno tipado
- **Client Component com Server Actions:** importação direta da action no componente cliente
- **Toast:** `import { toast } from "sonner"` — sem hook customizado
- **`cookies()` em Server Action:** `import { cookies } from "next/headers"` — disponível em Server Actions (`"use server"`)
- **Auto-join no Server Component:** lógica inline no page.tsx (sem extrair função — única ocorrência no app)

### Nada encontrado (precisa criar)

- `src/app/join/[inviteCode]/page.tsx` — rota não existe
- `src/components/features/invite/InviteCard.tsx` — componente não existe
- `src/actions/invite.ts` — Server Actions para join e save-invite não existem
- `tests/unit/invite-page.test.ts` — não existe
- `tests/unit/invite-actions.test.ts` — não existe

### Modificar existente

- `src/actions/auth.ts` — adicionar leitura do cookie `pendingInvite` antes do `signIn` para redirecionar para `/join/[inviteCode]` após auth em vez de `/home`
- `src/types/pool.ts` — adicionar interface `InvitePageData`

---

## Pesquisa Externa

### Next.js 16 — `cookies()` em Server Actions e Server Components

Confirmado no pattern do projeto: `cookies()` de `next/headers` retorna uma Promise e precisa de `await`. Disponível em Server Actions e Server Components:

```typescript
import { cookies } from "next/headers"
const cookieStore = await cookies()
cookieStore.set("pendingInvite", inviteCode, { maxAge: 60 * 30, path: "/" })
cookieStore.delete("pendingInvite")
```

### NextAuth — `redirectTo` dinâmico em `signIn()`

O parâmetro `redirectTo` da função `signIn()` aceita string dinâmica. Em `src/actions/auth.ts`, podemos ler o cookie antes de chamar `signIn` e montar o redirect destino:

```typescript
const cookieStore = await cookies()
const pendingInvite = cookieStore.get("pendingInvite")?.value
const redirectTo = pendingInvite ? `/join/${pendingInvite}` : "/home"
// Limpar o cookie antes do signIn (o redirect faz o browser perder o contexto da action)
cookieStore.delete("pendingInvite")
await signIn("credentials", { ..., redirectTo })
```

---

## Cenários

### Caminho feliz — logado (B21)

1. Usuário logado acessa `/join/[inviteCode]`
2. Server Component: `await params` → inviteCode
3. `prisma.pool.findUnique({ where: { inviteCode } })` → pool encontrado
4. `auth()` → sessão válida
5. Sem cookie `pendingInvite` → não faz auto-join
6. Renderiza InviteCard com `isLoggedIn: true`
7. Usuário clica "ENTRAR NO BOLAO" → chama `joinPoolAction`
8. Server Action: verifica sessão → verifica se já membro → `prisma.poolMember.create(...)` → `redirect("/pool/[poolId]")`

### Caminho feliz — não logado (B21)

1. Usuário não logado acessa `/join/[inviteCode]`
2. Server Component: busca pool, `auth()` → sem sessão
3. Renderiza InviteCard com `isLoggedIn: false`
4. Usuário clica "ENTRAR NO BOLAO" → chama `saveInviteAndRedirectAction(inviteCode)`
5. Server Action: `cookies().set("pendingInvite", inviteCode)` → `redirect("/auth")`
6. Usuário faz login/signup
7. `loginAction`/`signupAction`: lê cookie `pendingInvite`, deleta o cookie, `redirectTo = "/join/[inviteCode]"`
8. Usuário é redirecionado de volta para `/join/[inviteCode]`, agora logado
9. Server Component detecta: sessão válida + `pendingInvite === inviteCode` → auto-join inline + `redirect("/pool/[poolId]")`

### Edge cases

- **Já é membro:** `joinPoolAction` → `prisma.poolMember.findUnique({ where: { userId_poolId: {...} } })` → existe → `toast.warning("Voce ja participa desse bolao")` + `redirect("/pool/[poolId]")`
- **Bolão fechado (status !== "open"):** InviteCard renderiza botão `disabled` com texto "Este bolao nao aceita mais participantes" — condição passada via prop `isOpen`
- **inviteCode inválido:** `prisma.pool.findUnique` retorna `null` → `notFound()`
- **Auto-join com unique constraint (race condition):** `try/catch` no auto-join — se `create` falha por constraint, redireciona para `/pool/[poolId]` normalmente (o membro já existe)
- **Cookie `pendingInvite` expirado ou inválido:** `cookieStore.get("pendingInvite")` retorna `undefined` → fluxo normal de logado (sem auto-join)

### Erros

- **Prisma error no join:** `catch` → retorna `{ error: "Erro ao entrar no bolao. Tente novamente." }` — sem redirect
- **Sessão não encontrada no `joinPoolAction`:** `redirect("/auth")` (ação chamada sem sessão válida)
- **Prisma error no fetch da página:** `catch` → `notFound()`

---

## Banco de Dados

### Tabelas envolvidas

- `Pool` — READ: buscar por `inviteCode`, incluir `creator`, `members`, `categories`
- `PoolMember` — READ (verificar existing) + CREATE (entrar no bolão)
- `PoolCategory` + `ProductCategory` — READ: listar categorias do bolão para exibir no card

### Consultas necessárias

```typescript
// Fetch pool for invite page
const pool = await prisma.pool.findUnique({
  where: { inviteCode },
  select: {
    id: true,
    name: true,
    status: true,
    creator: { select: { name: true } },
    _count: { select: { members: true } },
    categories: {
      where: { isActive: true },
      select: {
        customName: true,
        isCustom: true,
        productCategory: { select: { name: true } },
      },
      orderBy: { createdAt: "asc" },
    },
  },
})
```

```typescript
// Check existing membership + create
const existing = await prisma.poolMember.findUnique({
  where: { userId_poolId: { userId, poolId } },
})
if (existing) { /* toast + redirect */ }

await prisma.poolMember.create({
  data: { userId, poolId, role: "participant" },
})
```

### Sem mudanças no schema

`PoolMember` já tem `@@unique([userId, poolId])` e `role: String @default("participant")`. Nenhuma migration necessária.

---

## Dependências Externas

Nenhuma nova. Tudo já está no projeto:
- Prisma (fetch + create)
- next/navigation (`notFound`, `redirect`)
- next/headers (`cookies`)
- sonner (`toast`)
- zod (validação na action)

---

## Arquivos — O Que Criar e Modificar

### Criar

| Arquivo | O que contém |
|---|---|
| `src/app/join/[inviteCode]/page.tsx` | Server Component público: `await params` → busca pool por inviteCode → `auth()` (sem redirect) → detecta auto-join via cookie → renderiza InviteCard com `{ poolData, isLoggedIn, isOpen }` |
| `src/components/features/invite/InviteCard.tsx` | Client Component (C18): "VOCE FOI CONVIDADO PARA" (font-pixel), nome bolão (font-heading grande), criador + contador participantes, card interno com categorias (bullets `text-secondary`), CTA "ENTRAR NO BOLAO" (Button default xl), nota rodapé sobre conta obrigatória. Chama `joinPoolAction` se logado, `saveInviteAndRedirectAction` se não logado |
| `src/actions/invite.ts` | Server Actions: `joinPoolAction` (verifica sessão + já-membro + cria PoolMember + redirect) e `saveInviteAndRedirectAction` (seta cookie + redirect /auth) |
| `tests/unit/invite-page.test.ts` | Testes unitários do page.tsx: inviteCode inválido → notFound, auto-join com cookie válido → redirect pool, render sem cookie → sem auto-join |
| `tests/unit/invite-actions.test.ts` | Testes unitários do joinPoolAction: sem sessão → redirect /auth, já membro → toast warning + redirect, bolão fechado → retorna erro, happy path → cria PoolMember + redirect |

### Modificar

| Arquivo | O que mudar |
|---|---|
| `src/actions/auth.ts` | Em `loginAction` e `signupAction`: ler cookie `pendingInvite` antes de `signIn`, construir `redirectTo` dinâmico (`/join/[inviteCode]` ou `/home`), deletar o cookie |
| `src/types/pool.ts` | Adicionar interface `InvitePageData` com os campos que o page.tsx passa para InviteCard |

### NÃO tocar

- `src/components/ui/*` — componentes base prontos
- `src/components/layouts/*` — não usados na página de convite
- `prisma/schema.prisma` — sem mudanças de schema
- `src/app/pool/*` — fora do escopo
- `src/app/home/*` — fora do escopo
- `src/components/features/wizard/*` — fora do escopo
- `src/components/features/pool/*` — fora do escopo
- `src/actions/pool.ts` e `src/actions/wizard.ts` — fora do escopo

---

## Decisões desta Issue

### D01 — Página pública sem auth guard, `auth()` apenas para condicionar comportamento

**Contexto:** `/join/[inviteCode]` precisa ser acessível sem login. O botão "ENTRAR NO BOLAO" tem comportamento diferente para logados e não-logados.
**Decisão:** `auth()` é chamado no Server Component para obter a sessão, mas sem `redirect("/auth")`. O resultado é passado como prop `isLoggedIn` para o InviteCard.
**Alternativas descartadas:** Middleware de auth com exceção para `/join/*` — mais complexo e desnecessário já que o projeto não tem middleware customizado.

### D02 — Auto-join inline no Server Component (sem Server Action separada)

**Contexto:** O auto-join pós-auth (fluxo não logado) precisa acontecer no render da página quando detectado o cookie. Poderia ser extraído para uma Server Action reutilizável.
**Decisão:** Lógica de auto-join inline no `page.tsx` — é uma unique occurrence no app, não justifica abstração. A lógica é: verifica cookie, deleta cookie, `prisma.poolMember.create`, `redirect`.
**Alternativas descartadas:** `autoJoinAction` separada chamada do Server Component — Server Actions são para clients; no Server Component, a chamada direta ao prisma é mais idiomática.

### D03 — Cookie `pendingInvite` deletado antes do `signIn` nas auth actions

**Contexto:** O cookie precisa ser deletado após ser consumido. Poderia ser deletado no page.tsx após auto-join ou nas auth actions antes do redirect.
**Decisão:** Deletado em dois lugares: nas auth actions (antes do `signIn`) E no page.tsx (após auto-join). Deletar nas auth actions evita que o cookie persista se o usuário fechar a aba antes de completar o fluxo. Deletar no page.tsx garante limpeza mesmo se as auth actions não chegaram a deletar.
**Alternativas descartadas:** Deletar apenas no page.tsx — risco de cookie orphan se o fluxo for interrompido.

### D04 — Status "não aceita participantes" = qualquer status !== "open"

**Contexto:** A spec menciona "bolao fechado (status closed)" mas o schema tem `open / in_progress / finished`. Não há status `closed` no banco.
**Decisão:** `isOpen = pool.status === "open"`. Bolões `in_progress` e `finished` não aceitam novos membros.
**Alternativas descartadas:** Permitir join em `in_progress` — a spec não menciona isso e adiciona complexidade de lógica de negócio fora do escopo desta issue.
