# Plan — design-refresh-p05-p06: Bolão Criado (C17) + Página de Convite (C18) para Digital Arena

> Issue: design-refresh-p05-p06 (follow-up de [design-refresh](../design-refresh/PLAN.md))
> Data: 2026-04-17
> Escopo: 100% visual em 2 componentes de feature + validação das páginas que os consomem. Zero mudança em `createPoolAction`, `joinPoolAction`, `saveInviteAndRedirectAction`, Clipboard API, Server Actions, redirects.

---

## Resumo

Migrar `SuccessScreen` (tela pós-criação de bolão) para **Card hero + CardAura + pill neon**, e `InviteCard` (página pública de convite) para **canvas claro + Card default editorial com Button pill**. Preservar lógica de clipboard, `autoJoin`, redirect pós-auth. **QR code fica fora desta issue** (pedido no MIGRATION-MAP mas sem dependência instalada) — listado como follow-up.

---

## Pesquisa Interna

### Design System (verificação obrigatória)

Lido em [.claude/docs/design-system.md](../../../.claude/docs/design-system.md):

- **SuccessScreen (P05)**: alto impacto celebratório → `Card variant="hero"` + `<CardAura />`. Texto "BOLÃO CRIADO!" mantém `font-pixel` + drop-shadow neon.
- **InviteCard (P06)**: canvas claro + `Card default` branco centralizado.
- **CTAs**: `Button variant="pill"` para "Copiar link" / "Entrar no bolão"; `pill-outline` para "Ir para o painel".
- **Input chip monospace**: input readonly em `bg-surface-low-light rounded-card font-mono`.

### Componentes `ui/` reutilizados

| Componente | Uso |
|---|---|
| `Card`, `CardHeader`, `CardContent`, `CardFooter`, `CardAura` | SuccessScreen (hero), InviteCard (default) |
| `Button` | CTAs pill / pill-outline |
| `Input` | Link monospace em SuccessScreen (`variant="default"` readonly, ou input nativo com classes tokenizadas) |

Nenhum novo componente `ui/*`.

### Patterns preservados

- `navigator.clipboard.writeText(inviteUrl)` + fallback `inputRef.current?.select()`.
- `toast.success("Link copiado!")` via `sonner`.
- `router.push(\`/pool/\${poolId}/admin\`)` após criação.
- `useTransition` em `InviteCard` para `joinPoolAction` / `saveInviteAndRedirectAction`.
- `autoJoin` effect com ref-guard.
- Estados: `isOpen` (pool status), `isLoggedIn`, `alreadyMember` warning.

---

## Pesquisa Externa

### Referência Stitch

Biblioteca inclui tela "Success" com hero card + aura neon. InviteCard editorial em canvas claro.

### QR code

[package.json](../../../package.json) **não tem** `qrcode`, `qrcode.react`, nem `react-qr-code`. Instalar agora amplia escopo da issue (dep nova + fonte externa/base64 asset). **Decisão D04 abaixo: QR fica fora.**

---

## Cenários

### P05 — Caminho feliz

1. Usuário conclui wizard → redirect para `/pool/[poolId]/created`.
2. Página server-side busca dados reais do pool.
3. `SuccessScreen` renderiza Card hero + aura, texto "BOLÃO CRIADO!" em pixel neon, nome do bolão abaixo.
4. Input chip mostra `inviteUrl` em monospace + Button pill "Copiar link".
5. Clica copiar → `navigator.clipboard.writeText` → toast + botão vira "Copiado!" por 2s.
6. Clica "Ir para o painel" (pill-outline) → `router.push(\`/pool/\${poolId}/admin\`)`.

### P06 — Caminho feliz (logado)

1. Usuário acessa `/join/[inviteCode]` logado.
2. Página busca pool por `inviteCode`.
3. `InviteCard` mostra canvas claro + card branco centralizado com headline "Você foi convidado para" + nome bolão, criador + contador, lista de categorias, botão pill "Entrar no bolão".
4. Clica → `joinPoolAction` → redirect `/pool/[poolId]`.

