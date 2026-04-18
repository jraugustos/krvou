# Plan — design-refresh: Migração do Design System para "Digital Arena"

> Issue: design-refresh (nova, ainda não registrada em [docs/ISSUES.md](../../ISSUES.md))
> Data: 2026-04-17
> Fonte: Stitch project "Bolões Inteligentes com IA" (ID 17036510969533916249), telas:
> - **Biblioteca de Componentes — KRVOU** (ID `03cea6948e13473f9d324025e4600140`) — desktop, 1280×3484
> - **Organismos do Aplicativo (Mobile First) — KRVOU** (ID `370d4ab5e63347dda8181a1f8ec15258`) — mobile, 390×3526
> Artefatos baixados: [/tmp/stitch-krvou/](file:///tmp/stitch-krvou/) (HTML + PNG)

---

## Resumo

O Stitch redesenhou o sistema visual do KRVOU em uma direção **editorial-gaming híbrida** — "Digital Arena" — que rompe com o "Neon Arcade Terminal" atual em 4 pontos estruturais: **cantos arredondados, sombras suaves com glow neon, cards brancos sobre hero escuro, e bottom nav flutuante em pill com FAB central**. Esta issue estabelece a **fundação** (tokens, `globals.css`, `src/components/ui/*`) e prepara o terreno para rewrite dos componentes de feature (C01–C39) em issues subsequentes.

---

## Pesquisa Interna

### Design System atual (verificação obrigatória)

Lido em [.claude/docs/design-system.md](../../.claude/docs/design-system.md) e [src/app/globals.css](../../../src/app/globals.css):

- **Radius:** `0px` em TUDO (`--radius: 0rem`) — **conflita diretamente** com Stitch (`rounded-xl` default = 1rem)
- **Sombras:** `shadow-arcade-*` = offset duro `4px 4px 0px 0px` — **conflita** com Stitch (glow suave `0 0 15px rgba(57,255,20,0.4)` + drop soft `0 8px 30px rgba(0,0,0,0.04)`)
- **Backgrounds:** tudo em tons de roxo escuro (`#1f0438`, `#2c1245`, `#43295b`) — **conflita** com Stitch (cards brancos `#ffffff` / hero dark `#190032`)
- **Semântica de `secondary`:** hoje é amarelo pálido (`#fffeac`) — no Stitch é **roxo escuro (#190032)** usado como cor de texto editorial e background de hero cards
- **Overlay scanline:** ativo em `body::after` — ausente no Stitch (estética menos "CRT", mais editorial)
- **Fontes:** Space Grotesk, Inter, Press Start 2P já carregadas — **compatível** com Stitch (mesmas 3 famílias)

### Componentes `ui/` existentes

| Arquivo | Status atual | Ação nesta issue |
|---|---|---|
| [src/components/ui/button.tsx](../../../src/components/ui/button.tsx) | 6 variantes arcade (hard-edge, offset shadow) | Reescrever variants: adicionar `pill` / `pill-outline` (rounded-full, glow) — manter `default` / `outline` arcade como legado temporário durante migração |
| [src/components/ui/input.tsx](../../../src/components/ui/input.tsx) | Inset com glow neon, 0px radius | Adicionar variante `pill` (para chat/search) + manter base atual; ajustar radius base para `rounded-card` |
| [src/components/ui/sonner.tsx](../../../src/components/ui/sonner.tsx) (C36) | Toast com borda colorida, 4px shadow | Ajustar radius + sombra suave |
| [src/components/ui/alert-dialog.tsx](../../../src/components/ui/alert-dialog.tsx) (C37) | Modal arcade | Ajustar radius + sombra |
| [src/components/ui/loading-state.tsx](../../../src/components/ui/loading-state.tsx) (C38) | Spinner pixel | Manter (pixel spinner é assinatura) |
| [src/components/ui/error-state.tsx](../../../src/components/ui/error-state.tsx) (C39) | Erro + retry | Ajustar radius + sombra |

**Nada de `src/components/ui/card.tsx`** — componente base ausente, precisa criar (Stitch usa card como envelope recorrente).

### Componentes de feature (C01–C35) — fora do escopo desta issue

Todos em [src/components/features/*](../../../src/components/features/) e [src/components/layouts/*](../../../src/components/layouts/). **NÃO serão tocados aqui** — migração é planejada em issues subsequentes (ver "Follow-up").

### Patterns do projeto

- **Tokens via CSS variables + `@theme inline`** em [globals.css](../../../src/app/globals.css) — pattern a manter; adicionar novos tokens (radius, soft-shadows, light-surface) no mesmo arquivo
- **`cn()` de `@/lib/utils`** — manter
- **Radius classes do Tailwind** usam `--radius-sm`, `--radius-md`, etc. que são múltiplos de `--radius: 0rem` → todos viram 0 hoje. Precisa definir `--radius` ≥ 0.25rem OU criar tokens dedicados (`--radius-card`, `--radius-pill`) desacoplados.

### Patterns globais atuais que o redesign **quebra**

- `active:translate-x-[4px] active:translate-y-[4px] active:shadow-none` (press arcade) — Stitch usa `hover:scale-[0.98]` ou `active:translate-y-1`. Mudança deliberada.
- `body::after` scanline — remover (ou tornar opt-in via classe). Decisão: **remover globalmente**, manter disponível como classe utilitária para casos pontuais (ex.: tela "GAME OVER" do bolão encerrado).

---

## Pesquisa Externa

### Stitch — análise dos artefatos

#### Tokens do projeto Stitch (extraídos do `tailwind.config` inline)

```
primary-container: #39ff14   → neon green (CTA, glow, accent)
primary-fixed-dim: #2ae500   → neon green acessível para text
primary: #106e00              → verde escuro (aux)
secondary: #190032            → ROXO ESCURO (hero cards, texto editorial headlines)
background: #f9faf6           → off-white
surface-container-lowest: #ffffff  → cards brancos
surface-container-low: #f3f4f0    → inputs/chips
on-surface: #1a1c1a           → texto em fundos claros
on-surface-variant: #3c4b35   → labels, metadata em fundos claros
outline: #6b7c63              → bordas sutis
outline-variant: #baccb0      → bordas ghost
```

**Radius scale:**
```
DEFAULT: 1rem    (rounded-card)
lg: 2rem         (rounded-card-lg)
xl: 3rem         (rounded-card-xl — usado em bottom nav pill)
full: 9999px     (rounded-pill — buttons + nav)
```

#### Organismos mobile (visto no screenshot e HTML)

1. **App Header** — `bg-secondary` (#190032) + `rounded-b-2xl` + `sticky top-0` + logo pixel com `drop-shadow-[0_0_8px_rgba(57,255,20,0.6)]`
2. **Hero Section** (ex.: "MEUS PALPITES") — card dark com aura `blur-3xl` + módulo interno com glassmorphism (`bg-white/5 backdrop-blur-md`)
3. **Match Card** — card BRANCO + crests circulares + score inputs inline + CTA pill neon full-width
4. **Player Stat Block** — card dark + avatar + grid 2×1 de stats com glassmorphism
5. **Bottom Navigation (Pill Flutuante)** — `fixed bottom-6` + `rounded-[3rem]` + `bg-[#0d0118]` + FAB central `#39ff14` elevado (`-top-8`) com ícone `edit`

#### Biblioteca desktop (visto no screenshot e HTML)

1. **Top Navigation (desktop)** — `fixed top-0` + nav horizontal com pill links
2. **Typography & Color docs** — showcase (não é componente de runtime)
3. **Pill Button Primary** — `bg-primary-container` + `rounded-full` + `py-4 px-8` + glow `[0_0_15px_rgba(57,255,20,0.4)]` + hover `-translate-y-1`
4. **Pill Button Secondary** — `bg-transparent` + `border-2 border-outline-variant` + `rounded-full`
5. **Score Input** — `w-16 h-16 rounded-xl` + `font-headline text-2xl` + focus `ring-primary-container` + soft glow
6. **Chat Input** — `rounded-full` + icon button interno
7. **Match Card (idem mobile)** + **Level Progress Card** (gamification)

### Notas importantes

- **Light mode vs dark mode:** a biblioteca é em **light mode global** (body `#f9faf6` off-white) com **hero/header em dark** (`#190032`). Isso é uma inversão completa do nosso esquema atual (tudo dark). **Decisão D01 abaixo.**
- **Border none + radius em inputs:** Stitch usa `border-none rounded-lg` + foco via `ring`. Nosso pattern é `border-2` visível. Manter bordas visíveis (acessibilidade + identidade tátil) mas com radius — decisão D03.
- **Atmospheric auras:** `absolute blur-3xl` + `opacity-10` para efeito "glow ambiente" — feature recorrente, virar utilitário.
- **Material Symbols Outlined:** carregadas via Google Fonts. Projeto atual usa `lucide-react`. Decisão D04.

---

## Cenários

### Caminho feliz — migração de `src/components/ui/*`

1. Desenvolver em paralelo com a base atual via **feature branch** `issue/design-refresh`
2. Tokens novos adicionados a [globals.css](../../../src/app/globals.css) sem remover os antigos (coexistência temporária)
3. `Button` ganha variantes `pill` + `pill-outline`; `default` e `outline` continuam funcionando (0 regressão em features existentes)
4. `Card` novo disponível em `@/components/ui/card`
5. Rota `/dev` atualizada com preview dos novos componentes lado a lado com os antigos (QA visual)
6. Nenhum componente de feature (C01–C35) alterado nesta issue → landing, home, wizard, painéis continuam exibindo visual antigo
7. Feature-flag visual via classe no `<body>` **NÃO é necessária** — as variantes são opt-in explícito (quem quiser usa `<Button variant="pill">`)

### Edge cases

- **Conflito de tokens** (radius, shadow) entre antigo e novo — resolver com namespacing: radius antigos continuam `--radius: 0rem`, novos ganham `--radius-card`, `--radius-pill`. Sombras antigas continuam `shadow-arcade-*`, novas ganham `shadow-neon-glow`, `shadow-drop-soft`.
- **Scanline overlay** quebra o visual editorial — **remover do `body::after`** e mover para classe utilitária `.arcade-scanline` (opt-in). Features que dependem (P10 "GAME OVER") aplicam a classe explicitamente.
- **Ícones (`lucide-react` vs `material-symbols`)** — manter `lucide-react` por ora; não importar Material Symbols. Visual próximo o suficiente; evita nova dependência + fonte externa.

### Erros

- **Storybook/visual regression ausente** — o projeto não tem setup de visual regression. Mitigação: `/dev` serve como snapshot manual; revisar no navegador antes do merge.
- **Páginas de feature quebrarem ao rodar `next build`** — improvável, pois nada de feature é tocado; tokens legados permanecem. Rodar `pnpm build` no fim da issue.

---

## Banco de Dados

**Nenhuma alteração.** Issue é 100% frontend/design.

---

## Dependências Externas

**Nenhuma nova.** Todas as fontes (Space Grotesk, Inter, Press Start 2P) já carregadas via `next/font`.

**Rejeitadas:**
- `@material-symbols/font` — não adicionar. Manter `lucide-react`.
- Biblioteca de Storybook — fora de escopo; `/dev` cumpre o papel de showcase interno.

---

## Arquivos — O Que Criar e Modificar

### Criar

| Arquivo | O que contém |
|---|---|
| `src/components/ui/card.tsx` | `<Card>`, `<CardHeader>`, `<CardContent>`, `<CardFooter>` com variantes `default` (branco), `hero` (dark purple `#190032` com drop shadow forte + aura slot), `stat` (dark com glassmorphism grid interno). Radius `rounded-card` (1rem). |
| `src/components/ui/pill-button.tsx` | **OU** adicionar variantes no `button.tsx` existente. Decisão: estender `button.tsx` (D02). |
| `docs/issues/design-refresh/MIGRATION-MAP.md` | Tabela completa C01–C39 → nova estrutura, com status (migrar / reescrever / depreciar). Serve de roadmap para as follow-up issues. |

### Modificar

| Arquivo | O que mudar |
|---|---|
| [src/app/globals.css](../../../src/app/globals.css) | Adicionar tokens novos: `--radius-card: 1rem`, `--radius-card-lg: 2rem`, `--radius-pill: 9999px`, `--shadow-neon-glow`, `--shadow-neon-glow-strong`, `--shadow-drop-soft`, `--shadow-drop-soft-md`. Adicionar surface claras (`--surface-lowest-light: #ffffff`, `--background-light: #f9faf6`). Remover `body::after` (scanline global) e criar classe utilitária `.arcade-scanline` no mesmo arquivo. Manter todos os tokens antigos (`--radius: 0rem`, `--shadow-arcade-*`) intactos. |
| [src/components/ui/button.tsx](../../../src/components/ui/button.tsx) + `button-variants.ts` (criar se não existir) | Adicionar variantes `pill` (neon green bg, texto preto, rounded-full, glow) e `pill-outline` (transparente, borda branca, rounded-full). Adicionar size `pill-lg` (`py-4 px-8`). Não remover nenhuma variante existente. |
| [src/components/ui/input.tsx](../../../src/components/ui/input.tsx) | Adicionar variante `pill` (rounded-full, padding horizontal maior, sem borda, focus ring). Manter variante default para forms tradicionais. |
| [src/components/ui/sonner.tsx](../../../src/components/ui/sonner.tsx) | Trocar `shadow-arcade-toast` por `shadow-drop-soft`. Adicionar `rounded-card`. |
| [src/components/ui/alert-dialog.tsx](../../../src/components/ui/alert-dialog.tsx) | Trocar `shadow-arcade-dark` por `shadow-drop-soft-md`. Adicionar `rounded-card`. |
| [src/components/ui/error-state.tsx](../../../src/components/ui/error-state.tsx) | Ajustar radius + sombra. |
| [.claude/docs/design-system.md](../../../.claude/docs/design-system.md) | Reescrita completa: novo North Star ("Digital Arena"), nova tabela de tokens (radius, soft-shadows), novos surface tokens (light white + dark purple), novo catálogo de componentes `ui/`, exemplos de uso. Manter uma seção "Tokens legados (arcade)" para referência durante a migração. |
| [src/app/dev/page.tsx](../../../src/app/dev/page.tsx) | Adicionar seção "Digital Arena" com preview de todos os novos componentes: Card (3 variantes), Button pill + pill-outline, Input pill, Toast, AlertDialog. Manter seção antiga para comparação. |
| [src/app/layout.tsx](../../../src/app/layout.tsx) | Verificar se é necessário remover classe global de scanline (se existir). |

### NÃO tocar

- **Qualquer arquivo em [src/components/features/](../../../src/components/features/)** — C01–C35 ficam intactos (landing, home, wizard, pool panel, etc.). Serão migrados em follow-up issues.
- **Qualquer arquivo em [src/components/layouts/](../../../src/components/layouts/)** — `TopBar`, `DashboardTopBar`, `BottomNavBar` são layouts de feature e ficam para follow-up (a migração do bottom nav para pill flutuante com FAB é visível em telas autenticadas e precisa ser coordenada com mudanças de rota — issue própria).
- **`src/app/page.tsx`, `src/app/home/*`, `src/app/pool/*`, `src/app/auth/*`** — páginas continuam com visual atual até suas issues de migração.
- **`prisma/schema.prisma`, `src/actions/*`, `src/hooks/*`, `src/lib/*`** — sem mudanças.
- **[docs/ISSUES.md](../../ISSUES.md) e [docs/SPEC.md](../../SPEC.md)** — serão atualizados na issue seguinte (`design-refresh-docs`), não aqui. A SPEC precisa refletir a nova estética e os novos componentes, mas é um trabalho de texto/docs separado.

---

## Mapeamento C01–C39 → Nova Estrutura (resumo)

> Detalhes completos vão em `MIGRATION-MAP.md` (arquivo criado nesta issue).

| Atual | Nova identidade visual | Mapeia para Stitch |
|---|---|---|
| C01 TopBar | Dark pill sticky com rounded-b-2xl | "App Header" |
| C06 BottomNavBar | **Floating pill** com FAB central (`edit`) para criar bolão | "Bottom Navigation (Floating Pill)" |
| C08 PoolCard | **Card branco** com borda fina, sombra drop-soft, badge status | (derivado de "Match Card") |
| C12 ProductCard | Card branco com crest circular centralizado | (derivado de "Match Card") |
| C20 UserPositionCard | **Stat block dark** com avatar + grid glassmorphism | "Player Stat Block" |
| C22 BetCategoryCard | Card branco com borda colorida esquerda | (mantém estrutura atual, visual novo) |
| C25 ScoreInput | Inputs `w-12 h-14 rounded-lg` dentro de Match Card | "Score Input" |
| C32 GameOverHeader | Manter scanline via classe `.arcade-scanline` + pixel pulse | (estética arcade preservada pontualmente) |
| (novo) | **LevelProgressCard** — XP/Level gamification (dark card com progress bar neon) | "Progress Card Level XP" |
| (novo) | **HeroSection** para /home autenticada | "Hero Section (MEUS PALPITES)" |
| (novo) | **ChatInput** (pill + icon) — útil se futuramente adicionarmos wizard IA ou chat de bolão | "Chat Input" |

**C02–C05 (landing), C07 (auth), C09–C17 (home + wizard + sucesso), C18 (convite), C19/C21/C23 (painel), C24/C26 (palpites), C27–C31 (admin), C33/C34 (encerrado), C35 (perfil):** todos ganham rewrite em follow-up issues usando os novos `ui/` desta fundação.

---

## Follow-up (issues subsequentes — NÃO desta issue)

> Ordem sugerida, cada uma será planejada via `/plan` no seu momento.

1. **design-refresh-p01** — Landing (C01–C05) no novo estilo
2. **design-refresh-layouts** — `TopBar`, `DashboardTopBar`, `BottomNavBar` (pill flutuante + FAB)
3. **design-refresh-p03** — Home autenticada: `PoolCard`, `EmptyState`, + novo `HeroSection`
4. **design-refresh-p04** — Wizard steps (C10–C16)
5. **design-refresh-p05-p06** — Success + Invite
6. **design-refresh-p07-p08** — Painel do bolão + registrar palpite
7. **design-refresh-p09** — Painel admin
8. **design-refresh-p10-p11** — Bolão encerrado + perfil
9. **design-refresh-docs** — atualizar [docs/SPEC.md](../../SPEC.md) e [docs/ISSUES.md](../../ISSUES.md) com o catálogo visual novo

---

## Decisões desta Issue

### D01 — Tema híbrido (dark hero sobre light canvas), não full-dark e não full-light

**Contexto:** Stitch usa `background: #f9faf6` (off-white) como canvas global, com cards hero em `secondary: #190032` (dark purple). Nosso projeto hoje é full-dark (`#1f0438` em todo fundo).
**Decisão:** Adotar o modelo híbrido do Stitch. Canvas global vira off-white, hero cards viram dark purple, cards de conteúdo (Match, PoolCard) viram brancos. **Porém**, mantemos os tokens antigos (`--background: #1f0438`) intactos e adicionamos paralelos (`--background-light: #f9faf6`) — as páginas só migram para o novo canvas quando suas issues específicas rodarem. Nesta issue a rota `/dev` serve para preview, sem mudar o canvas global.
**Alternativas descartadas:**
- Full-dark adaptado (manter canvas dark e só mudar cards) — perde o contraste editorial que o Stitch busca.
- Toggle light/dark mode pelo usuário — fora do escopo MVP; complexidade alta.

### D02 — Variantes `pill` dentro do `Button` existente, não componente separado

**Contexto:** Stitch introduz pill buttons como CTA principal. Poderíamos criar `src/components/ui/pill-button.tsx` dedicado ou estender o `Button` com novas variantes.
**Decisão:** Adicionar variantes `pill` e `pill-outline` dentro de `button-variants.ts`. Mantém API unificada (`<Button variant="pill">`) e evita proliferação de componentes.
**Alternativas descartadas:** `PillButton` dedicado — fragmenta a API, força importar de lugares diferentes, dobra testes.

### D03 — Manter bordas visíveis (2px) nos novos componentes, apenas relaxar radius

**Contexto:** Stitch muitas vezes usa `border-none` + `ring` no focus. Nosso sistema atual tem bordas 2px visíveis como identidade tátil.
**Decisão:** Nos novos componentes, bordas continuam visíveis (`border-2 border-outline-variant` ou `border-outline`), mas com radius aplicado. Exceção: variante `pill` de input (chat) usa `border-none` para combinar com o visual Stitch de chat messenger.
**Alternativas descartadas:** Border-none em tudo — perde identidade tátil e acessibilidade visual (contraste em light mode exige bordas).

### D04 — Manter `lucide-react`, não adotar Material Symbols

**Contexto:** Stitch usa Material Symbols Outlined via Google Fonts. Projeto atual usa `lucide-react`.
**Decisão:** Continuar com `lucide-react`. Ícones equivalentes existem (edit, home, person, etc.) e evita adicionar dependência de fonte externa + peso de download + complexidade de variable fonts no Next.js.
**Alternativas descartadas:** Material Symbols — inconsistente com o resto do projeto, peso maior, já temos lucide funcionando.

### D05 — Remover scanline global, manter como opt-in

**Contexto:** `body::after` aplica scanline em toda a tela. O novo visual editorial é mais limpo e a scanline destoa. Mas em telas de "arcade intense" (P10 GAME OVER) ela tem valor narrativo.
**Decisão:** Remover de `body::after`. Criar classe `.arcade-scanline` com o mesmo CSS. Apenas componentes que quiserem o efeito aplicam a classe.
**Alternativas descartadas:** Manter global — destoa do novo visual. Remover completamente — perde recurso útil para P10.

### D06 — Escopo estrito: só fundação nesta issue

**Contexto:** Tentação de migrar alguns componentes de feature já que estamos mexendo no visual.
**Decisão:** Só `src/components/ui/*` + tokens + docs + `/dev`. Zero features tocadas. Feature migration vai em issues separadas (ver Follow-up).
**Alternativas descartadas:** "Migrar também C08 PoolCard já que é fácil" — cria PR gigante, risco maior de regressão, dificulta code review. Cada feature ganha sua issue.

---

## Critérios de Aceitação

- [ ] Novos tokens adicionados a `globals.css` sem quebrar nenhum token antigo (build limpa)
- [ ] `src/components/ui/card.tsx` existe com 3 variantes (`default`, `hero`, `stat`)
- [ ] `Button` aceita `variant="pill"` e `variant="pill-outline"`
- [ ] `Input` aceita variante pill
- [ ] Scanline removida do `body::after`, classe `.arcade-scanline` disponível
- [ ] `/dev` mostra side-by-side dos novos componentes vs antigos
- [ ] [.claude/docs/design-system.md](../../../.claude/docs/design-system.md) reescrito refletindo o novo North Star
- [ ] `MIGRATION-MAP.md` listado para orientar as follow-up issues
- [ ] `pnpm build` passa sem erros
- [ ] Nenhum arquivo em `features/` ou `layouts/` foi modificado
- [ ] Visual das páginas existentes (landing, home, wizard, etc.) continua idêntico ao antes desta issue (zero regressão)

---

## Observações para Implementação

- **Ao aplicar:** o agente **component-writer** é o ideal para os componentes `ui/*`. O **integration-writer** não se aplica (sem integração externa). Documentação pode ir direto no fluxo do `/execute`.
- **Testes:** esta issue não gera testes unitários (componentes visuais sem lógica). QA é visual via `/dev`.
- **Revisão visual obrigatória:** antes do merge, comparar cada componente novo com o screenshot correspondente do Stitch em [/tmp/stitch-krvou/biblioteca.png](file:///tmp/stitch-krvou/biblioteca.png) e [/tmp/stitch-krvou/organismos.png](file:///tmp/stitch-krvou/organismos.png).
