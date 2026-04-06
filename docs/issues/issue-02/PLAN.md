# Plan — issue-02: Landing Page (P01)

> Issue: issue-02 (ISSUES.md — Fundacao Visual)
> Data: 2026-04-04
> Subtask: V (visual — interface completa com dados mockados)

## Resumo

Criar a landing page completa do KRVOU na rota `/` com estetica arcade. Composta por 5 componentes visuais: TopBar (C01), HeroSection (C02), PowerUpsGrid (C03), CTASection (C04) e Footer (C05). Dados mockados, links de navegacao funcionais para `/auth`. Mobile-first com breakpoints sm, md, lg.

## Pesquisa Interna

### Design System (verificacao obrigatoria)

- `.claude/docs/design-system.md` — EXISTE (criado na issue-01)
- Tokens: todas as cores, superficies, tipografia (3 fontes), sombras arcade, glow
- `--radius: 0rem` — border-radius 0px global ja configurado
- Scanline overlay ativo via `body::after` em globals.css

### Componentes ui/ existentes (issue-01)

| Componente | Path | Reutilizar? |
|---|---|---|
| Button | `src/components/ui/button.tsx` | ✅ Sim — CTAs "COMECAR AGORA" e "CRIAR MEU BOLAO" |
| Input | `src/components/ui/input.tsx` | ❌ Nao — landing nao tem inputs |
| Toaster (C36) | `src/components/ui/sonner.tsx` | ❌ Nao — landing nao tem toasts |
| AlertDialog (C37) | `src/components/ui/alert-dialog.tsx` | ❌ Nao |
| LoadingState (C38) | `src/components/ui/loading-state.tsx` | ❌ Nao |
| ErrorState (C39) | `src/components/ui/error-state.tsx` | ❌ Nao |

### Referencia Visual

- **Fonte primaria:** Google Stitch — Landing Page v5 (`stitch-landing-page.html` e `stitch-landing-page.png` em `docs/brief/`)
- **Fonte secundaria:** Wireframes (`docs/brief/wireframes.html` — secao P00)
- **Design System:** tokens em `.claude/docs/design-system.md`
- **Screenshot Stitch:** mobile 780x5390 — mostra TopBar, Hero com "KRVOU!", Power Ups grid (bento 8/4, 4/8), CTA "PRONTO PARA SER O LIDER?", Footer com neon glow

### Patterns do projeto

- Server Components por padrao (so `'use client'` se hooks/state/events)
- `cn()` de `@/lib/utils` para merge condicional
- Tailwind utility classes com tokens do design system
- Mobile-first com breakpoints `sm`, `md`, `lg`
- Fontes: `font-pixel` (Press Start 2P), `font-heading` (Space Grotesk), `font-sans` (Inter)
- Sombras arcade: `shadow-arcade-primary`, `shadow-arcade-dark`
- shadcn usa `@base-ui/react` nesta versao (nao Radix), conforme button.tsx

### Nada encontrado (precisa criar)

- `src/components/layouts/TopBar.tsx` — nao existe
- `src/components/features/HeroSection.tsx` — nao existe
- `src/components/features/PowerUpsGrid.tsx` — nao existe
- `src/components/features/CTASection.tsx` — nao existe
- `src/components/features/Footer.tsx` — nao existe

## Pesquisa Externa

### Documentacao consultada

- Next.js 16 App Router — componentes de pagina sao Server Components por padrao
- Next.js `Link` — usar `next/link` para navegacao interna (`/auth`)
- Google Fonts Material Symbols — usar via `next/font` ou CDN para icones (leaderboard, auto_awesome, share, sports_soccer, sports_esports, home, add_box, confirmation_number, notifications, menu)

### Padroes adotados