### P06 — Caminho feliz (não logado)

1. Usuário vê mesma página pública + nota "Você precisará criar uma conta ou fazer login".
2. Clica "Entrar no bolão" → `saveInviteAndRedirectAction(inviteCode)` salva cookie e redireciona para `/auth`.
3. Após auth, `autoJoin` dispara no effect → `joinPoolAction` → redirect.

### Edge cases

- Pool fechado (`status !== "open"`) → botão pill com texto "BOLÃO ENCERRADO" + `disabled=true` + nota "Este bolão não aceita mais participantes".
- Já membro → `toast.warning("Você já participa desse bolão")` + redirect para `/pool/[poolId]`.
- Clipboard indisponível → fallback `inputRef.select()` + `toast.info("Selecione e copie manualmente")`.
- Lista de categorias vazia → card de categorias não renderiza (preservado).

### Erros

- `joinPoolAction` falha → `setError(result.error)` → banner inline `text-destructive`.
- Clipboard throw → preservado: fallback select.

---

## Banco de Dados

**Nenhuma alteração.**

---

## Dependências Externas

**Nenhuma nova.** Bibliotecas de QR code **explicitamente** fora de escopo (D04).

---

## Arquivos — O Que Criar e Modificar

### Criar

Nenhum.

### Modificar

| Arquivo | O que mudar |
|---|---|
| [src/components/features/pool/SuccessScreen.tsx](../../../src/components/features/pool/SuccessScreen.tsx) | Envolver conteúdo em `<main className="bg-background-light min-h-screen flex items-center justify-center px-4 py-10">` + `<Card variant="hero" padding="lg" className="w-full max-w-md">` + `<CardAura />`. Headline "BOLÃO CRIADO!" mantém `font-pixel` + `text-primary drop-shadow-[0_0_15px_rgba(57,255,20,0.8)]` + `text-2xl`. Input de link readonly em `rounded-card bg-surface-low-light/10 border-white/10 font-mono text-xs text-on-surface px-3 py-2`. Botões: copiar → `<Button variant="pill" size="pill-lg" className="w-full">`, "Ir para painel" → `<Button variant="pill-outline" size="pill-lg" className="w-full">`. Remover `shadow-glow-primary` arcade. |
| [src/components/features/invite/InviteCard.tsx](../../../src/components/features/invite/InviteCard.tsx) | Envolver em `<main className="bg-background-light min-h-screen flex items-center justify-center px-4 py-10">` + `<Card padding="lg" className="w-full max-w-md">`. Headline em `font-heading text-2xl font-bold` (remover `uppercase` absoluto — manter o `uppercase` inline se preferência). Card de categorias vira bloco interno `rounded-card bg-surface-low-light border border-outline-variant-light p-4` com bullets em `text-primary`. CTA "Entrar no bolão" → `<Button variant="pill" size="pill-lg" className="w-full">`. Banner de erro → `rounded-card bg-destructive/10 border border-destructive/30 px-4 py-3 text-destructive`. |

### Páginas que consomem (validação, sem mudança)

| Arquivo | Status |
|---|---|
| [src/app/pool/[poolId]/created/page.tsx](../../../src/app/pool/[poolId]/created/page.tsx) | Só passa props para `SuccessScreen`. NÃO tocar. |
| [src/app/join/[inviteCode]/page.tsx](../../../src/app/join/[inviteCode]/page.tsx) | Só passa props para `InviteCard`. NÃO tocar. |

### NÃO tocar

- [src/actions/invite.ts](../../../src/actions/invite.ts) — `joinPoolAction`, `saveInviteAndRedirectAction` preservadas.
- [src/actions/wizard.ts](../../../src/actions/wizard.ts) — `createPoolAction` preservada.
- [src/types/pool.ts](../../../src/types/pool.ts) — `InvitePageData` preservado.
- Landing, Auth, Home, Wizard, Pool panel, Admin.

---

## Decisões desta Issue

### D01 — SuccessScreen usa `Card variant="hero"`, não canvas dark inteiro

