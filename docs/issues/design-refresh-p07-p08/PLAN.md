# Plan — design-refresh-p07-p08: Painel do bolão (C19–C23) + preparação de Registrar palpite (C24–C26) para Digital Arena

> Issue: design-refresh-p07-p08 (follow-up de [design-refresh](../design-refresh/PLAN.md))
> Data: 2026-04-17
> Escopo dual:
> 1. **Migração visual** do painel do bolão (`/pool/[poolId]`) — componentes existentes.
> 2. **Preparação visual** dos componentes de registrar palpite (MatchCard / ScoreInput / SubmitBetsBar) — **criados como visual-only**, sem integração. A integração funcional fica em `issue-09` (pendente em `docs/ISSUES.md`).

---

## Resumo

Migrar o painel do participante para Digital Arena: extrair `PoolHero` (Card hero + stats editoriais), reescrever `UserPositionCard` como `Card variant="stat"` (glassmorphism), re-estilizar `RankingList`, `BetCategoryCards` e `ResultComparisonCards` como cards brancos editoriais. Em paralelo, criar 3 componentes visual-only (`MatchCard`, `ScoreInput`, `SubmitBetsBar`) em `src/components/features/pool/bet/` para serem consumidos pela issue-09 quando chegar.

---

## Pesquisa Interna

### Design System (verificação obrigatória)

Lido em [.claude/docs/design-system.md](../../../.claude/docs/design-system.md):

- **PoolHero** → `Card variant="hero" padding="lg"` + `<CardAura />`.
- **UserPositionCard** → `Card variant="stat" padding="lg"` com grid glassmorphism (`bg-white/5 backdrop-blur-md border border-white/5 rounded-card`).
- **RankingList / BetCategoryCards / ResultComparisonCards** → `Card default` branco + linhas editoriais / borda esquerda colorida.
- **MatchCard** → Card branco + score inputs inline + CTA pill.
- **ScoreInput** → `w-12 h-14 rounded-card` ou `w-16 h-16 rounded-card-lg`.
- **SubmitBetsBar** → `fixed bottom-24 inset-x-4 rounded-pill bg-hero-surface shadow-drop-soft-lg p-2` (sticky acima do BottomNavBar flutuante).

### Componentes `ui/` reutilizados

| Componente | Uso |
|---|---|
| `Card`, `CardAura`, subcomponentes | PoolHero (hero), UserPositionCard (stat), RankingList / BetCategoryCards / ResultComparisonCards / MatchCard (default) |
| `Button` | CTAs pill (Registrar palpite, Submit) |
| `Input` | ScoreInput (styled input nativo — D03) |

### Status por componente (verificado via Read)

| ID | Componente | Status |
|---|---|---|
| C19 PoolHeader | Não existe como arquivo. Vive inline em [PoolPanelTabs.tsx](../../../src/components/features/pool/PoolPanelTabs.tsx) linhas 22–30. **Extrair** para novo `PoolHero.tsx`. |
| C20 UserPositionCard | Existe. **Reescrever** (Card stat + glassmorphism). |
| C21 RankingTable | Existe como `RankingList.tsx`. **Migrar** (Card default + divide-y + avatares). |
| C22 BetCategoryCards | Existe. **Migrar** (cards brancos com borda esquerda colorida). |
| C23 ParticipantsList | **Não existe** como arquivo próprio — é coberto por `RankingList`. Tratar como alias (D05). |
| C24 MatchCard | **Não existe**. Criar visual-only. |
| C25 ScoreInput | **Não existe**. Criar visual-only. |
| C26 SubmitBetsBar | **Não existe**. Criar visual-only. |
| `TabBar` | Existe. **Migrar** (fora do MIGRATION-MAP original mas necessário). |
| `ResultComparisonCards` | Existe. **Migrar** (fora do MIGRATION-MAP mas é tab "Resultados"). |

### Patterns preservados

- [PoolPanelTabs.tsx](../../../src/components/features/pool/PoolPanelTabs.tsx) — state `activeTab`, renderização condicional.
- `PoolPanelData` em [src/types/pool.ts](../../../src/types/pool.ts) — preservado.
- Tabs: `ranking` / `palpites` / `resultados`.
- `currentUserId` destacado no `RankingList`.

### Status da feature

- issue-08 (painel) — parte funcional já existe (componentes estão no código).
- issue-09 (palpite) — **pendente**; rota `/pool/[poolId]/bet/[categoryId]` não existe. Por isso criamos MatchCard/ScoreInput/SubmitBetsBar como **visual-only**.

---

## Pesquisa Externa

### Referência Stitch

