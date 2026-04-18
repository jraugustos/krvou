# Design System — KRVOU

> **Creative North Star (atual):** "Digital Arena" — editorial-gaming híbrido
> (dark hero cards sobre light canvas, cantos suaves, glow neon, sombras editoriais)
>
> **Fonte:** Stitch project "Bolões Inteligentes com IA" (`17036510969533916249`)
> — biblioteca desktop + organismos mobile.
>
> **Legado em migração:** "Neon Arcade Terminal" — tokens preservados em paralelo
> enquanto as features migram uma a uma (ver `docs/issues/design-refresh/MIGRATION-MAP.md`).
>
> **Implementado em:** issue `design-refresh` (fundação) + follow-up issues (features).

---

## Princípios

1. **Canvas claro, hero escuro.** O fundo global é off-white (`#f9faf6`). Áreas
   de alto impacto usam roxo profundo (`#190032`) como card-dentro-do-canvas.
2. **Cantos suaves (1–3rem) + pílulas.** Cards em `rounded-card` (1rem), hero em
   `rounded-card-lg` (2rem), bottom nav flutuante em `rounded-card-xl` (3rem),
   CTAs e chat input em `rounded-pill` (full).
3. **Glow neon em CTAs, drop soft em cards.** Pill buttons têm halo verde
   (`shadow-neon-glow`). Cards brancos têm sombra editorial sutil
   (`shadow-drop-soft`).
4. **Bordas visíveis continuam identidade tátil.** Exceto na variante `pill`
   de input (chat messenger), todos os componentes mantêm `border-2` visível
   — especialmente em light canvas onde contraste exige linha.
5. **Tipografia em 3 famílias.** Press Start 2P para display/logo/scores,
   Space Grotesk para headlines/labels/nav, Inter para body/dados.
6. **Scanline é opt-in, não global.** Para telas com estética arcade
   intencional (ex.: GAME OVER), aplicar a classe `.arcade-scanline`.

---

## Paleta "Digital Arena"

### Canvas claro (superfícies padrão)

| Token CSS | Tailwind | Hex | Uso |
|---|---|---|---|
| `--background-light` | `bg-background-light` | `#f9faf6` | Canvas global (páginas editoriais) |
| `--surface-lowest-light` | `bg-surface-lowest-light` | `#ffffff` | Cards brancos, inputs pill |
| `--surface-low-light` | `bg-surface-low-light` | `#f3f4f0` | Chips, input bg, áreas secundárias |
| `--surface-high-light` | `bg-surface-high-light` | `#e8ebe3` | Hover/estados elevados em light |
| `--on-surface-light` | `text-on-surface-light` | `#1a1c1a` | Texto principal em light |
| `--on-surface-variant-light` | `text-on-surface-variant-light` | `#3c4b35` | Labels, metadata em light |
| `--outline-light` | `border-outline-light` | `#6b7c63` | Bordas definidas |
| `--outline-variant-light` | `border-outline-variant-light` | `#baccb0` | Ghost borders em light |

### Hero dark (cards de alto impacto)

| Token CSS | Tailwind | Hex | Uso |
|---|---|---|---|
| `--hero-surface` | `bg-hero-surface` | `#190032` | Card hero, bottom nav, stat block |
| `--on-surface` | `text-on-surface` | `#f0dbff` | Texto sobre hero |
| `--on-surface-variant` | `text-on-surface-variant` | `#baccb0` | Metadata sobre hero |

### Neons e acentos (compartilhados com legado)

| Token | Tailwind | Hex | Uso |
|---|---|---|---|
| `--primary` | `bg-primary`, `text-primary` | `#39ff14` | Neon green — CTAs, glow, accent |
| `--primary-dim` | `text-primary-dim` | `#2ae500` | Neon acessível texto <14px |
| `--secondary` | `text-secondary` | `#fffeac` | Headlines editorial sobre hero |
| `--secondary-container` | `bg-secondary-container` | `#e4e403` | Alertas, warnings |
| `--tertiary` | `text-tertiary` | `#bd00ff` | Neon purple — decorativo |
| `--destructive` | `text-destructive` | `#ff3131` | Erros |

