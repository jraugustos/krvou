# Issues — KRVOU

> Baseado em: docs/SPEC.md (v2 — wizard redesenhado, sem IA)
> Total: 12 issues | Concluidas: 1/12 | Em progresso: 2/12
> Pendencias externas: ver [docs/PENDING.md](PENDING.md)

---

## Fundacao Visual

### issue-01 — Design System + Componentes Globais ✅

**Status:** Concluida
**Componentes:** C36, C37, C38, C39
**Ref:** Secao Design System da spec

---

#### Subtask V: Tokens, estilos globais e componentes shared

**Tipo:** visual
**Descricao:** Configurar design tokens no Tailwind (cores, tipografia, espacamento), estilos globais (scanline overlay, fontes Space Grotesk + Inter), e componentes reutilizaveis globais com dados mockados.

**Secoes:**
- Tailwind config com paleta completa (surface hierarchy, primary/secondary, on_surface variants)
- Fontes: Space Grotesk (headlines) + Inter (body) via next/font
- Scanline overlay CSS global (linhas horizontais pretas 5% opacidade)
- Toast (C36): sucesso (borda verde), erro (borda vermelha), info (borda cyan). Auto-dismiss 4s
- ConfirmModal (C37): titulo, descricao, botoes Cancelar/Confirmar. Overlay escuro
- LoadingState (C38): spinner pixel art em primary
- ErrorState (C39): icone erro, mensagem, botao "Tentar novamente"
- Botoes arcade: primary (4px offset, 0px radius), secondary, tertiary (scanline underline)
- Input fields: background inset, focus glow neon green

**Design tokens:** todas as cores, superficies e regras da secao Design System da spec
**Responsividade:** mobile-first

**Criterio de aceitacao:**
- [x] Tailwind config tem todas as cores do design system
- [x] Fontes Space Grotesk e Inter carregam corretamente
- [x] Scanline overlay visivel em todas as paginas
- [x] Toast renderiza nos 3 tipos (sucesso, erro, info)
- [x] ConfirmModal abre/fecha com overlay
- [x] LoadingState e ErrorState renderizam
- [x] Botoes arcade com 4px offset e press animation
- [x] Inputs com focus glow neon green
- [x] Border-radius 0px em tudo

---

**Paralelo:** sim (independente)

---

### issue-02 — Landing Page (P01) 🔧

**Status:** Em progresso (Subtask V)
**Pagina:** P01
**Componentes:** C01, C02, C03, C04, C05
**Comportamentos:** B01, B02

---

#### Subtask V: Interface da landing page

**Tipo:** visual
**Descricao:** Criar a pagina de landing completa com estetica arcade. Dados mockados, links de navegacao funcionais.

**Secoes:**
- TopBar (C01): logo KRVOU pixel font, links desktop, hamburger mobile, icone notificacoes. Background surface, borda inferior 4px
- HeroSection (C02): titulo "KRVOU!" pixel font (5xl mobile, 8xl desktop), tagline Space Grotesk uppercase, CTA "COMECAR AGORA" arcade (borda 8px), avatars pixel + contador "+1.2k". Background pixel grid (radial-gradient dots verdes) + blur roxo
- PowerUpsGrid (C03): grid bento 4 cards — WizardIA (8col, badge "AI ENHANCED"), Ranking (4col, mini barra progresso, box-shadow verde), Convite (4col, hover secondary), Versus (8col, decorativo, dot grid)
- CTASection (C04): titulo "PRONTO PARA SER O LIDER?" pixel font, CTA "CRIAR MEU BOLAO" (branco, hover primary). Background carbon fibre
- Footer (C05): logo com neon glow, texto pixel, icones sociais com hover

**Responsividade:** mobile-first, breakpoints sm, md, lg
**Design tokens:** usar tokens da issue-01

**Criterio de aceitacao:**
- [x] Pagina renderiza sem erros na rota `/`
- [ ] Layout correto em mobile, tablet e desktop
- [x] Todos os 5 componentes visuais presentes
- [x] Grid bento responsivo (empilha em mobile)
- [x] CTAs navegam para `/auth` (B01, B02)
- [x] Estetica arcade: pixel grid, CRT overlay, neon glow, 0px radius
- [x] Dados mockados (contador usuarios, avatars)

---

**Depende de:** issue-01 (tokens e estilos globais)
**Paralelo com:** issue-03 (ambas dependem de issue-01, nao entre si)

---

## Fundacao

### issue-03 — Auth / Login & Signup (P02) 🔧

**Status:** Em progresso (Subtask V + F)
**Pagina:** P02
**Componentes:** C07
**Comportamentos:** B04, B05, B06, B07

---

#### Subtask V: Interface de autenticacao

**Tipo:** visual
**Descricao:** Criar tela de auth unificada com toggle login/signup. Dados mockados, sem integracao real.

