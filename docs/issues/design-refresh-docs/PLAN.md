# Plan — design-refresh-docs: Atualizar SPEC.md e ISSUES.md pós Digital Arena

> Issue: design-refresh-docs (último follow-up da esteira)
> Data: 2026-04-17
> Escopo: **Documental apenas.** Atualizar `docs/SPEC.md` (header de versão + seção Design System + referências arcade espalhadas no catálogo de Componentes) e `docs/ISSUES.md` (contagem de issues + nota de "visual pós design-refresh" nas 10 features do backlog). **Zero mudança em código.**

---

## Resumo

Refletir nos documentos-mestres do projeto a migração completa de "Neon Arcade Terminal" para "Digital Arena". Depois desta issue, qualquer contribuidor que ler SPEC.md ou ISSUES.md vê que o sistema visual é Digital Arena, sem referências defasadas a "pixel font em toda parte", "neon green #39ff14 em todos os CTAs", "border-radius 0 global", "scanline global", etc. — tudo isso virou **opt-in consciente** ou foi substituído.

Esta issue **não reescreve a SPEC inteira** — ela faz **cirurgia editorial**: trocas de redação em seções específicas + delegação para `.claude/docs/design-system.md` como fonte canônica de tokens.

---

## Pesquisa Interna

### Design System — Fonte canônica

Lido em [.claude/docs/design-system.md](../../../.claude/docs/design-system.md): é o documento que contém tokens Digital Arena completos (cores, tipografia, Card/Button/Input, Cards hero/stat, CardAura, shadow-drop-soft, shadow-neon-glow, rounded-card/pill/card-lg/card-xl, etc.).

**Decisão editorial (DD01 abaixo):** SPEC.md **não** duplica o design system. SPEC mantém o "norte conceitual" da estética Digital Arena em um parágrafo + 2-3 regras-chave, e delega para `.claude/docs/design-system.md` a parte técnica (tokens, variantes, shadows).

### Foundation da migração

Lido em [docs/issues/design-refresh/PLAN.md](../design-refresh/PLAN.md): decisões D01-D06 definiram:

- D01: Digital Arena como nova estética.
- D02: Card/Button/Input com variantes novas, legado preservado.
- D03: Shadow tokens neon + drop-soft.
- D04: CardAura opt-in.
- D05: `.arcade-scanline` opt-in global (sem aplicação padrão).
- D06: Pixel font opt-in (LoadingState, GAME OVER, BOLÃO CRIADO).

### MIGRATION-MAP

Lido em [docs/issues/design-refresh/MIGRATION-MAP.md](../design-refresh/MIGRATION-MAP.md): mapa C01-C39 com status por componente.

### ISSUES.md atual

Lido em [docs/ISSUES.md](../../ISSUES.md): 12 issues totais, header diz `Total: 12 issues | Concluidas: 1/12 | Em progresso: 2/12`. Cada issue tem Subtask V (visual) descrita em arcade legado — copy ainda fala em "pixel font", "4px offset arcade", "border-radius 0", "scanline overlay", "bg neon green".

### Referência Stitch

Biblioteca Digital Arena é a fonte visual — SPEC e ISSUES devem referenciá-la onde a antiga SPEC cita "Google Stitch v5 arcade".

---

## Pesquisa Externa

**Nenhuma.** Issue 100% documental.

---

## Cenários

### Caminho feliz

1. Desenvolvedor novo abre `docs/SPEC.md`.
2. Lê header atualizado: "v3 — Digital Arena (migração visual concluída em design-refresh)".
3. Seção "Overview" mantém stack + produto; "Design" vira 1 parágrafo + link para `.claude/docs/design-system.md`.
4. Seção "Design System" vira **compacta**: 5-6 linhas descrevendo Digital Arena + referência a tokens.
5. Seção "Componentes" mantém IDs C01-C39 com descrições atualizadas (sem menção a "arcade 4px offset", "pixel font" exceto nos 3 casos opt-in).
6. Seção "Paginas" mantém P01-P11 com descrições atualizadas (canvas claro, hero cards, etc.).
7. Desenvolvedor abre `docs/ISSUES.md`.
8. Header diz "23 issues totais" (12 features + 10 design-refresh + 1 fundação atualizada = repriorizar).
9. Cada issue do backlog (02-12) ganha nota "Visual pós design-refresh: ver `docs/issues/design-refresh-*/PLAN.md`".

