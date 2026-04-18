# Plan — issue-05: Wizard de Criacao (P04) — Subtask F

> Issue: issue-05 em docs/ISSUES.md
> Data: 2026-04-05

## Resumo

Integrar Claude API para gerar categorias e regras de pontuacao a partir da descricao do evento, implementar logica de criacao do bolao no banco (Pool + BetCategory + ScoringRule + PoolMember), gerar inviteCode unico e redirecionar para P05. Substituir dados mockados da Subtask V por dados reais da IA.

## Pesquisa Interna

### Design System (verificacao obrigatoria)

- Componentes visuais ja criados na Subtask V — nao modificar aparencia
- Tokens do wizard ja adicionados em globals.css na Subtask V

**Componentes ui/ existentes:**
- `sonner.tsx` — reutilizar para toasts de erro IA e erro criacao

**Componentes a reutilizar nesta issue:**
- Todos os componentes `src/components/features/wizard/*` criados na Subtask V
- `Button` — estados disabled para validacao
- Toast via `sonner` — feedback de erro

### Componentes reutilizaveis encontrados

- `src/actions/auth.ts` — pattern de Server Action com Zod validation e retorno de estado
- `src/types/auth.ts` — pattern de tipos com Zod schemas
- `src/types/pool.ts` — types existentes de Pool/PoolMember
- `src/lib/prisma.ts` — singleton PrismaClient ja configurado
- `src/lib/auth.ts` — `auth()` para obter sessao/userId

### Patterns do projeto

- Server Actions em `src/actions/` com validacao Zod
- `useActionState()` para forms que chamam Server Actions
- Prisma com SQLite via better-sqlite3 adapter
- Auth via `auth()` em Server Components / Server Actions
- Toast feedback via `sonner` (toast.success, toast.error)

### Nada encontrado (precisa criar)

| Item | Motivo |
|---|---|
| `src/actions/wizard.ts` | Server Actions para IA + criacao do bolao |
| `src/lib/ai.ts` | Wrapper do Anthropic SDK com prompts estruturados |
| `src/types/wizard.ts` | Ja existe da Subtask V, mas precisa expandir com tipos de request/response da IA |
| `tests/unit/actions/wizard.test.ts` | Testes unitarios das actions |
| `tests/unit/lib/ai.test.ts` | Testes unitarios do wrapper IA |

## Pesquisa Externa

### Anthropic SDK (@anthropic-ai/sdk)

**Status:** NAO esta no package.json — precisa instalar.

**Instalacao:**
```bash
npm install @anthropic-ai/sdk
```

**Pattern de uso com JSON estruturado:**
```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // usa ANTHROPIC_API_KEY do env

const response = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  messages: [{ role: "user", content: prompt }],
});
```

**Para respostas JSON estruturadas:** Usar system prompt que instrui retorno em JSON + parsear a resposta.

### Next.js 16 — Server Actions

**Pattern confirmado:**
- Server Actions em arquivos separados com `'use server'`
- Chamadas via `useActionState()` em Client Components ou diretamente
- `revalidatePath()` para invalidar cache apos mutacao
- `redirect()` para navegacao server-side apos sucesso

### Prisma — Transacoes

**Para criacao atomica (Pool + Categories + Rules + Member):**
```typescript
await prisma.$transaction(async (tx) => {
  const pool = await tx.pool.create({ ... });
  await tx.betCategory.createMany({ ... });
  // etc.
});
```

### Documentacao consultada

- Anthropic SDK docs — client.messages.create, structured output
- `node_modules/next/dist/docs/` — Server Actions, redirect, revalidatePath
- Prisma docs — transactions, createMany, cuid generation
- `src/actions/auth.ts` — pattern existente de Server Actions no projeto

### Padroes adotados

- Anthropic SDK com wrapper em `src/lib/ai.ts` (isola config e prompts)
- Server Actions atomicas com `prisma.$transaction`
- inviteCode gerado como 8 chars alfanumericos random (crypto.randomBytes)
- Validacao Zod em todas as Server Actions
- Toast para feedback de erro (sonner)

## Cenarios

### Caminho feliz (B11 → B17)

1. **Step 1:** Usuario digita "Copa do Mundo 2026, quero palpites em todos os jogos e no campeao"
2. Clica "Proximo" → Server Action `analyzeEvent()` envia para Claude API
3. Loading state no botao enquanto IA processa
4. IA retorna: `{ name: "Copa do Mundo 2026", eventType: "football_tournament", suggestedCategories: [...] }`
5. Avanca para Step 2 com categorias reais da IA

6. **Step 2:** Categorias da IA renderizadas como CategoryCheckCards
7. Usuario toggle on/off categorias (B13)
8. Pode clicar "+ Adicionar" → input → Server Action `suggestCategory()` → nova categoria da IA (B14)
9. Minimo 1 categoria selecionada para avancar
10. Clica "Proximo" → avanca para Step 3

