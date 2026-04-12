# Plan — issue-05: Wizard de Criacao (P04) — Revisado

> Issue: issue-05 em docs/ISSUES.md
> Data: 2026-04-12
> Substitui: PLAN.md (Subtask V) e PLAN-F.md (Subtask F) anteriores — wizard redesenhado sem IA

## Resumo

Reescrever completamente o wizard de criacao de 3 steps: (1) selecionar produto, (2) configurar bolao (nome + categorias + categoria personalizada), (3) revisao e criacao. Substituir o modelo antigo baseado em IA (AIBubble, TemplateChips, ScoringRuleGroup) pelo novo baseado em produtos pre-definidos. Novo schema: Product, ProductCategory, PoolCategory. Seed com Copa do Mundo 2026.

---

## Pesquisa Interna

### Design System (verificacao obrigatoria)

- **Tokens de superficie:** `bg-surface-container`, `bg-surface-high`, `bg-surface-lowest`
- **Primary:** `text-primary`, `border-primary`, `bg-primary/5` (estado selecionado)
- **Textos:** `text-on-surface` (principal), `text-on-surface-variant` (secundario/labels)
- **Bordas:** minimo 2px, `border-outline-variant` (ghost), `border-primary` (ativo/selecionado)
- **Tipografia:** `font-pixel` (scores, step counter), `font-heading` (labels, badges), `font-sans` (body)
- **Sombras:** `shadow-arcade-dark` (cards), `shadow-arcade-primary` (CTAs)
- **Espacamento mobile:** `p-5`, gaps de `gap-4` ou `gap-6`

**Componentes ui/ a reutilizar:**

| Componente | Path | Uso |
|---|---|---|
| `Button` | `src/components/ui/button.tsx` | Voltar/Proximo, Criar, "+ Adicionar", Cancelar/Confirmar custom |
| `Input` | `src/components/ui/input.tsx` | PoolNameInput, CustomCategoryInput |
| `toast` | `src/components/ui/sonner.tsx` | Feedback de erro na criacao |

### Componentes wizard a reutilizar (sem mudanca)

| Componente | Path | Motivo |
|---|---|---|
| `WizardProgressBar` | `src/components/features/wizard/WizardProgressBar.tsx` | Ja usa totalSteps como prop dinamica |
| `WizardHeader` | `src/components/features/wizard/WizardHeader.tsx` | Generico, nao precisa mudar |
| `ReviewCard` | `src/components/features/wizard/ReviewCard.tsx` | Props identicas ao novo uso |

### Componentes wizard a MODIFICAR

| Componente | O que muda |
|---|---|
| `CategoryCheckCard` | Adicionar suporte a badge "Personalizada" (tipo `"custom"`) + atualizar tipo `Category` importado |
| `StepReview` | Remover referencia a `scoringRange`/`rulesCount`, adicionar `productName` no ReviewCard de produto |
| `WizardShell` | Reescrever completo: 3 steps, novo state (selectedProductId, poolName, categories), sem AI calls |

### Componentes wizard a DELETAR

| Arquivo | Motivo |
|---|---|
| `src/components/features/wizard/AIBubble.tsx` | Sem IA no novo wizard |
| `src/components/features/wizard/TemplateChips.tsx` | Substituido por ProductCard |
| `src/components/features/wizard/ScoringRuleGroup.tsx` | Pontuacao e plataforma-definida, sem UI |
| `src/components/features/wizard/StepEvent.tsx` | Substituido por StepProduct |
| `src/components/features/wizard/StepScoring.tsx` | Step de pontuacao removido |

### Componentes wizard a CRIAR

| Arquivo | O que e |
|---|---|
| `src/components/features/wizard/ProductCard.tsx` | C12 — card selecionavel de produto |
| `src/components/features/wizard/PoolNameInput.tsx` | C13 — input nome do bolao com contador |
| `src/components/features/wizard/CustomCategoryInput.tsx` | C15 — botao + input inline para categoria personalizada |
| `src/components/features/wizard/StepProduct.tsx` | Step 1 — composicao de ProductCards |
| `src/components/features/wizard/StepConfigure.tsx` | Step 2 — composicao de PoolNameInput + CategoryCheckCards + CustomCategoryInput |

