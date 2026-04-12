# Acoes Pendentes — KRVOU

> Integracao com servicos externos e configuracoes que precisam ser feitas antes de testar/deployar determinadas features.
> Atualizado em: 2026-04-05

---

## P01 — Google OAuth (issue-03)

**Status:** Pendente
**Bloqueio:** Login com Google nao funciona sem as credenciais
**Necessita de:** issue-03 (Subtask F)

**O que fazer:**
1. Criar projeto no [Google Cloud Console](https://console.cloud.google.com/)
2. Ativar API "Google Identity" (OAuth 2.0)
3. Configurar tela de consentimento OAuth (External)
4. Criar credenciais OAuth 2.0 (Web Application)
   - Authorized redirect URI: `http://localhost:3000/api/auth/callback/google` (dev)
   - Authorized redirect URI: `https://krvou.vercel.app/api/auth/callback/google` (prod)
5. Copiar Client ID e Client Secret para `.env.local`:
   ```
   AUTH_GOOGLE_ID="..."
   AUTH_GOOGLE_SECRET="..."
   ```

**Impacto se nao feito:** Login por email/senha continua funcionando normalmente. So o botao "Continuar com Google" nao funciona.

---

## P02 — Anthropic API Key (issue-05)

**Status:** Pendente
**Bloqueio:** Wizard IA nao funciona sem a chave
**Necessita de:** issue-05 (Subtask F)

**O que fazer:**
1. Acessar [Anthropic Console](https://console.anthropic.com/)
2. Criar API Key
3. Adicionar ao `.env.local`:
   ```
   ANTHROPIC_API_KEY="sk-ant-..."
   ```

**Codigo ja preparado:** `src/lib/ai.ts` — usa `@anthropic-ai/sdk` com modelo `claude-sonnet-4-6`
**Impacto se nao feito:** Wizard nao gera categorias/regras via IA. Funcionalidade core do issue-05-F bloqueada.

---

## P03 — AUTH_SECRET (issue-03)

**Status:** Pendente
**Bloqueio:** Auth.js nao funciona sem o secret
**Necessita de:** issue-03 (Subtask F)

**O que fazer:**
1. Gerar secret:
   ```bash
   npx auth secret
   ```
2. Ou gerar manualmente e adicionar ao `.env.local`:
   ```
   AUTH_SECRET="..."
   ```

**Impacto se nao feito:** Nenhuma autenticacao funciona (JWT nao assina).

---

## P04 — PostgreSQL (deploy)

**Status:** Pendente (nao urgente)
**Bloqueio:** Deploy de producao
**Necessita de:** pre-deploy

**O que fazer:**
1. Criar banco PostgreSQL (Supabase, Neon, ou outro)
2. Atualizar `DATABASE_URL` no `.env` de producao
3. Atualizar Prisma schema para usar adapter PostgreSQL em vez de SQLite
4. Rodar `npx prisma migrate deploy` no ambiente de producao

**Impacto se nao feito:** Dev local funciona com SQLite. So bloqueia deploy em producao.

---

## P05 — Vercel Deploy (pos-MVP)

**Status:** Futuro
**Bloqueio:** App nao acessivel publicamente
**Necessita de:** todas as pendencias acima resolvidas

**O que fazer:**
1. Conectar repo ao Vercel
2. Configurar env vars (AUTH_SECRET, AUTH_GOOGLE_*, ANTHROPIC_API_KEY, DATABASE_URL)
3. Configurar dominio (se aplicavel)

---

## Resumo Rapido

| # | Pendencia | Bloqueia | Urgencia |
|---|-----------|----------|----------|
| P01 | Google OAuth credentials | Login Google | Media (login email funciona) |
| P02 | Anthropic API Key | Wizard IA | Baixa (so na issue-05) |
| P03 | AUTH_SECRET | Toda auth | Alta (precisa pra testar auth) |
| P04 | PostgreSQL prod | Deploy | Baixa (SQLite funciona em dev) |
| P05 | Vercel deploy | Acesso publico | Baixa (pos-MVP) |
