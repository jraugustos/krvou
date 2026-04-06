# Plan — issue-03: Auth / Login & Signup (P02)

> Issue: ISSUES.md linhas 94-152
> Data: 2026-04-04
> Subtask: V (visual) — interface de autenticacao com dados mockados

## Resumo

Criar a pagina `/auth` com formulario unificado de login/signup, toggle entre modos, botao Google OAuth, e campos email/senha (+ nome no signup). Apenas visual, sem integracao real. Layout baseado no mockup Stitch "KRVOU - Autenticacao (v1)".

## Pesquisa Interna

### Design System (verificacao obrigatoria)

- **Tokens**: Todos definidos em `globals.css` — cores (primary, surface-*, on-surface, etc.), fontes (font-pixel, font-heading, font-sans), shadows (shadow-arcade-*, shadow-glow-*), radius 0px global
- **Componentes ui/ existentes**: Button, Input, Toaster, AlertDialog, LoadingState, ErrorState
- **Componentes a reutilizar nesta issue**: **Button** (variante `default` size `xl` para submit, variante `ghost`/custom para Google), **Input** (campos email, senha, nome)

### Referencia Visual

- **Fonte**: Google Stitch — projeto 17036510969533916249, screen ce0e404bcc8845acada93e37ab825b96
- **Screenshot**: `docs/issues/issue-03/auth-screen.png`
- **Codigo de referencia**: `docs/issues/issue-03/auth-screen.html`
- **Observacoes do mockup Stitch**:
  - Logo "KRVOU" em font-pixel grande com drop-shadow glow verde, tracking amplo
  - Subtitulo "Terminal de Apostas Retro-Futurista" em font-heading, text-secondary, uppercase, tracking-widest
  - Card com bg-surface-container, borda-l-4 + borda-t-4 surface-highest, arcade-inset (box-shadow inset)
  - Botao Google: fundo branco, texto neutro escuro, icone SVG Google colorido, shadow cinza 4px, uppercase font-heading
  - Divider "OU": linha h-1 surface-highest + texto on-surface-variant, uppercase, tracking amplo
  - Labels: font-heading, text-primary, uppercase, tracking-widest, text-xs, bold
  - Inputs: bg-surface-lowest, sem borda default, p-4, font-heading, placeholder com opacity baixa, focus glow neon (borda primary-container blur)
  - Botao submit: bg-primary, text-primary-foreground, font-heading black, text-xl, uppercase, tracking-widest, h-16, shadow-arcade-primary
  - Toggle: texto on-surface-variant + span text-secondary com border-bottom dotted
  - Footer status: "SISTEMA ONLINE" com dot animado, versao, ENC-MOD

### Componentes reutilizaveis encontrados

- `src/components/ui/button.tsx` — reutilizar para botao submit (variante `default`, size `xl`). Botao Google precisa de estilo customizado (fundo branco) — usar className override ou criar via composicao
- `src/components/ui/input.tsx` — reutilizar para campos email/senha/nome. Precisa de ajustes de estilo via className (h maior, font-heading, placeholder arcade)
- `src/components/ui/button-variants.ts` — variantes de CVA ja definidas
- `src/lib/utils.ts` — `cn()` para merge de classes

### Patterns do projeto

- Landing page usa Server Components com composicao de features isoladas
- Componentes em `features/` sao agrupados por dominio (ex: `features/landing/`)
- Layouts em `layouts/` (TopBar ja existe)
- Fontes carregadas no root layout via next/font/google com CSS variables

### Nada encontrado (precisa criar)

- `src/app/auth/page.tsx` — pagina da rota `/auth`
- `src/components/features/auth/AuthForm.tsx` — componente C07 (client component com estado toggle)
- `src/components/features/auth/GoogleIcon.tsx` — icone SVG inline do Google (extraido do Stitch)

## Pesquisa Externa

### Documentacao consultada

Nenhuma necessaria — subtask visual nao requer libs externas. Stack atual (Next.js + Tailwind + base-ui) ja suporta tudo.

### Padroes adotados

- Pagina `/auth` como Server Component, renderiza `<AuthForm />` (Client Component)
- Toggle login/signup via estado local `useState` — nao precisa de roteamento
- Sem validacao real (subtask V) — apenas visual dos estados

## Cenarios

### Caminho feliz