### Outros arquivos a modificar/deletar

| Arquivo | O que muda |
|---|---|
| `src/types/wizard.ts` | Reescrever: remover todos os tipos de IA, adicionar `Product`, `ProductCategory`, `PoolCategory`, `WizardState`, `CreatePoolSchema` (Zod) |
| `src/actions/wizard.ts` | Reescrever: remover actions de IA, manter apenas `createPoolAction` + adicionar `getProductsAction` |
| `src/app/pool/new/page.tsx` | Atualizar `WizardStep` para `1 | 2 | 3`, buscar produtos no servidor e passar para WizardShell |
| `src/lib/ai.ts` | DELETAR — sem IA no wizard |
| `package.json` | Remover `@anthropic-ai/sdk` das dependencies |
| `prisma/schema.prisma` | Ver secao Banco de Dados |

### Patterns do projeto

- **Server Component por padrao** — page.tsx e Server Component que faz fetch de produtos e passa como prop para WizardShell (Client Component)
- **Server Actions:** validacao com Zod, retorno `{ success, data } | { success, error } | null`
- **Forms:** `useTransition` + chamadas diretas a Server Actions (nao `useActionState` neste caso — state e gerenciado no WizardShell)
- **Toast:** `import { toast } from "sonner"` → `toast.error()` para erros

---

## Pesquisa Externa

### Next.js 16 — searchParams (breaking change confirmado)

`searchParams` e uma Promise em page.tsx — deve ser `await`ed:

```typescript
export default async function NewPoolPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { step } = await searchParams;
}
```

**Documentacao:** `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md`

### Prisma 7 — seed

Seed via `prisma/seed.ts` + script em `package.json`:

```json
"prisma": {
  "seed": "ts-node --compiler-options '{\"module\":\"CommonJS\"}' prisma/seed.ts"
}
```

Ou mais simples com `tsx`:
```json
"prisma": { "seed": "tsx prisma/seed.ts" }
```

### Tailwind v4 — cores e estados

Para estado selecionado do ProductCard, usar `border-primary bg-primary/5` (Tailwind opacity modifier).
Badge "Personalizada" em `bg-secondary-container text-secondary-foreground`.

---

## Cenarios

### Caminho feliz (B11 → B15)

1. Usuario acessa `/pool/new?step=1`
2. Page.tsx (Server) busca produtos ativos no banco → passa para WizardShell
3. WizardShell renderiza StepProduct com ProductCards
4. Usuario clica "Copa do Mundo 2026" → card fica com borda primary + check
5. Clica "Proximo" → step 2
6. StepConfigure renderiza: PoolNameInput + 5 CategoryCheckCards (dados do produto selecionado)
7. Usuario digita nome, toggle categorias, opcionalmente adiciona categoria personalizada
8. Clica "Proximo" com min 1 categoria e nome valido → step 3
9. StepReview renderiza ReviewCards: produto, nome, categorias ativas
10. Usuario clica "CRIAR BOLAO" → `createPoolAction`
11. Server Action: valida sessao, cria Pool + PoolCategory[]  + PoolMember(admin), gera inviteCode
12. `redirect('/pool/[poolId]/created')`

### Edge cases

- Produto nao selecionado → botao "Proximo" desabilitado (B11)
- "Em breve" nao clicavel → ProductCard com opacity-50, pointer-events-none (B11)
- Nome vazio → botao "Proximo" step 2 desabilitado (B12)
- Nome > 60 chars → bloqueado no input, contador vermelho (B12)
- 0 categorias ativas → botao "Proximo" desabilitado (B13)
- Categoria personalizada: botao "Adicionar" desabilitado com input vazio (B14)
- Categoria personalizada: aparece na lista com badge "Personalizada", ja selecionada (B14)
- Browser Back → step anterior, estado mantido em React state (B16)
- Voltar no step 1 → `/home` (B16)
- Sessao expirada → `createPoolAction` faz `redirect('/auth')`