---

## Radius

| Token | Classe Tailwind | Valor | Uso |
|---|---|---|---|
| `--radius` | `rounded-*` (sm/md/lg/xl/…) | `0rem` | **Legado**: componentes arcade (features ainda não migradas) |
| `--radius-card` | `rounded-card` | `1rem` | Cards default, inputs, alerts, modais |
| `--radius-card-lg` | `rounded-card-lg` | `2rem` | Hero sections, blocos grandes |
| `--radius-card-xl` | `rounded-card-xl` | `3rem` | Bottom nav pill flutuante |
| `--radius-pill` | `rounded-pill` | `9999px` | Pill buttons, chips, chat inputs |

**Regra:** componentes novos usam os tokens "Digital Arena". Componentes legados
que ainda não migraram continuam com `rounded-*` do legado (que resolve para 0).

---

## Sombras

### Neon glow (CTAs, pill buttons, progress bars)

| Token | Tailwind | Valor | Uso |
|---|---|---|---|
| `--shadow-neon-glow` | `shadow-neon-glow` | `0 0 15px rgba(57,255,20,0.4)` | Pill button default |
| `--shadow-neon-glow-strong` | `shadow-neon-glow-strong` | `0 0 25px rgba(57,255,20,0.6)` | Pill button hover, progress bar ativa |
| `--shadow-neon-glow-sm` | `shadow-neon-glow-sm` | `0 0 10px rgba(57,255,20,0.2)` | Focus rings, accents sutis |

### Drop soft (cards editoriais em canvas claro)

| Token | Tailwind | Valor | Uso |
|---|---|---|---|
| `--shadow-drop-soft` | `shadow-drop-soft` | `0 8px 30px rgba(0,0,0,0.04)` | Card default |
| `--shadow-drop-soft-md` | `shadow-drop-soft-md` | `0 12px 40px rgba(0,0,0,0.08)` | Card hero, toast |
| `--shadow-drop-soft-lg` | `shadow-drop-soft-lg` | `0 20px 60px rgba(0,0,0,0.12)` | Modais, dialogs |

### Arcade 4px offset (legado)

| Token | Uso |
|---|---|
| `shadow-arcade-primary` / `-secondary` / `-destructive` / `-dark` / `-toast` | Componentes legados (Button default, secondary, etc.) — **não usar em componentes novos** |

---

## Tipografia

| Nível | Fonte | CSS Variable | Tailwind | Uso |
|---|---|---|---|---|
| Display/Logo/Scores | Press Start 2P | `--font-press-start` | `font-pixel` | Logo, scores, hero titles pontuais |
| Headlines/Labels/Nav | Space Grotesk | `--font-space-grotesk` | `font-heading` | Subtítulos, labels, botões, nav |
| Body/Dados | Inter | `--font-inter` | `font-sans` | Textos, descrições, dados |

---

## Componentes `src/components/ui/*`

### Catálogo atual (após issue/design-refresh)

| Componente | Path | Variantes | Uso |
|---|---|---|---|
| **Card** | `src/components/ui/card.tsx` | `default` (branco), `hero` (dark + drop soft), `stat` (dark + glassmorphism interno) | Envelope recorrente de conteúdo |
| **Button** | `src/components/ui/button.tsx` | Legado: `default`, `secondary`, `tertiary`, `destructive`, `outline`, `ghost`. Novos: `pill`, `pill-outline`. | CTAs. Componentes novos usam pill. |
| **Input** | `src/components/ui/input.tsx` | `default` (legado inset arcade), `pill` (messenger, chat) | Forms e chat |
| **AlertDialog** (C37) | `src/components/ui/alert-dialog.tsx` | — | Modais de confirmação. Já com `rounded-card` + `shadow-drop-soft-lg` |
| **Toaster** (C36) | `src/components/ui/sonner.tsx` | success/error/info/warning | Já com `rounded-card` + `shadow-drop-soft-md` |
| **LoadingState** (C38) | `src/components/ui/loading-state.tsx` | `sm`, `default`, `lg` | Spinner pixel art (mantido — assinatura) |
| **ErrorState** (C39) | `src/components/ui/error-state.tsx` | — | Erro + retry |