**Contexto:** Poderia ser uma página inteira dark (como está hoje). Digital Arena prefere cards sobre canvas claro.
**Decisão:** Canvas `bg-background-light` + card hero central. Celebratório mas editorial.
**Alternativas descartadas:** Página inteira hero — menos contraste com o resto do app migrado.

### D02 — Manter `font-pixel` no "BOLÃO CRIADO!"

**Contexto:** Pixel font é assinatura para momentos de alto impacto (scores, champion, etc.).
**Decisão:** Manter. É um dos casos em que pixel font é apropriado (similar a "GAME OVER").
**Alternativas descartadas:** Trocar por Space Grotesk — perde impacto nostálgico.

### D03 — InviteCard em canvas claro + card branco, não card hero

**Contexto:** Invite é página pública; precisa ser leve, editorial, confiável. Hero dark seria agressivo para conversão.
**Decisão:** Canvas claro + Card default.
**Alternativas descartadas:** Card hero — excessivo para página pública.

### D04 — QR code **fora de escopo**, vira follow-up

**Contexto:** MIGRATION-MAP menciona QR code no InviteCard. Nenhuma lib instalada.
**Decisão:** Fica como follow-up dedicado (`design-refresh-p06-qr` ou `feature-qr-invite`). Adicionar lib `qrcode.react` requer validação de peso + testes + ToS (nada crítico, mas amplia o PR).
**Alternativas descartadas:** Implementar agora — mistura design-refresh com feature nova; aumenta risco.

### D05 — Input de link monospace em styled `<input>` nativo, não `<Input variant="pill">`

**Contexto:** Variante pill é bg branco com border-none — em card hero dark, fica com contraste ruim.
**Decisão:** Input nativo com classes tokenizadas (`rounded-card bg-white/10 text-on-surface font-mono`). Mantém o ref para `select()` fallback.
**Alternativas descartadas:** `Input variant="default"` — visual inconsistente no hero card.

### D06 — Banner de erro em `rounded-card` + token `destructive/10`

**Contexto:** Hoje é `font-heading text-destructive text-sm`.
**Decisão:** Upgrade para banner com fundo tokenizado, mais legível.
**Alternativas descartadas:** Manter texto simples — fica escondido no card.

### D07 — Copiar link muda texto do botão para "Copiado!" por 2s

**Contexto:** Preservado do componente atual.
**Decisão:** Manter. Apenas atualizar variante visual (pill + disabled temporário).
**Alternativas descartadas:** Remover timeout — perde feedback visual.

### D08 — `"Entrar no bolão"` em `pill size="pill-lg"` full-width

**Contexto:** Ação primária de conversão.
**Decisão:** Pill largo com glow.
**Alternativas descartadas:** Pill size default — menor destaque.

---

## Critérios de Aceitação

- [ ] `SuccessScreen` em Card hero + aura + texto pixel neon
- [ ] Input de link readonly com fonte monospace e `select-all`
- [ ] Botão "Copiar link" em pill com feedback "Copiado!"
- [ ] Botão "Ir para painel" em pill-outline
- [ ] `InviteCard` em canvas claro + Card default centralizado
- [ ] Headline + metadata preservados
- [ ] Card de categorias estilizado como bloco interno
- [ ] CTA pill neon com estados (pending / disabled / `BOLÃO ENCERRADO`)
- [ ] `joinPoolAction` / `saveInviteAndRedirectAction` intocadas
- [ ] `autoJoin` continua disparando após login
- [ ] `pnpm build` + `pnpm typecheck` passam
- [ ] Landing inalterada

---

## Follow-up (fora desta issue)

- `design-refresh-p06-qr` — adicionar lib `qrcode.react`, gerar QR do `inviteUrl`, inserir em bloco colapsável no InviteCard.

---

## Observações para Implementação

- Agent sugerido: **component-writer**.
- QA visual: acessar `/pool/[poolId]/created` e `/join/[inviteCode]` em mobile DevTools.
- Comparar com biblioteca Stitch — seção Success + Invite.
- Não reimplementar clipboard; o existente funciona.