### Edge cases

- SPEC tem 681 linhas — **não** reescrever inteira. Editar cirurgicamente.
- Manter IDs C01-C39 e B01-B38 **intocados** — são referências de código e ISSUES.md.
- `.claude/docs/design-system.md` **já existe e está canônico** — não tocar nele aqui.
- Issues não implementadas (10, 11, 12) ganham aviso explícito: "implementar direto em Digital Arena".

### Erros

- Quebrar referências cruzadas (ex: `issue-02` cita C02 que é renomeado) → **proibido renomear IDs**.
- Remover sem substituir (ex: remover seção Design System inteira sem apontar para `.claude/docs/`) → **proibido**.

---

## Banco de Dados

**Nenhuma alteração.**

---

## Dependências Externas

**Nenhuma.**

---

## Arquivos — O Que Criar e Modificar

### Criar

Nenhum.

### Modificar

#### 1. `docs/SPEC.md`

**L3 — Header de versão**

Trocar:
```
> Status: Em revisao (wizard redesenhado — v2)
> Baseado em: docs/brief/BRIEF.md + Google Stitch (Landing Page v5)
```
Por:
```
> Status: Estavel (v3 — Digital Arena, migracao visual concluida em design-refresh)
> Baseado em: docs/brief/BRIEF.md + Google Stitch (biblioteca Digital Arena)
> Design system tecnico: .claude/docs/design-system.md (fonte canonica de tokens, variantes, shadows)
```

**L17 — Linha de Design**

Trocar:
```
**Design:** Estetica arcade hard-edge (Stitch Landing Page v5) — neon green #39ff14, deep purple #120224, border-radius 0, pixel font, CRT overlay.
```
Por:
```
**Design:** Digital Arena — canvas claro `#f9faf6` + hero cards dark `#190032`, rounded pills (`rounded-card-xl`), shadow drop-soft + shadow-neon-glow, Space Grotesk + Inter. Pixel font e scanline arcade preservados **apenas** em opt-ins conscientes (GAME OVER, BOLAO CRIADO, LoadingState). Ver `.claude/docs/design-system.md` para tokens.
```

**L21-L94 — Seção "Design System"**

Reescrever inteira. **Antes:** ~74 linhas descrevendo "Neon Arcade Terminal", "PCB Layers", "3D Pixel Principle", "Pixel Font", scanline global, border-radius 0.

**Depois (compacto, ~15 linhas):**

```markdown
## Design System — Digital Arena

### North Star
Estetica "Digital Arena": canvas editorial claro + momentos celebratorios em hero cards dark com aura neon. Equilibrio entre confianca (canvas claro, cards brancos, inputs default) e energia (pills neon, hero cards dark, aura verde).

### Cores, Tipografia e Componentes
Fonte canonica: `.claude/docs/design-system.md`. Resumo:

