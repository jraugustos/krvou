# Arquitetura — KRVOU

> Stack: Next.js 16 + TypeScript + Tailwind v4 + shadcn/ui
> Deploy: Vercel

## Estrutura de Pastas

```
src/
├── app/                  ← App Router (paginas, layouts, rotas)
│   ├── globals.css       ← Design tokens + estilos globais
│   ├── layout.tsx        ← Root layout (fontes, Toaster, metadata)
│   ├── page.tsx          ← Landing page (/)
│   └── dev/page.tsx      ← Preview de componentes (/dev)
├── components/
│   ├── ui/               ← Componentes base (Button, Input, Toast, Modal, etc.)
│   ├── features/         ← Componentes de dominio (BolaoCard, WizardStep, etc.)
│   └── layouts/          ← Layouts (TopBar, BottomNav, PageContainer)
├── hooks/                ← Custom hooks
├── actions/              ← Server Actions
├── lib/                  ← Utilitarios (cn, formatters)
└── types/                ← TypeScript types/interfaces
```

## Convencoes

### Naming
- Componentes: PascalCase (`Button.tsx`, `LoadingState.tsx`)
- Hooks: camelCase com prefixo `use` (`useAuth.ts`)
- Actions: camelCase (`createPool.ts`)
- Types: PascalCase (`Pool`, `BetCategory`)

### Componentes
- **Server Component por padrao** — so `'use client'` se usa hooks/state/events
- Props sempre tipadas via interface
- Composicao sobre heranca
- Sem logica de negocio — renderiza apenas
- Mobile-first com breakpoints Tailwind (sm, md, lg)

### Styling
- Tailwind utility classes (nunca CSS customizado em componentes)
- `cn()` de `@/lib/utils` para merge condicional
- Design tokens de `globals.css` — nunca hardcodar cores
- Border-radius 0px global (via --radius: 0rem)

### Server Actions
- Validacao com Zod
- Pattern: `createSafeAction` (a definir)
- Revalidacao com `revalidatePath` apos mutacoes

### Imports
- Alias `@/` para `src/`
- Importar componentes ui/ com `@/components/ui/`
- Importar lib com `@/lib/`
