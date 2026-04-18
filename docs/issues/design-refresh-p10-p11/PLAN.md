# Plan — design-refresh-p10-p11: Bolão Encerrado (P10) + Perfil (P11) para Digital Arena

> Issue: design-refresh-p10-p11 (follow-up de [design-refresh](../design-refresh/PLAN.md))
> Data: 2026-04-17
> Escopo: Migrar GameOverHeader (C32) + FinalRanking (C33) + ChampionCard (C34) para hero cards Digital Arena **com aplicação intencional do opt-in `.arcade-scanline`** (único caso onde arcade é preservado). Migrar ProfileCard (C35) para hero card editorial. Criar LevelProgressCard novo (Card stat). Zero mudança em Server Actions, cálculo de ranking final, logout, troca de senha.

---

## ⚠️ Bloqueio atual

**Nenhum dos componentes P10/P11 existe no código.** Busca confirmou:

- `grep -r "GameOverHeader\|FinalRanking\|ChampionCard\|ProfileCard\|LevelProgress" src/` → **zero hits**.
- Rota `/pool/[poolId]` **renderiza o painel participante** (issue-08, já migrado em p07-p08). Não há branch `if (pool.status === "closed")` que leve a layout distinto.
- Rota `/settings` **não existe** em `src/app/`.

Ou seja, P10 e P11 dependem de:

- **issue-11** (Bolão Encerrado) — pendente
- **issue-12** (Perfil / Settings) — pendente

### Recomendação

Mesma de p09: **issues 11 e 12 devem nascer em Digital Arena**. Esta issue serve como **cartilha de mapeamento** se por qualquer motivo elas forem implementadas em arcade legado.

A lista de arquivos "Modificar" fica como **hipótese** até que 11/12 entreguem os componentes.

---

## Resumo

Esta é a única issue da esteira que **preserva conscientemente** a estética arcade — o GameOverHeader (C32) é um dos casos de "assinatura arcade" (como LoadingState pixel spinner em issue-01 D06). O resto do canvas P10 vira Digital Arena: Hero cards dark + CardAura + medalhas top 3 editoriais. P11 vira hero card editorial de perfil + LevelProgressCard novo em Card stat com XP bar neon.

---

## Pesquisa Interna

### Design System (verificação obrigatória)

Lido em [.claude/docs/design-system.md](../../../.claude/docs/design-system.md):

- **Arcade Scanline Opt-in**: a classe `.arcade-scanline` existe em `src/app/globals.css` e foi mantida intencionalmente pela issue fundação para casos como GAME OVER (decisão D06 da design-refresh).
- **Canvas P10**: `bg-hero-surface` (dark roxo profundo `#190032`) + `Card variant="hero"` + `<CardAura />`.
- **Canvas P11**: `bg-background-light` + `Card variant="hero"` para ProfileCard (dark hero contra canvas claro = impacto editorial).
- **LevelProgressCard (novo)**: `Card variant="stat"` com glassmorphism grid. XP bar em `bg-gradient-to-r from-primary to-secondary-light rounded-pill h-2`.

### Componentes `ui/` reutilizados

| Componente | Uso |
|---|---|
| `Card`, `CardHeader`, `CardContent`, `CardFooter`, `CardAura` | P10 (hero ranking + champion), P11 (hero profile) |
| `Card variant="stat"` | LevelProgressCard novo |
| `Button` (`pill`, `pill-outline`, `pill-lg`) | "Criar novo bolão" (pill neon), "Logout" (pill-outline destrutivo) |
| `Input` (`default`) | Form de perfil (nome, senha) |
| `AlertDialog` | Confirmação de logout |

### Patterns preservados (quando issues 11/12 existirem)

- `getPoolFinalRanking`, `updateProfileAction`, `changePasswordAction`, NextAuth `signOut()`.
- Status `closed` rota em `/pool/[poolId]/page.tsx` com branch de layout.
- Form de senha só aparece para usuários com auth email/senha (não Google).
- Avatar placeholder com iniciais.

### Opt-in arcade em `globals.css`

Verificado em `src/app/globals.css`: `.arcade-scanline` aplica `linear-gradient` horizontal 5% opacity como overlay. Deve ser aplicada **apenas no GameOverHeader**, não no resto da página.

---

## Pesquisa Externa

### Referência Stitch