### Erros

- `createPoolAction` falha (Prisma error) → `toast.error("Erro ao criar bolao. Tente novamente.")` + nao redireciona
- Banco offline → catch generico → toast
- `redirect()` lanca erro especial — re-throw obrigatorio (pattern ja usado em wizard.ts atual)

---

## Banco de Dados

### Schema — o que muda

**REMOVER completamente:**
- `model BetCategory` — sem migracao aplicada, pode deletar
- `model ScoringRule` — sem migracao aplicada, pode deletar (sera recriado no futuro linkado a ProductCategory)

**ADICIONAR:**

```prisma
model Product {
  id          String            @id @default(cuid())
  name        String
  slug        String            @unique
  description String?
  isActive    Boolean           @default(true)
  categories  ProductCategory[]
  pools       Pool[]
  createdAt   DateTime          @default(now())
}

model ProductCategory {
  id             String         @id @default(cuid())
  productId      String
  product        Product        @relation(fields: [productId], references: [id], onDelete: Cascade)
  name           String
  description    String?
  type           String         // "exact_score" | "single_choice" | "free_text"
  resultSource   String         @default("manual") // "api" | "manual" (D13)
  sortOrder      Int            @default(0)
  poolCategories PoolCategory[]
  createdAt      DateTime       @default(now())

  @@index([productId])
}

model PoolCategory {
  id                String           @id @default(cuid())
  poolId            String
  pool              Pool             @relation(fields: [poolId], references: [id], onDelete: Cascade)
  productCategoryId String?          // null se isCustom = true
  productCategory   ProductCategory? @relation(fields: [productCategoryId], references: [id])
  isCustom          Boolean          @default(false)
  customName        String?          // obrigatorio se isCustom = true
  customResultText  String?          // preenchido pelo admin ao final da competicao
  isActive          Boolean          @default(true)
  createdAt         DateTime         @default(now())

  @@index([poolId])
  @@index([productCategoryId])
}
```

**MODIFICAR model Pool:**

```prisma
model Pool {
  id          String         @id @default(cuid())
  name        String
  description String?
  productId   String                              // NOVO (antes: eventType String?)
  product     Product        @relation(fields: [productId], references: [id])  // NOVO
  status      String         @default("open")
  inviteCode  String         @unique
  creatorId   String
  creator     User           @relation("PoolCreator", fields: [creatorId], references: [id])
  members     PoolMember[]
  categories  PoolCategory[]                      // MUDOU (antes: BetCategory[])
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  @@index([creatorId])
  @@index([productId])
}
```

### Seed — Copa do Mundo 2026

`prisma/seed.ts` cria (idempotente com `upsert`):

```typescript
const copa = await prisma.product.upsert({
  where: { slug: "copa-2026" },
  update: {},
  create: {
    name: "Copa do Mundo 2026",
    slug: "copa-2026",
    description: "FIFA World Cup 2026 — USA, Canada & Mexico",
    isActive: true,
    categories: {
      create: [
        { name: "Resultados dos jogos",        type: "exact_score",   resultSource: "api",    sortOrder: 1, description: "Placar exato de cada partida" },
        { name: "Vencedor da copa",             type: "single_choice", resultSource: "api",    sortOrder: 2, description: "Selecao campea do torneio" },
        { name: "Artilheiro",                   type: "free_text",     resultSource: "api",    sortOrder: 3, description: "Jogador com mais gols" },
        { name: "Primeiro, segundo e terceiro", type: "single_choice", resultSource: "api",    sortOrder: 4, description: "Podio de selecoes" },
        { name: "Jogador revelacao",            type: "free_text",     resultSource: "api",    sortOrder: 5, description: "Nome do jogador" },
      ],
    },
  },
});
```

---

## Dependencias Externas

### Remover

| Pacote | Motivo |
|---|---|
| `@anthropic-ai/sdk` | Sem IA no novo wizard |

### Adicionar

| Pacote | Motivo |
|---|---|
| `tsx` (devDependency) | Executar seed.ts sem configuracao extra |