11. **Step 3:** Server Action `generateScoringRules()` gera regras baseadas nas categorias selecionadas
12. Regras renderizadas em ScoringRuleGroups
13. Usuario edita valores inline (B15) — min 1, max 999, inteiros
14. Pode pedir rebalanceamento via input → Server Action `rebalanceScoring()` (B16)
15. Clica "Proximo" → avanca para Step 4

16. **Step 4:** Review cards com dados reais
17. Links "Editar" voltam ao step correspondente
18. Clica "CRIAR BOLAO" → Server Action `createPool()`
19. Transacao Prisma cria Pool + BetCategories + ScoringRules + PoolMember(admin)
20. Gera inviteCode unico (8 chars alfanumericos)
21. `redirect('/pool/[poolId]/created')` → P05

### Edge cases

- **Texto vazio step 1:** Botao "Proximo" desabilitado (B11)
- **Erro IA step 1:** Toast "Nao consegui entender o evento. Tente descrever com mais detalhes." + permite re-tentar (B11)
- **Template chips (B12):** Pre-preenche input e envia para IA automaticamente
- **0 categorias selecionadas:** Botao "Proximo" desabilitado (B13)
- **Valor pontuacao invalido:** min 1, max 999, apenas inteiros (B15)
- **Erro rebalanceamento IA:** Toast + mantem valores anteriores (B16)
- **Erro criacao:** Toast "Erro ao criar bolao" + nao redireciona (B17)
- **inviteCode duplicado:** Loop retry com novo random (improvavel mas tratado)
- **Sessao expirada:** Redirect para /auth

### Erros

- Claude API timeout/error → catch → toast generico + permite re-tentar
- Prisma error (constraint, connection) → catch → toast "Erro ao criar bolao"
- Network error → catch generico → toast "Tente novamente"
- Auth error (sessao invalida) → redirect /auth

## Banco de Dados

### Tabelas envolvidas

- `Pool` — CREATE (novo bolao com name, status:open, inviteCode)
- `PoolMember` — CREATE (criador como admin)
- `BetCategory` — CREATE (categorias selecionadas pelo usuario)
- `ScoringRule` — CREATE (regras de pontuacao configuradas)
- `User` — READ (obter userId da sessao)

### Schema necessario (nao existe ainda)

```prisma
model BetCategory {
  id          String        @id @default(cuid())
  name        String
  description String?
  type        String        // "single_choice" | "exact_score" | "free_text"
  isLocked    Boolean       @default(false)
  deadline    DateTime?
  poolId      String
  pool        Pool          @relation(fields: [poolId], references: [id], onDelete: Cascade)
  scoringRules ScoringRule[]
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@index([poolId])
}

model ScoringRule {
  id          String      @id @default(cuid())
  name        String
  points      Int
  categoryId  String
  category    BetCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  createdAt   DateTime    @default(now())

  @@index([categoryId])
}
```

**Modificacoes no model Pool existente:**
```prisma
model Pool {
  // campos existentes...
  eventType   String?       // tipo de evento (football_tournament, etc.)
  categories  BetCategory[] // nova relacao
}
```

**Modificacao no inviteCode:**
- Trocar `@default(cuid())` por logica custom de 8 chars alfanumericos (D07 da spec)

## Dependencias Externas

### Nova dependencia

| Pacote | Versao | Motivo |
|---|---|---|
| `@anthropic-ai/sdk` | latest | Integracao com Claude API para gerar categorias e regras |

### Variavel de ambiente necessaria

```env
ANTHROPIC_API_KEY=sk-ant-...
```

## Arquivos — O Que Criar e Modificar

### Criar

| Arquivo | O que contem |
|---|---|
| `src/lib/ai.ts` | Wrapper Anthropic SDK. Funcoes: `analyzeEvent(text)` → retorna nome/tipo/categorias, `suggestCategory(context, request)` → retorna nova categoria, `generateScoringRules(categories)` → retorna regras agrupadas, `rebalanceScoring(rules, request)` → retorna regras rebalanceadas. System prompts estruturados. Retorno JSON tipado |
| `src/actions/wizard.ts` | Server Actions: `analyzeEventAction(formData)` — valida input + chama analyzeEvent + retorna resultado. `suggestCategoryAction(formData)` — gera categoria via IA. `generateScoringAction(formData)` — gera regras. `rebalanceScoringAction(formData)` — rebalanceia. `createPoolAction(formData)` — transacao Prisma (Pool + BetCategories + ScoringRules + PoolMember) + gera inviteCode + redirect |
| `src/types/wizard.ts` | Expandir types existentes (da Subtask V) com: AnalyzeEventRequest/Response, SuggestCategoryRequest/Response, GenerateScoringRequest/Response, RebalanceRequest/Response, CreatePoolRequest. Zod schemas para validacao |
| `tests/unit/lib/ai.test.ts` | Testes unitarios do wrapper IA (mock do Anthropic SDK). Testa parsing de respostas, tratamento de erros, formato de prompts |
| `tests/unit/actions/wizard.test.ts` | Testes unitarios das Server Actions (mock do Prisma e IA). Testa validacao, criacao atomica, geracao de inviteCode, tratamento de erros |