- **Paleta:** `background-light` (#f9faf6), `hero-surface` (#190032), `primary` (neon green #39ff14), `secondary-light` (dourado #e4e403), `destructive` (vermelho).
- **Superficies:** surface-low-light, surface-container-light, outline-variant-light (canvas claro); hero-surface + white/10 (hero cards).
- **Tipografia:** Space Grotesk (headings), Inter (body), Press Start 2P (pixel — **opt-in**).
- **Componentes base:** `Card` (variantes `default` / `hero` / `stat` + `CardAura`), `Button` (`pill`, `pill-outline`, size `pill-lg`), `Input` (`default`, `pill`).
- **Shadows:** `shadow-drop-soft`, `shadow-neon-glow`, `shadow-neon-glow-strong`.
- **Radii:** `rounded-card` (1rem), `rounded-card-lg` (2rem), `rounded-card-xl` (3rem), `rounded-pill`.

### Opt-ins arcade preservados
- `font-pixel` — apenas GAME OVER (P10), BOLAO CRIADO (P05), LoadingState spinner (C38).
- `.arcade-scanline` — apenas GameOverHeader (C32).
- Esses casos sao **assinatura nostalgica intencional**, nao padrao global.

### Do's and Don'ts
- Canvas claro e default para todo conteudo funcional (home, wizard, invite, admin, perfil).
- Hero cards dark para celebracao (criacao, encerramento, perfil/champion).
- Pill buttons sao o CTA padrao — `pill` para primario, `pill-outline` para secundario e destrutivo.
- **Nao** aplicar scanline global. **Nao** forcar pixel font fora dos opt-ins. **Nao** usar border-radius 0 em componentes novos.
```

**L97 — Seção "Paginas"**

Adicionar parágrafo introdutório logo antes de "### P01 — Landing Page":
```
> As secoes abaixo descrevem as paginas em sua forma funcional. O visual de cada uma foi migrado para Digital Arena via esteira `design-refresh-*`. Descricoes mencionam **intencao**, nao tokens — para estilos concretos, consultar o componente correspondente em `src/components/features/`.
```

**L99-L246 — P01 a P11**

Passar seção por seção **editando cirurgicamente** as frases que ainda descrevem arcade. Exemplos-alvo:

- "pixel font" fora de GAME OVER/BOLAO CRIADO/LoadingState → trocar por "headline em `font-heading`" ou remover.
- "border-radius 0", "borda 4px", "4px offset" → remover (substituído por rounded-card / shadow-drop-soft).
- "neon green em todo botão" → trocar por "CTAs pill" (implícito que pill usa neon).
- "scanline overlay" global → remover; manter apenas em GameOverHeader (P10 C32).
- "bg-primary-container" nas tabs → trocar por "Card/pill tokens".

Alvos por página (linhas aproximadas):

- **P01 Landing** (L99-107): `issue/design-refresh-p01` vai reescrever a copy visual; esta issue apenas garante que a copy menciona "canvas claro + hero section editorial + CTAs pill". **Não** detalhar tokens.
- **P02 Auth** (L108-114): "Card hero + pill neon + input pill". Remover "input inset arcade".
- **P03 Home** (L115-126): "HeroSection dark + PoolCard branco + BottomNavBar floating pill + FAB central". Remover "border superior 4px", "border-radius 0".
- **P04 Wizard** (L127-157): "Canvas claro + WizardProgressBar pill + ProductCards brancos + Input default". Remover "border 4px arcade", "pixel font em STEP X/3" (vira Space Grotesk).
- **P05 Sucesso** (L158-164): "Hero card + CardAura + pixel font em BOLAO CRIADO (opt-in)". **Manter pixel font** neste caso.
- **P06 Convite** (L165-172): "Canvas claro + Card default + pill neon".
- **P07 Painel Particip.** (L173-190): "Hero PoolHero + Card stat UserPosition + Cards brancos ranking/palpites/resultados".
- **P08 Registrar Palpite** (L191-210): "Card branco MatchCard + ScoreInput tokenizado + SubmitBetsBar sticky pill".
- **P09 Admin** (L211-230): "Canvas claro + Card stat stats + Cards editoriais pendentes/inseridos + DangerZone border-l destructive".
- **P10 Encerrado** (L231-238): **Manter** descrição arcade-forte: "GAME OVER pixel font dourado com `.arcade-scanline` (opt-in intencional)". Adicionar "Podium em hero card + aura + top 3 medalhas".
- **P11 Perfil** (L239-246): "ProfileCard hero + LevelProgressCard stat + forms em Cards brancos".

**L249-394 — Seção "Componentes"**

Mesma cirurgia. Passar por cada C## e atualizar a frase de descrição sempre que cite arcade. Especialmente:

- **C01, C01b (TopBar, DashboardTopBar):** "Dark pill sticky com rounded-b-2xl, logo drop-shadow neon, navegacao horizontal em pills." Remover "border inferior 4px".
- **C06 (BottomNavBar):** "Floating pill fixed bottom-6 rounded-card-xl com FAB central elevado (-top-8)." Remover "border superior 4px".
- **C08 (PoolCard):** "Card branco com crests circulares + badge status + CTA pill." Remover "border 4px arcade".
- **C12 (ProductCard):** "Card branco com crest circular centralizado." Remover estado selecionado "borda primary 4px" (substituído por ring-primary + shadow-neon-glow).
- **C13 (agora PoolNameInput, foi ChatInput no MIGRATION-MAP):** "Input default com contador de chars." (Não é mais chat.)
- **C14 (CategoryCheckCard — era WizardStepper no MIGRATION-MAP):** manter função original da spec.
- **C18 (InviteCard):** "Card branco com link copiável + categorias bullets em `text-primary`." Remover "bullets dourados".
- **C20 (UserPositionCard):** "Card stat dark com avatar + grid glassmorphism." Remover "borda accent bg gradient".
- **C21 (RankingList):** "Card branco com linhas editoriais." Remover "linha destaque verde" (substituído por `bg-primary/10 ring-primary/30`).
- **C22 (BetCategoryCard):** "Card branco com borda esquerda colorida (status)."
- **C25 (ScoreInput):** "Input `w-12 h-14 rounded-card` ou `w-16 h-16 rounded-card-lg`." Remover "pixel font".
- **C28/C29 (PendingResultCard/InsertedResultCard):** "Card branco com border-l secondary-light / primary + opacity-70."
- **C32 (GameOverHeader):** **Manter** "pixel font dourado com text-shadow e glow" + adicionar "`.arcade-scanline` opt-in".
- **C33 (Podium):** "Hero card dark com top 3 + medalhas dourado/prata/bronze em pixel font."
- **C36 (Toast):** "`rounded-card` + `shadow-drop-soft-md`." Remover "borda 4px".
- **C37 (AlertDialog/ConfirmModal):** "`rounded-card` + `shadow-drop-soft-lg`."
- **C38 (LoadingState):** "Pixel spinner — assinatura opt-in preservada."
- **C39 (ErrorState):** "Icone wrapper com rounded-card + shadow-drop-soft."

**Adicionar Decisões no final**

Adicionar no final da SPEC (antes de qualquer `---` final ou EOF) uma subseção:

```markdown
## Decisoes Visuais (v3 — Digital Arena)

### DD01 — SPEC delega tokens para `.claude/docs/design-system.md`
**Contexto:** Manter tokens duplicados em SPEC + design-system.md gera drift.
**Decisao:** design-system.md e fonte canonica. SPEC menciona conceito + delega.
**Alternativas descartadas:** SPEC como fonte unica — perde granularidade tecnica.

### DD02 — Arcade preservado apenas em 3 opt-ins
**Contexto:** Pixel font e scanline sao assinatura nostalgica. Manter global polui editorial.
**Decisao:** `font-pixel` em GAME OVER (C32), BOLAO CRIADO (C17), LoadingState (C38). `.arcade-scanline` em C32 (GameOverHeader).
**Alternativas descartadas:** Remover 100% — perde identidade; manter global — visual inconsistente.

### DD03 — Issues pendentes (10/11/12) devem nascer em Digital Arena
**Contexto:** Implementar em arcade e migrar depois dobra trabalho.
**Decisao:** issues 10/11/12 adotam tokens Digital Arena desde o primeiro commit. Isso torna design-refresh-p09 e design-refresh-p10-p11 redundantes.
**Alternativas descartadas:** Aguardar implementacao arcade + migrar depois.
```

---

#### 2. `docs/ISSUES.md`

**L1-L5 — Header**

Trocar:
```
# Issues — KRVOU

> Baseado em: docs/SPEC.md (v2 — wizard redesenhado, sem IA)
> Total: 12 issues | Concluidas: 1/12 | Em progresso: 2/12
> Pendencias externas: ver [docs/PENDING.md](PENDING.md)
```
Por:
```
# Issues — KRVOU

> Baseado em: docs/SPEC.md (v3 — Digital Arena)
> Total: 12 issues de feature + 10 issues de design-refresh (esteira visual)
> Concluidas (feature): 1/12 | Em progresso: 2/12
> Esteira design-refresh: ver seção "Esteira Design Refresh" abaixo
> Pendencias externas: ver [docs/PENDING.md](PENDING.md)
```

**L11 — issue-01 header**

Adicionar nota no final da seção issue-01 (logo após `**Paralelo:** sim`):
```
> **Atualizacao 2026-04-17:** tokens arcade originais foram reescritos em Digital Arena pela esteira `design-refresh-*`. Design tokens atuais vivem em `.claude/docs/design-system.md`.
```

**L55-L92 — issue-02 (Landing)**

Adicionar bloco no final da issue (logo antes do `---` que separa para issue-03):
```
> **Visual pos design-refresh:** `design-refresh-p01` migrou landing para hero com aura neon + FeatureCard branco + canvas claro. Ver `docs/issues/design-refresh-p01/PLAN.md`.
```

**L97-L178 — issue-03 (Auth)**
Adicionar:
```
> **Visual pos design-refresh:** `design-refresh-p02` migrou AuthForm para Card hero + Input pill + Google button pill-outline. Ver `docs/issues/design-refresh-p02/PLAN.md`.
```

**L182-L251 — issue-04 (Home)**
Adicionar:
```
> **Visual pos design-refresh:** `design-refresh-layouts` migrou BottomNavBar para floating pill + FAB; `design-refresh-p03` criou HeroSection dark, migrou PoolCard para Card branco, EmptyState para canvas claro. Ver `docs/issues/design-refresh-layouts/PLAN.md` e `docs/issues/design-refresh-p03/PLAN.md`.
```

**L256-L415 — issue-05 (Wizard)**
Adicionar:
```
> **Visual pos design-refresh:** `design-refresh-p04` migrou WizardShell/WizardProgressBar para pill + ProductCard branco + Input default. Ver `docs/issues/design-refresh-p04/PLAN.md`.
```

**L418-L471 — issue-06 (Bolao Criado)**
Adicionar:
```
> **Visual pos design-refresh:** `design-refresh-p05-p06` migrou SuccessScreen para Card hero + CardAura (pixel font "BOLAO CRIADO!" preservado como opt-in). Ver `docs/issues/design-refresh-p05-p06/PLAN.md`.
```

**L475-L543 — issue-07 (Convite)**
Adicionar:
```
> **Visual pos design-refresh:** `design-refresh-p05-p06` migrou InviteCard para canvas claro + Card branco + pill neon. Ver `docs/issues/design-refresh-p05-p06/PLAN.md`.
```

**L546-L617 — issue-08 (Painel Participante)**
Adicionar:
```
> **Visual pos design-refresh:** `design-refresh-p07-p08` migrou PoolHeader para hero + UserPositionCard para Card stat + BetCategoryCard com border-l colorida. Ver `docs/issues/design-refresh-p07-p08/PLAN.md`.
```

**L620-L694 — issue-09 (Registrar Palpite)**
Adicionar:
```
> **Visual pos design-refresh:** `design-refresh-p07-p08` cobriu componentes MatchCard / ScoreInput / SubmitBetsBar (criados visualmente junto da issue-09 em Digital Arena). Ver `docs/issues/design-refresh-p07-p08/PLAN.md`.
```

**L697-L779 — issue-10 (Painel Admin)**
Adicionar aviso forte (DD03 reflexo):
```
> **⚠️ Design refresh:** issue-10 **deve nascer em Digital Arena** — adotar tokens `.claude/docs/design-system.md` desde o primeiro commit. Isso torna `design-refresh-p09` redundante. Se por cronograma issue-10 sair em arcade, executar `design-refresh-p09` depois. Ver `docs/issues/design-refresh-p09/PLAN.md` como cartilha de mapeamento.
```

**L782-L833 — issue-11 (Bolao Encerrado)**
Adicionar aviso:
```
> **⚠️ Design refresh:** issue-11 deve nascer em Digital Arena. Preservar `.arcade-scanline` e `font-pixel` apenas no GameOverHeader (opt-in). Ver `docs/issues/design-refresh-p10-p11/PLAN.md`.
```

**L836-L892 — issue-12 (Perfil)**
Adicionar aviso:
```
> **⚠️ Design refresh:** issue-12 deve nascer em Digital Arena. ProfileCard em hero + LevelProgressCard em stat card. Ativar 4º slot "Perfil" do BottomNavBar (hoje placeholder disabled). Ver `docs/issues/design-refresh-p10-p11/PLAN.md`.
```

**L895-L910 — Mapa de Dependencias**

Adicionar ao final do bloco de código:
```
Paralelo a toda a esteira:
└── design-refresh (fundacao) ──✅
    ├── design-refresh-layouts ──✅ (ou em progresso)
    ├── design-refresh-p01 — Landing
    ├── design-refresh-p02 — Auth
    ├── design-refresh-p03 — Home
    ├── design-refresh-p04 — Wizard
    ├── design-refresh-p05-p06 — Sucesso + Convite
    ├── design-refresh-p07-p08 — Painel + Palpite
    ├── design-refresh-p09 — Admin (bloqueada por issue-10, ver DD03)
    ├── design-refresh-p10-p11 — Encerrado + Perfil (bloqueada por issues 11/12, ver DD03)
    └── design-refresh-docs — esta issue
```

**L912-L923 — Ordem de Implementacao**

Adicionar nota no final:
```
### Esteira Design Refresh

A esteira `design-refresh-*` roda **paralela** ao backlog de features. Para features ja implementadas (issues 1-9), a esteira migra o visual. Para features pendentes (issues 10, 11, 12), a recomendacao e **implementar direto em Digital Arena** (ver DD03 em SPEC.md).

Ordem da esteira (ja planejada, cada uma tem PLAN.md em `docs/issues/design-refresh-*/`):
1. ✅ `design-refresh` (fundacao — concluida)
2. `design-refresh-layouts`
3. `design-refresh-p01` (landing, fora desta esteira)
4. `design-refresh-p02` (auth)
5. `design-refresh-p03` (home)
6. `design-refresh-p04` (wizard)
7. `design-refresh-p05-p06` (sucesso + convite)
8. `design-refresh-p07-p08` (painel + palpite)
9. `design-refresh-p09` (admin — condicional)
10. `design-refresh-p10-p11` (encerrado + perfil — condicional)
11. `design-refresh-docs` (esta issue — atualiza SPEC + ISSUES)
```

### NÃO tocar

- `.claude/docs/design-system.md` — **já é a fonte canônica** atualizada.
- `docs/issues/design-refresh/PLAN.md` — histórico da fundação.
- `docs/issues/design-refresh/MIGRATION-MAP.md` — histórico do mapeamento.
- Qualquer `docs/issues/design-refresh-*/PLAN.md` de follow-ups (inclusive este) — são planos por issue.
- `docs/PENDING.md` — pendências externas, fora de escopo.
- `docs/brief/BRIEF.md` — brief original, preservar histórico.
- Código em `src/` — esta issue é 100% documental.

---

## Decisões desta Issue

### DD01 — SPEC delega tokens para `.claude/docs/design-system.md`

**Contexto:** SPEC hoje duplica design tokens (cores, superfícies, tipografia). design-system.md também tem. Manter duplicado gera drift.
**Decisão:** SPEC fica com 1 parágrafo + link. design-system.md é canônico.
**Alternativas descartadas:** Mover design-system.md para dentro de SPEC — SPEC fica gigante; Remover `.claude/docs/design-system.md` — perde lugar especializado.

### DD02 — Arcade preservado em 3 opt-ins explícitos

**Contexto:** Pixel font e scanline são assinatura. Remover 100% perde identidade; manter global polui editorial.
**Decisão:** Opt-ins preservados apenas em GAME OVER (C32), BOLÃO CRIADO (C17), LoadingState (C38) para `font-pixel`, e GameOverHeader (C32) para `.arcade-scanline`. Documentar explicitamente na SPEC.
**Alternativas descartadas:** Manter arcade global — conflita com Digital Arena; remover tudo — perde o "piscada" nostálgica.

### DD03 — Issues pendentes (10/11/12) nascem em Digital Arena

**Contexto:** Issues 10/11/12 não implementadas. Implementar em arcade e depois migrar duplica trabalho.
**Decisão:** ISSUES.md avisa explicitamente em cada issue pendente que deve nascer em Digital Arena. design-refresh-p09 e design-refresh-p10-p11 ficam como **cartilha** caso cronograma force implementação arcade.
**Alternativas descartadas:** Deixar em aberto — sem sinalização, risco de regredir para arcade; remover issues da esteira — perde a cartilha.

### DD04 — Edição cirúrgica, não reescrita total

**Contexto:** SPEC tem 681 linhas. Reescrever inteira é arriscado (quebra referências C##, B##).
**Decisão:** Editar apenas trechos que falam em arcade legado. Preservar IDs e estrutura. Substituir frases específicas.
**Alternativas descartadas:** Reescrever SPEC inteira — risco de perder informação; criar SPEC-v3.md separado — fragmenta fonte da verdade.

### DD05 — ISSUES.md ganha notas "Visual pós design-refresh" em vez de reescrita

**Contexto:** Copy das issues do backlog descreve arcade. Reescrever todas é trabalho duplicado com os PLAN.md de follow-up.
**Decisão:** Adicionar 1 linha de nota apontando para o PLAN.md correspondente. O PLAN.md tem os detalhes visuais atualizados.
**Alternativas descartadas:** Reescrever cada Subtask V — duplica informação; remover Subtask V arcade — perde histórico do que foi implementado.

### DD06 — Issue número atualiza contagem mas mantém IDs de issue-01 a 12

**Contexto:** Backlog cresceu (10 design-refresh + 12 feature). Renumerar issues é catastrófico para referências.
**Decisão:** Manter `issue-01` a `issue-12` como IDs. Esteira design-refresh é "paralela" no header, não numerada sequencialmente.
**Alternativas descartadas:** Renumerar para issue-01 a issue-23 — quebra links em commits históricos.

### DD07 — Sem mudança em código

**Contexto:** Tentação de consertar comentários/docstrings no código que ainda falam em arcade.
**Decisão:** **Zero** mudança em `src/`. Se aparecer tempo, abrir follow-up `design-refresh-code-comments`.
**Alternativas descartadas:** Fazer junto — amplia PR e tira foco do objetivo documental.

---

## Critérios de Aceitação

- [ ] `docs/SPEC.md` L3 diz "v3 — Digital Arena"
- [ ] `docs/SPEC.md` L17 menciona Digital Arena + delega para `.claude/docs/design-system.md`
- [ ] `docs/SPEC.md` seção "Design System" compacta (~15 linhas, antes ~74)
- [ ] `docs/SPEC.md` menções a "pixel font" global removidas (preservar em C17, C32, C38)
- [ ] `docs/SPEC.md` menções a "border-radius 0" / "4px offset arcade" / "scanline global" removidas
- [ ] `docs/SPEC.md` menções a "neon green em todo botão" substituídas por "Button pill"
- [ ] `docs/SPEC.md` nova subseção "Decisoes Visuais (v3)" adicionada no final com DD01/DD02/DD03
- [ ] `docs/ISSUES.md` header atualizado (v3 + contagem)
- [ ] `docs/ISSUES.md` issue-01 ganha nota de atualização
- [ ] `docs/ISSUES.md` issues 02-09 ganham linha "Visual pos design-refresh: ver ..."
- [ ] `docs/ISSUES.md` issues 10/11/12 ganham aviso "⚠️ Design refresh: deve nascer em Digital Arena"
- [ ] `docs/ISSUES.md` seção "Esteira Design Refresh" adicionada
- [ ] IDs C01-C39, B01-B38, issue-01 a issue-12 **preservados**
- [ ] Zero mudança em `src/`, `.claude/docs/design-system.md`, `prisma/`, PLAN.md existentes
- [ ] `pnpm build` passa (deve passar — nenhum código tocado)

---

## Follow-up (fora desta issue)

- `design-refresh-code-comments` — revisar docstrings/comments em `src/` que ainda mencionem arcade legado (se encontrados em review).
- Considerar renomear `docs/brief/BRIEF.md` **não** — é histórico original, preservar.
- Se issues 10/11/12 rodarem em arcade, reabrir design-refresh-p09 e design-refresh-p10-p11 com paths reais.

---

## Observações para Implementação

- **Abordagem cirúrgica** — editar apenas o que está listado. Tentação de "melhorar redação" em outras partes → não fazer.
- Agent sugerido: **docs-writer** (ou main session direta, já que é edit-heavy).
- Fazer um PR único com todas as edições documentais (SPEC + ISSUES).
- QA: reler SPEC de ponta a ponta e procurar menções residuais a "arcade", "neon", "pixel" fora dos 3 opt-ins documentados.
- Referência para não perder contexto: [design-system.md](../../../.claude/docs/design-system.md) é a fonte; SPEC delega.
