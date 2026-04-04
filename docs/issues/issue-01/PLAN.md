# Plan — issue-01: Design System + Componentes Globais

> Issue: issue-01 (ISSUES.md — Fundacao Visual)
> Data: 2026-04-04

## Resumo

Inicializar o projeto Next.js com Tailwind CSS v4, configurar todos os design tokens (cores, tipografia, espacamento), estilos globais (scanline overlay, fontes) e criar os componentes shared reutilizaveis: Toast (C36), ConfirmModal (C37), LoadingState (C38), ErrorState (C39), botoes arcade e inputs com glow neon.

## Pesquisa Interna

### Design System (verificacao obrigatoria)

- `.claude/docs/design-system.md` — NAO EXISTE ainda (sera criado como output desta issue)
- `.claude/docs/architecture.md` — NAO EXISTE ainda (sera criado como output desta issue)
- `src/` — NAO EXISTE. Projeto greenfield, zero codigo

### Referencia Visual

- **Fonte:** Google Stitch — projeto `17036510969533916249`
- **Screen:** Landing Page v5 (`647b2da2b9b74ce3b77814350810295c`)
- **Design System Stitch:** "KRVOU Arcade Grid" (`assets/828f2c0bfc7846b79030684d964d7d73`)
- **Screenshot:** disponivel via Stitch MCP (780x5390 mobile)

### Componentes reutilizaveis encontrados

Nenhum — projeto greenfield.

### Patterns do projeto

Nenhum — primeiro codigo do projeto.

### Nada encontrado (precisa criar)

Tudo. Esta issue cria a fundacao completa.

## Pesquisa Externa

### Documentacao consultada

- shadcn/ui docs — init com Next.js, theming Tailwind v4, Sonner (toast), AlertDialog
- Tailwind CSS v4 — `@theme` directive para tokens customizados em CSS (sem tailwind.config.ts)
- next/font/google — setup de Space Grotesk, Inter e Press Start 2P
- Google Fonts — confirmado que as 3 fontes estao disponiveis

### Padroes adotados

**Tailwind v4 + shadcn/ui:**
- Cores definidas via CSS variables em `:root` + `@theme inline` (padrao Tailwind v4)
- `--radius: 0rem` no `:root` para border-radius 0px global (shadcn calcula derivados automaticamente)
- shadcn/ui inicializado com `npx shadcn@latest init`

**Fontes via next/font:**
- Space Grotesk (`--font-space-grotesk`) — headlines, labels, navegacao
- Inter (`--font-inter`) — body text, dados
- Press Start 2P (`--font-press-start`) — logo, pontuacoes, display pixel (peso unico: 400)

**Toast = Sonner (shadcn):**
- `npx shadcn@latest add sonner`
- Customizacao via `toastOptions.classNames` no `<Toaster />`
- Tipos: `toast.success()`, `toast.error()`, `toast.info()`

**ConfirmModal = AlertDialog (shadcn):**
- `npx shadcn@latest add alert-dialog`
- Nao fecha ao clicar fora (comportamento correto para confirmacao)
- API composable: AlertDialogTrigger, Content, Title, Description, Cancel, Action

## Design Tokens (Paleta Completa)

Extraidos do design system "KRVOU Arcade Grid" no Stitch + SPEC + BRIEF:

### Cores

| Token | Hex | Uso |
|---|---|---|
| `background` | `#1f0438` | Fundo base da app |
| `surface` | `#1f0438` | Superficie base |
| `surface-lowest` | `#190032` | Background mais profundo |
| `surface-low` | `#280e40` | Conteudo secundario |
| `surface-container` | `#2c1245` | Areas de conteudo principal |
| `surface-high` | `#371e50` | Cards elevados |
| `surface-highest` | `#43295b` | Cards ativos, slips |
| `surface-bright` | `#472d60` | Glass overlay (60% opacity + blur 12px) |
| `primary` | `#39ff14` | Neon green — CTAs, acoes primarias |
| `primary-dim` | `#2ae500` | Neon acessivel para texto pequeno |
| `on-primary` | `#053900` | Texto sobre primary |
| `secondary` | `#fffeac` | Headlines sobre fundo roxo |
| `secondary-container` | `#e4e403` | Electric Yellow — alertas, energia |
| `on-secondary` | `#323200` | Texto sobre secondary |
| `tertiary` | `#bd00ff` | Neon purple — decorativo |
| `on-surface` | `#f0dbff` | Texto principal |
| `on-surface-variant` | `#baccb0` | Texto secundario/dados |
| `outline` | `#85967c` | Bordas de cards |
| `outline-variant` | `#3c4b35` | Ghost border (20% opacity) |
| `error` | `#ff3131` | Alertas e erros |
| `error-container` | `#93000a` | Background de erro |
| `on-error` | `#690005` | Texto sobre erro |

