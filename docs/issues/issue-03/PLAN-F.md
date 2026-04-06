# Plan — issue-03-F: Autenticacao com NextAuth (Subtask F)

> Issue: ISSUES.md linhas 124-169
> Data: 2026-04-04
> Subtask: F (funcional) — auth completa com NextAuth, Prisma, Google OAuth + Credentials

## Resumo

Implementar autenticacao completa no KRVOU usando Auth.js v5 (next-auth@beta) com Google OAuth e Credentials providers, modelo User no Prisma (SQLite local/dev), validacao Zod, proxy.ts para protecao de rotas, e integracao com o AuthForm visual ja existente (subtask V).

## Pesquisa Interna

### Design System (verificacao obrigatoria)

- **Tokens**: Todos definidos em `globals.css` — usados pelo AuthForm existente
- **Componentes ui/ existentes**: Button, Input, Toaster (sonner), AlertDialog, LoadingState, ErrorState
- **Componentes a reutilizar nesta issue**: Button (estados loading/disabled), Input (estados error/aria-invalid), Toaster (toast.error para erros de servidor)

### Componentes reutilizaveis encontrados

- `src/components/features/auth/AuthForm.tsx` — form visual pronto (subtask V), precisa integrar com Server Actions e estados loading/erro
- `src/components/features/auth/GoogleIcon.tsx` — icone SVG ja pronto
- `src/components/ui/button.tsx` — reutilizar com estado loading (disabled + texto alterado)
- `src/components/ui/input.tsx` — reutilizar com aria-invalid para campos com erro
- `src/components/ui/sonner.tsx` — toast.error para erros de servidor
- `src/lib/utils.ts` — `cn()` para classes condicionais

### Patterns do projeto

- Server Components por padrao, `'use client'` so quando precisa de hooks/state/events
- Componentes features/ agrupados por dominio (`features/auth/`)
- Alias `@/` para `src/`
- Nao existem: `src/hooks/`, `src/actions/`, `src/types/` — serao criados nesta issue

### Nada encontrado (precisa criar)

- `auth.ts` — config Auth.js (raiz do projeto, ao lado de `src/`)
- `src/app/api/auth/[...nextauth]/route.ts` — route handler Auth.js
- `src/proxy.ts` — protecao de rotas (Next.js 16 usa `proxy.ts`, nao `middleware.ts`)
- `prisma/schema.prisma` — schema do banco
- `src/lib/prisma.ts` — singleton PrismaClient
- `src/actions/auth.ts` — Server Actions de signup
- `src/types/auth.ts` — types para form state
- `.env.local` — variaveis de ambiente (template)

## Pesquisa Externa

### Documentacao consultada

- **Next.js 16 Proxy docs** (`node_modules/next/dist/docs/`) — `middleware.ts` foi deprecado e renomeado para `proxy.ts` com export `proxy()`. Arquivo fica em `src/proxy.ts` quando usando pasta `src/`
- **Next.js 16 Authentication guide** (`node_modules/next/dist/docs/`) — pattern de Server Actions com `useActionState`, validacao Zod no servidor, hash com bcrypt
- **Auth.js v5** (pesquisa web) — pacote `next-auth@beta` + `@auth/prisma-adapter`. Config em `auth.ts` na raiz. Exporta `{ handlers, signIn, signOut, auth }`. Env vars com prefixo `AUTH_` + `AUTH_SECRET`
- **Prisma** (pesquisa web) — schema com models User, Account, Session, VerificationToken para compatibilidade Auth.js. Singleton pattern para dev

### Padroes adotados

- Auth.js v5 (next-auth@beta) — linha ativa, v4 so recebe security patches
- JWT strategy (sem session table no banco) — mais simples, sem necessidade de sessions persistentes
- `bcryptjs` para hash de senha — zero native deps, funciona em qualquer plataforma, seguro com cost 12
- SQLite via Prisma para dev local (produção pode migrar para PostgreSQL depois)
- Zod para validacao (ja instalado no projeto)
- `proxy.ts` (nao `middleware.ts`) — obrigatorio no Next.js 16

## Cenarios

### Caminho feliz — Google OAuth (B04)

1. Usuario clica "Continuar com Google"
2. `signIn("google")` do Auth.js inicia fluxo OAuth
3. Google autentica, callback retorna para `/api/auth/callback/google`
4. Auth.js cria/atualiza User no banco via PrismaAdapter
5. JWT gerado com dados do usuario
6. Redirect para `/home`

### Caminho feliz — Login email/senha (B05)

1. Usuario preenche email + senha
2. Submit dispara Server Action `loginAction`
3. Validacao Zod (email formato valido, senha nao vazia)
4. `signIn("credentials", { email, password })` do Auth.js
5. Credentials provider busca User pelo email no Prisma
6. Compara senha com hash via `bcryptjs.compare`
7. JWT gerado, sessao criada
8. Redirect para `/home`

### Caminho feliz — Signup (B06)

