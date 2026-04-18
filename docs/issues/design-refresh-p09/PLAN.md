#  Plan — design-refresh-p09: Painel Admin (P09) para Digital Arena

> Issue: design-refresh-p09 (follow-up de [design-refresh](../design-refresh/PLAN.md))
> Data: 2026-04-17
> Escopo: 100% visual nos 5 componentes de admin (C27–C31) + canvas da página `/pool/[poolId]/admin`. Zero mudança em Server Actions, calculo de pontuacao, remoção de membros, encerramento.

---

## ⚠️ Bloqueio atual

**O painel admin não existe no código.** Nenhum dos 5 componentes listados na MIGRATION-MAP (`AdminDashboard`, `SettingsPanel`, `ParticipantsAdmin`, `RulesEditor`, `DangerZone`) foi implementado — issue-10 (Painel Admin) segue **Pendente**.

Confirmado via busca:

- `grep -r "AdminDashboard\|SettingsPanel\|ParticipantsAdmin\|RulesEditor\|DangerZone" src/` → **zero hits**.
- Rota `/pool/[poolId]/admin` não existe em `src/app/pool/[poolId]/` (só `page.tsx` do painel participante + `created/`).

### Recomendação

Não rodar esta issue antes da issue-10. Em vez disso, **issue-10 deve nascer em Digital Arena** — adotar os tokens e componentes novos desde o primeiro commit. Isso elimina design-refresh-p09 por completo.

Se por qualquer motivo a issue-10 for implementada em estética arcade legada, então esta issue serve como **cartilha de migração**. A seção abaixo documenta o mapeamento esperado, mas a lista de arquivos fica em branco até a issue-10 fechar.

---

## Resumo

Migrar os 5 componentes do painel admin para Digital Arena **quando existirem**: canvas claro + cards editoriais + pill CTAs + Card stat para AdminStatsRow + borda esquerda destructive em DangerZone. Sem mudança em lógica de admin.

---

## Pesquisa Interna

### Design System (verificação obrigatória)

Lido em [.claude/docs/design-system.md](../../../.claude/docs/design-system.md):

- **AdminDashboard (C27)**: canvas `bg-background-light` + grid editorial de Cards. `AdminStatsRow` vira **2× `Card variant="stat"`** lado a lado (participantes + resultados X/Y).
- **PendingResultCards (C28)**: `Card default` com borda esquerda `border-l-4 border-secondary-light` (dourado para pendente) + `Button variant="pill"` size `default` para "Inserir".
- **InsertedResultCards (C29)**: `Card default` com borda esquerda `border-l-4 border-primary` + `opacity-70` + badge "Inserido".
- **SettingsPanel / PoolConfigPanel**: `Card default` com form em `Input variant="default"` + `Button variant="pill"` primário e `pill-outline` destrutivo.
- **ParticipantsAdmin (C29 na numeração de `MemberRows`)**: `Card default` com lista tokenizada (`divide-outline-variant-light`), badges de role, botão `pill-outline` destrutivo para remover.
- **RulesEditor (C30)**: `Card default` com accordion de categorias. Reutilizar pattern de `Card` expansível.
- **DangerZone (C31)**: `Card default` com `border-l-4 border-destructive` + texto explicativo + `Button variant="pill-outline"` com classes `text-destructive border-destructive/60 hover:bg-destructive/10`.

### Componentes `ui/` reutilizados

| Componente | Uso |
|---|---|
| `Card`, `CardHeader`, `CardContent` (`default`) | Formulários, lista de membros, DangerZone |
| `Card` (`stat`) + glassmorphism grid | AdminStatsRow |
| `Button` (`pill`, `pill-outline`, size `default`/`pill-lg`) | CTAs: inserir, salvar, remover, encerrar |
| `Input` (`default`) | Campos de form (nome do bolão, etc.) |
| `AlertDialog` | Confirmação de encerramento e remoção (reutilizar ConfirmModal já tokenizado) |

Nenhum novo componente `ui/*`.

### Patterns preservados (quando issue-10 existir)

- Server Actions: `submitResultAction`, `removeMemberAction`, `updatePoolNameAction`, `closePoolAction`.
- `useTransition` + `toast.success` / `toast.error` em cada ação.
- Pre-condição de "100% resultados inseridos" para habilitar encerrar bolão.
- Admin não pode se auto-remover.

---

## Pesquisa Externa

### Referência Stitch

Biblioteca Digital Arena tem screen "Admin" com layout de grid editorial (stat row + card grid). Reusar layout.

---

## Cenários (para quando issue-10 existir)

### P09 — Caminho feliz (Resultados)