### Tipografia

| Nivel | Fonte | Uso |
|---|---|---|
| Display/Logo/Pontuacoes | Press Start 2P | Pixel font — titulos hero, logo "KRVOU", scores |
| Headlines/Labels/Nav | Space Grotesk | Geometrica — subtitulos, labels, navegacao, botoes |
| Body/Dados | Inter | Legibilidade — textos, descricoes, dados |

### Espacamento e Regras

- **Border-radius:** `0px` global (hard-edge arcade)
- **Bordas:** Minimo 2px, preferencial 4px. Nunca 1px
- **Elevacao:** 4px offset (box-shadow: `4px 4px 0px`) — nunca shadows padrao
- **Separacao:** Tonal shifts entre secoes, nunca linhas divisorias
- **Padding mobile:** Minimo 20px gutter
- **Espacamento vertical:** 16px ou 24px entre elementos

## Cenarios

### Caminho feliz

1. Projeto Next.js inicializado com `create-next-app`
2. Tailwind v4 configurado com tokens customizados
3. shadcn/ui inicializado e configurado com tema arcade
4. Fontes carregam via next/font (Space Grotesk, Inter, Press Start 2P)
5. Scanline overlay visivel em todas as paginas
6. Todos os componentes renderizam corretamente em `/dev` (pagina de preview)
7. Botoes arcade com 4px offset e animacao de press
8. Inputs com focus glow neon green

### Edge cases