1. Usuario preenche nome + email + senha (modo signup)
2. Submit dispara Server Action `signupAction`
3. Validacao Zod: nome >= 2 chars, email valido, senha >= 8 chars
4. Verifica se email ja existe no banco
5. Hash da senha com `bcryptjs.hash(password, 12)`
6. Cria User no Prisma
7. Login automatico via `signIn("credentials", ...)`
8. Redirect para `/home`

### Edge cases

- **Email formato invalido** → erro Zod → highlight campo + mensagem inline
- **Senha vazia** → erro Zod → highlight campo
- **Signup: nome < 2 chars** → erro Zod → "Nome obrigatorio (min 2 caracteres)"
- **Signup: senha < 8 chars** → erro Zod → "Senha deve ter no minimo 8 caracteres"
- **Signup: email duplicado** → Prisma unique constraint catch → "Ja existe uma conta com esse email"
- **Login: credenciais erradas** → "Email ou senha incorretos" (mensagem generica, nao revela qual campo)
- **Erro servidor** → catch generico → `toast.error("Erro ao fazer login")` / `toast.error("Erro ao criar conta")`
- **Redirect pos-auth com convite pendente** → checar cookie `inviteCode`, se presente redirecionar para `/pool/join?code=X` em vez de `/home`

### Estados visuais a implementar

- **Loading**: botao submit mostra texto "ENTRANDO..." / "CRIANDO..." com disabled, botao Google idem
- **Erro inline**: campo com borda `border-destructive` + glow `shadow-glow-destructive` + mensagem abaixo do campo
- **Erro generico**: mensagem acima do form ou toast
- **Sucesso**: redirect automatico (sem estado visual especial)

## Banco de Dados

### Tabelas envolvidas

| Model | Operacao | Descricao |
|---|---|---|
| `User` | CREATE (signup), READ (login) | Usuario do sistema |
| `Account` | CREATE (OAuth) | Contas OAuth vinculadas (gerenciado pelo PrismaAdapter) |
| `Session` | — | Nao usado (JWT strategy) |
| `VerificationToken` | — | Nao usado nesta issue (email verification futura) |

### Schema necessario

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  password      String?
  image         String?
  accounts      Account[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}
```

**Nota:** Model Session e VerificationToken omitidos porque usamos JWT strategy. Se necessarios no futuro, sao adicionados facilmente.

## Dependencias Externas

### Instalar

| Pacote | Versao | Motivo |
|---|---|---|
| `next-auth` | `@beta` (v5) | Auth.js — core da autenticacao |
| `@auth/prisma-adapter` | latest | Adapter para persistir users/accounts no Prisma |
| `@prisma/client` | latest | ORM client |
| `prisma` | latest (devDep) | CLI + gerador |
| `bcryptjs` | latest | Hash de senhas (zero native deps) |
| `@types/bcryptjs` | latest (devDep) | Types TS |

### Ja instaladas (reutilizar)

- `zod` — validacao de schemas
- `sonner` — toasts

## Arquivos — O Que Criar e Modificar

### Criar

| Arquivo | O que contem |
|---|---|
| `prisma/schema.prisma` | Schema com models User e Account (SQLite) |
| `src/lib/prisma.ts` | Singleton PrismaClient (pattern para Next.js dev) |
| `auth.ts` | Config Auth.js v5 — Google + Credentials providers, PrismaAdapter, JWT strategy, callbacks |
| `src/app/api/auth/[...nextauth]/route.ts` | Route handler — exporta `{ GET, POST }` dos handlers de `auth.ts` |
| `src/proxy.ts` | Protecao de rotas — redireciona para `/auth` se nao autenticado em rotas protegidas. Export `proxy()` (Next.js 16) |
| `src/actions/auth.ts` | Server Actions: `signupAction` (validacao Zod + create user + hash + signIn) e `loginAction` (validacao Zod + signIn credentials) |
| `src/types/auth.ts` | Types: `AuthFormState` (errors por campo + mensagem generica), schemas Zod (LoginSchema, SignupSchema) |
| `.env.example` | Template de env vars: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` |

### Modificar

| Arquivo | O que mudar |
|---|---|
| `src/components/features/auth/AuthForm.tsx` | Integrar com `useActionState` para chamar loginAction/signupAction, exibir erros inline por campo, estado loading no submit, chamar `signIn("google")` no botao Google, toast.error para erros de servidor |
| `src/app/auth/page.tsx` | Nenhuma mudanca estrutural necessaria (AuthForm ja e client component), mas pode adicionar redirect se usuario ja autenticado |
| `package.json` | Novas dependencias (via npm install) |

### NAO tocar

Tudo que nao esta listado acima. Especialmente:
- `src/components/ui/*` — componentes base ja prontos, usar via props/className
- `src/app/page.tsx` — landing page
- `src/app/layout.tsx` — root layout
- `src/app/globals.css` — tokens ja definidos
- `src/components/features/auth/GoogleIcon.tsx` — icone ja pronto
- `src/components/features/landing/*` — componentes da landing

## Decisoes desta Issue

### D01 — Auth.js v5 (beta) em vez de v4

**Contexto:** Auth.js v5 e beta mas e a linha ativamente desenvolvida. v4 so recebe security patches.
**Decisao:** Usar `next-auth@beta` (v5). E amplamente usado em producao, suporta Next.js 16, e tem melhor ergonomia (config unificada em `auth.ts`).
**Alternativas descartadas:** v4 — API mais antiga, nao otimizado para App Router, migracao eventual seria necessaria.