Biblioteca Digital Arena tem screens "Champion" (hero card dark + medalha + aura neon forte) e "Profile" (hero card + avatar + stats grid glassmorphism).

---

## Cenários (para quando issues 11/12 existirem)

### P10 — Caminho feliz (bolão encerrado)

1. Usuário acessa `/pool/[poolId]` de bolão com `status === "closed"`.
2. Página server-side detecta status e renderiza layout P10 (não P07).
3. Canvas `bg-hero-surface` com GameOverHeader em pixel font dourado + `.arcade-scanline` + pulse animation.
4. Abaixo, `Card hero` + `CardAura` com FinalRanking: avatar campeão + top 3 com medalhas (🥇🥈🥉 em pixel font com cores gold/silver/bronze).
5. Ranking completo em lista tokenizada (4º+) expansível via "+ X participantes".
6. CTA `Button variant="pill" size="pill-lg"` "Criar novo bolão" → navega para `/pool/new?step=1`.

### P11 — Caminho feliz (perfil)

1. Usuário acessa `/settings` (rota protegida).
2. Canvas `bg-background-light` + `Card hero` central com avatar placeholder + nome + LevelProgressCard abaixo (stat card com XP bar neon + stats grid).
3. Seção editar perfil em `Card default` com Input default + Button pill "Salvar".
4. Seção trocar senha em `Card default` (só email/senha) com 3 Inputs default + Button pill.
5. Seção logout em `Card default` com Button `pill-outline` destrutivo + ConfirmModal preservado.

### Edge cases

- **P10**: `.arcade-scanline` só envolve o `<h1>GAME OVER</h1>` (não o ranking inteiro — senão polui).
- **P10**: Sem palpites no bolão (cenário raro) → empty state "Ninguém palpitou" — manter fora do hero.
- **P11**: Usuário Google → esconder seção trocar senha (preservado).
- **P11**: Nome < 2 chars → validação inline preservada.
- **P11**: Avatar → placeholder com iniciais (mesmo padrão de ParticipantsList em p07-p08).

### Erros

- `updateProfileAction` falha → `toast.error("Erro ao atualizar perfil")`.
- `changePasswordAction` falha → `toast.error("Senha atual incorreta")`.
- Logout → NextAuth preservado (sem try/catch customizado).

---

## Banco de Dados

**Nenhuma alteração.**

---

## Dependências Externas

**Nenhuma nova.**

---

## Arquivos — O Que Criar e Modificar

### ⚠️ Pendente das issues 11 e 12

A lista abaixo é **hipótese** — os paths reais dependem de como issues 11/12 organizarem a estrutura.

### Hipótese — Criar

| Arquivo (hipótese) | O que contém |
|---|---|
| `src/components/features/pool/closed/LevelProgressCard.tsx` | `Card variant="stat"` com XP bar (`bg-gradient-to-r from-primary to-secondary-light`) + 3 stats glassmorphism (bolões criados, vitórias, pontos totais). |

### Hipótese — Modificar (quando existirem)

| Arquivo (hipótese) | O que mudar |
|---|---|
| `src/app/pool/[poolId]/page.tsx` | Adicionar branch `if (pool.status === "closed") return <ClosedPoolView />`. `ClosedPoolView` renderiza layout P10. Canvas `<main className="bg-hero-surface min-h-screen pt-20 pb-28 px-4">`. |
| `src/components/features/pool/closed/GameOverHeader.tsx` | `<section className="arcade-scanline relative text-center py-10">` + `<h1 className="font-pixel text-5xl text-secondary-light drop-shadow-[0_0_20px_rgba(228,228,3,0.8)] animate-pulse">GAME OVER</h1>` + nome do bolão abaixo em `font-pixel text-primary text-lg`. |
| `src/components/features/pool/closed/FinalRanking.tsx` | `<Card variant="hero" padding="lg" className="relative"><CardAura />`. Top 3 em grid 3 colunas com alturas proporcionais (1º mais alto, bordas `border-secondary-light` / silver / bronze). Ranking 4º+ em lista `divide-white/10`. |
| `src/components/features/pool/closed/ChampionCard.tsx` | `<Card variant="hero" padding="lg">` + avatar grande (`w-24 h-24 rounded-full ring-4 ring-secondary-light`) + nome campeão em `font-heading text-2xl` + pontuação em `font-pixel text-primary text-3xl`. |
| `src/app/settings/page.tsx` | **Criar.** Canvas `<main className="bg-background-light min-h-screen pt-20 pb-28 px-4 flex flex-col items-center gap-6">`. |
| `src/components/features/profile/ProfileCard.tsx` | `<Card variant="hero" padding="lg" className="w-full max-w-md">` + `<CardAura />` + avatar (`w-20 h-20 rounded-full bg-white/10 ring-4 ring-primary/40`) + nome em `font-heading text-xl` + email `text-on-surface-variant`. |
| `src/components/features/profile/EditProfileForm.tsx` | `<Card padding="md" className="w-full max-w-md">` + `<Input variant="default">` + `<Button variant="pill" size="pill-lg" className="w-full">Salvar</Button>`. |
| `src/components/features/profile/ChangePasswordForm.tsx` | Idem editar perfil + validação inline preservada. |
| `src/components/features/profile/LogoutSection.tsx` | `<Card padding="md" className="w-full max-w-md">` + `<Button variant="pill-outline" className="text-destructive border-destructive/60 hover:bg-destructive/10">Sair</Button>` + ConfirmModal. |