1. Usuario acessa `/auth`
2. Ve tela de login com logo, botao Google, divider, form email/senha, botao submit, link toggle
3. Clica "Criar Conta" → form alterna para signup (campo nome aparece, botao muda texto, link muda)
4. Clica "Entrar" → volta para login (campo nome some, campos limpos)

### Edge cases (visuais apenas)

- Toggle login→signup: campo nome aparece com animacao, botao muda para "CRIAR CONTA", link muda para "Ja tem conta? Entrar"
- Toggle signup→login: campo nome some, todos os campos sao limpos, botao volta para "ENTRAR NO TERMINAL"
- Mobile: layout centralizado, largura full com max-w-md, padding p-6
- Desktop: mesmo layout centralizado, card com max-w-md

### Estados visuais a implementar

- **Default**: form de login com campos vazios
- **Signup mode**: campo nome visivel, textos alterados
- **Nenhum estado de loading/erro** nesta subtask (sera implementado na subtask F)

## Banco de Dados

Nao aplicavel — subtask visual, sem integracao.

## Dependencias Externas

Nenhuma nova. Stack atual suporta tudo.

## Arquivos — O Que Criar e Modificar

### Criar

| Arquivo | O que contem |
|---|---|
| `src/app/auth/page.tsx` | Server Component — pagina `/auth`, renderiza AuthForm |
| `src/components/features/auth/AuthForm.tsx` | Client Component (C07) — form unificado login/signup com toggle, estado local, layout completo do mockup Stitch |
| `src/components/features/auth/GoogleIcon.tsx` | Componente SVG inline do icone Google (4 cores oficiais) |

### Modificar

Nenhum arquivo existente precisa ser modificado.

### NAO tocar

Tudo que nao esta listado acima. Especialmente:
- `src/components/ui/*` — componentes base ja prontos, reutilizar via className
- `src/app/page.tsx` — landing page (issue-01/02)
- `src/app/layout.tsx` — root layout ja configurado
- `src/app/globals.css` — tokens ja definidos

## Decisoes desta Issue

### D01 — Botao Google como composicao, nao nova variante

**Contexto:** O botao "Continuar com Google" tem estilo unico (fundo branco, shadow cinza) que nao se encaixa nas variantes existentes do Button.
**Decisao:** Usar o `<Button>` existente com className override para o estilo branco, em vez de criar uma nova variante "google" no CVA.
**Alternativas descartadas:** Criar variante `google` no button-variants.ts — descartado porque e um caso unico demais para poluir o sistema de variantes. Usar `<button>` nativo — descartado porque perde acessibilidade e consistencia do base-ui.

### D02 — Inputs reutilizam componente base com className

**Contexto:** Os inputs do Stitch sao mais altos (p-4) e usam font-heading, diferente do default do Input base.
**Decisao:** Passar className override no `<Input>` existente (`h-auto p-4 font-heading text-base`), mantendo o comportamento de focus glow e aria-invalid do componente base.
**Alternativas descartadas:** Criar variante "arcade-lg" no Input — descartado, nao justifica a complexidade.

### D03 — GoogleIcon como componente separado

**Contexto:** O SVG do icone Google tem 4 paths com cores especificas.
**Decisao:** Extrair para `GoogleIcon.tsx` para manter o AuthForm limpo.
**Alternativas descartadas:** Inline no AuthForm — funciona mas polui o JSX com 10+ linhas de SVG.

### D04 — Sem Label component — usar tag nativa com classes

**Contexto:** O projeto nao tem um componente `<Label>` no ui/.
**Decisao:** Usar `<label>` nativo com classes Tailwind diretas (`font-heading text-primary font-bold text-xs uppercase tracking-widest`), consistente com o mockup Stitch.
**Alternativas descartadas:** Criar componente Label — descartado, nao ha necessidade nesta issue e pode ser criado quando houver mais uso.

### D05 — Footer status decorativo incluido no AuthForm

**Contexto:** O mockup Stitch mostra um footer com "SISTEMA ONLINE", versao e "ENC-MOD: AES-256".
**Decisao:** Incluir como parte do layout do AuthForm (puramente decorativo, hardcoded) para fidelidade ao mockup.
**Alternativas descartadas:** Omitir — descartado, e um detalhe visual importante do tema arcade/terminal.
