# Design System — KRVOU

> Creative North Star: "The Neon Arcade Terminal"
> Source: Stitch "KRVOU Arcade Grid" + SPEC + BRIEF
> Implementado em: issue-01

## Paleta de Cores

### Superficies (PCB Layers)

| Token | Hex | Tailwind Class | Uso |
|---|---|---|---|
| background | #1f0438 | `bg-background` | Fundo base |
| surface-lowest | #190032 | `bg-surface-lowest` | Fundo mais profundo (inputs) |
| surface-low | #280e40 | `bg-surface-low` | Conteudo secundario |
| surface-container | #2c1245 | `bg-surface-container` | Areas de conteudo |
| surface-high | #371e50 | `bg-surface-high` | Cards elevados |
| surface-highest | #43295b | `bg-surface-highest` | Cards ativos |
| surface-bright | #472d60 | `bg-surface-bright` | Glass overlay |

### Primarias

| Token | Hex | Tailwind Class | Uso |
|---|---|---|---|
| primary | #39ff14 | `text-primary`, `bg-primary` | Neon green — CTAs, acoes |
| primary-dim | #2ae500 | `text-primary-dim` | Neon acessivel texto < 14px |
| primary-foreground | #053900 | `text-primary-foreground` | Texto sobre primary |

### Secundarias

| Token | Hex | Tailwind Class | Uso |
|---|---|---|---|
| secondary | #fffeac | `text-secondary` | Headlines sobre fundo roxo |
| secondary-container | #e4e403 | `bg-secondary-container` | Electric Yellow — alertas |
| secondary-foreground | #323200 | `text-secondary-foreground` | Texto sobre secondary |

### Outras

| Token | Hex | Tailwind Class | Uso |
|---|---|---|---|
| tertiary | #bd00ff | `text-tertiary`, `border-tertiary` | Neon purple — decorativo |
| destructive | #ff3131 | `text-destructive` | Erros |
| on-surface | #f0dbff | `text-on-surface` | Texto principal |
| on-surface-variant | #baccb0 | `text-on-surface-variant` | Texto secundario |
| outline | #85967c | `border-outline` | Bordas de cards |
| outline-variant | #3c4b35 | `border-outline-variant` | Ghost border |

## Tipografia

| Nivel | Fonte | CSS Variable | Tailwind Class | Uso |
|---|---|---|---|---|
| Display/Logo/Scores | Press Start 2P | --font-press-start | `font-pixel` | Titulos hero, logo, pontuacoes |
| Headlines/Labels/Nav | Space Grotesk | --font-space-grotesk | `font-heading` | Subtitulos, labels, botoes |
| Body/Dados | Inter | --font-inter | `font-sans` | Textos, descricoes, dados |

## Regras de Design

### Border-radius
`0px` em TUDO. Sem excecoes. `--radius: 0rem` no CSS.

### Bordas
- Minimo 2px, preferencial 4px
- NUNCA 1px
- Ghost border: `border-2 border-outline-variant` (20% opacity)

### Elevacao — 4px Offset (Signature Move)
- Idle: `shadow-[4px_4px_0px_0px_<cor>]`
- Active/Pressed: `active:translate-x-[4px] active:translate-y-[4px] active:shadow-none`
- NUNCA usar box-shadow padrao (blur)

### Separacao
- Usar tonal shifts (surface-low → surface-container → surface-high)
- NUNCA usar linhas divisorias 1px

### Espacamento
- Padding mobile: minimo 20px (p-5)
- Vertical entre elementos: 16px ou 24px (gap-4 ou gap-6)

### Scanline Overlay
- Sempre ativo via `body::after` em globals.css
- Linhas horizontais pretas 5% opacity a cada 4px
- `pointer-events: none` + `z-index: 9999`

## Componentes Disponiveis

| Componente | Path | Tipo |
|---|---|---|
| Button | `src/components/ui/button.tsx` | Arcade com 6 variantes |
| Input | `src/components/ui/input.tsx` | Inset com glow neon |
| Toaster (C36) | `src/components/ui/sonner.tsx` | Toast com borda colorida por tipo |
| AlertDialog (C37) | `src/components/ui/alert-dialog.tsx` | Modal de confirmacao |
| LoadingState (C38) | `src/components/ui/loading-state.tsx` | Spinner pixel art |
| ErrorState (C39) | `src/components/ui/error-state.tsx` | Erro com retry |

### Button — Variantes

| Variante | Visual |
|---|---|
| `default` | bg-primary, shadow 4px, press effect |
| `secondary` | bg-secondary-container, shadow 4px, press effect |
| `tertiary` | Transparente, texto primary, underline dotted |
| `destructive` | bg-destructive, shadow 4px |
| `outline` | Borda outline-variant, fundo transparente |
| `ghost` | Sem borda, fundo transparente |

### Button — Sizes

| Size | Classe |
|---|---|
| `sm` | h-8, text-xs |
| `default` | h-10 |
| `lg` | h-12, text-base |
| `xl` | h-14, text-lg |
| `icon` | size-10 |

### Toast — Tipos

```tsx
import { toast } from "sonner"
toast.success("Mensagem") // borda verde (primary)
toast.error("Mensagem")   // borda vermelha (destructive)
toast.info("Mensagem")    // borda roxa (tertiary)
toast.warning("Mensagem") // borda amarela (secondary-container)
```

### ConfirmModal — Uso

```tsx
<AlertDialog>
  <AlertDialogTrigger render={<Button>Acao</Button>} />
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Titulo</AlertDialogTitle>
      <AlertDialogDescription>Descricao</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancelar</AlertDialogCancel>
      <AlertDialogAction>Confirmar</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```