### NÃO tocar

- `src/actions/profile.ts`, `src/actions/pool.ts` — lógica preservada.
- NextAuth config — preservada.
- `src/components/layouts/BottomNavBar.tsx` — se issue-12 ativar slot "Perfil" (hoje placeholder), só muda `disabled=false` + link.

---

## Decisões desta Issue

### D01 — Issues 11 e 12 devem nascer em Digital Arena

**Contexto:** Pendente no backlog. Implementar em arcade gera retrabalho.
**Decisão:** Recomendar no kickoff que nasçam com tokens Digital Arena. Isso **torna esta issue redundante**, igual a p09.
**Alternativas descartadas:** Implementar em arcade e depois migrar — duplica trabalho.

### D02 — `.arcade-scanline` é intencional e único em P10

**Contexto:** Decisão D06 da fundação preservou `.arcade-scanline` como opt-in. Este é o único lugar onde faz sentido aplicar.
**Decisão:** Aplicar **apenas** no `<section>` do GameOverHeader (não na página inteira). O resto de P10 é Digital Arena (hero cards + aura).
**Alternativas descartadas:** Scanline na página toda — atrapalha leitura do ranking; Remover scanline de vez — perde a homenagem arcade no único momento apropriado.

### D03 — GAME OVER mantém `font-pixel` + pulse + dourado

**Contexto:** "GAME OVER" é o momento mais nostálgico do app. Pixel font + pulse + dourado é assinatura.
**Decisão:** Manter. Similar a "BOLÃO CRIADO!" em p05 (ambos são casos de pixel font intencional).
**Alternativas descartadas:** Trocar por Space Grotesk — perde impacto nostálgico.

### D04 — FinalRanking em `Card hero` com aura neon forte

**Contexto:** Bolão encerrado é celebratório. Digital Arena prevê hero para esses momentos.
**Decisão:** `Card hero` + `CardAura />` (a aura neon forte destaca o top 3).
**Alternativas descartadas:** Canvas claro + Card default — não celebra o suficiente.

### D05 — ChampionCard embutido ou separado?

**Contexto:** MIGRATION-MAP lista C33 (FinalRanking) e C34 (ChampionCard) separados. Pode ser consolidado ou dividido.
**Decisão:** **Separados** para flexibilidade de layout (ChampionCard no topo, FinalRanking abaixo) e melhor separação de responsabilidade.
**Alternativas descartadas:** Tudo num único componente — dificulta reuso e testes.

### D06 — Medalhas top 3 em pixel font com cores temáticas

**Contexto:** Top 3 precisa destaque. Medalha visual + cor.
**Decisão:** 🥇 `text-secondary-light` (dourado), 🥈 `text-white/80`, 🥉 `text-[#cd7f32]` (bronze). Posição em `font-pixel`.
**Alternativas descartadas:** Só números — sem impacto; SVG customizado — overkill para escopo visual.

### D07 — ProfileCard em `Card hero` em canvas claro

**Contexto:** Perfil é painel de identidade. Hero dark contra canvas claro = impacto editorial.
**Decisão:** `bg-background-light` + `Card hero`. Similar a p05 (canvas claro + hero).
**Alternativas descartadas:** Canvas dark — cansativo para uso funcional de settings.