### D02 — bcryptjs em vez de argon2

**Contexto:** Argon2 e mais forte (OWASP recomenda), mas requer compilacao nativa. bcryptjs e pure JS.
**Decisao:** Usar `bcryptjs` com cost factor 12. Zero dependencias nativas, funciona em qualquer plataforma e CI sem problemas. Seguranca adequada para o escopo do projeto.
**Alternativas descartadas:** `argon2` — melhor seguranca mas requer build nativo, pode causar problemas em deploy/CI. `bcrypt` (nativo) — problemas de compatibilidade com Node versions.

### D03 — SQLite para dev, migracao futura para PostgreSQL

**Contexto:** Projeto em fase inicial, nao precisa de banco externo agora.
**Decisao:** SQLite via Prisma para dev local. Schema e migration-ready para PostgreSQL (so mudar provider + url).
**Alternativas descartadas:** PostgreSQL desde o inicio — overhead desnecessario para dev local, requer Docker ou servico externo.

### D04 — JWT strategy sem model Session

**Contexto:** Auth.js suporta JWT e database strategies.
**Decisao:** JWT strategy — mais simples, stateless, nao requer tabela Session. Dados do user ficam no token.
**Alternativas descartadas:** Database sessions — overhead de queries a cada request para verificar sessao, sem beneficio claro neste momento.

### D05 — proxy.ts (nao middleware.ts)

**Contexto:** Next.js 16 deprecou `middleware.ts` e renomeou para `proxy.ts` com export `proxy()`.
**Decisao:** Usar `src/proxy.ts` com export nomeado `proxy`. Matcher exclui rotas publicas (`/`, `/auth`, `/api/auth`, assets).
**Alternativas descartadas:** `middleware.ts` — deprecado no Next.js 16, gera warning.

### D06 — Server Actions para signup, signIn direto para login

**Contexto:** Login com credentials pode usar `signIn()` direto do Auth.js no client. Signup precisa de logica server-side (criar user, hash senha).
**Decisao:** Signup usa Server Action (`signupAction`) que cria o user e depois chama `signIn`. Login usa `signIn("credentials", ...)` via Server Action tambem para consistencia e para retornar erros formatados via `useActionState`.
**Alternativas descartadas:** Login client-side puro — funciona mas perde a ergonomia de `useActionState` para exibir erros inline.

### D07 — Validacao duplicada (client + server)

**Contexto:** Spec exige validacao client-side para todos os edge cases.
**Decisao:** Schemas Zod definidos em `src/types/auth.ts` e reutilizados tanto no AuthForm (validacao pre-submit) quanto nas Server Actions (validacao server-side). Mesma fonte de verdade.
**Alternativas descartadas:** Validacao so server-side — UX pior (round-trip para cada erro). Validacao so client-side — inseguro.

## Divergencias (atualizacoes durante /execute)

### DIV-01 — Prisma v7 requer driver adapter explicito

**Data:** 2026-04-05
**PLAN original:** PrismaClient instanciado sem argumentos (`new PrismaClient()`) como no pattern classico
**Realidade encontrada:** Prisma v7.6.0 removeu o engine embutido — `PrismaClientOptions` agora exige `adapter` ou `accelerateUrl`
**Mudanca feita:** Instalado `@prisma/adapter-better-sqlite3` + `better-sqlite3` + `@types/better-sqlite3`. PrismaClient instanciado com `new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) })`
**Aprovado pelo usuario:** sim (correcao necessaria para build funcionar)

### DIV-02 — auth.ts movido para src/lib/auth.ts

**Data:** 2026-04-05
**PLAN original:** Config Auth.js em `auth.ts` na raiz do projeto (pattern docs Auth.js)
**Realidade encontrada:** Import de `auth.ts` da raiz com alias `@/` nao funciona. `@/` resolve para `./src/`
**Mudanca feita:** Movido para `src/lib/auth.ts` — todos os imports usam `@/lib/auth` consistentemente
**Aprovado pelo usuario:** sim (melhora consistencia de imports)

### DIV-03 — Prisma client gerado em path customizado

**Data:** 2026-04-05
**PLAN original:** Import de `@prisma/client`
**Realidade encontrada:** Prisma v7 com `prisma-client` generator gera em `src/generated/prisma/`. Import correto e `@/generated/prisma/client`
**Mudanca feita:** Import ajustado para `import { PrismaClient } from "@/generated/prisma/client"`
**Aprovado pelo usuario:** sim

### DIV-04 — Redirect convite pendente deferido

**Data:** 2026-04-05
**PLAN original:** Checar cookie `inviteCode` apos auth, redirecionar para `/pool/join?code=X` se presente
**Realidade encontrada:** Feature depende de infraestrutura de convites que ainda nao existe (issue-05+). Implementar agora seria dead code
**Mudanca feita:** Deferido para issue futura que implementar o fluxo de convites. Redirect padrao sempre vai para `/home`
**Aprovado pelo usuario:** sim