1. Admin acessa `/pool/[poolId]/admin` → canvas claro + header com nome bolão.
2. **Tab Resultados (default):** grid 2 colunas com `AdminStatsRow` em Card stat no topo.
3. Abaixo, lista de cards pendentes (borda dourada) + cards inseridos (borda verde + opacity).
4. Admin clica "Inserir" em card pendente → inline form com Input default + Button pill.
5. Submete → `submitResultAction` → Toast "Resultado inserido!" → card move para Inserido.

### P09 — Tab Membros

1. Lista com `Card default` contendo rows de membros.
2. Cada row: avatar placeholder + nome + data entrada + badge role + Button `pill-outline` destrutivo "Remover".
3. Remover abre ConfirmModal → Server Action → Toast.

### P09 — Tab Config

1. `Card default` com campos editáveis (nome bolão, link convite readonly).
2. DangerZone em `Card` separado com border-l destructive.
3. "Encerrar bolão" só aparece com 100% resultados (pre-condição preservada).
4. Clica → ConfirmModal → `closePoolAction` → redireciona para P10.

### Edge cases

- Faltam resultados → botão encerrar em `disabled:opacity-50` + mensagem `text-on-surface-variant-light text-sm`.
- Admin tenta se remover → toast preservado: "Você não pode se remover".
- Resultado inserido errado → admin edita card Inserido (mantém comportamento funcional).

### Erros

- Todos os erros de Server Action → `toast.error` (pattern já estabelecido).

---

## Banco de Dados

**Nenhuma alteração.**

---

## Dependências Externas

**Nenhuma nova.**

---

## Arquivos — O Que Criar e Modificar

### ⚠️ Pendente da issue-10

A lista de arquivos desta seção **só pode ser finalizada depois que issue-10 implementar os componentes**. Abaixo, **hipótese de mapeamento** com os paths prováveis (seguindo convenção `src/components/features/admin/`):

### Hipótese — Modificar (quando existirem)

| Arquivo (hipótese) | O que mudar |
|---|---|
| `src/app/pool/[poolId]/admin/page.tsx` | Canvas `<main className="bg-background-light min-h-screen pt-20 pb-28">`. Offset `pt-20 pb-28` para TopBar pill + BottomNavBar pill. |
| `src/components/features/admin/AdminDashboard.tsx` | Wrapper em canvas claro com tabs Digital Arena. Grid editorial com stat row no topo. |
| `src/components/features/admin/AdminStatsRow.tsx` | `<div className="grid grid-cols-2 gap-4">` com 2× `<Card variant="stat" padding="md">`. Números em `font-heading text-3xl text-primary` + label em `text-on-surface-variant`. |
| `src/components/features/admin/PendingResultCard.tsx` | `<Card padding="md" className="border-l-4 border-secondary-light">` + `<Button variant="pill" size="default">Inserir</Button>` inline. |
| `src/components/features/admin/InsertedResultCard.tsx` | `<Card padding="md" className="border-l-4 border-primary opacity-70">` + badge "Inserido" em `bg-primary/10 text-primary rounded-pill px-2 py-0.5 text-xs font-semibold`. |
| `src/components/features/admin/SettingsPanel.tsx` | `<Card padding="lg">` com form vertical (`space-y-4`). Input default + Button pill "Salvar". |
| `src/components/features/admin/ParticipantsAdmin.tsx` | `<Card padding="none">` com `<ul className="divide-y divide-outline-variant-light">`. Cada `<li>` em `px-5 py-4 flex items-center gap-3`. Badge de role em `rounded-pill bg-primary/10 text-primary text-xs px-2 py-0.5 font-semibold`. |
| `src/components/features/admin/RulesEditor.tsx` | `<Card padding="md">` com accordion. Cada item em `rounded-card bg-surface-low-light p-3 mb-2`. |
| `src/components/features/admin/DangerZone.tsx` | `<Card padding="md" className="border-l-4 border-destructive">` + `<Button variant="pill-outline" className="text-destructive border-destructive/60 hover:bg-destructive/10">Encerrar bolão</Button>`. |

### NÃO tocar (quando issue-10 existir)

- `src/actions/admin.ts` (ou equivalente) — lógica de admin preservada.
- `prisma/schema.prisma` — sem mudanças.
- Todas as outras features migradas em issues anteriores (layouts, auth, home, wizard, success, invite, pool panel).

---

## Decisões desta Issue

### D01 — Issue-10 deve nascer em Digital Arena (recomendação forte)