### D08 — LevelProgressCard novo em `Card stat`

**Contexto:** MIGRATION-MAP marca como 🆕 novo. Stat card é o padrão para números + glassmorphism.
**Decisão:** `Card variant="stat" padding="md"` + XP bar gradient primary→secondary-light + 3 stats em grid (2x1 ou 3x1). Stats mockados iniciais: "Bolões", "Vitórias", "Pontos".
**Alternativas descartadas:** Card hero — excessivo; Card default — sem glassmorphism; Stats no ProfileCard direto — acumula.

### D09 — Logout em Card separado com pill-outline destrutivo

**Contexto:** Ação destrutiva precisa isolamento.
**Decisão:** Card isolado + Button `pill-outline` com classes destructive. ConfirmModal preservado.
**Alternativas descartadas:** Botão dentro do form de perfil — mistura contextos.

### D10 — Rota `/settings` é criada pela issue-12, não por esta

**Contexto:** Rota não existe hoje. Esta issue **não** cria rota — só estiliza os componentes quando existirem.
**Decisão:** Documentar no plan que issue-12 precisa criar `/settings/page.tsx`. Esta issue só edita os componentes.
**Alternativas descartadas:** Criar rota aqui — mistura design-refresh com feature implementation.

### D11 — Slot "Perfil" do BottomNavBar fica ativo após issue-12

**Contexto:** Em design-refresh-layouts, 4º slot ficou `disabled` como placeholder (decisão daquela issue).
**Decisão:** issue-12 ativa o slot (remove `disabled`, aponta para `/settings`). Esta issue (p10-p11) **não** toca BottomNavBar.
**Alternativas descartadas:** Ativar aqui — fora de escopo; mistura com layouts já migrado.

---

## Critérios de Aceitação

**Pré-requisito:** issues 11 e 12 concluídas (ou adotam Digital Arena no kickoff, tornando esta issue redundante).

### P10 — Bolão Encerrado

- [ ] Canvas em `bg-hero-surface`
- [ ] GameOverHeader com `.arcade-scanline` + pixel font dourado + pulse
- [ ] ChampionCard em `Card hero` + `CardAura` + avatar ring primário
- [ ] FinalRanking em `Card hero` + top 3 com medalhas pixel font coloridas
- [ ] Ranking 4º+ em lista tokenizada expansível
- [ ] CTA "Criar novo bolão" em `Button pill size="pill-lg"`

### P11 — Perfil

- [ ] Canvas em `bg-background-light`
- [ ] ProfileCard em `Card hero` + avatar + nome + email
- [ ] LevelProgressCard novo em `Card stat` + XP bar gradient + stats grid
- [ ] EditProfileForm em Card + Input default + Button pill
- [ ] ChangePasswordForm só para usuários email/senha
- [ ] LogoutSection em Card separado + pill-outline destrutivo + ConfirmModal
- [ ] Rota `/settings` funciona (criada pela issue-12)

### Geral

- [ ] `.arcade-scanline` aplicado APENAS no GameOverHeader (não na página P10 toda)
- [ ] Server Actions intactas (updateProfile, changePassword, signOut, getPoolFinalRanking)
- [ ] `pnpm build` + `pnpm typecheck` passam
- [ ] BottomNavBar slot "Perfil" ativado pela issue-12 (fora desta issue)

---

## Follow-up (fora desta issue)

- Se issues 11/12 saírem em arcade, reabrir esta issue com paths reais.
- LevelProgressCard: adicionar dados reais de XP/level quando houver schema (hoje seria mockado).

---

## Observações para Implementação

- **Não inicie esta issue sem verificar status de issues 11 e 12.** Rode `ls src/app/settings/` + `grep -r "closed" src/app/pool/\[poolId\]/page.tsx`; se ambos vazios, parar.
- Agent sugerido: **component-writer** (quando 11/12 existirem).
- QA visual: testar bolão com `status = "closed"` via seed; `/settings` logado.
- Comparar com biblioteca Stitch — seções Champion + Profile.
- **Não remova** `.arcade-scanline` do globals.css — é opt-in explícito.
- Lista de arquivos "Modificar/Criar" é **hipótese** — atualizar no kickoff quando 11/12 fecharem.
