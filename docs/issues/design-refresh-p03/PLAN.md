# Plan — design-refresh-p03: Home autenticada (HeroSection novo, PoolCard, EmptyState) para Digital Arena

> Issue: design-refresh-p03 (follow-up de [design-refresh](../design-refresh/PLAN.md))
> Data: 2026-04-17
> Escopo: rota `/home` — [src/app/home/page.tsx](../../../src/app/home/page.tsx), [PoolCard](../../../src/components/features/home/PoolCard.tsx), [EmptyState](../../../src/components/features/home/EmptyState.tsx) + **novo `HeroSection`**. Zero mudança em Server Actions.

---

## Resumo

Migrar a home autenticada para Digital Arena: canvas local `bg-background-light`, introduzir `HeroSection` novo (Card hero com aura + greeting + próximos jogos mockados), reescrever `PoolCard` como card branco editorial com crest circular + badge status + CTA pill, e re-estilizar `EmptyState` mantendo estrutura. Sem mexer em `getUserPools` nem em schema.

---

## Pesquisa Interna

### Design System (verificação obrigatória)

Lido em [.claude/docs/design-system.md](../../../.claude/docs/design-system.md):

- **Canvas**: `bg-background-light` (#f9faf6) local — aplicado **no `<main>`**, não em `layout.tsx` (evita regressão em outras rotas).
- **Hero**: `Card variant="hero" padding="lg"` + `<CardAura />` para HeroSection.
- **Card default** (branco): para `PoolCard` e `EmptyState`.
- **Button pill / pill-outline**: CTAs.
- **Sombras**: `shadow-drop-soft` em cards, `shadow-neon-glow` em CTAs.

### Componentes `ui/` reutilizados

| Componente | Uso |
|---|---|
| `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `CardAura` | HeroSection (hero), PoolCard (default), EmptyState (default) |
| `Button` (+ `buttonVariants`) | Header CTA "Criar bolão" (`pill`), EmptyState ("Criar bolão" `pill`, "Tenho convite" `pill-outline`), PoolCard footer ("Entrar" `pill`) |
| `lucide-react` | `Gamepad2` reusado no EmptyState; `Trophy`/`Users`/`ArrowRight` para hero/card |

Nenhum novo componente `ui/*`.

### Patterns do projeto preservados

- [src/actions/pool.ts](../../../src/actions/pool.ts) `getUserPools(userId)` — só leitura, sem mudança.
- `auth()` server-side em `HomePage` — preservado.
- `PoolCard` com `<Link href={href ?? /pool/${id}}>` + `STATUS_CONFIG` por enum `PoolStatus` — estrutura preservada, apenas classes mudam.
- Tipos `PoolStatus` em [src/types/pool.ts](../../../src/types/pool.ts) — não tocar.

### Status da feature

[docs/ISSUES.md](../../ISSUES.md) issue-04 (Home P03): pendente na Subtask V/F para alguns critérios, mas a rota já funciona (os componentes existem). Esta issue é **apenas visual** + adição do HeroSection novo.

---

## Pesquisa Externa

### Referência Stitch

[/tmp/stitch-krvou/organismos.png](file:///tmp/stitch-krvou/organismos.png) — "Hero Section (MEUS PALPITES)":

- Card hero dark com `<CardAura />` (blur radial primary/30)
- Greeting em Space Grotesk: "Olá, **{nome}**." + subtítulo ("Próximos jogos na sua lista")
- Bloco interno com glassmorphism (`bg-white/5 backdrop-blur-md border border-white/5 rounded-card p-4`) listando 2–3 jogos

Nenhuma dependência nova.

---

## Cenários

### Caminho feliz

1. Usuário autenticado acessa `/home`.
2. Server Component renderiza `HeroSection` no topo com greeting + 2–3 jogos mock (via `getUpcomingGamesMock(userId)`).
3. Lista de bolões do usuário em `PoolCard` brancos (3+ se houver).
4. Quando vazia, `EmptyState` aparece abaixo do HeroSection (o HeroSection sempre renderiza).

### Edge cases

- Sessão sem `user.name` → greeting vira `"Olá."` (sem interpolação).
- `getUpcomingGamesMock` retorna array vazio → HeroSection mostra estado vazio ("Sem jogos próximos por enquanto").
- Lista com 1 pool `finished` → `PoolCard` com `opacity-60` preservado via classe nova.
- `BottomNavBar` ainda em estilo legado (arcade) — sobrepõe levemente o canvas claro. **Dependência documentada**: será resolvida por `design-refresh-layouts`.
- Crest: `Product` não tem logo no schema atual → usar placeholder com inicial do nome do bolão em círculo neon.

### Erros

- `getUserPools` lança → propaga para error boundary existente. Sem mudança.

---

## Banco de Dados

**Nenhuma alteração.** `Match` / `UpcomingGame` **não** entram no schema nesta issue.

- Decisão: **mock local** `getUpcomingGamesMock(userId): UpcomingGame[]` em novo arquivo [src/actions/home.ts](../../../src/actions/home.ts) atrás de flag `USE_UPCOMING_GAMES_MOCK = true`. Futura issue substitui por query real.

---

## Dependências Externas

**Nenhuma nova.**

---

## Arquivos — O Que Criar e Modificar

### Criar

| Arquivo | O que contém |
|---|---|
| `src/components/features/home/HeroSection.tsx` | Server Component. Props: `userName?: string`, `upcomingGames: UpcomingGame[]`. Renderiza `<Card variant="hero" padding="lg">` + `<CardAura />` + greeting (Space Grotesk) + bloco glassmorphism com lista. |
| `src/actions/home.ts` | `getUpcomingGamesMock(userId: string): Promise<UpcomingGame[]>` com array estático (até 3 jogos). Flag `USE_UPCOMING_GAMES_MOCK`. Tipos em `src/types/home.ts`. |
| `src/types/home.ts` | Tipo `UpcomingGame { id, homeTeam, awayTeam, kickoff: Date, poolName? }`. |

### Modificar

| Arquivo | O que mudar |
|---|---|
| [src/app/home/page.tsx](../../../src/app/home/page.tsx) | `<main>` ganha `bg-background-light min-h-screen pt-20 pb-28 px-4 md:px-6 max-w-2xl mx-auto`. Importar e renderizar `<HeroSection userName={session?.user?.name} upcomingGames={...} />` acima do header "Meus Bolões". CTA "Criar bolão" passa a `<Link className={buttonVariants({ variant: "pill", size: "default" })}>`. |
| [src/components/features/home/PoolCard.tsx](../../../src/components/features/home/PoolCard.tsx) | Envelope: `<Card>` default (branco) em vez de `<Link>` cru. Interno: crest circular `size-10 rounded-full bg-primary/10 text-primary font-pixel` com inicial. Badges de status ganham `rounded-pill` + palette tokenizada (open→`bg-primary/10 text-primary-dim`, in_progress→`bg-secondary-container text-on-surface`, finished→`bg-destructive/10 text-destructive`). Contexto info em `CardFooter`. Hover: `hover:-translate-y-0.5 hover:shadow-drop-soft-md transition`. |
| [src/components/features/home/EmptyState.tsx](../../../src/components/features/home/EmptyState.tsx) | Envolver em `<Card>` default centralizado (max-w-sm). CTAs viram `buttonVariants({ variant: "pill" })` e `buttonVariants({ variant: "pill-outline" })`. Ícone `Gamepad2` reutilizado, sem troca. |

### NÃO tocar

- `src/components/layouts/*` — reserva para `design-refresh-layouts`.
- `src/components/ui/*` — fundação já entregou.
- `src/actions/pool.ts` — só leitura.
- `src/types/pool.ts` — `PoolStatus` preservado.
- `src/app/layout.tsx` — canvas global intacto.
- Landing (`src/app/page.tsx`), Auth, Wizard, Pool — fora do escopo.

---

## Decisões desta Issue

### D01 — Canvas claro local (no `<main>`), não global

**Contexto:** Se aplicado em `layout.tsx`, afeta landing/auth/wizard ainda não migrados.
**Decisão:** `bg-background-light` só no `<main>` da página /home.
**Alternativas descartadas:** Canvas global — gera regressão em cascata.

### D02 — HeroSection é Server Component

**Contexto:** Greeting depende de `session?.user?.name`; lista vem de action.
**Decisão:** Server Component recebendo props do `HomePage`. Sem `"use client"`.
**Alternativas descartadas:** Client Component com fetch próprio — adiciona loading state desnecessário.

### D03 — `getUpcomingGamesMock` em `src/actions/home.ts` atrás de flag

**Contexto:** Schema não tem `Match`. Queremos preparar o slot visual sem esperar o backend.
**Decisão:** Mock com 3 jogos estáticos + flag `USE_UPCOMING_GAMES_MOCK`. TODO em comentário no arquivo referenciando "substituir por query real em issue futura".
**Alternativas descartadas:** Placeholder vazio — perde o visual do hero; adicionar schema agora — fora de escopo.

### D04 — Crest circular com inicial (placeholder)

**Contexto:** `Product` não tem URL de logo.
**Decisão:** Círculo `bg-primary/10 text-primary` com primeira letra do `title`. Abre caminho para trocar por `<Image>` quando backend suportar.
**Alternativas descartadas:** Baixar SVGs externos (peso + ToS); ícone genérico único (não distingue bolões).

### D05 — `EmptyState` mantém `Gamepad2`

**Contexto:** Ícone é reconhecível e já "Digital Arena" compatível.
**Decisão:** Reutilizar, apenas redimensionar e aplicar `text-on-surface-variant-light`.
**Alternativas descartadas:** Novo ícone.

### D06 — `PoolCard` vira `<Card>` (não `<Link>`)

**Contexto:** `Card` é envelope padrão; precisamos do hover neon editorial.
**Decisão:** `<Card>` com `<Link>` interno cobrindo o CardTitle/Description. Mantém semântica clicável.
**Alternativas descartadas:** Manter `<Link>` como root — perde a composição de Card (Header/Footer).

### D07 — Status em classes tokenizadas, não literais

**Contexto:** Hoje `STATUS_CONFIG.badgeClass` usa `bg-primary text-primary-foreground`.
**Decisão:** Rescrever para palette clara/light: `bg-primary/10 text-primary-dim` etc. Mantém semântica de cor mas compatível com card branco.
**Alternativas descartadas:** Classes legadas — conflito cromático sobre card branco.

### D08 — Header "Meus Bolões" permanece

**Contexto:** Poderia ser absorvido pelo HeroSection.
**Decisão:** Manter como delimitador de seção da lista. HeroSection é sobre **jogos próximos**, não "meus bolões".
**Alternativas descartadas:** Fundir — confunde a função de cada bloco.

### D09 — BottomNavBar mantém visual legado nesta issue

**Contexto:** Tentação de re-estilizar aqui também.
**Decisão:** Não. `design-refresh-layouts` cuida disso. Durante o rollout, a home pode ter "sanduíche" visual (canvas claro + navbar arcade) — aceito temporariamente.
**Alternativas descartadas:** Migrar nav aqui — escopo maior, PR gigante.

---

## Critérios de Aceitação

- [ ] `/home` renderiza com `bg-background-light` no `<main>`
- [ ] `HeroSection` no topo com greeting + 2–3 jogos mockados
- [ ] Lista de `PoolCard` em cards brancos com hover neon
- [ ] Crest placeholder funciona para qualquer título
- [ ] Badges de status tokenizados compatíveis com card branco
- [ ] `EmptyState` em card branco centralizado com CTAs pill
- [ ] `getUpcomingGamesMock` e tipos `UpcomingGame` criados, com flag documentada
- [ ] `getUserPools` não foi tocado
- [ ] `pnpm build` + `pnpm typecheck` passam
- [ ] Landing inalterada

---

## Observações para Implementação

- Agent sugerido: **component-writer** para HeroSection, PoolCard, EmptyState.
- Pode rodar **em paralelo** com `design-refresh-layouts` (arquivos diferentes), mas validar visualmente juntos antes do merge para detectar sobreposições com o FAB flutuante.
- Comparar `HeroSection` com [/tmp/stitch-krvou/organismos.png](file:///tmp/stitch-krvou/organismos.png) (seção "MEUS PALPITES") antes do review.
- Quando backend suportar `Match` e logos de Product, remover flag `USE_UPCOMING_GAMES_MOCK` e substituir crest placeholder por `<Image>`.