**Contexto:** issue-10 segue pendente. Implementar o admin hoje em estética arcade e depois migrar duplica trabalho.
**Decisão:** Recomendar no kickoff da issue-10 que ela adote os tokens e componentes Digital Arena desde o primeiro commit. Isso **torna esta issue (p09) redundante**.
**Alternativas descartadas:** Rodar issue-10 em arcade e depois migrar — retrabalho, mais risco de regressão, reviews duplicados.

### D02 — Se p09 rodar, fica como cartilha pós-issue-10

**Contexto:** Se por decisão de cronograma issue-10 sair em arcade, precisaremos migrar depois.
**Decisão:** Esta issue fica **dormente** até issue-10 fechar. No kickoff, revisitar a lista "Modificar" com os paths reais.
**Alternativas descartadas:** Cancelar a issue — perde a cartilha de mapeamento que já está feita.

### D03 — AdminStatsRow em `Card variant="stat"` (não hero)

**Contexto:** MIGRATION-MAP pede stat boxes com destaque editorial.
**Decisão:** `Card stat` (dark glassmorphism grid). Não hero — stat block é o padrão para números de painel admin (similar ao UserPositionCard no painel participante).
**Alternativas descartadas:** Card default branco — perde impacto; Card hero — excessivo para dado agregado.

### D04 — Borda esquerda colorida para status (pendente/inserido/destructive)

**Contexto:** Biblioteca Stitch tem pattern de borda-l para indicar status em cards.
**Decisão:** Usar `border-l-4 border-secondary-light` (pendente dourado), `border-l-4 border-primary` (inserido verde), `border-l-4 border-destructive` (DangerZone). Consistente com BetCategoryCard em p07-p08.
**Alternativas descartadas:** Badge no topo — menos visual em lista.

### D05 — DangerZone em card separado com pill-outline destrutivo

**Contexto:** Ação destrutiva precisa isolamento visual.
**Decisão:** Card independente, não integrado ao SettingsPanel. Botão pill-outline destrutivo (não pill sólido — evita parecer CTA primário).
**Alternativas descartadas:** Acordion — esconde demais; Button pill sólido vermelho — atrai cliques acidentais.

### D06 — Config e Membros em Card default branco

**Contexto:** Admin tem muita informação — precisa ser legível, editorial.
**Decisão:** Canvas claro + Cards brancos (como Home). Não usar dark.
**Alternativas descartadas:** Canvas dark com Card hero — cansativo para uso funcional.

### D07 — ConfirmModal já está tokenizado, nenhuma mudança

**Contexto:** `src/components/ui/alert-dialog.tsx` já está em Digital Arena.
**Decisão:** Reutilizar sem mexer.
**Alternativas descartadas:** Criar wrapper específico de admin — desnecessário.

---

## Critérios de Aceitação

**Pré-requisito:** issue-10 precisa estar concluída (ou adotar Digital Arena no kickoff, tornando esta issue redundante).

Caso execute-se:

- [ ] Canvas `/pool/[poolId]/admin` em `bg-background-light`
- [ ] AdminStatsRow em 2× `Card variant="stat"`
- [ ] PendingResultCards com border-l secondary-light + Button pill "Inserir"
- [ ] InsertedResultCards com border-l primary + opacity-70 + badge "Inserido"
- [ ] SettingsPanel em `Card default` + Input default + Button pill "Salvar"
- [ ] ParticipantsAdmin em `Card` com lista tokenizada + badges de role
- [ ] DangerZone em `Card` com border-l destructive + Button pill-outline destrutivo
- [ ] RulesEditor em `Card` com accordion tokenizado
- [ ] ConfirmModal preservado (já em Digital Arena)
- [ ] Server Actions intactas (inserir resultado, remover membro, editar nome, encerrar)
- [ ] `pnpm build` + `pnpm typecheck` passam
- [ ] Pre-condição "100% resultados" preservada

---

## Follow-up (fora desta issue)

- Se issue-10 aparece em arcade, abrir `design-refresh-p09` como nova issue com escopo atualizado (paths reais dos componentes).
- Considerar consolidar com `design-refresh-p10-p11` num único "admin + encerrado + perfil" se issues 10/11/12 forem implementadas em sequência arcade.

---

## Observações para Implementação

- **Não inicie esta issue sem verificar status de issue-10.** Rode `ls src/app/pool/[poolId]/admin/` primeiro; se vazio, parar.
- Agent sugerido: **component-writer** (se issue-10 existir em arcade).
- QA visual: acessar cada tab em mobile DevTools + desktop.
- Comparar com biblioteca Stitch — seção Admin.
- Lista de arquivos "Modificar" é **hipótese** — atualizar no kickoff quando issue-10 fechar.