**Secoes:**
- AuthForm (C07): logo KRVOU topo, botao "Continuar com Google" (branco, icone SVG), divider "ou", form email/senha, campo nome (so signup), botao submit arcade, link toggle login↔signup
- Estados visuais: loading no botao, highlight campos invalidos, mensagens de erro inline

**Responsividade:** mobile-first, centralizado
**Design tokens:** input inset, focus glow, botao arcade

**Criterio de aceitacao (V):**
- [x] Pagina renderiza na rota `/auth`
- [x] Toggle login/signup funciona visualmente (B07)
- [x] Campos limpos ao trocar modo
- [ ] Layout correto mobile e desktop
- [x] Botao Google com icone SVG
- [x] Campos com estilo input arcade (inset, focus glow)

---

#### Subtask F: Autenticacao com NextAuth

**Tipo:** funcional
**Depende de:** Subtask V desta issue
**Descricao:** Implementar auth completa com NextAuth.js (Google OAuth + Credentials), modelo User no Prisma, e fluxo de redirect.

**Caminho feliz (Google — B04):**
1. Usuario clica "Continuar com Google"
2. Fluxo OAuth NextAuth
3. Cria/atualiza User no banco
4. Redireciona para `/home` (ou link de convite pendente)

**Caminho feliz (Email login — B05):**
1. Usuario preenche email + senha
2. Credentials provider valida
3. Sessao criada, redireciona para `/home`

**Caminho feliz (Signup — B06):**
1. Usuario preenche nome + email + senha
2. Cria User no banco (senha com hash)
3. Login automatico, redireciona para `/home`

**Edge cases:**
- Email formato invalido → highlight campo
- Senha vazia → highlight campo
- Signup: nome < 2 chars → "Nome obrigatorio (min 2 caracteres)"
- Signup: senha < 8 chars → "Senha deve ter no minimo 8 caracteres"
- Signup: email duplicado → "Ja existe uma conta com esse email"
- Login: credenciais erradas → "Email ou senha incorretos" (mensagem generica)
- Erro servidor → Toast "Erro ao fazer login" / "Erro ao criar conta"

**Dados:**
- Tabela: `User` (id, name, email, password, image, createdAt, updatedAt)
- Provider: Google (OAuth) + Credentials (email/senha)
- Session: JWT strategy

**Criterio de aceitacao (F):**
- [ ] Login Google funciona end-to-end ⚠️ (pendencia P01 — ver PENDING.md)
- [x] Login email/senha funciona
- [x] Signup cria usuario com senha hashed
- [x] Validacoes client-side para todos os edge cases
- [x] Mensagens de erro corretas e genericas (nao revelam qual campo errou no login)
- [x] Redirect para `/home` apos auth
- [ ] Redirect para convite pendente se veio de link (cookie/session com inviteCode) — adiado para issue-07
- [x] Sessao persiste entre refreshes
- [x] Middleware protege rotas autenticadas

---

**Depende de:** issue-01 (tokens)
**Paralelo com:** issue-02 (ambas dependem de issue-01, nao entre si)

---

### issue-04 — Home / Dashboard (P03)

**Pagina:** P03
**Componentes:** C06, C08, C09
**Comportamentos:** B03, B08, B09, B10

---

#### Subtask V: Interface do dashboard

**Tipo:** visual
**Descricao:** Criar dashboard principal com lista de boloes, bottom nav e empty state. Dados mockados.

**Secoes:**
- Top bar: logo KRVOU + avatar usuario
- CTA "CRIAR BOLAO" em destaque (botao arcade)
- PoolCard (C08): titulo, contador participantes, badge status (Aberto=verde, Em andamento=amarelo, Encerrado=rosa), info contextual por status. Encerrado com opacity reduzida. Clicavel
- EmptyState (C09): mensagem + botoes "Criar Bolao" e "Tenho um convite"
- BottomNavBar (C06): 4 itens (Home, Criar, Meus Palpites, Ranking). Item ativo com bg primary. Icones Material Symbols. Borda superior 4px. Mobile only. Sem border-radius

**Responsividade:** mobile-first
**Design tokens:** surface hierarchy para cards, badges coloridos

**Criterio de aceitacao (V):**
- [ ] Pagina renderiza na rota `/home`
- [ ] PoolCards exibem com dados mockados (3+ cards com status variados)
- [ ] Badges de status com cores corretas
- [ ] Info contextual muda por status (pendentes / posicao / resultado)
- [ ] EmptyState renderiza quando lista vazia
- [ ] BottomNavBar fixa no mobile com 4 itens
- [ ] Top bar com logo e avatar

---

#### Subtask F: Listagem de boloes e navegacao

**Tipo:** funcional
**Depende de:** Subtask V desta issue
**Descricao:** Conectar dashboard a dados reais — listar boloes do usuario, navegacao contextual por role/status.

