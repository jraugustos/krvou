# Plan — issue-06: Bolao Criado + Sucesso (P05)

> Subtasks: V (visual) + F (funcional)
> Depende de: issue-05 (wizard cria o bolao e redireciona para `/pool/[poolId]/created`)
> Paralelo com: issue-07 (convite)

---

## Contexto

Apos o wizard de criacao (issue-05), o `createPoolAction` redireciona para `/pool/[poolId]/created`. Esta pagina e a tela celebratoria de sucesso com o link de convite para compartilhar.

**Redirect atual (src/actions/wizard.ts:107):**
```typescript
redirect(`/pool/${pool.id}/created`);
```

**Dados disponiveis no Pool:**
- `id`, `name`, `inviteCode` (8-char hex, unico), `creatorId`, `productId`, `status`

---

## Subtask V — Interface da tela de sucesso

**Tipo:** visual
**Arquivos a criar:**

### 1. Rota: `src/app/pool/[poolId]/created/page.tsx`

Server Component que:
- Recebe `poolId` via `params`
- Busca Pool no banco (id, name, inviteCode)
- Verifica sessao via `auth()` — redireciona para `/auth` se nao logado
- Verifica que o usuario e o criador (creatorId === session.user.id) — redireciona para `/home` se nao for
- Passa dados para o componente client

```typescript
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { PoolCreatedSuccess } from "@/components/features/pool/PoolCreatedSuccess";

export default async function PoolCreatedPage({
  params,
}: {
  params: Promise<{ poolId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth");

  const { poolId } = await params;
  const pool = await prisma.pool.findUnique({
    where: { id: poolId },
    select: { id: true, name: true, inviteCode: true, creatorId: true },
  });

  if (!pool) notFound();
  if (pool.creatorId !== session.user.id) redirect("/home");

  return <PoolCreatedSuccess poolId={pool.id} poolName={pool.name} inviteCode={pool.inviteCode} />;
}
```

### 2. Componente: `src/components/features/pool/PoolCreatedSuccess.tsx`

Client Component (`"use client"`) — componente C17 da spec.

**Layout (mobile-first, centralizado vertical):**

```
+------------------------------------------+
|              [DashboardTopBar]            |
+------------------------------------------+
|                                          |
|           BOLAO CRIADO!                  |  <- font-pixel, text-primary, shadow-glow-primary
|                                          |
|         "Nome do Bolao"                  |  <- font-heading, text-secondary, text-xl
|                                          |
|  +------------------------------------+  |
|  |  Compartilhe o link com os seus    |  |  <- font-sans, text-on-surface-variant
|  |  amigos para eles entrarem:        |  |
|  |                                    |  |
|  |  [krvou.app/join/a1b2c3d4]        |  |  <- font-mono, bg-surface-lowest, p-3
|  |                                    |  |
|  |  [ COPIAR LINK ]                  |  |  <- Button default (primary arcade)
|  +------------------------------------+  |  <- bg-surface-container, border-2 border-outline-variant
|                                          |
|  [ Ir para o painel do bolao ]           |  <- Button outline
|                                          |
+------------------------------------------+
|              [BottomNavBar]              |
+------------------------------------------+
```

**Props:**
```typescript
interface PoolCreatedSuccessProps {
  poolId: string;
  poolName: string;
  inviteCode: string;
}
```