> Verificar: `tsx` pode ja estar instalado como dependencia de outra lib. Se sim, usar diretamente.

---

## Arquivos — O Que Criar, Modificar e Deletar

### Criar

| Arquivo | O que contem |
|---|---|
| `src/components/features/wizard/ProductCard.tsx` | C12. Card de produto. Props: `{ product: Product, selected: boolean, onSelect: () => void }`. Estado selecionado: `border-primary bg-primary/5` + icone Check no canto. Badge "Em breve" se `!product.isActive` (opacity-50, sem onClick) |
| `src/components/features/wizard/PoolNameInput.tsx` | C13. Input para nome do bolao. Props: `{ value: string, onChange: (v: string) => void }`. Label "NOME DO BOLAO" em font-pixel, placeholder, contador `X/60` (vermelho se > 60). Usa `Input` de ui/ |
| `src/components/features/wizard/CustomCategoryInput.tsx` | C15. Botao + input inline. Estado fechado: botao "outline" "+ Adicionar categoria". Estado aberto: Input + botao "Adicionar" (disabled se vazio) + botao "Cancelar". Props: `{ onAdd: (name: string) => void }` |
| `src/components/features/wizard/StepProduct.tsx` | Step 1. Composicao: titulo instrucional + grid de ProductCards. Props: `{ products: Product[], selectedId: string \| null, onSelect: (id: string) => void }` |
| `src/components/features/wizard/StepConfigure.tsx` | Step 2. Composicao: PoolNameInput + lista de CategoryCheckCards + CustomCategoryInput. Props: `{ poolName, onPoolNameChange, categories, onToggle, onAddCustom, productName }` |
| `prisma/seed.ts` | Seed idempotente com upsert. Cria Product "Copa do Mundo 2026" + 5 ProductCategories |

### Modificar

| Arquivo | O que muda |
|---|---|
| `prisma/schema.prisma` | Remover BetCategory e ScoringRule. Adicionar Product, ProductCategory, PoolCategory. Modificar Pool (productId, PoolCategory[]) |
| `src/types/wizard.ts` | Reescrever: remover todos os tipos de IA (AnalyzeEventResponse, SuggestCategoryResponse, etc.). Adicionar `Product`, `ProductCategory`, `PoolCategory`, `WizardCategory` (union de pre-definida + personalizada), `WizardState`, `CreatePoolSchema` (Zod), `WizardStep = 1 \| 2 \| 3` |
| `src/actions/wizard.ts` | Reescrever: remover todas as actions de IA. Manter apenas `createPoolAction` (recebe productId, poolName, activeProductCategoryIds[], customCategoryNames[]). Server Component page.tsx faz fetch direto de produtos via Prisma (sem action separada) |
| `src/components/features/wizard/WizardShell.tsx` | Reescrever: state = `{ selectedProductId, poolName, categories: WizardCategory[] }`. 3 steps. Handlers sem AI. Recebe `products: Product[]` como prop |
| `src/components/features/wizard/CategoryCheckCard.tsx` | Adicionar suporte a `type: "custom"` (badge "Personalizada" em secondary-container). Atualizar import de types para novo `WizardCategory` |
| `src/components/features/wizard/StepReview.tsx` | Remover ReviewCards de pontuacao (scoringRange, rulesCount). Adicionar ReviewCard de produto (label "PRODUTO", titulo = productName). Atualizar props |
| `src/app/pool/new/page.tsx` | `WizardStep = 1 \| 2 \| 3`. Adicionar fetch `prisma.product.findMany({ where: { isActive: true }, include: { categories: { orderBy: { sortOrder: 'asc' } } } })`. Passar `products` como prop para WizardShell |
| `package.json` | Remover `@anthropic-ai/sdk`. Adicionar script `"prisma": { "seed": "tsx prisma/seed.ts" }` |

### Deletar

