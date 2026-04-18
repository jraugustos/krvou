# Plan — design-refresh-layouts: Migração de TopBar, DashboardTopBar e BottomNavBar para "Digital Arena"

> Issue: design-refresh-layouts (follow-up de [issue/design-refresh](../design-refresh/PLAN.md))
> Data: 2026-04-17
> Fonte visual: Stitch — "Organismos do Aplicativo (Mobile First)" — [/tmp/stitch-krvou/organismos.html](file:///tmp/stitch-krvou/organismos.html) (linhas 99–115 App Header, 210–238 Bottom Navigation, 241–261 Floating Pill variant) e [/tmp/stitch-krvou/organismos.png](file:///tmp/stitch-krvou/organismos.png)
> MIGRATION-MAP: [docs/issues/design-refresh/MIGRATION-MAP.md](../design-refresh/MIGRATION-MAP.md) — linhas C01, C01b, C06
> Escopo: 100% visual em 3 arquivos de `src/components/layouts/` + ajuste de `pt/pb` nas páginas que os consomem + seção demo em `/dev`. Zero mudança em rotas, sessão, comportamento de nav.

---

## Resumo

Migrar `TopBar`, `DashboardTopBar` e `BottomNavBar` da estética "Neon Arcade Terminal" (hard-edge, border-4px, shadow-arcade 4px offset, fundo full-dark) para "Digital Arena": **top bars continuam sticky em dark pill** com `bg-hero-surface` e `rounded-b-2xl`, logo em `font-pixel` com `drop-shadow-[0_0_8px_#39ff14]`, nav/ícones em pills circulares; e **BottomNavBar vira pill flutuante** (`fixed bottom-6 left-1/2 -translate-x-1/2`, `rounded-card-xl`, `bg-[#0d0118]`) com **FAB central verde neon** (`#39ff14`, `-top-8`) apontando para `/pool/new?step=1`. A landing (`src/app/page.tsx`) **não é tocada** — migra em `design-refresh-p01`. O `TopBar` só é usado na landing hoje, mas é reescrito para paridade de chrome quando a landing migrar.

---

## Pesquisa Interna

### Design System (verificação obrigatória)

Lido em [.claude/docs/design-system.md](../../../.claude/docs/design-system.md):

- **Hero surface**: `bg-hero-surface` (`#190032`) — fundo dos top bars. A pill flutuante usa `#0d0118` (ainda mais escuro) conforme Stitch — ver **D08**.
- **Radius**: `rounded-b-2xl` (1rem Tailwind default) para top bars sticky, `rounded-card-xl` (3rem) para bottom nav pill, `rounded-pill` (full) para nav items internos / pill buttons.
- **Sombras**: `shadow-drop-soft-md` em top bars; `shadow-2xl` (Tailwind) na pill flutuante (Stitch não introduz token dedicado); `shadow-neon-glow-strong` (`0 0 25px rgba(57,255,20,0.6)`) no FAB.
- **Neon**: logo em `font-pixel text-primary` (`#39ff14`) com `drop-shadow-[0_0_8px_rgba(57,255,20,0.6)]`; FAB em `bg-primary`.
- **Tipografia**: `font-heading` (Space Grotesk) em nav items; `font-pixel` (Press Start 2P) somente no logo.

### Componentes `ui/` reutilizados

| Componente | Uso |
|---|---|
| `Button` ([src/components/ui/button.tsx](../../../src/components/ui/button.tsx)) | **Opcional** — nav items são `<Link>` com estilo pill inline (mais leve que Button full). FAB é `<Link>` estilizado (precisa de `href`). Nenhum uso obrigatório. |
| `Card` ([src/components/ui/card.tsx](../../../src/components/ui/card.tsx)) | **Não é usado** — top bars e bottom nav têm geometria própria (chrome, não "cards de conteúdo"). |
| `Input` ([src/components/ui/input.tsx](../../../src/components/ui/input.tsx)) | **Não é usado** — sem campos de busca. |
| `lucide-react` icons | `Home`, `Plus` (FAB), `Target`, `Trophy`, `User`, `Bell`, `Menu`, `Search` — já em uso. |

Nenhum componente `ui/*` é criado nesta issue. Tokens Tailwind diretos (`bg-hero-surface`, `rounded-card-xl`, `shadow-drop-soft-md`, `shadow-neon-glow-strong`) são usados em vez de envolver em `<Card>`. Ver **D03**.

### Patterns do projeto preservados

- `usePathname()` em `BottomNavBar` e `TopBar` para item ativo (client component).
- `auth()` em `DashboardTopBar` para imagem do usuário (server component assíncrono).
- `Link` do `next/link` em todos os slots navegáveis.
- `cn()` para composição de classes.
- `md:hidden` no `BottomNavBar` (mobile-only).

### Onde os layouts são usados (Grep)

- `TopBar`: [src/app/page.tsx](../../../src/app/page.tsx) (linha 10) — landing pública (rota `/`).
- `DashboardTopBar`: [src/app/home/page.tsx](../../../src/app/home/page.tsx), [src/app/pool/new/page.tsx](../../../src/app/pool/new/page.tsx), [src/app/pool/[poolId]/page.tsx](../../../src/app/pool/[poolId]/page.tsx), [src/app/pool/[poolId]/created/page.tsx](../../../src/app/pool/[poolId]/created/page.tsx).
- `BottomNavBar`: mesmas rotas do `DashboardTopBar` (exceto landing e auth).

**Conclusão:** `src/app/auth/*` e `src/app/page.tsx` não importam `BottomNavBar` nem `DashboardTopBar`. A regra "FAB oculto em auth/landing" é estrutural (via ausência de import), não via prop — **D05**.

### O que precisa de atenção especial

1. **Offset de conteúdo**: hoje `pt-16 pb-20`. Com bottom nav subindo para `bottom-6` e FAB em `-top-8`, o offset total sobe para `pt-20 pb-28`. **D07**.
2. **Logo no `DashboardTopBar`** aponta para `/home`; no `TopBar` aponta para `/`. Mantido.
3. **Avatar no `DashboardTopBar`** continua `<img>` (sem `next/image`) — troca de API fora de escopo.

---

## Pesquisa Externa

### Stitch — "App Header" (linhas 99–115)

```html
<div class="bg-secondary rounded-xl shadow-2xl p-5 flex justify-between items-center border border-white/10">
  <div class="font-pixel text-lg text-primary-container drop-shadow-[0_0_8px_rgba(57,255,20,0.6)]">KRVOU!</div>
  <div class="flex items-center gap-3">
    <button class="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-primary-container">
      <span class="material-symbols-outlined text-xl">notifications</span>
    </button>
    <button class="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-primary-container">
      <span class="material-symbols-outlined text-xl">search</span>
    </button>
  </div>
</div>
```

**Extração:** fundo `bg-secondary` (=`#190032` → nosso `bg-hero-surface`), logo em `font-pixel` com glow neon, ícones à direita em pills redondos (`rounded-full` + hover `bg-white/10`). Shadow forte (Stitch `shadow-2xl` → traduzimos para `shadow-drop-soft-md`). **Adaptação sticky**: `rounded-xl` (card isolado) vira `rounded-b-2xl` (top grudado na borda superior, só cantos inferiores arredondados).

### Stitch — "Bottom Navigation (Floating Pill)" (linhas 241–261)

```html
<div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-[360px]">
  <div class="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#39ff14] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(57,255,20,0.6)] z-20 cursor-pointer hover:scale-105 transition-transform">
    <span class="material-symbols-outlined text-[#190032] text-3xl font-bold">edit</span>
  </div>
  <nav class="bg-[#0d0118] w-full flex justify-around items-center px-4 py-4 rounded-[3rem] border border-white/5 shadow-2xl relative z-10">
    <button><span class="material-symbols-outlined text-2xl">sports_esports</span></button>
    <button class="text-[#39ff14]"><span class="material-symbols-outlined text-2xl">style</span></button>
    <div class="w-12"></div>  <!-- spacer sob o FAB -->
    <button><span class="material-symbols-outlined text-2xl">group</span></button>
    <button><span class="material-symbols-outlined text-2xl">person</span></button>
  </nav>
</div>
```

**Extração:**
- Container `fixed bottom-6 left-1/2 -translate-x-1/2`, `w-[calc(100%-2rem)] max-w-[360px]`.
- FAB: absolute `-top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#39ff14] rounded-full`, glow forte, `hover:scale-105`.
- Nav: `bg-[#0d0118]` (mais escuro que `#190032` — **D08**), `rounded-[3rem]` (= nosso `rounded-card-xl`), `border border-white/5`, `shadow-2xl`, `py-4 px-4`.
- **4 slots + spacer `w-12`** no meio (buraco sob o FAB).
- Item ativo `text-[#39ff14]`, inativo `text-white/30`, hover `text-white/60`.
- **Ícones-only** (sem label texto) — identidade minimalista (**D07**).

### Notas importantes

- **Ícones Material Symbols vs lucide**: Stitch usa `edit`, `home`, `sports_soccer`, `bar_chart`, `person`, `sports_esports`, `style`, `group`. **D04**: mapear para lucide — `Plus` (FAB), `Home`, `Trophy`, `Target`, `User`, `Bell`, `Search`, `Menu`.
- **`prefers-reduced-motion`**: `hover:scale-105` no FAB e transitions devem respeitar `motion-reduce:transform-none` / `motion-reduce:transition-none` (Tailwind v4).

---

## Cenários

### Caminho feliz

1. **Landing pública (`/`)** renderiza `TopBar` novo com fundo `bg-hero-surface`, `rounded-b-2xl`, logo em pixel neon, nav desktop horizontal em pills inline. Sem `BottomNavBar`.
2. **Home autenticada (`/home`)** renderiza `DashboardTopBar` novo (mesmo chrome + avatar à direita) e `BottomNavBar` floating pill com 4 itens + FAB central "criar bolão" apontando para `/pool/new?step=1`.
3. **Wizard (`/pool/new`)**, **painel (`/pool/[poolId]`)** e **created (`/pool/[poolId]/created`)** renderizam o mesmo par. FAB continua apontando para `/pool/new?step=1` em todas (ação canônica — **D02**).
4. Em todas as rotas autenticadas mobile, **FAB sempre visível**. Sem estado "criar desabilitado" neste escopo.
5. Scroll: top bar fixo no topo; bottom pill flutuante com gap 1.5rem da borda inferior (visualmente "ilha").
6. Desktop (`md:`) oculta `BottomNavBar` como hoje; desktop usa `TopBar` com nav horizontal em pills.

### Edge cases

1. **FAB só em mobile**: `md:hidden` preservado no wrapper do `BottomNavBar`. Desktop usa nav do top bar.
2. **FAB oculto em auth/landing**: `BottomNavBar` não é importado em `src/app/page.tsx` nem em `src/app/auth/*`. Estrutural, não por prop (**D05**).
3. **Sticky/fixed + scroll**: `fixed top-0` no top, `fixed bottom-6` no bottom, z-40 em ambos. Páginas autenticadas ajustam `pt-20 pb-28` (**D06 + D07**).
4. **`prefers-reduced-motion`**: `motion-reduce:transform-none motion-reduce:transition-none` nos botões (FAB hover-scale, nav hover). Cor continua animando; transform é suprimido.
5. **Rota ativa com querystring**: `/pool/new?step=1` — pathname matching ignora query via `item.href.split("?")[0]` (lógica atual preservada).
6. **Safe-area iOS**: `fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))]` para não colidir com barra do Safari / home indicator.
7. **Subpath `/pool/abc/bet/xyz`**: item "Palpites" ativo se `pathname.startsWith("/bets") || pathname.startsWith("/pool/")` — preservado.
8. **Sessão sem `image`**: fallback `<User />` lucide dentro de wrapper `rounded-full bg-white/10 border border-white/10`.
9. **Pill overflow em telas <320px**: `w-[calc(100%-2rem)]` garante 16px de gap; `max-w-[360px]` evita exagero em tablets.

### Erros

- **FAB por trás de toasts/dialogs**: Sonner usa z-50; top/bottom usam z-40. FAB z-20 relativo à pill — não colide com Sonner. Manter z-40 no wrapper.
- **Build quebra por token inexistente**: todos os tokens usados (`bg-hero-surface`, `rounded-card-xl`, `shadow-drop-soft-md`, `shadow-neon-glow-strong`) já existem em `globals.css` da fundação. **Não adicionar tokens nesta issue**.
- **`auth()` lança em `DashboardTopBar`**: propaga como antes; avatar mostra fallback. Sem mudança.

---

## Banco de Dados

**Nenhuma alteração.** Issue 100% frontend/layout.

---

## Dependências Externas

**Nenhuma nova.** `lucide-react`, `next/link`, `next/navigation` já em uso. Fontes (Space Grotesk, Press Start 2P, Inter) já carregadas.

**Rejeitadas:**
- Material Symbols — reafirmação D04 (peso extra, fora da direção).
- Framer Motion — transitions nativas Tailwind atendem.

---

## Arquivos — O Que Criar e Modificar

### Criar

**Nenhum arquivo novo.** Toda migração é reescrita de existentes.

### Modificar

| Arquivo | O que mudar |
|---|---|
| [src/components/layouts/TopBar.tsx](../../../src/components/layouts/TopBar.tsx) | Reescrever: container `fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 md:px-8 py-4 bg-hero-surface rounded-b-2xl shadow-drop-soft-md border-b border-white/10`. Logo com `drop-shadow-[0_0_8px_rgba(57,255,20,0.6)]`. Hamburger e bell em `p-1.5 rounded-full text-white/70 hover:bg-white/10 hover:text-primary transition-colors motion-reduce:transition-none`. Nav desktop (Home/Ranking/Jogos) em pills `rounded-pill px-4 py-2`. Adicionar `usePathname` + lógica `isActive` (não havia antes). |
| [src/components/layouts/DashboardTopBar.tsx](../../../src/components/layouts/DashboardTopBar.tsx) | Mesmo chrome do `TopBar`. Server Component assíncrono mantido. Avatar: `size-9 rounded-full bg-white/10 border border-white/10 overflow-hidden ring-2 ring-primary/20`; fallback `<User className="size-4 text-white/70" />`. Slot comentado `{/* TODO: user menu dropdown */}`. |
| [src/components/layouts/BottomNavBar.tsx](../../../src/components/layouts/BottomNavBar.tsx) | Reescrever: wrapper `fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-[360px] md:hidden`. FAB absolute `<Link href="/pool/new?step=1">` com `-top-8 size-16 bg-primary rounded-full flex items-center justify-center shadow-neon-glow-strong z-20 hover:scale-105 transition-transform motion-reduce:transform-none` + `<Plus className="size-7 text-hero-surface" />`. Nav interno `bg-[#0d0118] rounded-card-xl border border-white/5 shadow-2xl px-4 py-4 flex justify-around items-center relative z-10`. Itens: Home (`/home`), Palpites (`/bets` ou painéis), **[FAB spacer `w-12`]**, Ranking (`/ranking`), Perfil (`#` placeholder). Item ativo `text-primary`, inativo `text-white/40`, hover `text-white/70`. **Remover labels** — ícones-only com `aria-label`. |
| [src/app/home/page.tsx](../../../src/app/home/page.tsx) | Ajustar wrapper `<main>`: `pt-20 pb-28` (antes `pt-16 pb-20`). |
| [src/app/pool/new/page.tsx](../../../src/app/pool/new/page.tsx) | Mesmo ajuste `pt-20 pb-28`. |
| [src/app/pool/[poolId]/page.tsx](../../../src/app/pool/[poolId]/page.tsx) | Mesmo ajuste `pt-20 pb-28`. |
| [src/app/pool/[poolId]/created/page.tsx](../../../src/app/pool/[poolId]/created/page.tsx) | Mesmo ajuste `pt-20 pb-28`. |
| [src/app/dev/page.tsx](../../../src/app/dev/page.tsx) | Adicionar seção "Digital Arena — Layouts" com preview estático (mockados, sem `fixed` positioning) dos 3 bars + legenda. |

### NÃO tocar

- [src/app/page.tsx](../../../src/app/page.tsx) (landing `/`) — migra em `design-refresh-p01`. Apesar de importar `TopBar`, a landing em si não é tocada aqui.
- [src/app/auth/*](../../../src/app/auth/) — não consome esses layouts; fora de escopo.
- [src/components/features/**](../../../src/components/features/) — nenhum componente de feature é afetado.
- [src/components/ui/**](../../../src/components/ui/) — UI base já migrada em `issue/design-refresh`.
- [src/app/globals.css](../../../src/app/globals.css) — tokens já existem; **não adicionar tokens** nesta issue.
- [src/app/layout.tsx](../../../src/app/layout.tsx) — canvas global sem mudança aqui (páginas aplicam `bg-background-light` via issues próprias).
- Tokens legados (`shadow-arcade-*`, `--radius: 0rem`) — intactos para features não migradas.

---

## Mapeamento Atual → Novo

### TopBar (C01)

| Elemento atual | Classes atuais | Novo elemento | Classes novas |
|---|---|---|---|
| Container `<header>` | `fixed top-0 left-0 w-full z-40 flex items-center justify-between px-4 md:px-6 h-16 bg-background border-b-4 border-surface-container shadow-arcade-dark` | Container `<header>` | `fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 md:px-8 py-4 bg-hero-surface rounded-b-2xl shadow-drop-soft-md border-b border-white/10` |
| Logo `<Link href="/">` | `font-pixel text-lg text-primary drop-shadow-[2px_2px_0px_var(--surface-container)] uppercase tracking-wider` | Logo `<Link href="/">` | `font-pixel text-lg text-primary drop-shadow-[0_0_8px_rgba(57,255,20,0.6)] uppercase tracking-wider` |
| Hamburger `<button>` | `md:hidden text-primary` + `<Menu className="size-6" />` | Hamburger `<button>` | `md:hidden p-1.5 rounded-full text-white/70 hover:bg-white/10 hover:text-primary transition-colors motion-reduce:transition-none` + `<Menu className="size-6" />` |
| Nav desktop `<nav>` | `hidden md:flex gap-8` | Nav desktop `<nav>` | `hidden md:flex items-center gap-2` |
| Link ativo | `font-heading text-xs font-bold uppercase tracking-widest text-primary` | Link ativo | `font-heading text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-pill bg-white/10 text-primary` |
| Link inativo | `font-heading text-xs font-bold uppercase tracking-widest text-on-surface hover:text-primary transition-colors` | Link inativo | `font-heading text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-pill text-white/70 hover:bg-white/10 hover:text-primary transition-colors motion-reduce:transition-none` |
| Bell `<button>` | `text-primary` + `<Bell className="size-5" />` | Bell `<button>` | `p-1.5 rounded-full text-white/70 hover:bg-white/10 hover:text-primary transition-colors motion-reduce:transition-none` + `<Bell className="size-5" />` |

### DashboardTopBar (C01b)

| Elemento atual | Classes atuais | Novo elemento | Classes novas |
|---|---|---|---|
| Container `<header>` | `fixed top-0 left-0 w-full z-40 flex items-center justify-between px-4 md:px-6 h-16 bg-background border-b-4 border-surface-container shadow-arcade-dark` | Container `<header>` | `fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 md:px-8 py-4 bg-hero-surface rounded-b-2xl shadow-drop-soft-md border-b border-white/10` |
| Logo `<Link href="/home">` | `font-pixel text-lg text-primary drop-shadow-[2px_2px_0px_var(--surface-container)] uppercase tracking-wider` | Logo `<Link href="/home">` | `font-pixel text-lg text-primary drop-shadow-[0_0_8px_rgba(57,255,20,0.6)] uppercase tracking-wider` |
| Avatar wrapper | `flex size-8 items-center justify-center bg-surface-high` | Avatar wrapper | `flex size-9 items-center justify-center rounded-full bg-white/10 border border-white/10 overflow-hidden ring-2 ring-primary/20` |
| Avatar `<img>` | `size-8 object-cover` | Avatar `<img>` | `size-full rounded-full object-cover` |
| Fallback `<User />` | `size-4 text-on-surface-variant` | Fallback `<User />` | `size-4 text-white/70` |
| — (não existe) | — | Slot user menu | `{/* TODO: dropdown futuro */}` |

### BottomNavBar (C06)

| Elemento atual | Classes atuais | Novo elemento | Classes novas |
|---|---|---|---|
| Container `<nav>` | `fixed bottom-0 left-0 w-full z-40 flex bg-background border-t-4 border-surface-container shadow-arcade-dark-invert md:hidden` | Wrapper `<div>` | `fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-[360px] md:hidden` |
| — (não existe) | — | FAB `<Link href="/pool/new?step=1">` | `absolute -top-8 left-1/2 -translate-x-1/2 size-16 bg-primary rounded-full flex items-center justify-center shadow-neon-glow-strong z-20 hover:scale-105 transition-transform motion-reduce:transform-none` + `<Plus className="size-7 text-hero-surface" />` |
| — (não existe) | — | Nav interno `<nav>` | `bg-[#0d0118] w-full flex justify-around items-center px-4 py-4 rounded-card-xl border border-white/5 shadow-2xl relative z-10` |
| Link item | `flex flex-1 flex-col items-center gap-1 overflow-hidden py-2 transition-colors` | Link item (icon-only) | `flex items-center justify-center p-2 rounded-full transition-colors motion-reduce:transition-none` |
| Item ativo | `bg-primary text-background` + label | Item ativo | `text-primary` (ícone neon, sem bg — minimalista) |
| Item inativo | `text-on-surface-variant hover:text-primary` | Item inativo | `text-white/40 hover:text-white/70` |
| Label `<span>` | `font-heading text-[10px] uppercase tracking-wide truncate` | — | **Removido** (ícones-only com `aria-label`) |
| — (não existe) | — | Spacer central `<div />` | `w-12` (buraco sob o FAB) |
| Itens (4) | Home / Criar / Palpites / Ranking | Itens (4 + FAB spacer) | Home (`/home`) · Palpites (`/bets` ou painéis) · **[FAB]** · Ranking (`/ranking`) · Perfil (`#` placeholder com `aria-disabled`) |

**Nota sobre itens:** "Criar" sai da nav horizontal e vira o FAB central. Os 4 slots são: Home, Palpites, Ranking, Perfil. Se `/profile` ainda não existe, href = `#` com `aria-disabled="true"` + `pointer-events-none opacity-50` — preserva simetria 2+FAB+2 sem quebrar navegação.

---

## Decisões desta Issue

### D01 — 4 slots laterais + FAB central (não 5 slots iguais)

**Contexto:** Atualmente há 4 itens uniformes (Home/Criar/Palpites/Ranking). Stitch define 4 laterais + FAB central destacado.
**Decisão:** **4 slots + FAB**. "Criar" vira o FAB central (ação primária destacada). Slots laterais: Home, Palpites, Ranking, Perfil (com `aria-disabled` até issue-12).
**Alternativas descartadas:**
- Manter "Criar" plano + FAB extra (5 ações) — ação duplicada, UX confusa.
- 3 slots assimétricos — visual desequilibrado.
- Duplicar Ranking no 4º slot — confuso.

### D02 — FAB sempre aponta para `/pool/new?step=1`

**Contexto:** FAB poderia mudar rota conforme contexto (home → criar; painel → registrar palpite).
**Decisão:** **FAB sempre aponta para `/pool/new?step=1`**. Mental model consistente ("verde = criar bolão"). Registrar palpite ganha CTA próprio (SubmitBetsBar / C26) na issue do painel.
**Alternativas descartadas:**
- FAB contextual por pathname — scope creep, UX inconsistente, mais testes.
- Remover FAB — perde identidade "Digital Arena".

### D03 — FAB inline no `BottomNavBar`, sem variante de `Button`

**Contexto:** FAB poderia virar `Button variant="fab"` ou componente `<Fab />` separado.
**Decisão:** **Inline no `BottomNavBar`**. FAB é único no app, tem semântica de link (`href`), não botão. Variante em `Button` seria overengineering. Se aparecer um segundo FAB, extrai na ocasião.
**Alternativas descartadas:**
- `<Button variant="fab" asChild>` — fragmenta API por caso único.
- `<Fab />` separado — overhead sem ganho.

### D04 — Manter `lucide-react`, não adotar Material Symbols

**Contexto:** Stitch usa Material Symbols (`edit`, `home`, `sports_soccer`, etc.). Projeto usa `lucide-react`.
**Decisão:** **lucide-react**. Mapeamento: `edit` → `Plus` (FAB "criar"), `home` → `Home`, `sports_soccer` → `Target`, `bar_chart` → `Trophy`, `person` → `User`, `notifications` → `Bell`, `search` → `Search`, `menu` → `Menu`.
**Alternativas descartadas:** Material Symbols — fonte externa por 5 ícones é desproporcional; reafirma D04 da fundação.

### D05 — FAB oculto em auth/landing via ausência de import

**Contexto:** `BottomNavBar` só deve aparecer em rotas autenticadas mobile.
**Decisão:** **Não importar `BottomNavBar` em `src/app/page.tsx`, `src/app/auth/*` nem em layouts públicos**. Estado atual já segue — manter. Não introduzir prop `hidden`/`variant`.
**Alternativas descartadas:**
- Prop `variant="public"` — complexidade sem benefício.
- Detectar pathname no próprio componente — rompe composição explícita do Next.js.

### D06 — `fixed` em ambos os bars (não `sticky`)

**Contexto:** Top bars poderiam usar `sticky top-0` (flui até colar) ou `fixed top-0` (sempre no viewport).
**Decisão:** **`fixed top-0`** no top, **`fixed bottom-6`** no bottom. Chrome nunca desaparece com scroll; páginas compensam com `pt-20 pb-28`.
**Alternativas descartadas:** `sticky` — comportamento inconsistente em listas longas (pode parecer "sumir" no início).

### D07 — Ícone-only na bottom nav (sem labels texto)

**Contexto:** `BottomNavBar` atual tem label + icon empilhados. Stitch usa ícones-only.
**Decisão:** **Remover labels**. Ícones-only com `aria-label` para acessibilidade. Identidade minimalista combina com "Digital Arena" editorial.
**Alternativas descartadas:**
- Manter labels — destoa do Stitch, visual mais "chunky".
- Label só no ativo — implementação complexa, pouco ganho.

### D08 — Pill usa `bg-[#0d0118]` (mais escuro que `bg-hero-surface`)

**Contexto:** Stitch usa `#0d0118` na pill flutuante (ainda mais escuro que hero `#190032`).
**Decisão:** **Usar `bg-[#0d0118]` como arbitrary value nesta issue**. Se em follow-up identificarmos reuso, promovemos a token (`--surface-deepest`). Não criar token por uso único.
**Alternativas descartadas:**
- Usar `bg-hero-surface` — perde contraste sutil desenhado pelo Stitch; pill deve parecer "mais profunda" que canvas/top bar.
- Criar token `--surface-deepest: #0d0118` em `globals.css` — escopo desta issue é layouts, não tokens.

---

## Critérios de Aceitação

- [ ] `TopBar` renderiza com `bg-hero-surface`, `rounded-b-2xl`, `shadow-drop-soft-md`, logo com `drop-shadow` neon
- [ ] `DashboardTopBar` tem mesmo chrome + avatar redondo com fallback `User` e `ring-2 ring-primary/20`
- [ ] `BottomNavBar` é floating pill (`fixed bottom-6`, `rounded-card-xl`, `bg-[#0d0118]`, `max-w-[360px]`)
- [ ] FAB central verde neon em `-top-8`, `size-16`, `rounded-full`, `shadow-neon-glow-strong`, `hover:scale-105`
- [ ] FAB aponta para `/pool/new?step=1` (testado em `/home`, `/pool/new`, `/pool/[poolId]`, `/pool/[poolId]/created`)
- [ ] 4 slots laterais (Home, Palpites, Ranking, Perfil) + spacer central sob o FAB
- [ ] Ícones-only (sem labels) com `aria-label` em cada `<Link>`
- [ ] Item ativo `text-primary`, inativo `text-white/40`, hover `text-white/70`
- [ ] Transições respeitam `motion-reduce:transform-none` / `motion-reduce:transition-none`
- [ ] Safe-area iOS aplicada via `bottom-[calc(1.5rem+env(safe-area-inset-bottom))]`
- [ ] `md:hidden` preservado no `BottomNavBar` (mobile only)
- [ ] Rotas `home`, `pool/new`, `pool/[poolId]`, `pool/[poolId]/created` ajustadas para `pt-20 pb-28`
- [ ] `src/app/page.tsx` (landing) **não modificado**
- [ ] `src/app/auth/*` **não modificado**
- [ ] Nenhum arquivo em `src/components/features/**` modificado
- [ ] Nenhum arquivo em `src/components/ui/**` modificado
- [ ] `src/app/globals.css` não modificado
- [ ] `/dev` recebeu seção estática "Digital Arena — Layouts" com preview dos 3 bars
- [ ] `pnpm build` passa sem erros
- [ ] `pnpm lint` passa sem warnings novos
- [ ] QA visual: comparar `BottomNavBar` com [/tmp/stitch-krvou/organismos.png](file:///tmp/stitch-krvou/organismos.png) (seção "Bottom Navigation")
- [ ] QA visual: comparar `TopBar`/`DashboardTopBar` com a mesma imagem (seção "App Header")

---

## Observações para Implementação

- **Agente ideal:** `component-writer` para os 3 componentes; ajustes de `pt/pb` em `page.tsx` via Edit direto.
- **Testes:** esta issue não gera unit tests (componentes visuais, sem lógica além de `usePathname` já presente). QA é visual.
- **Revisão visual obrigatória:** antes do merge, abrir `/home` em viewport mobile (375×667) no browser e conferir paridade com `/tmp/stitch-krvou/organismos.png`.
- **Sequência sugerida:** `BottomNavBar` primeiro (mais impactante/arriscado) → `DashboardTopBar` (reusa pattern do top) → `TopBar` (baixo risco, só aparece em `/`) → ajustes `pt/pb` → `/dev` showcase.