**Caminho feliz (B09):**
1. Usuario logado acessa `/home`
2. Fetch boloes onde e membro (PoolMember)
3. Cards exibem com dados reais
4. Clica em card → navega para `/pool/[poolId]/admin` (se admin) ou `/pool/[poolId]` (se participante)
5. Se encerrado → layout P10

**Edge cases:**
- Sem boloes (B10) → EmptyState com CTAs
- "Criar Bolao" (B08) → navega para `/pool/new?step=1`
- "Tenho um convite" → input para colar link/codigo
- BottomNav (B03): se nao logado, redireciona para auth

**Dados:**
- Query: PoolMember WHERE userId = current, JOIN Pool, ORDER BY updatedAt DESC
- Calcular info contextual: categorias pendentes (Aberto), posicao+pts (Em andamento), resultado final (Encerrado)

**Criterio de aceitacao (F):**
- [ ] Lista boloes reais do usuario logado
- [ ] Navegacao contextual por role (admin vs participante)
- [ ] Info contextual calculada corretamente por status
- [ ] Empty state funcional com CTAs
- [ ] BottomNav navega corretamente
- [ ] Rota protegida (redireciona para auth se nao logado)

---

**Depende de:** issue-03 (auth — precisa de userId e sessao)
**Paralelo:** nao (sequencial apos issue-03)

---

## Features Core

### issue-05 — Wizard de Criacao (P04)

**Pagina:** P04 (P04a, P04b, P04c)
**Componentes:** C10, C11, C12, C13, C14, C15, C16
**Comportamentos:** B11, B12, B13, B14, B15, B16

---

#### Subtask V: Interface do wizard (3 steps)

**Tipo:** visual
**Descricao:** Criar as 3 telas do wizard com todos os componentes. Dados mockados — produtos e categorias hardcoded no componente.

**Secoes:**
- WizardProgressBar (C10): 3 steps, gradient primary→cyan, "STEP X/3" pixel font
- WizardHeader (C11): step number verde + titulo bold
- **Step 1 — Selecionar Produto:**
  - ProductCards (C12): grid de cards de produto. Copa do Mundo 2026 (selecionavel, card com imagem/icone + nome + descricao curta). Brasileirao e Champions League com badge "Em breve" e opacity reduzida (nao clicaveis). Estado selecionado: borda primary + check overlay
- **Step 2 — Configurar Bolao:**
  - PoolNameInput (C13): input para nome do bolao (label + placeholder + contador X/60 chars)
  - CategoryCheckCards (C14): lista com as 5 categorias mockadas da Copa do Mundo 2026 (Resultados dos jogos, Vencedor da copa, Artilheiro, Primeiro/segundo/terceiro lugar, Jogador revelacao). Toggle on/off visual. Badge de tipo em cada card
  - CustomCategoryInput (C15): botao "+ Adicionar categoria" expande para input inline. Confirmar adiciona card na lista com badge "Personalizada". Cancelar fecha sem adicionar
- **Step 3 — Revisao:**
  - ReviewCards (C16): produto selecionado, nome do bolao, categorias ativas (X pre-definidas + Y personalizadas). Link "Editar" volta ao step correspondente
  - CTA "CRIAR BOLAO" (desabilitado por ora — so visual nesta subtask)
- Navegacao: botoes "Voltar" e "Proximo" entre steps (B16). Voltar no step 1 vai para Home

**Responsividade:** mobile-first
**Design tokens:** ProductCard com estado selecionado, CategoryCheckCard com badge, botao arcade

**Mock data:**
```
Produtos: [
  { id: "copa-2026", name: "Copa do Mundo 2026", description: "FIFA World Cup", available: true },
  { id: "brasileirao", name: "Brasileirao Serie A", description: "Campeonato Brasileiro", available: false },
  { id: "champions", name: "Champions League", description: "UEFA Champions League", available: false },
]
Categorias Copa 2026: [
  { id: "1", name: "Resultados dos jogos", description: "Placar exato de cada partida", type: "exact_score" },
  { id: "2", name: "Vencedor da copa", description: "Selecao campea", type: "single_choice" },
  { id: "3", name: "Artilheiro", description: "Jogador com mais gols", type: "free_text" },
  { id: "4", name: "Primeiro, segundo e terceiro lugar", description: "Podio de selecoes", type: "single_choice" },
  { id: "5", name: "Jogador revelacao", description: "Nome do jogador", type: "free_text" },
]
```

**Criterio de aceitacao (V):**
- [ ] 3 steps renderizam nas rotas `/pool/new?step=1` ate `?step=3`
- [ ] Progress bar atualiza por step
- [ ] Step 1: ProductCards com selecionavel e "Em breve" nao clicaveis
- [ ] Estado selecionado do produto visivel (borda primary + check)
- [ ] Step 2: input nome + CategoryCheckCards com toggle on/off visual
- [ ] Categoria personalizada: botao expande input, confirmar adiciona na lista
- [ ] Step 3: ReviewCards com dados mockados e links "Editar"
- [ ] Navegacao entre steps (Voltar/Proximo) funciona
- [ ] Estado mantido entre steps (client-side)

