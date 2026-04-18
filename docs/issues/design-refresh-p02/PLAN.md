# Plan — design-refresh-p02: Migração visual da tela Auth (C07) para Digital Arena

> Issue: design-refresh-p02 (follow-up de [design-refresh](../design-refresh/PLAN.md))
> Data: 2026-04-17
> Escopo: 100% visual. Zero mudança em lógica de autenticação, Server Actions, NextAuth, validações, toasts.

---

## Resumo

Reescrever o JSX e as classes Tailwind do [AuthForm](../../../src/components/features/auth/AuthForm.tsx) para o novo sistema "Digital Arena": canvas claro (`bg-background-light`) com **hero card central dark** (`Card variant="hero"` + `CardAura`) abrigando o formulário, Google Sign-In em `Button variant="pill-outline"` (override branco), inputs em `Input variant="pill"`, submit em `Button variant="pill"` com glow neon. Toda a lógica (`useActionState`, `loginAction`, `signupAction`, `signIn("google")`, `key={mode}`, toasts, validações Zod) é preservada.

---

## Pesquisa Interna

### Design System (verificação obrigatória)

Lido em [.claude/docs/design-system.md](../../../.claude/docs/design-system.md):

- **Canvas**: `bg-background-light` (#f9faf6) — inversão do dark atual
- **Hero card**: `Card variant="hero"` (bg #190032, `shadow-drop-soft-md`, `rounded-card-lg`)
- **Aura**: `<CardAura />` (blur radial neon sobre hero)
- **CTAs**: `Button variant="pill"` (neon green + `shadow-neon-glow`) / `pill-outline` (bg transparente + borda)
- **Inputs**: `Input variant="pill"` (border-none, rounded-pill, bg-surface-lowest-light, shadow-drop-soft, focus ring-primary)
- **Tipografia**: `font-pixel` (Press Start 2P) só para display; `font-heading` (Space Grotesk) para labels/nav; `font-sans` (Inter) para body

### Componentes `ui/` reutilizados nesta issue

| Componente | Path | Uso no Auth |
|---|---|---|
| `Card` + `CardAura` | [src/components/ui/card.tsx](../../../src/components/ui/card.tsx) | Envelope central (`variant="hero" padding="lg"`) |
| `Button` | [src/components/ui/button.tsx](../../../src/components/ui/button.tsx) | Google (`pill-outline` + override `bg-white text-neutral-900`), submit (`pill size="pill-lg"`) |
| `Input` | [src/components/ui/input.tsx](../../../src/components/ui/input.tsx) | `variant="pill"` para nome/email/senha |

Nada a criar em `ui/`.

### Patterns do projeto preservados

- `useActionState<AuthFormState, FormData>` para [loginAction](../../../src/actions/auth.ts) e [signupAction](../../../src/actions/auth.ts)
- `signIn("google", { callbackUrl: "/home" })` via `next-auth/react`
- `key={mode}` no `<form>` para reset ao trocar login↔signup
- `toast.error(state.message)` via `sonner`
- `aria-invalid` + render condicional de `state.errors.<campo>[0]`
- `disabled={isPending || googleLoading}` nos botões

### Status atual da feature

[docs/ISSUES.md](../../ISSUES.md) issue-03 — Auth (P02) está 🔧 em progresso (Subtasks V e F com checkboxes majoritariamente marcados). O comportamento funcional já existe; esta issue **só muda o visual**.

---

## Pesquisa Externa

### Referência Stitch

[/tmp/stitch-krvou/biblioteca.html](file:///tmp/stitch-krvou/biblioteca.html) mostra "Auth Card" com:
- Card hero central em `bg-secondary` (#190032), `rounded-card-lg`, `shadow-drop-soft-md`
- Logo pixel no topo do card + tagline em Space Grotesk
- Google button em `border-2 border-outline-variant` + `bg-white text-neutral-900` + `rounded-full`
- Divisor "ou" em 2 traços finos + texto pequeno
- Inputs em `rounded-pill` + `bg-surface-lowest-light` + padding horizontal largo
- CTA submit em pill neon full-width com glow

Nenhuma dependência externa nova.

---

## Cenários

### Caminho feliz — login email

1. Usuário acessa `/auth` (modo `login` default)
2. Preenche email + senha nos inputs pill
3. Clica submit pill ("Entrar")
4. `loginAction` valida + `signIn("credentials")`
5. Redireciona para `/home`

### Caminho feliz — signup

1. Clica toggle → `setMode("signup")` reseta form via `key={mode}`
2. Preenche nome + email + senha
3. Submit chama `signupAction`
4. Cria usuário, faz login, redireciona

### Caminho feliz — Google

1. Clica pill-outline branco com `<GoogleIcon />`
2. `setGoogleLoading(true)` → texto muda para "Conectando..."
3. `signIn("google", { callbackUrl: "/home" })` abre fluxo OAuth
4. Retorno: redireciona

### Edge cases (mesmos do AuthForm atual, apenas visual muda)

- Campo inválido → `aria-invalid` + ring destructive no input pill + mensagem em `text-destructive` abaixo
- `state.message && !state.errors` → `toast.error` (preservado)
- Pending → botões disabled mantendo texto "Entrando...", "Criando...", "Conectando..."
- Toggle enquanto pending → `disabled={isPending}` no botão toggle

### Erros

- Google `signIn` throw → `toast.error("Falha ao autenticar com Google")` + `setGoogleLoading(false)` (preservado)
- Erro servidor retornado em `state.message` → banner inline no topo do card (mantido, apenas re-estilizado com `rounded-card` + `bg-destructive/10` + `border-destructive`)

---

## Banco de Dados

**Nenhuma alteração.** 100% visual.

---

## Dependências Externas

**Nenhuma nova.** Fontes (Press Start 2P, Space Grotesk, Inter) já carregadas; `lucide-react` já presente; `sonner` já em uso.

---

## Arquivos — O Que Criar e Modificar

### Criar

Nenhum.

### Modificar

| Arquivo | O que mudar |
|---|---|
| [src/components/features/auth/AuthForm.tsx](../../../src/components/features/auth/AuthForm.tsx) | Reescrita do JSX e das classes: envolver o form em `<Card variant="hero" padding="lg">` + `<CardAura />`, mover logo + tagline para `CardHeader`, Google button em `<Button variant="pill-outline" size="pill-lg">` + overrides `bg-white text-neutral-900 hover:bg-neutral-100`, inputs em `<Input variant="pill">`, submit em `<Button variant="pill" size="pill-lg">`, toggle em link sublinhado pontilhado neon. Remover: decorações arcade `AUTH_MODE 002`, `READY PLAYER 1`, `SISTEMA ONLINE`, wrappers `shadow-[inset_4px_4px_...]`, borda `border-l-4 border-t-4 border-surface-highest`, overlay blur focus customizado. |

### NÃO tocar

- [src/app/auth/page.tsx](../../../src/app/auth/page.tsx) — só renderiza `<AuthForm />`
- [src/components/features/auth/GoogleIcon.tsx](../../../src/components/features/auth/GoogleIcon.tsx) — SVG do Google, reaproveitado
- [src/app/layout.tsx](../../../src/app/layout.tsx) — canvas global fica como está (só a rota /auth ganha `bg-background-light` via `<main>`)
- [src/actions/auth.ts](../../../src/actions/auth.ts) — `loginAction`, `signupAction` preservadas
- [src/types/auth.ts](../../../src/types/auth.ts) — `AuthFormState` preservado
- `src/app/page.tsx` (landing) — **não tocar, escopo explícito fora desta issue**
- Qualquer outra feature (`home`, `wizard`, `pool`) — fora de escopo

---

## Decisões desta Issue

### D01 — Canvas claro local, não global

**Contexto:** O Digital Arena usa `bg-background-light` como canvas. Mas aplicar no `layout.tsx` afetaria todas as rotas ainda não migradas (landing, home, wizard, pool).
**Decisão:** Aplicar `bg-background-light` apenas no `<main>` do `AuthForm`. Rotas não migradas continuam com o canvas dark atual.
**Alternativas descartadas:** Mudar `globals.css`/`layout.tsx` — geraria regressão visual nas features ainda arcade.

### D02 — Google button como `pill-outline` com override branco

**Contexto:** Guideline do Google exige fundo branco + logo colorido. O `pill-outline` padrão é transparente com borda.
**Decisão:** `<Button variant="pill-outline" size="pill-lg" className="bg-white text-neutral-900 hover:bg-neutral-100 border-outline-light">` — mantém API unificada sem criar variante nova dedicada.
**Alternativas descartadas:** Nova variante `pill-google` — fragmentaria a API para um caso único.

### D03 — Remover decorações arcade

**Contexto:** `AUTH_MODE 002`, `READY PLAYER 1 / INSERT COIN`, `SISTEMA ONLINE v 2.0.84`, shadow inset 4px do card, bordas assimétricas.
**Decisão:** Removidas. O novo visual é editorial; essas decorações pertencem ao legado "Neon Arcade Terminal".
**Alternativas descartadas:** Manter "READY PLAYER 1" como easter egg — polui o novo visual e quebra a direção editorial.

### D04 — Inputs em `variant="pill"`, não `default`

**Contexto:** O Digital Arena define `Input variant="pill"` para chat/messenger e `default` para forms tradicionais. Auth é form tradicional, mas a ref Stitch mostra inputs rounded-pill em auth.
**Decisão:** Usar `variant="pill"` em nome/email/senha para coerência com a referência Stitch.
**Alternativas descartadas:** `variant="default"` — visual mais "formal" mas dissonante do resto da página quando migrada.

### D05 — Zero mudança em lógica

**Contexto:** Tentação de refatorar `useActionState` duplicado (login + signup) para hook dedicado.
**Decisão:** Manter tudo. Esta issue é puramente visual. Refatoração é tema de outra issue.
**Alternativas descartadas:** Hook `useAuthForm` — aumenta escopo e risco de regressão.

### D06 — Submit em `pill size="pill-lg"`, não `pill-outline`

**Contexto:** O submit é CTA primário; glow neon reforça a ação.
**Decisão:** `<Button variant="pill" size="pill-lg">` (verde neon + glow). Toggle entre login/signup continua em link textual com `border-b-2 border-dotted text-primary`.
**Alternativas descartadas:** Submit em `pill-outline` — diminui a hierarquia visual.

---

## Critérios de Aceitação

- [ ] `/auth` renderiza canvas claro com hero card central dark
- [ ] Logo KRVOU pixel + tagline dentro do card (não fora)
- [ ] Google button pill branco com `GoogleIcon`; texto muda para "Conectando..." em loading
- [ ] Divisor "ou" entre Google e form continua presente
- [ ] 3 inputs pill (nome condicional, email, senha)
- [ ] Submit pill neon full-width com glow
- [ ] Toggle login↔signup preservado (reset via `key={mode}`)
- [ ] `aria-invalid` + mensagens de erro por campo preservadas
- [ ] `state.message` ainda dispara `toast.error` (não quebrar `useEffect`)
- [ ] Decorações arcade (AUTH_MODE 002, READY PLAYER 1, SISTEMA ONLINE) removidas
- [ ] `pnpm build` e `pnpm typecheck` passam
- [ ] Landing (`/`) não sofre alteração visual

---

## Observações para Implementação

- Agent sugerido: **component-writer**
- Rodar `/dev` após implementar para QA visual
- Comparar lado a lado com [/tmp/stitch-krvou/biblioteca.png](file:///tmp/stitch-krvou/biblioteca.png) (seção Auth) antes do review
- `design-refresh-layouts` pode ajustar o `TopBar` dessa página em issue separada — nesta issue o top bar continua como está