### Card — uso

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAura } from "@/components/ui/card";

// Card branco (editorial, canvas claro)
<Card>
  <CardHeader>
    <CardTitle>Bolão da Copa</CardTitle>
    <CardDescription>32 participantes</CardDescription>
  </CardHeader>
  <CardContent>...</CardContent>
  <CardFooter>
    <Button variant="pill">Entrar</Button>
  </CardFooter>
</Card>

// Card hero (alto impacto com aura neon)
<Card variant="hero" padding="lg">
  <CardAura />
  <div className="relative">...</div>
</Card>

// Card stat (gamification com glassmorphism grid interno)
<Card variant="stat" padding="lg">
  <CardAura className="-left-10 -top-10" />
  <div className="relative">
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-card border border-white/5 bg-white/5 p-4 backdrop-blur-md">...</div>
    </div>
  </div>
</Card>
```

### Button — pill (novo padrão para CTAs)

```tsx
<Button variant="pill">Entrar</Button>
<Button variant="pill" size="pill-lg">Registrar palpite</Button>
<Button variant="pill-outline">Compartilhar</Button>
```

- Hover: `-translate-y-0.5` + `shadow-neon-glow-strong`
- Active: volta à posição original
- Disabled: `opacity-50` (herdado)

### Input — pill (chat messenger)

```tsx
<Input variant="pill" placeholder="Digite uma mensagem..." />
```

- `border-none`, `rounded-pill`, `bg-surface-lowest-light`, `shadow-drop-soft`
- Focus: `ring-2 ring-primary`
- Invalid: `ring-2 ring-destructive`

---

## Componentes legados "Neon Arcade Terminal"

Ainda vivos no codebase, usados por todas as features que não migraram:

- `Button` variantes `default`, `secondary`, `tertiary`, `destructive`, `outline`, `ghost`
- `Input` variante `default`
- Tokens `shadow-arcade-*`, `--radius: 0rem`

**Não remover** até a migração de features estar completa
(ver `docs/issues/design-refresh/MIGRATION-MAP.md`).

---

## Regras de aplicação

### Para componentes novos (follow-up issues de feature)

1. Usar `variant="pill"` para CTAs primários.
2. Usar `<Card>` como envelope — escolher `default`, `hero` ou `stat` pela função.
3. Usar `rounded-card` / `rounded-pill` — nunca `rounded-none` em componentes novos.
4. Usar `shadow-drop-soft*` para cards, `shadow-neon-glow*` para CTAs/accents neon.
5. Bordas visíveis (`border-2`) em qualquer componente com interação, exceto input pill.
6. Hover: `-translate-y-0.5` (pill) ou `hover:brightness-110` (card). Active: volta.
7. Scanline: **não aplicar globalmente**. Adicionar `.arcade-scanline` só em
   telas com estética arcade intencional.

### Para componentes legados (features ainda não migradas)

- Manter o visual arcade (shadow 4px, radius 0, press translate-x/y 4px) até
  a issue de migração da feature rodar.
- Não misturar tokens: se o componente é legado, usa arcade; se é novo, usa
  Digital Arena.

---

## Referência visual

- Biblioteca desktop: [/tmp/stitch-krvou/biblioteca.png](file:///tmp/stitch-krvou/biblioteca.png) · [/tmp/stitch-krvou/biblioteca.html](file:///tmp/stitch-krvou/biblioteca.html)
- Organismos mobile: [/tmp/stitch-krvou/organismos.png](file:///tmp/stitch-krvou/organismos.png) · [/tmp/stitch-krvou/organismos.html](file:///tmp/stitch-krvou/organismos.html)
- Preview dos componentes vivos: `/dev` (seção "Digital Arena" no topo, legado abaixo)