---

#### Subtask F: Schema, seed e persistencia

**Tipo:** funcional
**Depende de:** Subtask V desta issue
**Descricao:** Criar schema Prisma para Product/ProductCategory/PoolCategory, seed com dados da Copa do Mundo 2026, Server Action de criacao do bolao.

**Schema novo (adicionar ao prisma/schema.prisma):**
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
  id            String         @id @default(cuid())
  productId     String
  product       Product        @relation(fields: [productId], references: [id], onDelete: Cascade)
  name          String
  description   String?
  type          String         // "exact_score" | "single_choice" | "free_text"
  resultSource  String         @default("manual") // "api" | "manual" (D13)
  sortOrder     Int            @default(0)
  poolCategories PoolCategory[]

  @@index([productId])
}

model PoolCategory {
  id                  String           @id @default(cuid())
  poolId              String
  pool                Pool             @relation(fields: [poolId], references: [id], onDelete: Cascade)
  productCategoryId   String?          // null se categoria personalizada
  productCategory     ProductCategory? @relation(fields: [productCategoryId], references: [id])
  isCustom            Boolean          @default(false)
  customName          String?          // preenchido se isCustom = true
  customResultText    String?          // preenchido pelo admin ao final da competicao
  isActive            Boolean          @default(true)
  createdAt           DateTime         @default(now())

  @@index([poolId])
  @@index([productCategoryId])
}
```

**Modificar model Pool:**
- Adicionar: `productId String`, `product Product @relation(...)`, `categories PoolCategory[]`
- Remover: `eventType String?` (substituido por productId)

**Seed (prisma/seed.ts):**
- Criar Product "Copa do Mundo 2026" (slug: "copa-2026", isActive: true)
- Criar as 5 ProductCategories com sortOrder 1-5
- Pontuacao (ScoringRules) sera definida em issue posterior (D10)

**Caminho feliz (B11 → B15):**
1. Step 1: usuario seleciona Copa do Mundo 2026 (B11)
2. Step 2: preenche nome + toggle categorias (B12, B13) + opcional: adiciona personalizadas (B14)
3. Step 3: revisao → clica "CRIAR BOLAO" (B15)
4. Server Action `createPoolAction`:
   - Valida sessao (redirect /auth se expirado)
   - Cria Pool (name, productId, status:"open", inviteCode 8 chars)
   - Cria PoolCategory para cada categoria pre-definida ativa (productCategoryId, isCustom:false)
   - Cria PoolCategory para cada categoria personalizada (isCustom:true, customName)
   - Cria PoolMember (role:"admin")
5. Redireciona para `/pool/[poolId]/created`

**Edge cases:**
- Produto nao selecionado → botao "Proximo" desabilitado (B11)
- Nome vazio ou > 60 chars → botao "Proximo" step 2 desabilitado (B12)
- 0 categorias ativas → botao "Proximo" desabilitado (B13)
- Categoria personalizada sem nome → botao "Adicionar" desabilitado (B14)
- Erro criacao → Toast "Erro ao criar bolao" + nao redireciona (B15)
- Nome duplicado → permitido (boloes com mesmo nome sao diferenciados por ID)

**Dados:**
- Tabelas criadas: Pool, PoolCategory (por categoria ativa), PoolMember (admin)
- Leitura: Product + ProductCategory via seed (ja existem no banco)
- State: React state client-side ate step 3 (D03)
- Sem Claude API (D13 — sem IA no wizard)

**Criterio de aceitacao (F):**
- [ ] Seed cria Product "Copa do Mundo 2026" com 5 categorias
- [ ] Step 1 busca produtos do banco (isActive:true)
- [ ] Step 2 exibe categorias do produto selecionado do banco
- [ ] Criacao salva Pool + PoolCategories + PoolMember no banco
- [ ] inviteCode unico gerado (8 chars, D07)
- [ ] Redirect para `/pool/[poolId]/created` apos sucesso
- [ ] Categorias personalizadas salvas com isCustom:true + customName
- [ ] Estado nao persiste no banco ate confirmacao (D03)
- [ ] Sessao expirada redireciona para /auth

---

**Depende de:** issue-03 (auth), issue-04 (home para redirect)
**Paralelo:** nao (sequencial)

---

### issue-06 — Bolao Criado + Sucesso (P05)

**Pagina:** P05
**Componentes:** C17
**Comportamentos:** B19, B20

---

#### Subtask V: Tela de sucesso e convite

**Tipo:** visual
**Descricao:** Tela celebratoria pos-criacao com link de convite.

**Secoes:**
- SuccessScreen (C17): "BOLAO CRIADO!" pixel font verde com glow, nome do bolao, card com link monospace + botao "Copiar link", botao outline "Ir para o painel do bolao"

**Criterio de aceitacao (V):**
- [ ] Pagina renderiza na rota `/pool/[poolId]/created`
- [ ] Texto celebratorio com glow neon green
- [ ] Link de convite em fonte monospace
- [ ] Botao "Copiar link" presente
- [ ] Botao "Ir para o painel" presente
- [ ] Dados mockados

---

#### Subtask F: Copiar link e navegacao

**Tipo:** funcional
**Depende de:** Subtask V desta issue
**Descricao:** Funcionalidade de copiar link para clipboard e navegacao.

**Caminho feliz (B19):**
1. Pagina carrega com dados reais do bolao recem-criado
2. Usuario clica "Copiar link" → Clipboard API copia URL
3. Toast "Link copiado!" + texto muda para "Copiado!" por 2s

**Edge cases:**
- Clipboard API indisponivel → seleciona texto do input (fallback)

**Navegacao (B20):**
- "Ir para o painel" → navega para `/pool/[poolId]/admin`

**Criterio de aceitacao (F):**
- [ ] Link de convite exibe URL real com inviteCode
- [ ] Copiar funciona via Clipboard API
- [ ] Fallback funciona sem Clipboard API
- [ ] Toast de confirmacao aparece
- [ ] Navegacao para painel admin funciona

---

**Depende de:** issue-05 (wizard cria o bolao)
**Paralelo:** nao (sequencial)

---

### issue-07 — Pagina de Convite (P06)

**Pagina:** P06
**Componentes:** C18
**Comportamentos:** B21

---

#### Subtask V: Interface do convite publico

**Tipo:** visual
**Descricao:** Pagina publica que apresenta o bolao para convidados.

**Secoes:**
- InviteCard (C18): "Voce foi convidado para" + nome bolao (bold grande), criador + contador participantes, card interno com categorias (bullets dourados), botao "ENTRAR NO BOLAO" arcade, nota rodape conta obrigatoria

**Criterio de aceitacao (V):**
- [ ] Pagina renderiza na rota `/join/[inviteCode]`
- [ ] Acessivel sem login
- [ ] Card com dados mockados do bolao
- [ ] Categorias listadas com bullets dourados
- [ ] CTA arcade presente
- [ ] Nota sobre conta obrigatoria

---

#### Subtask F: Fluxo de entrada no bolao

**Tipo:** funcional
**Depende de:** Subtask V desta issue
**Descricao:** Logica de entrar no bolao via convite, com fluxo de auth intermediario.

**Caminho feliz — logado (B21):**
1. Usuario logado acessa `/join/[inviteCode]`
2. Pagina exibe dados reais do bolao (fetch por inviteCode)
3. Clica "ENTRAR NO BOLAO"
4. Server Action cria PoolMember (role: participant)
5. Redireciona para `/pool/[poolId]` (painel participante)

**Caminho feliz — nao logado (B21):**
1. Usuario acessa `/join/[inviteCode]`
2. Ve pagina publica com dados do bolao
3. Clica "ENTRAR NO BOLAO"
4. Salva inviteCode em cookie
5. Redireciona para `/auth`
6. Apos auth, processa convite automaticamente → cria PoolMember → redireciona para painel

**Edge cases:**
- Ja e membro → Toast "Voce ja participa desse bolao" + redireciona para painel
- Bolao fechado (status closed) → botao desabilitado + "Este bolao nao aceita mais participantes"
- inviteCode invalido → pagina 404 ou mensagem de erro

**Dados:**
- Query: Pool WHERE inviteCode = param, include categorias e contador membros
- Create: PoolMember (poolId, userId, role: participant)

**Criterio de aceitacao (F):**
- [ ] Fetch bolao por inviteCode funciona
- [ ] Entrada cria PoolMember corretamente
- [ ] Fluxo nao-logado salva inviteCode e redireciona pos-auth
- [ ] Ja-membro detectado e tratado
- [ ] Bolao fechado desabilita entrada
- [ ] inviteCode invalido tratado

---

**Depende de:** issue-03 (auth), issue-05 (bolao precisa existir)
**Paralelo com:** issue-06 (ambas dependem de issue-05, nao entre si)

---

### issue-08 — Painel do Bolao / Participante (P07)

**Pagina:** P07
**Componentes:** C19, C20, C21, C22, C23
**Comportamentos:** B22, B23, B24, B25

---

#### Subtask V: Interface do painel com tabs

**Tipo:** visual
**Descricao:** Central do participante com 3 tabs (Ranking, Palpites, Resultados). Dados mockados.

**Secoes:**
- TabBar (C19): Ranking, Palpites, Resultados. Tab ativa com bg elevated + cor primary
- **Tab Ranking:**
  - UserPositionCard (C20): posicao (pixel font dourado), pontuacao (pixel font verde), diferenca para lider (dim). Borda accent, bg gradient
  - RankingList (C21): lista com posicao (dourado), nome, pontuacao (verde). Linha do usuario com bg highlight verde
- **Tab Palpites:**
  - BetCategoryCards (C22): borda esquerda 3px (verde=feito, rosa=pendente), nome, palpite ou "Nenhum palpite", badge status
  - Progress bar: X de Y categorias preenchidas
- **Tab Resultados:**
  - ResultComparisonCards (C23): resultado real vs palpite, pontuacao recebida (verde=acertou, rosa=errou)
- BottomNavBar com "Meus Palpites" ativo

**Criterio de aceitacao (V):**
- [ ] Pagina renderiza na rota `/pool/[poolId]`
- [ ] 3 tabs funcionam (troca de conteudo visual)
- [ ] Tab Ranking: card posicao + lista ranking mockada
- [ ] Tab Palpites: cards com borda colorida por status + progress bar
- [ ] Tab Resultados: cards comparacao com cores de acerto/erro
- [ ] Default: tab Ranking ao abrir

---

#### Subtask F: Dados reais do painel

**Tipo:** funcional
**Depende de:** Subtask V desta issue
**Descricao:** Conectar tabs a dados reais — ranking calculado, palpites do usuario, resultados com comparacao.

**Tab Ranking (B22, B23):**
- Fetch PoolMembers ordenados por totalScore DESC
- Rank calculado (empates = mesma posicao)
- Destaque linha do usuario logado

**Tab Palpites (B24):**
- Fetch BetCategories do pool + Bets do usuario
- Status: feito (tem Bet) ou pendente (sem Bet)
- Tap em categoria → navega para P08
- Se isLocked ou deadline passou → Toast "Palpites encerrados" + nao navega

**Tab Resultados (B25):**
- Fetch Results + Bets do usuario
- Calcula acertos e pontuacao por categoria
- Sem resultados → empty state

**Criterio de aceitacao (F):**
- [ ] Ranking carrega com dados reais ordenados
- [ ] Empates tratados (mesma posicao)
- [ ] Usuario logado destacado no ranking
- [ ] Palpites mostram status real (feito/pendente)
- [ ] Navegacao para P08 funciona
- [ ] Categorias trancadas/expiradas bloqueiam navegacao
- [ ] Resultados comparam com palpites do usuario
- [ ] Empty states funcionais

---

**Depende de:** issue-04 (home/dashboard), issue-05 (bolao precisa existir)
**Paralelo com:** issue-09 (registrar palpite pode ser paralelo se UI nao conflita)

---

### issue-09 — Registrar Palpite (P08)

**Pagina:** P08 (P08a, P08b, P08c)
**Componentes:** C24, C25, C26
**Comportamentos:** B26, B27, B28, B29

---

#### Subtask V: Interface dos 3 tipos de palpite

**Tipo:** visual
**Descricao:** Telas de palpite para os 3 tipos: escolha unica, placar exato, texto livre. Dados mockados.

**Secoes:**
- **Escolha Unica (P08a):** descricao categoria topo, ChoiceSelector (C24) — cards selecionaveis radio-style, borda primary quando selecionado. Botao salvar
- **Placar Exato (P08b):** lista de jogos agrupados por rodada. ScoreInput (C25) — flag/nome time A, 2 inputs numericos pixel font, separador "x", flag/nome time B. Card preenchido com borda verde. Botao salvar
- **Texto Livre (P08c):** FreeTextInput (C26) — campo texto estilo arcade. Botao salvar

**Criterio de aceitacao (V):**
- [ ] Pagina renderiza na rota `/pool/[poolId]/bet/[categoryId]`
- [ ] Escolha unica: cards radio com selecao visual
- [ ] Placar exato: inputs de placar com layout time A x time B
- [ ] Texto livre: campo com estilo arcade
- [ ] Botao salvar presente em todos
- [ ] Dados mockados (opcoes, jogos, categorias)

---

#### Subtask F: Salvar e editar palpites

**Tipo:** funcional
**Depende de:** Subtask V desta issue
**Descricao:** Logica de criar/atualizar palpites no banco com validacao.

**Escolha Unica (B26):**
1. Seleciona 1 opcao → clica salvar
2. Cria/atualiza Bet (value = opcao)
3. Toast "Palpite salvo!" + volta para P07

**Placar Exato (B27):**
1. Preenche placares (ambos campos por jogo, 0-99)
2. Salvar: Bet com value = JSON {home: X, away: Y} por jogo
3. Parcial permitido (D05): salva apenas jogos preenchidos
4. Toast "Palpites salvos!" + volta para P07

**Texto Livre (B28):**
1. Digita texto (nao vazio, max 100 chars)
2. Cria/atualiza Bet (value = texto)
3. Toast "Palpite salvo!" + volta para P07

**Edicao (B29):**
- Se ja tem Bet, pre-preenche com valores salvos
- UPDATE (nao INSERT)
- Se deadline passou → campos read-only + mensagem

**Dados:**
- Tabela: Bet (id, userId, categoryId, value, createdAt, updatedAt, pointsEarned)
- value: string (JSON para placar, texto para outros)

**Criterio de aceitacao (F):**
- [ ] Palpite escolha unica salva corretamente
- [ ] Palpite placar exato salva JSON por jogo
- [ ] Palpites parciais permitidos em placar exato
- [ ] Palpite texto livre salva com validacao (nao vazio, max 100)
- [ ] Edicao pre-preenche valores existentes
- [ ] UPDATE em vez de INSERT para edicao
- [ ] Campos read-only apos deadline
- [ ] Toasts de sucesso
- [ ] Redirect para P07 apos salvar

---

**Depende de:** issue-08 (painel participante — navega de la)
**Paralelo:** nao (sequencial apos issue-08)

---

### issue-10 — Painel Admin (P09)

**Pagina:** P09
**Componentes:** C27, C28, C29, C30, C31
**Comportamentos:** B30, B31, B32, B33

---

#### Subtask V: Interface do painel admin com tabs

**Tipo:** visual
**Descricao:** Painel admin com 3 tabs (Resultados, Membros, Config). Dados mockados.

**Secoes:**
- **Tab Resultados:**
  - AdminStatsRow (C27): 2 stat boxes — participantes (pixel font verde), resultados X/Y (pixel font dourado)
  - PendingResultCards (C28): borda esquerda dourada, nome jogo/categoria, subtitulo fase, botao "Inserir" arcade small
  - InsertedResultCards (C29): borda esquerda verde, opacity reduzida, badge "Inserido"
- **Tab Membros:**
  - MemberRows (C30): nome, data entrada, badge role (Admin=roxo), botao remover (admins)
- **Tab Config:**
  - PoolConfigPanel (C31): nome editavel, link convite copiavel, botao "Encerrar bolao" (outline error, so visivel quando 100% resultados)

**Criterio de aceitacao (V):**
- [ ] Pagina renderiza na rota `/pool/[poolId]/admin`
- [ ] 3 tabs funcionam
- [ ] Stats row com dados mockados
- [ ] Cards pendentes vs inseridos com estilos distintos
- [ ] Lista membros com badges de role
- [ ] Config com campos editaveis e botao encerrar
- [ ] Botao encerrar so aparece com 100% resultados (mockado)

---

#### Subtask F: Gerenciamento do bolao (resultados, membros, config)

**Tipo:** funcional
**Depende de:** Subtask V desta issue
**Descricao:** Logica completa de admin — inserir resultados com calculo de pontuacao, gerenciar membros, editar config e encerrar bolao.

**Inserir resultado (B30):**
1. Admin clica "Inserir" em card pendente
2. Input inline (mesmo layout P08 mas para resultado real)
3. Server Action: cria Result, compara com todas Bets da categoria, aplica ScoringRules, atualiza pointsEarned em Bet e totalScore/rank em PoolMember (D04)
4. Toast "Resultado inserido! Ranking atualizado." + card move para Inserido

**Remover participante (B31):**
1. Clica remover → ConfirmModal (C37)
2. Deleta PoolMember + Bets associadas, recalcula ranking
3. Admin nao pode se remover
4. Toast "Participante removido"

**Editar nome (B32):**
- Inline edit, nao vazio, max 100 chars
- Toast "Nome atualizado"

**Encerrar bolao (B33):**
- Pre-condicao: 100% resultados inseridos
- ConfirmModal → muda Pool.status para "closed", define closedAt, ranking final
- Redireciona para P10
- Se faltam resultados: botao desabilitado + mensagem

**Dados:**
- Tabela: Result (id, categoryId, value, createdAt)
- Calculo: ScoringRule.points aplicado por acerto, atualiza Bet.pointsEarned e PoolMember.totalScore

**Criterio de aceitacao (F):**
- [ ] Inserir resultado funciona com calculo de pontuacao
- [ ] Ranking recalcula apos cada resultado
- [ ] Card move de pendente para inserido
- [ ] Remover participante com confirmacao funciona
- [ ] Admin nao pode se auto-remover
- [ ] Editar nome salva no banco
- [ ] Encerrar bolao so disponivel com 100% resultados
- [ ] Encerramento muda status e redireciona para P10
- [ ] Toasts corretos em todas as acoes
- [ ] Erros tratados com toast

---

**Depende de:** issue-08 (painel participante), issue-09 (palpites precisam existir para calculo)
**Paralelo:** nao (sequencial)

---

### issue-11 — Bolao Encerrado (P10)

**Pagina:** P10
**Componentes:** C32, C33, C34
**Comportamentos:** B34, B35

---

#### Subtask V: Tela celebratoria de encerramento

**Tipo:** visual
**Descricao:** Tela "GAME OVER" com podio e ranking final. Dados mockados.

**Secoes:**
- GameOverHeader (C32): "GAME OVER" pixel font dourado com text-shadow e glow, nome bolao pixel font verde
- Podium (C33): 3 blocos alturas proporcionais (1o centro mais alto). Posicao pixel font (dourado/prata/bronze), pontuacao verde, nome acima. 1o com borda dourada + glow
- FinalRankingList (C34): ranking do 4o em diante, link "+ X participantes" para expandir

**Criterio de aceitacao (V):**
- [ ] Pagina renderiza na rota `/pool/[poolId]` com status closed
- [ ] Header "GAME OVER" com estetica arcade dourada
- [ ] Podio com 3 posicoes e alturas proporcionais
- [ ] Ranking expandivel abaixo do podio
- [ ] Dados mockados

---

#### Subtask F: Dados finais e acoes

**Tipo:** funcional
**Depende de:** Subtask V desta issue
**Descricao:** Carregar ranking final real e acoes de navegacao.

**Ver ranking (B34):**
- Fetch ranking final com detalhamento por categoria
- Bets + Results + pontuacao por categoria para cada participante

**Criar novo bolao (B35):**
- Navega para `/pool/new?step=1`

**Criterio de aceitacao (F):**
- [ ] Podio exibe top 3 reais
- [ ] Ranking completo com dados reais
- [ ] Detalhamento por categoria disponivel
- [ ] Botao "Criar novo bolao" navega para wizard
- [ ] Botao "Ver pontuacao detalhada" expande lista

---

**Depende de:** issue-10 (admin encerra o bolao)
**Paralelo:** nao (sequencial)

---

### issue-12 — Perfil / Settings (P11)

**Pagina:** P11
**Componentes:** C35
**Comportamentos:** B36, B37, B38

---

#### Subtask V: Interface de perfil

**Tipo:** visual
**Descricao:** Tela de configuracoes da conta com form de edicao. Dados mockados.

**Secoes:**
- ProfileForm (C35): nome (editavel), email (read-only se Google), avatar (placeholder), botao salvar. Secao trocar senha (so email/senha): senha atual, nova senha, confirmar. Botao logout outline vermelho

**Criterio de aceitacao (V):**
- [ ] Pagina renderiza na rota `/settings`
- [ ] Form com campos corretos
- [ ] Email read-only para usuarios Google
- [ ] Secao senha oculta para usuarios Google
- [ ] Botao logout estilizado
- [ ] Dados mockados do usuario

---

#### Subtask F: Edicao de perfil, senha e logout

**Tipo:** funcional
**Depende de:** Subtask V desta issue
**Descricao:** Logica de atualizar perfil, trocar senha e logout.

**Editar perfil (B36):**
- Edita nome/avatar → Server Action atualiza User
- Toast "Perfil atualizado"

**Trocar senha (B37):**
- Pre-condicao: so auth email/senha (nao Google)
- Validacao: senha atual correta, nova min 8 chars, confirmacao confere
- Sucesso: Toast "Senha alterada"
- Erro: "Senha atual incorreta"

**Logout (B38):**
- NextAuth signOut → redireciona para `/`

**Criterio de aceitacao (F):**
- [ ] Editar nome salva no banco
- [ ] Trocar senha valida e atualiza
- [ ] Trocar senha so aparece para auth email/senha
- [ ] Logout encerra sessao e redireciona
- [ ] Toasts corretos

---

**Depende de:** issue-03 (auth)
**Paralelo com:** issue-04+ (independente das features de bolao)

---

## Mapa de Dependencias

```
issue-01 (Design System)
├── issue-02 (Landing) ──────────────────── paralelo com issue-03
├── issue-03 (Auth) ─────────────────────── paralelo com issue-02
│   ├── issue-04 (Home) ─────────────────── sequencial
│   │   ├── issue-05 (Wizard) ───────────── sequencial
│   │   │   ├── issue-06 (Bolao Criado) ── paralelo com issue-07
│   │   │   └── issue-07 (Convite) ──────── paralelo com issue-06
│   │   ├── issue-08 (Painel Particip.) ─── sequencial
│   │   │   └── issue-09 (Registrar Palp.) ─ sequencial
│   │   │       └── issue-10 (Painel Admin) ─ sequencial
│   │   │           └── issue-11 (Encerrado) ─ sequencial
│   └── issue-12 (Perfil) ──────────────── paralelo (independente)
```

## Ordem de Implementacao

1. ~~**issue-01** — Design System + Globais (fundacao visual)~~ ✅
2. **issue-02** + **issue-03** — Landing + Auth (paralelo) 🔧 em progresso
3. **issue-04** — Home/Dashboard
4. **issue-05** — Wizard de Criacao
5. **issue-06** + **issue-07** — Bolao Criado + Convite (paralelo)
6. **issue-08** — Painel Participante
7. **issue-09** — Registrar Palpite
8. **issue-10** — Painel Admin
9. **issue-11** — Bolao Encerrado
10. **issue-12** — Perfil/Settings (pode ser paralelo a partir do passo 3)
