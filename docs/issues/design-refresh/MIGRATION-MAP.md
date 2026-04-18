# Migration Map — C01–C39 → "Digital Arena"

> Roadmap para migração gradual de features da estética "Neon Arcade Terminal"
> para "Digital Arena". Produzido em `issue/design-refresh` (fundação).
> Cada linha da tabela vira (ou entra em) uma issue de follow-up.

Legenda de status:
- 🟢 **migrar** — mudar visual mantendo estrutura/comportamento atual
- 🟡 **reescrever** — estrutura muda (novos elementos ou organização visual)
- 🔵 **manter** — fica com visual arcade por decisão explícita (ex.: GAME OVER)
- 🆕 **novo** — componente não existe hoje, criado junto com a migração

---

## Layouts e organismos de app

| ID | Componente | Path atual | Status | Novo componente/estrutura | Issue follow-up |
|---|---|---|---|---|---|
| C01 | TopBar | `src/components/layouts/TopBar.tsx` | 🟡 reescrever | Dark pill sticky com `rounded-b-2xl`, logo em `drop-shadow[0_0_8px_#39ff14]`, nav horizontal em pills | `design-refresh-layouts` |
| C01b | DashboardTopBar | `src/components/layouts/DashboardTopBar.tsx` | 🟡 reescrever | Mesmo padrão do TopBar, com slot para avatar/menu | `design-refresh-layouts` |
| C06 | BottomNavBar | `src/components/layouts/BottomNavBar.tsx` | 🟡 reescrever | **Floating pill** (`fixed bottom-6`, `rounded-card-xl`, `bg-hero-surface`) com **FAB central** em `#39ff14` elevado (`-top-8`) para ação "criar bolão" | `design-refresh-layouts` |

## Landing (/)

| ID | Componente | Status | Nova estrutura | Issue |
|---|---|---|---|---|
| C02 | Hero landing | 🟡 reescrever | Hero section com aura neon difusa + CTAs pill full-width | `design-refresh-p01` |
| C03 | FeatureCard | 🟢 migrar | Card branco (`Card default`) com ícone + título + descrição | `design-refresh-p01` |
| C04 | SocialProof | 🟢 migrar | Card branco com stats em grid | `design-refresh-p01` |
| C05 | FooterLanding | 🟢 migrar | Footer editorial em `bg-background-light` | `design-refresh-p01` |

## Auth

| ID | Componente | Status | Nova estrutura | Issue |
|---|---|---|---|---|
| C07 | AuthCard | 🟡 reescrever | Card hero com Google Sign-In em pill button | `design-refresh-p02` |

## Home autenticada (/home)

| ID | Componente | Status | Nova estrutura | Issue |
|---|---|---|---|---|
| 🆕 | HeroSection | 🆕 novo | Hero card dark com aura + greeting + próximos jogos | `design-refresh-p03` |
| C08 | PoolCard | 🟡 reescrever | **Card branco** (`Card default`) com crests circulares + badge status + CTA pill | `design-refresh-p03` |
| C09 | EmptyState | 🟢 migrar | Card branco com ilustração + CTA pill | `design-refresh-p03` |

## Wizard (criação de bolão)

| ID | Componente | Status | Nova estrutura | Issue |
|---|---|---|---|---|
| C10 | WizardShell | 🟡 reescrever | Canvas claro com progress pill no topo | `design-refresh-p04` |
| C11 | AIChatBubble | 🟡 reescrever | Bubble com `rounded-card`, bg light, shadow drop-soft | `design-refresh-p04` |
| C12 | ProductCard (escolha esporte/modalidade) | 🟡 reescrever | **Card branco** com crest circular centralizado | `design-refresh-p04` |
| C13 | ChatInput | 🟡 reescrever | **Input pill** (`<Input variant="pill">`) + botão enviar interno | `design-refresh-p04` |
| C14 | WizardStepper | 🟢 migrar | Dots em pill flutuante no topo | `design-refresh-p04` |
| C15 | QuickReply | 🟢 migrar | Pill buttons outline | `design-refresh-p04` |
| C16 | SummaryCard | 🟢 migrar | Card branco com review dos dados | `design-refresh-p04` |
| C17 | SuccessCard | 🟡 reescrever | Card hero com aura neon + mensagem "bolão criado" | `design-refresh-p05-p06` |

## Convite

| ID | Componente | Status | Nova estrutura | Issue |
|---|---|---|---|---|
| C18 | InviteCard | 🟡 reescrever | Card branco com link copiável + QR code | `design-refresh-p05-p06` |

## Painel do bolão

