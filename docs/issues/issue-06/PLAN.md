# Plan — issue-06: Bolao Criado + Sucesso (P05)

> Issue: issue-06 em docs/ISSUES.md
> Data: 2026-04-12

## Resumo

Implementar a tela de sucesso pós-criação do bolão em `/pool/[poolId]/created`. Server Component busca o Pool pelo ID e passa dados para o SuccessScreen (C17) — Client Component que exibe texto celebratório, link de convite copiável e botão de navegação para o painel admin.

---

## Pesquisa Interna

### Design System (verificação obrigatória)

- **Glow/celebração:** `shadow-glow-primary` para o título "BOLAO CRIADO!" (nunca rgba hardcoded)
- **Tipografia título:** `font-pixel text-primary` (Press Start 2P, neon green)
- **Card do link:** `bg-surface-container border-2 border-outline-variant`
- **Link monospace:** `font-mono` (Inter não tem mono — usar `font-mono` do Tailwind, que usa system monospace)
- **CTA principal:** Button variante `default` (bg-primary, shadow-arcade-primary, press effect)
- **CTA secundário:** Button variante `outline` (borda outline-variant, fundo transparente)
- **Toast sucesso:** `toast.success("Link copiado!")` — borda verde (primary)
- **Padding mobile:** `p-5`, gaps `gap-4` / `gap-6`
- **Border-radius:** `0px` em tudo (já no CSS global)

### Componentes ui/ a reutilizar

| Componente | Path | Uso |
|---|---|---|
| `Button` | `src/components/ui/button.tsx` | "Copiar link" (default) e "Ir para o painel" (outline) |
| Toaster | `src/components/ui/sonner.tsx` | `toast.success("Link copiado!")` — já montado no layout global |

### Componentes de layout a reutilizar

| Componente | Path | Uso |
|---|---|---|
| `DashboardTopBar` | `src/components/layouts/DashboardTopBar.tsx` | Header padrão das páginas autenticadas |
| `BottomNavBar` | `src/components/layouts/BottomNavBar.tsx` | Nav bar padrão das páginas autenticadas |

### Hooks existentes

Nenhum em `src/hooks/`. Lógica de clipboard vai inline no SuccessScreen (3 linhas, não justifica hook).

### Patterns do projeto

- **Auth em Server Component:** `const session = await auth()` — se não autenticado, redireciona (pattern de `src/app/home/page.tsx` e `src/actions/wizard.ts`)
- **Fetch direto no page.tsx:** `prisma.pool.findUnique()` — sem Server Action intermediária para leitura (pattern de `src/app/pool/new/page.tsx`)
- **`params` é Promise no Next.js 16:** `const { poolId } = await params` — breaking change confirmado em `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md`
- **Toast:** `import { toast } from "sonner"` — sem hook customizado
- **Client Component com `useRouter`:** `import { useRouter } from "next/navigation"` para navegação programática
- **`notFound()`:** Para pool inexistente — aciona o 404 padrão do Next.js (sem not-found.tsx próprio no projeto)

### Nada encontrado (precisa criar)

- `src/app/pool/[poolId]/created/page.tsx` — rota não existe
- `src/components/features/pool/SuccessScreen.tsx` — componente não existe

---

## Pesquisa Externa

### Next.js 16 — `params` como Promise em Server Components

Confirmado em `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md`:

```typescript
export default async function Page({
  params,
}: {
  params: Promise<{ poolId: string }>
}) {
  const { poolId } = await params
}
```

### Next.js — `headers()` para construir URL de convite no servidor

`headers()` retorna uma Promise em App Router — precisa de `await`:

```typescript
import { headers } from "next/headers"
const headersList = await headers()
const host = headersList.get("host") ?? "localhost:3000"
const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
const inviteUrl = `${protocol}://${host}/join/${pool.inviteCode}`
```

Isso evita o problema de hydration mismatch que ocorreria se tentássemos construir a URL no cliente com `window.location.origin` (valor só disponível após montagem).

### Clipboard API — fallback sem permissão

```typescript
async function copyToClipboard(text: string, inputRef: RefObject<HTMLInputElement>) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text)
  } else {
    inputRef.current?.select()  // fallback: seleciona o texto
  }
}
```

---

## Cenários

### Caminho feliz (B19 + B20)

1. `createPoolAction` redireciona para `/pool/[poolId]/created`
2. Server Component: `await params` → poolId
3. `auth()` → sessão válida
4. `prisma.pool.findUnique({ where: { id: poolId } })` → pool encontrado
5. `headers()` → constrói `inviteUrl = https://[host]/join/[inviteCode]`
6. Renderiza SuccessScreen com `{ poolName, inviteUrl, poolId }`
7. **B19 — Copiar link:** Usuário clica "Copiar link" → `navigator.clipboard.writeText(inviteUrl)` → `toast.success("Link copiado!")` → texto do botão muda para "Copiado!" → após 2s volta para "Copiar link"
8. **B20 — Ir para painel:** Usuário clica "Ir para o painel do bolão" → `router.push('/pool/[poolId]/admin')`