**Elementos visuais:**
- Titulo "BOLAO CRIADO!" em `font-pixel` com `text-primary` (#39ff14) e `shadow-glow-primary` (neon green glow)
- Nome do bolao em `font-heading` (Space Grotesk), `text-secondary` (#fffeac)
- Card com link de convite:
  - Background `bg-surface-container` (#2c1245)
  - Border `border-2 border-outline-variant` com 20% opacidade
  - Texto explicativo em `font-sans`, `text-on-surface-variant`
  - Link em fonte monospace, `bg-surface-lowest`, padding, texto selecionavel
  - Botao "COPIAR LINK" — `Button` variant `default` (arcade, primary)
- Botao "Ir para o painel do bolao" — `Button` variant `outline`, full width
- Usar `DashboardTopBar` no topo
- Usar `BottomNavBar` no rodape (mobile)

**Responsividade:**
- Mobile: padding `p-5`, flex-col centralizado, max-width full
- Desktop: `max-w-md mx-auto`, mais breathing room

### Criterio de aceitacao (V)

- [ ] Pagina renderiza na rota `/pool/[poolId]/created`
- [ ] Texto "BOLAO CRIADO!" com glow neon green e font-pixel
- [ ] Nome do bolao exibido
- [ ] Link de convite em fonte monospace dentro de card
- [ ] Botao "COPIAR LINK" presente e estilizado arcade
- [ ] Botao "Ir para o painel do bolao" presente e estilizado outline
- [ ] Layout centralizado e responsivo (mobile-first)
- [ ] TopBar e BottomNavBar presentes
- [ ] Rota protegida (redireciona se nao logado)
- [ ] So o criador pode ver a pagina (redireciona se nao for criador)

---

## Subtask F — Copiar link e navegacao

**Tipo:** funcional
**Depende de:** Subtask V desta issue

### 1. URL do convite

A URL de convite sera construida client-side:
```typescript
const inviteUrl = `${window.location.origin}/join/${inviteCode}`;
```

O link sera exibido no card em texto monospace e tambem usado para copiar.

### 2. Copiar link (B19)

**Caminho feliz:**
1. Usuario clica "COPIAR LINK"
2. `navigator.clipboard.writeText(inviteUrl)` copia a URL
3. `toast.success("Link copiado!")` exibe feedback
4. Texto do botao muda para "Copiado!" por 2 segundos, depois volta ao original

**Implementacao:**
```typescript
const [copied, setCopied] = useState(false);

async function handleCopy() {
  try {
    await navigator.clipboard.writeText(inviteUrl);
    toast.success("Link copiado!");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch {
    // Fallback: seleciona o texto do input para copia manual
    inputRef.current?.select();
    toast.info("Selecione e copie o link manualmente");
  }
}
```

**Fallback (Clipboard API indisponivel):**
- O link esta num `<input readOnly>` — `inputRef.current?.select()` seleciona o texto
- Toast info com instrucao manual

### 3. Navegacao para painel admin (B20)

**Botao "Ir para o painel do bolao":**
```typescript
<Link href={`/pool/${poolId}/admin`}>
  <Button variant="outline" className="w-full">
    Ir para o painel do bolao
  </Button>
</Link>
```

> Nota: a rota `/pool/[poolId]/admin` sera criada na issue-10. Por enquanto, o link vai redirecionar para 404. Isso e aceitavel — a issue-06 depende apenas da issue-05, nao da issue-10.

### Criterio de aceitacao (F)

- [ ] Link de convite exibe URL real com inviteCode (usando `window.location.origin`)
- [ ] Copiar funciona via Clipboard API
- [ ] Toast "Link copiado!" aparece apos copiar
- [ ] Texto do botao muda para "Copiado!" por 2s
- [ ] Fallback funciona sem Clipboard API (seleciona texto do input)
- [ ] Botao "Ir para o painel" navega para `/pool/[poolId]/admin`

---

## Arquivos a criar/modificar

| Acao | Arquivo | Descricao |
|------|---------|-----------|
| Criar | `src/app/pool/[poolId]/created/page.tsx` | Server Component — rota da pagina |
| Criar | `src/components/features/pool/PoolCreatedSuccess.tsx` | Client Component — C17 (tela de sucesso) |

**Nenhuma alteracao em:**
- Prisma schema (Pool ja tem inviteCode)
- Actions (createPoolAction ja redireciona para a rota correta)
- Componentes existentes

---

## Dependencias e imports

```
@/lib/auth          -> auth()
@/lib/prisma        -> prisma
@/components/ui/button -> Button
sonner              -> toast
next/link           -> Link
next/navigation     -> redirect, notFound
@/components/layouts/DashboardTopBar -> DashboardTopBar
@/components/layouts/BottomNavBar    -> BottomNavBar
```

---

## Estimativa

- **Subtask V:** ~30min (1 pagina server + 1 componente client, sem logica complexa)
- **Subtask F:** ~15min (clipboard API + toast + navegacao)
- **Total:** ~45min

## Ordem de execucao

1. Criar `src/app/pool/[poolId]/created/page.tsx` (server component com auth + fetch)
2. Criar `src/components/features/pool/PoolCreatedSuccess.tsx` (client component com UI completa)
3. Implementar copy-to-clipboard com fallback
4. Testar fluxo completo: wizard -> criacao -> redirect -> pagina de sucesso -> copiar link