| ID | Componente | Status | Nova estrutura | Issue |
|---|---|---|---|---|
| C19 | PoolHeader | 🟡 reescrever | Hero section dark com nome do bolão + stats editoriais | `design-refresh-p07-p08` |
| C20 | UserPositionCard | 🟡 reescrever | **Stat block** (`Card variant="stat"`) com avatar + grid glassmorphism | `design-refresh-p07-p08` |
| C21 | RankingTable | 🟢 migrar | Card branco com linhas editoriais | `design-refresh-p07-p08` |
| C22 | BetCategoryCard | 🟢 migrar | Card branco com borda esquerda colorida (status) | `design-refresh-p07-p08` |
| C23 | ParticipantsList | 🟢 migrar | Card branco com avatares circulares | `design-refresh-p07-p08` |

## Registrar palpite

| ID | Componente | Status | Nova estrutura | Issue |
|---|---|---|---|---|
| C24 | MatchCard | 🟡 reescrever | **Card branco** com crests circulares + score inputs inline + CTA pill full-width | `design-refresh-p07-p08` |
| C25 | ScoreInput | 🟡 reescrever | Input `w-12 h-14 rounded-card` ou `w-16 h-16 rounded-card-lg` (biblioteca) dentro do MatchCard | `design-refresh-p07-p08` |
| C26 | SubmitBetsBar | 🟡 reescrever | Sticky bottom pill com CTA | `design-refresh-p07-p08` |

## Admin

| ID | Componente | Status | Nova estrutura | Issue |
|---|---|---|---|---|
| C27 | AdminDashboard | 🟡 reescrever | Canvas claro com cards editoriais de ações | `design-refresh-p09` |
| C28 | SettingsPanel | 🟢 migrar | Card branco com form em inputs default | `design-refresh-p09` |
| C29 | ParticipantsAdmin | 🟢 migrar | Card branco com lista + ações | `design-refresh-p09` |
| C30 | RulesEditor | 🟢 migrar | Card branco com accordion de regras | `design-refresh-p09` |
| C31 | DangerZone | 🟢 migrar | Card branco com borda destructive esquerda | `design-refresh-p09` |

## Bolão encerrado

| ID | Componente | Status | Nova estrutura | Issue |
|---|---|---|---|---|
| C32 | GameOverHeader | 🔵 manter (com ajustes) | **Aplicar `.arcade-scanline`** + pixel pulse. Manter estética arcade intencional | `design-refresh-p10-p11` |
| C33 | FinalRanking | 🟡 reescrever | Hero card dark com top 3 + medalhas | `design-refresh-p10-p11` |
| C34 | ChampionCard | 🟡 reescrever | Hero card com aura neon + avatar do campeão | `design-refresh-p10-p11` |

## Perfil

| ID | Componente | Status | Nova estrutura | Issue |
|---|---|---|---|---|
| C35 | ProfileCard | 🟡 reescrever | Hero card com avatar + level progress + stats grid | `design-refresh-p10-p11` |
| 🆕 | LevelProgressCard | 🆕 novo | Card stat dark com XP bar neon + stats glassmorphism | `design-refresh-p10-p11` |

## UI base (tocados em `issue/design-refresh` — fundação)

| ID | Componente | Status | O que mudou |
|---|---|---|---|
| — | `src/components/ui/card.tsx` | 🆕 novo | Criado com variantes `default` / `hero` / `stat` + `CardAura` |
| — | `src/components/ui/button.tsx` | 🟢 migrar | Adicionadas variantes `pill` e `pill-outline` + size `pill-lg` (legado preservado) |
| — | `src/components/ui/input.tsx` | 🟢 migrar | Adicionada variante `pill` (legado default preservado) |
| C36 | `src/components/ui/sonner.tsx` | 🟢 migrar | `rounded-card` + `shadow-drop-soft-md` |
| C37 | `src/components/ui/alert-dialog.tsx` | 🟢 migrar | `rounded-card` + `shadow-drop-soft-lg` |
| C38 | `src/components/ui/loading-state.tsx` | 🔵 manter | Pixel spinner é assinatura — nenhuma mudança |
| C39 | `src/components/ui/error-state.tsx` | 🟢 migrar | Ícone wrapper com `rounded-card` + `shadow-drop-soft` |

---

## Ordem sugerida de rollout

1. ✅ **`issue/design-refresh`** (fundação — concluída)
2. `design-refresh-layouts` — TopBar, DashboardTopBar, BottomNavBar (pill flutuante + FAB)
3. `design-refresh-p01` — Landing
4. `design-refresh-p02` — Auth
5. `design-refresh-p03` — Home autenticada (+ novo HeroSection)
6. `design-refresh-p04` — Wizard
7. `design-refresh-p05-p06` — Success + Invite
8. `design-refresh-p07-p08` — Painel do bolão + registrar palpite
9. `design-refresh-p09` — Painel admin
10. `design-refresh-p10-p11` — Bolão encerrado + perfil
11. `design-refresh-docs` — atualizar `docs/SPEC.md` e `docs/ISSUES.md`

Cada follow-up segue a ordem:
- `/plan <id>` → levantar pesquisa interna (reutilizar Card/Button/Input novos)
- `/execute <id>` → migrar feature mantendo API e comportamento
- `/review <id>` → validar com screenshot Stitch correspondente
