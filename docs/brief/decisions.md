# Decisoes — KRVOU

## D01 — Stack: Next.js + Prisma + PostgreSQL
**Contexto:** Projeto solo, IA-assisted, precisa de deploy rapido e barato. Mobile-first webapp.
**Decisao:** Next.js App Router + TypeScript + Prisma + PostgreSQL na Vercel.
**Justificativa:** Vercel e o host escolhido, Next.js e a melhor integracao. App Router com Server Actions elimina necessidade de API separada. Prisma simplifica o acesso ao banco. PostgreSQL e robusto e tem opcoes gratuitas/baratas (Vercel Postgres, Supabase).
**Alternativas descartadas:** SvelteKit (menos ecossistema), Remix (menos maduro na Vercel), backend separado (complexidade desnecessaria para MVP).

## D02 — Auth: NextAuth.js com Google + Credentials
**Contexto:** Precisa de Google login (conveniencia) e email/senha (universalidade). Sem custo.
**Decisao:** NextAuth.js v5 (Auth.js) com providers Google e Credentials.
**Justificativa:** Gratuito, bem integrado com Next.js, suporta ambos os metodos de auth.
**Alternativas descartadas:** Clerk (pago), Supabase Auth (vendor lock-in), Lucia (mais manual).

## D03 — IA: Claude API para wizard de criacao
**Contexto:** O diferencial do produto e a criacao conversacional com IA que entende o evento e sugere estrutura.
**Decisao:** Usar Claude API (Anthropic SDK) com chamadas server-side no wizard.
**Justificativa:** Claude tem capacidade forte de seguir instrucoes estruturadas, ideal para extrair parametros de linguagem natural e gerar sugestoes de regras.
**Consideracao de custo:** Cada criacao de bolao consome tokens. Mitigar com: (1) prompts otimizados, (2) templates pre-montados para eventos comuns, (3) limitar re-geracoes.
**Alternativas descartadas:** OpenAI (preferencia do dev por Claude), wizard sem IA (perde o diferencial), IA local (complexo demais).

## D04 — UI: shadcn/ui customizado com estetica pixel art
**Contexto:** Identidade visual pixel art retro mas interface clean e usavel.
**Decisao:** Usar shadcn/ui como base de componentes, customizar com tema pixel art (pixel fonts para headings, bordas retro, cores arcade).
**Justificativa:** shadcn/ui da uma base solida e acessivel. Customizar por cima e mais rapido que criar do zero. A estetica pixel art vem via tokens de design (fontes, bordas, cores), nao via reconstrucao de componentes.
**Alternativas descartadas:** Construir UI do zero (lento), usar lib pixel art pronta (nao existe uma boa), NES.css (muito datado e limitado).

## D05 — Resultados: Input manual no MVP
**Contexto:** Usuario queria agente IA que busca resultados automaticamente, mas isso adiciona complexidade significativa (APIs esportivas, sistema de aprovacao, custo).
**Decisao:** MVP com input 100% manual pelo admin do bolao. Agente de busca de resultados fica para v2.
**Justificativa:** Reduz escopo drasticamente. A maioria dos boloes tem poucos resultados para inserir (ex: 64 jogos numa Copa). Input manual e aceitavel.
**Futuro (v2):** Agente que busca resultados via API, preenche e admin aprova.

## D06 — Mobile-first, sem app nativo
**Contexto:** Boloes sao acessados majoritariamente pelo celular.
**Decisao:** Webapp responsivo mobile-first. Sem app nativo, sem PWA no MVP.
**Justificativa:** Reduz complexidade. Link de convite funciona melhor em webapp (abre no browser direto). PWA pode ser adicionado depois sem refatoracao significativa.

## D07 — Sem monetizacao no MVP
**Contexto:** Boloes sao por diversao, sem transacao financeira.
**Decisao:** Sem qualquer sistema de pagamento, planos ou premium.
**Justificativa:** Simplifica MVP. Modelo de negocio pode ser definido apos validacao do produto.

## D08 — Sem tempo real
**Contexto:** Atualizacao ao vivo durante jogos nao e prioridade.
**Decisao:** Experiencia assincrona — participantes checam resultados quando querem.
**Justificativa:** Tempo real (WebSockets, SSE) adiciona complexidade de infra significativa. O valor do bolao esta nos palpites e na competicao, nao no live score.

## D09 — Wizard em steps (nao chat)
**Contexto:** A jornada de criacao com IA poderia ser um chat literal ou um wizard guiado.
**Decisao:** Wizard em steps onde a IA processa cada etapa (nao uma interface de chat).
**Justificativa:** Wizard e mais previsivel, mais facil de implementar, e garante que todas as informacoes necessarias sejam coletadas. Chat livre tem risco de conversas que fogem do escopo.

## D10 — Convite por link com conta obrigatoria
**Contexto:** Participantes precisam de conta para palpitar, mas o convite e por link simples.
**Decisao:** Link publico mostra info do bolao. Para entrar e palpitar, precisa criar conta.
**Justificativa:** Conta e necessaria para rastrear palpites e pontuacao. Link sem codigo simplifica o compartilhamento (WhatsApp, etc). Signup no momento do convite e friction aceitavel.