- **Server Components:** TopBar, HeroSection, PowerUpsGrid, CTASection, Footer sao todos Server Components (sem state/hooks). A TopBar precisa de `'use client'` apenas se implementar hamburger menu interativo — para a landing page mockada, pode ser Server Component
- **Link component:** `next/link` para CTAs que navegam para `/auth`
- **Material Symbols:** Usar como CDN link no layout.tsx (ja que sao usados extensivamente no design Stitch) OU SVGs inline para performance. Decisao: SVGs inline nos componentes para evitar dependencia CDN e melhor performance
- **Imagens/avatars pixel:** Usar divs estilizadas com cores do design system como placeholders de avatars (sem dependencia de URLs externas)

## Cenarios

### Caminho feliz

1. Usuario acessa `/`
2. Pagina renderiza com TopBar fixa no topo
3. HeroSection com titulo "KRVOU!" em pixel font, tagline, CTA e social proof
4. PowerUpsGrid com 4 cards em grid bento responsivo
5. CTASection com "PRONTO PARA SER O LIDER?" e CTA
6. Footer com logo neon, texto pixel e icones sociais
7. CTAs (B01, B02) levam para `/auth` via Link
8. Layout responsivo: empilha em mobile, grid 12 colunas em desktop

### Edge cases

- Sem estado, sem dados externos — tudo mockado, nao ha edge cases de dados
- Viewport extremo (< 320px) — garantir que texto nao quebre de forma ruim com `min-w-0`
- TopBar em mobile: hamburger menu apenas visual (nao abre drawer nesta issue)
- BottomNavBar: NAO incluir na landing (pertence a P03+, so para usuarios logados)

### Erros

- Nao ha erros possiveis — pagina estatica com dados mockados
- Fontes FOUT: ja tratado no layout.tsx com `display: "swap"`

## Banco de Dados

Nao aplicavel — pagina estatica com dados mockados.

## Dependencias Externas

### Nenhuma nova a instalar

- Tudo que a landing precisa ja esta no projeto (Next.js, Tailwind, design tokens)
- Material Symbols: usar SVGs inline (sem nova dependencia)

## Estrutura dos Componentes

### C01 — TopBar

```
Layout:
┌────────────────────────────────┐
│ ☰  KRVOU     [Home Ranking Jogos]  🔔│
└────────────────────────────────┘
```