### Edge cases

- **Clipboard API indisponível:** `inputRef.current?.select()` (spec: "seleciona o texto do input")
- **Toast durante cooldown:** clique no botão desabilitado por 2s enquanto exibe "Copiado!" — botão fica `disabled`

### Erros

- **poolId inválido / pool não existe:** `notFound()` → 404 padrão do Next.js
- **Sessão expirada:** `redirect("/auth")` no Server Component
- **Prisma error:** catch → `notFound()` (sem dado para exibir, comportamento seguro)

---

## Banco de Dados

### Tabelas envolvidas

- `Pool` — READ only: `id`, `name`, `inviteCode`

### Consulta necessária

```typescript
const pool = await prisma.pool.findUnique({
  where: { id: poolId },
  select: { id: true, name: true, inviteCode: true },
})
if (!pool) notFound()
```

**Sem mudanças no schema** — Pool já tem `inviteCode: String @unique`.

---

## Dependências Externas

Nenhuma nova. Tudo já está no projeto:
- Prisma (fetch)
- next/navigation (notFound, redirect, useRouter)
- next/headers (headers)
- sonner (toast)

---

## Arquivos — O Que Criar e Modificar

### Criar

| Arquivo | O que contém |
|---|---|
| `src/app/pool/[poolId]/created/page.tsx` | Server Component: `await params` → `auth()` → `prisma.pool.findUnique` → `headers()` para inviteUrl → renderiza `<SuccessScreen>` com layout (DashboardTopBar + BottomNavBar) |
| `src/components/features/pool/SuccessScreen.tsx` | Client Component (C17): "BOLAO CRIADO!" em font-pixel com glow, nome do bolão, card com input monospace + botão "Copiar link" (clipboard + toast + estado "Copiado!"), botão outline "Ir para o painel do bolão" |

### Modificar

Nenhum arquivo existente precisa ser modificado.

### NÃO tocar

- `src/actions/wizard.ts` — createPoolAction já redireciona para a rota correta
- `src/components/ui/*` — componentes base prontos
- `prisma/schema.prisma` — sem mudanças
- `src/app/pool/new/*` — wizard intacto
- `src/app/home/*` — fora do escopo
- `src/components/features/wizard/*` — fora do escopo

---

## Decisões desta Issue

### D01 — URL de convite construída no Server Component via `headers()`

**Contexto:** A tela exibe a URL completa de convite (`https://host/join/[inviteCode]`). Essa URL pode ser construída no servidor (com `headers()`) ou no cliente (com `window.location.origin`).
**Decisão:** Construir no Server Component com `headers().get('host')` e passar como prop para SuccessScreen. Sem hydration mismatch.
**Alternativas descartadas:** `window.location.origin` no cliente — valor só disponível após montagem, causa flicker ou requer `useEffect` + estado inicial vazio, desnecessariamente complexo para MVP.

### D02 — Lógica de clipboard inline no SuccessScreen (sem hook)

**Contexto:** A operação de copiar é 3-4 linhas. Poderia ser extraída em `src/hooks/useCopyToClipboard.ts`.
**Decisão:** Clipboard logic inline em SuccessScreen. Sem abstração prematura — este é o único lugar no app que usa clipboard.
**Alternativas descartadas:** `useCopyToClipboard` hook — não justifica com um único uso; seguindo a regra do projeto: "Three similar lines of code is better than a premature abstraction."

### D03 — Sem Server Action para fetch do pool

**Contexto:** Precisamos buscar o Pool pelo ID para exibir nome e inviteCode.
**Decisão:** `prisma.pool.findUnique()` direto no Server Component page.tsx (sem Server Action intermediária para leitura). Mesmo pattern de `src/app/pool/new/page.tsx` que usa `prisma.product.findMany()` diretamente.
**Alternativas descartadas:** Server Action `getPoolByIdAction` — desnecessário; Server Actions são para mutações ou quando o Client precisa chamar o servidor após montagem.