[/tmp/stitch-krvou/organismos.png](file:///tmp/stitch-krvou/organismos.png):
- Hero section "MEUS PALPITES" → PoolHero
- Player Stat Block → UserPositionCard
- Match Card → MatchCard (branco, crests circulares, score inputs inline, CTA pill full-width)

Nenhuma dependência nova.

---

## Cenários

### Painel — Caminho feliz

1. Usuário acessa `/pool/[poolId]` autenticado.
2. Canvas claro + `PoolHero` (Card hero + nome do bolão + stats "N participantes · X categorias · Y rodadas").
3. `TabBar` pill flutuante com 3 tabs.
4. Tab Ranking: `UserPositionCard` (Card stat) + `RankingList` (Card branco com avatares circulares, linha do usuário destacada `bg-primary/5`).
5. Tab Palpites: `BetCategoryCards` — cards brancos com borda esquerda `primary` (feito) ou `destructive` (pendente) + badge pill.
6. Tab Resultados: `ResultComparisonCards` — cards brancos com resultado vs palpite, acertou = `text-primary`, errou = `text-destructive`.

### Palpite visual-only — Preparação

1. Componentes criados em `src/components/features/pool/bet/` com mock data inline.
2. Exportar para uso em `/dev` (adicionar seção para QA visual).
3. Issue-09 vai consumir: criar rota, wiring de state, server actions.

### Edge cases

- `currentUserRank` null → `UserPositionCard` não renderiza (preservado).
- `ranking` vazio → `RankingList` mostra empty state ("Sem participantes ainda").
- `betCategories` vazio → empty state.
- `results` vazio → empty state ("Aguardando resultados").
- Tab ativa em mobile: `TabBar` ganha scroll horizontal se não couber.
- `SubmitBetsBar` sobreposto ao `BottomNavBar` flutuante → `bottom-24` em vez de `bottom-6`.

### Erros

- Sem mudança em error handling.

---

## Banco de Dados

**Nenhuma alteração.**

---

## Dependências Externas

**Nenhuma nova.**

---

## Arquivos — O Que Criar e Modificar

### Criar

| Arquivo | O que contém |
|---|---|
| `src/components/features/pool/PoolHero.tsx` | Server Component. Props: `poolName`, `participantCount`, `categoryCount`, `roundCount?`. `<Card variant="hero" padding="lg">` + `<CardAura />` + nome em `font-heading text-2xl text-on-surface` + stats editoriais em `flex gap-4` (cada stat em `flex flex-col` com número grande pixel + label small uppercase). |
| `src/components/features/pool/bet/MatchCard.tsx` | Card branco + 2 crests circulares (iniciais dos times) + ScoreInput × 2 + separador "×" + CTA pill "Salvar". Props: `match` com `homeTeam`, `awayTeam`, `kickoff`, `homeScore?`, `awayScore?`, `onSave`. |
| `src/components/features/pool/bet/ScoreInput.tsx` | Input numérico `w-12 h-14 rounded-card border-2 border-outline-variant-light font-pixel text-xl text-center` + focus `ring-2 ring-primary`. Props: `value`, `onChange`, `aria-label`. |
| `src/components/features/pool/bet/SubmitBetsBar.tsx` | `fixed bottom-24 inset-x-4 rounded-pill bg-hero-surface shadow-drop-soft-lg p-2 flex items-center justify-between`. Texto "X de Y palpites preenchidos" + `<Button variant="pill" size="pill-lg">Registrar</Button>`. Props: `filled`, `total`, `onSubmit`, `disabled`. |

### Modificar

| Arquivo | O que mudar |
|---|---|
| [src/components/features/pool/PoolPanelTabs.tsx](../../../src/components/features/pool/PoolPanelTabs.tsx) | Substituir header inline (linhas 22–30) por `<PoolHero>`. Canvas local `bg-background-light`. Espaçamento ajustado. |
| [src/components/features/pool/UserPositionCard.tsx](../../../src/components/features/pool/UserPositionCard.tsx) | Reescrever para `Card variant="stat" padding="lg"` + `<CardAura className="-left-10 -top-10" />` + grid `grid-cols-2` glassmorphism (rank / pontuação / diferença para líder / próximo alvo). Pixel font para números destacados. |
| [src/components/features/pool/RankingList.tsx](../../../src/components/features/pool/RankingList.tsx) | Envelope `<Card>` default. Linhas `flex items-center gap-3 px-4 py-3 divide-y divide-outline-variant-light`. Posição em `font-pixel text-primary-dim` circular, avatar `size-8 rounded-full`, nome body, pontuação destaque. Linha do usuário com `bg-primary/5`. |
| [src/components/features/pool/BetCategoryCards.tsx](../../../src/components/features/pool/BetCategoryCards.tsx) | Cada card em `<Card>` default com `border-l-4` dinâmico (`border-l-primary` feito / `border-l-destructive` pendente). Badge status em `rounded-pill`. Progress bar superior em `bg-primary/10` com fill `bg-primary shadow-neon-glow-sm`. |
| [src/components/features/pool/ResultComparisonCards.tsx](../../../src/components/features/pool/ResultComparisonCards.tsx) | Cards brancos com duas colunas "Resultado" vs "Seu palpite". Pontuação recebida em pill `bg-primary/10 text-primary` se acertou / `bg-destructive/10 text-destructive` se errou. |
| [src/components/features/pool/TabBar.tsx](../../../src/components/features/pool/TabBar.tsx) | Pill flutuante `inline-flex gap-1 rounded-pill bg-surface-low-light p-1`. Tab ativa: `bg-hero-surface text-on-surface rounded-pill px-4 py-1.5 shadow-drop-soft`. Inativa: `text-on-surface-variant-light hover:text-on-surface-light`. |
| [src/app/dev/page.tsx](../../../src/app/dev/page.tsx) | Adicionar seção "Pool & Bet" com preview de `PoolHero`, `UserPositionCard`, `MatchCard`, `ScoreInput`, `SubmitBetsBar` para QA visual. |

### NÃO tocar

- [src/actions/pool.ts](../../../src/actions/pool.ts), [src/actions/invite.ts](../../../src/actions/invite.ts) — preservadas.
- [src/types/pool.ts](../../../src/types/pool.ts) — tipos preservados.
- [SuccessScreen.tsx](../../../src/components/features/pool/SuccessScreen.tsx) — fora de escopo (migra em p05-p06).
- Landing, Auth, Home, Wizard, Admin.

---

## Decisões desta Issue

### D01 — Extrair PoolHero como componente novo, não manter inline

**Contexto:** Header do painel hoje é inline em `PoolPanelTabs`. MIGRATION-MAP pede componente próprio.
**Decisão:** Criar `PoolHero.tsx`. Melhora reuso + legibilidade do `PoolPanelTabs`.
**Alternativas descartadas:** Manter inline — perde clareza da estrutura.

### D02 — Criar `MatchCard`/`ScoreInput`/`SubmitBetsBar` **visual-only**, sem wiring

**Contexto:** Issue-09 (registrar palpite) ainda não foi implementada.
**Decisão:** Entregar os 3 componentes com props mocáveis + preview em `/dev`. Issue-09 consome depois, só precisando criar rota + state + action.
**Alternativas descartadas:** Esperar issue-09 — adia a refresh do painel (que está pronto); criar com fetch próprio — mistura apresentação com dados.

### D03 — `ScoreInput` em input nativo estilizado, não nova variante de `Input`

**Contexto:** Caso muito específico (square, pixel font, grande).
**Decisão:** `<input type="number" inputMode="numeric" className="...">` inline no componente. Evita variante `Input` única para este uso.
**Alternativas descartadas:** Nova variante `Input variant="score"` — over-engineered.

### D04 — `SubmitBetsBar` em `bottom-24`, não `bottom-6`

**Contexto:** BottomNavBar (após `design-refresh-layouts`) vira pill flutuante em `bottom-6`. Sobreposição.
**Decisão:** Offset de 96px (`bottom-24`) para ficar acima do nav. Design system pode introduzir token `bottom-nav-height` em issue futura.
**Alternativas descartadas:** Esconder BottomNavBar nas páginas de palpite — muda navegação, fora do escopo.

### D05 — C23 ParticipantsList = alias de RankingList

**Contexto:** Não existe arquivo dedicado. MIGRATION-MAP lista como 🟢 migrar.
**Decisão:** Tratar como alias. `RankingList` já cobre "participantes + pontuação". Nenhum arquivo novo.
**Alternativas descartadas:** Criar `ParticipantsList` duplicado — redundante.

### D06 — Canvas claro apenas na rota `/pool/[poolId]`

**Contexto:** Coerência com D01 de outras issues.
**Decisão:** Aplicar `bg-background-light` no root de `PoolPanelTabs` (componente é wrapper de page).
**Alternativas descartadas:** Global no layout — regressão.

### D07 — Migrar `ResultComparisonCards` e `TabBar` fora do MIGRATION-MAP original

**Contexto:** MIGRATION-MAP não lista explicitamente, mas são parte integral do painel.
**Decisão:** Incluir nesta issue para coerência visual completa.
**Alternativas descartadas:** Deixar arcade — inconsistência grosseira numa rota inteira migrada.

---

## Critérios de Aceitação

### Painel

- [ ] `PoolHero` renderiza como Card hero com stats editoriais
- [ ] `UserPositionCard` em Card stat com glassmorphism grid
- [ ] `RankingList` em Card branco com avatares + linha do usuário destacada
- [ ] `BetCategoryCards` com borda esquerda colorida + progress bar
- [ ] `ResultComparisonCards` em cards brancos com palette de acerto/erro
- [ ] `TabBar` em pill flutuante editorial
- [ ] Canvas `bg-background-light` na rota

### Palpite visual-only

- [ ] `MatchCard` renderiza em `/dev` com dados mock
- [ ] `ScoreInput` aceita `value`/`onChange`, estilizado
- [ ] `SubmitBetsBar` fixo em `bottom-24`, não sobrepõe BottomNavBar

### Comum

- [ ] `PoolPanelData` não tocado
- [ ] `pnpm build` + `pnpm typecheck` passam
- [ ] Landing inalterada
- [ ] `/dev` atualizado com nova seção

---

## Observações para Implementação

- Agent sugerido: **component-writer** (5+ componentes).
- Issue-09 futura pode consumir `MatchCard`/`ScoreInput`/`SubmitBetsBar` só fazendo wiring + action + rota.
- Comparar QA visual com [/tmp/stitch-krvou/organismos.png](file:///tmp/stitch-krvou/organismos.png).
- `design-refresh-layouts` deve rodar antes ou junto para o `SubmitBetsBar` não sobrepor a nav antiga.