- **Mobile:** Logo KRVOU pixel font + hamburger icon esquerda + bell icon direita
- **Desktop:** Logo + links de navegacao (Home, Ranking, Jogos) centralizados + bell icon
- Background `surface` (#1f0438), borda inferior 4px em `surface-container` (#2c1245)
- Shadow arcade: `shadow-arcade-dark` (4px 4px 0px)
- Position: `fixed top-0 w-full z-40` (z-40 para ficar abaixo do scanline z-9999)
- Altura: `h-16`

### C02 — HeroSection

```
Layout (mobile):
         KRVOU!
   Onde a resenha vira jogo.
   Crie seu bolão com IA
   [  COMEÇAR AGORA  ]
   🟢🟣🔵 +1.2k
```

- Titulo "KRVOU!" em `font-pixel text-5xl md:text-8xl text-primary` com drop-shadow
- Tagline em `font-heading font-bold text-white uppercase tracking-wider`
- Palavra "Crie seu bolão com nossa IA" em `text-secondary`
- CTA "COMECAR AGORA" — `Button` variant `default` size `xl` com borda inferior e direita 8px (override larger)
- Avatars pixel: 3 divs quadradas com cores do design system + div "+1.2k" em `bg-tertiary text-white font-pixel text-[8px]`
- Background: pixel grid com `radial-gradient(circle, #39ff14 0.5px, transparent 0.5px)` size 24px + blur decorativo roxo (`absolute -top-10 -right-10 w-64 h-64 bg-tertiary/20 blur-[100px]`)
- Padding: `px-6 py-12 md:py-24`

### C03 — PowerUpsGrid

```
Layout desktop (12 cols):
┌────────────────┬─────────┐
│   WIZARD IA    │REAL-TIME│
│   (8 col)      │RANKING  │
│   AI ENHANCED  │(4 col)  │
├─────────┬──────┴─────────┤
│CONVITE  │    VERSUS      │
│RAPIDO   │    (8 col)     │
│(4 col)  │  MULTIPLAYER   │
└─────────┴────────────────┘
```

- Titulo "POWER UPS" com `font-pixel` e borda esquerda 8px primary
- Grid: `grid grid-cols-1 md:grid-cols-12 gap-8`
- **WizardIACard (8 col):** badge "AI ENHANCED" em `bg-primary text-primary-foreground font-pixel text-[8px]`, titulo "WIZARD IA" font-pixel, descricao, icone auto_awesome como SVG inline decorativo (opacity 10%, hover 30%)
- **RankingCard (4 col):** bg `surface-container`, borda 4px primary, shadow-arcade-primary. Icone leaderboard SVG, titulo "REAL-TIME RANKING", mini barra de progresso (div `bg-primary w-3/4 h-full` dentro de `bg-background h-3`)
- **ConviteCard (4 col):** bg surface, borda outline. Icone share SVG. hover: `border-secondary-container transition-colors`
- **VersusCard (8 col):** bg background, decorativo. "VERSUS" text-3xl md:text-5xl font-pixel italic com `drop-shadow-[3px_3px_0px_#bd00ff]`. "MULTIPLAYER MODE" font-pixel text-[8px]. Icones sports nas laterais. Background dot grid: `bg-[radial-gradient(#2c1245_1px,transparent_1px)] bg-[size:10px_10px]`

### C04 — CTASection

```
Layout:
   PRONTO PARA
   SER O LÍDER?
   [ CRIAR MEU BOLÃO ]
```

- Titulo "PRONTO PARA" + "SER O LIDER?" (span com `text-primary`)
- Font: `text-3xl md:text-6xl font-pixel text-white`
- CTA "CRIAR MEU BOLAO" — `Button` branco customizado (bg-white, text-background, border 8px cinza, hover bg-primary)
- Background: `bg-surface-container border-y-4 border-outline` com carbon fibre texture (CSS pattern `repeating-linear-gradient` ou background-image)
- Padding: `px-6 py-24 text-center`

### C05 — Footer

```
Layout:
   KRVOU (neon glow)
   criado com ❤ para quem ama o jogo
   [📱] [💻] [🎮]
```

- Logo "KRVOU" em `font-pixel text-xl text-primary` com `drop-shadow-[0_0_5px_rgba(57,255,20,0.5)]`
- Texto pixel: `font-pixel text-[8px] text-white/40 uppercase tracking-widest`
- Icones sociais: SVGs inline com `hover:text-primary transition-colors`
- Background: `bg-background border-t-4 border-outline`
- Padding: `px-6 py-16 text-center`

## Arquivos — O Que Criar e Modificar

### Criar

| Arquivo | O que contem |
|---|---|
| `src/components/layouts/TopBar.tsx` | Barra fixa topo: logo KRVOU pixel, links desktop, hamburger mobile, icone notificacoes. Server Component |
| `src/components/features/landing/HeroSection.tsx` | Hero principal: titulo KRVOU!, tagline, CTA, avatars pixel + contador. Server Component |
| `src/components/features/landing/PowerUpsGrid.tsx` | Grid bento 4 cards: WizardIA, Ranking, Convite, Versus. Server Component |
| `src/components/features/landing/CTASection.tsx` | Secao CTA final: "PRONTO PARA SER O LIDER?" + botao. Server Component |
| `src/components/features/landing/Footer.tsx` | Footer: logo neon, texto pixel, icones sociais. Server Component |

### Modificar

| Arquivo | O que mudar |
|---|---|
| `src/app/page.tsx` | Substituir placeholder "Em construcao" pela landing page completa: importar e compor TopBar + HeroSection + PowerUpsGrid + CTASection + Footer |
| `src/app/layout.tsx` | Adicionar link do Material Symbols (se necessario para icones) OU confirmar que SVGs inline sao suficientes (preferido) |

### NAO tocar

Tudo que nao esta listado acima. Especialmente:
- `src/app/globals.css` — tokens ja prontos da issue-01
- `src/components/ui/*` — componentes base ja prontos
- `src/app/dev/page.tsx` — pagina de preview independente
- `src/lib/utils.ts` — utilitario cn() ja pronto
- `.claude/docs/*` — docs ja atualizados na issue-01

## Decisoes desta Issue

### D01 — SVGs inline em vez de Material Symbols CDN

**Contexto:** O design Stitch usa Material Symbols Outlined para icones (menu, notifications, leaderboard, share, auto_awesome, sports_soccer, sports_esports, home, add_box, confirmation_number).
**Decisao:** Usar SVGs inline ou lucide-react (ja instalado) para icones equivalentes.
**Alternativas descartadas:** CDN do Google Fonts Material Symbols — adiciona dependencia externa e latencia de carregamento.
**Mapeamento lucide-react:** menu→Menu, bell→Bell, sparkles→Sparkles (auto_awesome), trophy→Trophy (leaderboard), share-2→Share2, soccer→não tem (usar SVG inline). Para icones que lucide nao tem, usar SVG inline simples.

### D02 — Componentes da landing em `features/landing/` subpasta

**Contexto:** Os componentes HeroSection, PowerUpsGrid, CTASection e Footer sao especificos da landing page, nao reutilizaveis em outras paginas.
**Decisao:** Colocar em `src/components/features/landing/` para organizacao. TopBar vai em `layouts/` porque sera reutilizado em outras paginas.
**Alternativas descartadas:** Tudo em `features/` flat — ficaria desorganizado com muitos componentes de diferentes paginas.

### D03 — Avatars pixel como divs estilizadas (sem imagens externas)

**Contexto:** O design Stitch usa imagens de avatar geradas. Para dados mockados, nao queremos dependencia de URLs externas.
**Decisao:** Usar divs quadradas com cores do design system (primary, tertiary, secondary-container) como placeholders. "J", "A", "M" como iniciais dentro dos quadrados.
**Alternativas descartadas:** Usar URLs de placeholder (api.dicebear.com, etc) — adiciona dependencia externa para dados mockados.

### D04 — Button nao-padrao para CTAs com borda 8px

**Contexto:** Os CTAs do hero ("COMECAR AGORA") e CTA section ("CRIAR MEU BOLAO") tem bordas de 8px (mais grossas que o padrao 4px do design system) conforme a referencia Stitch.
**Decisao:** Usar o Button base com className override para as bordas mais grossas. Nao criar nova variante — sao estilos especificos da landing.
**Alternativas descartadas:** Criar variante `hero` no Button — over-engineering para 2 instancias.

### D05 — TopBar sem interacao mobile (hamburger nao abre drawer)

**Contexto:** A issue-02 so cobre a Subtask Visual. O hamburger menu mobile precisa de state para abrir/fechar drawer.
**Decisao:** Hamburger icon e visual-only nesta issue. Drawer/mobile menu sera implementado em issue futura se necessario. Links de navegacao so aparecem em desktop.
**Alternativas descartadas:** Implementar drawer completo — fora do escopo da Subtask V e adiciona complexidade desnecessaria.

## Criterios de Aceitacao (da ISSUES.md)

- [ ] Pagina renderiza sem erros na rota `/`
- [ ] Layout correto em mobile, tablet e desktop
- [ ] Todos os 5 componentes visuais presentes (TopBar, HeroSection, PowerUpsGrid, CTASection, Footer)
- [ ] Grid bento responsivo (empilha em mobile)
- [ ] CTAs navegam para `/auth` (B01, B02)
- [ ] Estetica arcade: pixel grid, CRT overlay (scanline ja ativo), neon glow, 0px radius
- [ ] Dados mockados (contador usuarios "+1.2k", avatars pixel)