### Modificar

| Arquivo | O que mudar |
|---|---|
| `prisma/schema.prisma` | Adicionar models BetCategory e ScoringRule. Adicionar campo eventType e relacao categories no Pool. Alterar inviteCode default |
| `src/components/features/wizard/WizardShell.tsx` | Substituir dados mockados por chamadas a Server Actions. Adicionar loading states. Implementar validacoes reais (texto vazio, min categorias, range pontuacao). Conectar botoes com actions |
| `src/components/features/wizard/StepEvent.tsx` | Conectar com analyzeEventAction. Loading state no botao. Tratamento de erro IA. Template chips disparam IA |
| `src/components/features/wizard/StepCategories.tsx` | Renderizar categorias da IA em vez de mock. Toggle real com validacao min 1. Botao "+ Adicionar" chama suggestCategoryAction |
| `src/components/features/wizard/StepScoring.tsx` | Renderizar regras da IA. Edicao inline com validacao (1-999, inteiros). Input rebalanceamento chama rebalanceScoringAction |
| `src/components/features/wizard/StepReview.tsx` | Renderizar dados reais. CTA "CRIAR BOLAO" chama createPoolAction. Loading state. Tratamento de erro |
| `package.json` | Adicionar @anthropic-ai/sdk nas dependencies |
| `.env` | Adicionar ANTHROPIC_API_KEY (nao commitar) |
| `.gitignore` | Garantir que .env esta listado |

### NAO tocar

Tudo que nao esta listado acima. Especialmente:
- `src/components/ui/*` — componentes base ja prontos
- `src/components/features/wizard/WizardProgressBar.tsx` — visual pronto da Subtask V
- `src/components/features/wizard/WizardHeader.tsx` — visual pronto
- `src/components/features/wizard/AIBubble.tsx` — visual pronto
- `src/components/features/wizard/TemplateChips.tsx` — visual pronto (so recebe props diferentes)
- `src/components/features/wizard/CategoryCheckCard.tsx` — visual pronto
- `src/components/features/wizard/ScoringRuleGroup.tsx` — visual pronto
- `src/components/features/wizard/ReviewCard.tsx` — visual pronto
- `src/app/home/*` — dashboard, escopo issue-04
- `src/app/auth/*` — auth, escopo issue-03
- `src/lib/auth.ts` — config auth ja pronta
- `src/lib/prisma.ts` — singleton ja configurado

## Decisoes desta Issue

### D01 — Wrapper de IA em src/lib/ai.ts (nao inline nas actions)

**Contexto:** Multiplas Server Actions precisam chamar Claude API com prompts diferentes.
**Decisao:** Criar `src/lib/ai.ts` que encapsula o Anthropic SDK, define system prompts e parseia respostas JSON. As Server Actions chamam funcoes do wrapper.
**Alternativas descartadas:** Chamar SDK diretamente nas actions — duplicaria config e prompts. Criar servico completo com classes — over-engineering para o escopo atual.

### D02 — Transacao Prisma para criacao atomica

**Contexto:** Criar bolao envolve 4 tabelas (Pool, BetCategory, ScoringRule, PoolMember). Se uma falha, nenhuma deve ser criada.
**Decisao:** Usar `prisma.$transaction()` para garantir atomicidade. Todas as operacoes dentro de uma transacao.
**Alternativas descartadas:** Creates sequenciais com cleanup manual em caso de erro — fragil e propenso a dados orfaos.

### D03 — inviteCode com crypto.randomBytes (8 chars alfanumericos)

**Contexto:** Spec D07 define inviteCode como 8 chars alfanumericos, nao cuid.
**Decisao:** Gerar com `crypto.randomBytes(4).toString('hex')` (8 chars hex). Verificar unicidade no banco antes de usar. Loop retry se duplicado (improvavel).
**Alternativas descartadas:** (1) cuid() — muito longo, nao atende spec. (2) nanoid — dependencia extra desnecessaria. (3) Math.random — nao criptograficamente seguro.

### D04 — Claude claude-sonnet-4-6 para geracoes do wizard

**Contexto:** Precisamos escolher qual modelo Claude usar para gerar categorias e regras.
**Decisao:** Usar `claude-sonnet-4-6` — bom equilibrio entre qualidade e velocidade/custo para geracoes estruturadas.
**Alternativas descartadas:** Opus — mais caro e lento para tarefas simples de extracao/geracao. Haiku — pode nao ter qualidade suficiente para sugestoes criativas.

### D05 — State client-side ate confirmacao (D03 da spec)

**Contexto:** O wizard tem 4 steps e o usuario pode navegar entre eles editando dados.
**Decisao:** Manter todo o state em React useState no WizardShell. So persiste no banco quando usuario clica "CRIAR BOLAO" no step 4. Se abandonar, nada e criado.
**Alternativas descartadas:** Salvar rascunho no banco a cada step — complexidade desnecessaria, cria boloes orfaos.