| Arquivo | Motivo |
|---|---|
| `src/lib/ai.ts` | Sem IA |
| `src/components/features/wizard/AIBubble.tsx` | Sem IA |
| `src/components/features/wizard/TemplateChips.tsx` | Substituido por ProductCard |
| `src/components/features/wizard/ScoringRuleGroup.tsx` | Sem step de pontuacao |
| `src/components/features/wizard/StepEvent.tsx` | Substituido por StepProduct |
| `src/components/features/wizard/StepScoring.tsx` | Step removido |

### NAO tocar

- `src/components/features/wizard/WizardProgressBar.tsx` — sem mudanca (prop totalSteps ja e dinamica)
- `src/components/features/wizard/WizardHeader.tsx` — sem mudanca
- `src/components/features/wizard/ReviewCard.tsx` — sem mudanca
- `src/components/ui/*` — componentes base prontos
- `src/app/home/*` — fora do escopo
- `src/app/auth/*` — fora do escopo
- `src/components/layouts/*` — fora do escopo
- `src/lib/auth.ts`, `src/lib/prisma.ts`, `src/lib/utils.ts` — fora do escopo
- `src/app/pool/[poolId]/created/*` — fora do escopo (issue-06)

---

## Decisoes desta Issue

### D01 — page.tsx faz fetch de produtos diretamente (sem Server Action)

**Contexto:** O wizard precisa carregar os produtos disponíveis. Poderia ser uma Server Action chamada do Client Component ou um fetch no Server Component page.
**Decisao:** `page.tsx` e Server Component — faz `prisma.product.findMany()` diretamente e passa `products` como prop para `WizardShell`. Sem Server Action intermediaria para leitura.
**Alternativas descartadas:** Server Action `getProductsAction` chamada no WizardShell — desnecessario, page.tsx ja e server-side. useEffect com fetch — anti-pattern para dados iniciais no App Router.

### D02 — Categorias do produto vem junto com o produto (include no fetch)

**Contexto:** No step 2, o usuario precisa ver as categorias do produto selecionado. As categorias sao do banco.
**Decisao:** page.tsx inclui `categories` no fetch do produto (`include: { categories: { orderBy: { sortOrder: 'asc' } } }`). WizardShell recebe tudo upfront. Step 2 filtra categorias pelo `selectedProductId`.
**Alternativas descartadas:** Fetch lazy das categorias quando produto e selecionado (Server Action no cliente) — adiciona latencia e complexidade desnecessaria no MVP com 1 produto.

### D03 — createPoolAction recebe IDs de categorias separados de nomes de categorias custom

**Contexto:** O wizard tem dois tipos de categoria: pre-definidas (productCategoryId) e personalizadas (texto livre).
**Decisao:** `createPoolAction` recebe dois campos distintos via FormData: `activeProductCategoryIds` (JSON array de ids) e `customCategoryNames` (JSON array de strings). Dentro da action, cria um `PoolCategory` para cada id + um `PoolCategory` com `isCustom: true` para cada nome.
**Alternativas descartadas:** Enviar tudo como um array unificado com flag — mais fragil para validacao Zod.

### D04 — BetCategory e ScoringRule removidos do schema nesta issue

**Contexto:** BetCategory e ScoringRule existem no schema.prisma mas nenhuma migration foi aplicada para elas (as 2 migrations existentes so cobrem User, Account, Pool, PoolMember). Sao residuos do wizard antigo.
**Decisao:** Remover ambos do schema e criar nova migration. Nao ha dados para migrar. ScoringRule sera recriado em issue futura linkado a ProductCategory.
**Alternativas descartadas:** Manter no schema para compatibilidade — aumenta ruido e confusao. Nao ha consumers dessas tabelas no codigo apos o rewrite desta issue.

### D05 — Seed idempotente com upsert

**Contexto:** O seed precisa poder rodar multiplas vezes sem duplicar dados.
**Decisao:** Usar `prisma.product.upsert({ where: { slug: "copa-2026" } })`. Se o produto ja existe, o `update: {}` e um no-op. Categorias sao criadas apenas se o produto nao existia.
**Alternativas descartadas:** `deleteMany` + `createMany` — destrutivo, apaga IDs referenciados por PoolCategory em desenvolvimento.