- Fonte Press Start 2P nao carrega (peso unico 400) — fallback para Space Grotesk
- Scanline overlay interfere com cliques — `pointer-events: none` obrigatorio
- Cores neon em texto pequeno nao passam contraste — usar `primary-dim` (#2ae500) para texto < 14px

### Erros

- shadcn/ui nao detecta Tailwind v4 — verificar versao do Tailwind no package.json
- Fontes FOUT (flash of unstyled text) — usar `display: swap` no next/font

## Banco de Dados

Nao aplicavel nesta issue — sem interacao com banco.

## Dependencias Externas

### Pacotes a instalar

| Pacote | Versao | Motivo |
|---|---|---|
| `next` | 15+ | Framework (create-next-app) |
| `react` + `react-dom` | 19+ | UI (vem com create-next-app) |
| `typescript` | 5+ | Tipagem (vem com create-next-app) |
| `tailwindcss` | 4+ | Styling (vem com create-next-app) |
| `shadcn` | latest | CLI para componentes |
| `sonner` | latest | Toast notifications (via shadcn) |
| `@radix-ui/react-alert-dialog` | latest | ConfirmModal (via shadcn) |
| `class-variance-authority` | latest | Variantes de componentes (via shadcn) |
| `clsx` + `tailwind-merge` | latest | Utility cn() (via shadcn) |
| `lucide-react` | latest | Icones (via shadcn) |

### Fontes (via next/font — sem install)

- Space Grotesk (Google Fonts)
- Inter (Google Fonts)
- Press Start 2P (Google Fonts)

## Arquivos — O Que Criar e Modificar

### Criar (setup do projeto)

| Arquivo | O que contem |
|---|---|
| Projeto inteiro via `create-next-app` | Scaffold Next.js + TypeScript + Tailwind |
| `src/app/globals.css` | Design tokens (`:root`, `@theme inline`), scanline overlay, tipografia global |
| `src/app/layout.tsx` | Root layout com fontes (next/font), `<Toaster />`, metadata |
| `src/lib/utils.ts` | Funcao `cn()` (clsx + tailwind-merge) — criado pelo shadcn init |

### Criar (componentes)

| Arquivo | O que contem |
|---|---|
| `src/components/ui/button.tsx` | Botao arcade: primary (4px offset + press), secondary, tertiary (scanline underline). Baseado no shadcn Button com variantes customizadas |
| `src/components/ui/input.tsx` | Input com background inset (`surface-lowest`), focus glow neon green 2px + 4px blur. Baseado no shadcn Input |
| `src/components/ui/sonner.tsx` | Wrapper do Sonner com estilos arcade: borda success (green), error (red), info (cyan). Auto-dismiss 4s |
| `src/components/ui/alert-dialog.tsx` | ConfirmModal: titulo, descricao, botoes Cancel/Confirm. Overlay escuro. Baseado no shadcn AlertDialog |
| `src/components/ui/loading-state.tsx` | Componente custom: spinner pixel art animado em primary, texto "Carregando..." |
| `src/components/ui/error-state.tsx` | Componente custom: icone erro, mensagem, botao "Tentar novamente" |

### Criar (docs internos)

| Arquivo | O que contem |
|---|---|
| `.claude/docs/design-system.md` | Documentacao completa do design system implementado (tokens, componentes, patterns) |
| `.claude/docs/architecture.md` | Documentacao da arquitetura: estrutura de pastas, convencoes, patterns |

### Criar (preview/dev)

| Arquivo | O que contem |
|---|---|
| `src/app/dev/page.tsx` | Pagina de preview: mostra todos os componentes, tokens, tipografia. Util para validacao visual. Rota so de dev |

### NAO tocar

Tudo que nao esta listado acima. Especialmente:
- Nao criar paginas de rota (landing, auth, dashboard) — sao de outras issues
- Nao criar hooks de logica de negocio — sao de issues funcionais
- Nao configurar banco/Prisma — e de outra issue
- Nao configurar auth — e de outra issue

## Decisoes desta Issue

### D01 — Tailwind v4 (CSS-first) em vez de v3 (config file)

**Contexto:** Tailwind v4 usa `@theme` directive em CSS puro, sem `tailwind.config.ts`. shadcn/ui ja suporta v4.
**Decisao:** Usar Tailwind v4 com tokens em CSS variables + `@theme inline`.
**Alternativas descartadas:** Tailwind v3 com `tailwind.config.ts` — funciona mas e o padrao antigo.

### D02 — 3 fontes (Press Start 2P + Space Grotesk + Inter)

**Contexto:** BRIEF menciona Press Start 2P para pixel font (logo, pontuacoes). SPEC e Stitch usam Space Grotesk para headlines. Sao papeis diferentes.
**Decisao:** Usar as 3: Press Start 2P (display/logo/pixel), Space Grotesk (headlines/labels/nav), Inter (body).
**Alternativas descartadas:** Apenas 2 fontes — perderia o efeito pixel autentico do Press Start 2P.

### D03 — Sonner (via shadcn) para Toast em vez de componente custom

**Contexto:** shadcn/ui recomenda Sonner como toast padrao. Suporta tipos (success/error/info) e customizacao de estilos.
**Decisao:** Usar Sonner via `npx shadcn@latest add sonner`, customizar com classes arcade.
**Alternativas descartadas:** Toast custom do zero — mais trabalho, menos features (queue, promise, etc).

### D04 — AlertDialog (shadcn) para ConfirmModal

**Contexto:** ConfirmModal precisa nao fechar ao clicar fora. Dialog fecha; AlertDialog nao.
**Decisao:** Usar AlertDialog do shadcn/Radix.
**Alternativas descartadas:** Dialog com `onInteractOutside={e => e.preventDefault()}` — hack desnecessario.

### D05 — Pagina /dev para preview de componentes

**Contexto:** Sem Storybook (overhead grande para MVP). Precisamos validar componentes visualmente.
**Decisao:** Criar rota `/dev` com showcase de todos os componentes e tokens. Simples e eficiente.
**Alternativas descartadas:** Storybook (complexo demais para MVP solo dev), nenhuma pagina de preview (dificil validar).

### D06 — Design system "KRVOU Arcade Grid" do Stitch como fonte primaria de tokens

**Contexto:** Existem 2 design systems no Stitch: "8-Bit Modernist" (fundo preto #131313) e "KRVOU Arcade Grid" (fundo roxo #1f0438). O segundo foi criado especificamente para o KRVOU.
**Decisao:** Usar "KRVOU Arcade Grid" como fonte primaria de cores. Complementar com valores do BRIEF (error #ff3131, tertiary #bd00ff) que nao estao no Stitch.
**Alternativas descartadas:** "8-Bit Modernist" — fundo preto generico, nao tem a identidade roxa do KRVOU.
