# Spec — KRVOU

> Data: 2026-04-12
> Status: Em revisao (wizard redesenhado — v2)
> Baseado em: docs/brief/BRIEF.md + Google Stitch (Landing Page v5)

---

## Overview

**Nome:** KRVOU
**Descricao:** Webapp mobile-first para criar e participar de boloes esportivos a partir de produtos pre-definidos (Copa do Mundo, Brasileirao, etc.), com wizard de criacao guiado e ranking em tempo real.
**Problema:** Boloes hoje vivem em grupos de WhatsApp e planilhas — regras confusas, ninguem sabe quem ta ganhando, organizador perde tempo fazendo tudo na mao.
**Solucao:** Uma plataforma com produtos pre-configurados (categorias e pontuacao definidas pela plataforma), onde o criador monta o bolao em 3 steps e os participantes so palpitam e acompanham o ranking.
**Publico:** Pessoas que organizam boloes entre amigos ou colegas de trabalho — foco em Copa do Mundo 2026 no MVP.
**Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Prisma, PostgreSQL, NextAuth.js (Google + Credentials), Vercel.
**Design:** Estetica arcade hard-edge (Stitch Landing Page v5) — neon green #39ff14, deep purple #120224, border-radius 0, pixel font, CRT overlay.

---

## Design System — Retro-Futurist Betting Experience

### North Star: "The Neon Arcade Terminal"
Estetica de arcade premium dos anos 80 reimaginada com lente futurista. Rejeita flat design em favor de ambiente imersivo, tatil e nostalgico. O sistema quebra o look "template" com **Intentional Blockiness**: hard edges, assimetria intencional (offset de 4px cria mais tensao que centralizacao), e shifts tonais de alto contraste.

### Cores & Superficies

**Paleta**
- **Foundation:** `surface` (#1f0438) — void profundo de alto contraste que faz neon vibrar.
- **Primary Glow:** `primary_container` (#39ff14) — "Winning Green", reservado para sucesso e acoes criticas.
- **Secondary Energy:** `secondary_container` (#e4e403) — "High-Voltage Yellow", alertas e pools de alta energia.

**Regra "No-Line":** Nunca usar 1px solid lines para separar secoes. Usar shifts tonais (ex: `surface` → `surface_container_low`) ou hard-edge depth (offset 4px).

**Hierarquia de Superficies (PCB Layers)**
1. **Base:** `surface_container_lowest` (#190032) — background mais profundo.
2. **Intermediate:** `surface_container` (#2c1245) — areas de conteudo principal.
3. **Active/Raised:** `surface_container_highest` (#43295b) — cards e betting slips ativos.

**Regra "Glass & Gradient":** CTAs primarios usam gradiente sutil (`primary` → `primary_container`). Overlays usam `surface_bright` com 60% opacidade e 12px backdrop-blur ("Neon Haze").

### Tipografia

**Display & Headlines (Personalidade)**
- **Font:** `Space Grotesk` (letter-spacing pesado, weights blocky, estetica pixel refinada).
- **Uso:** `display-lg` a `headline-sm`. Cor `secondary` (#fffeac) para headlines sobre fundo purple.

**Body & Labels (Utilidade)**
- **Font:** `Inter`.
- **Uso:** `body-lg` a `label-sm`. Texto limpo e razor-sharp.
- **Cor secundaria:** `on_surface_variant` (#baccb0) para dados secundarios.

### Elevacao & Profundidade: 3D Pixel Principle

**Sem shadows padrao Material.** Usar Tonal Stacking e Geometric Offsets.

**Regra do "4px Offset" (Signature Move)**
- **Idle:** Bloco solido de cor com "shadow" de 4px de variante tonal mais escura (ex: botao `primary` com offset `on_primary_fixed_variant` bottom-right).
- **Active/Pressed:** Offset desaparece (translate Y+4, X+4) simulando botao fisicamente pressionado.

**"Ghost Border" Fallback:** Se container precisa mais definicao, usar "Pixel Border": stroke 2px com `outline_variant` a 20% opacidade (glow sutil de CRT).

### Componentes de Design

**Buttons**
- **Primary:** Background `primary_container`, text `on_primary`. Offset 4px hard-edge. Border-radius `0px`.
- **Secondary:** Background `secondary_container`, text `on_secondary`.
- **Tertiary:** Sem background. Text `primary` com underline "Scanline" (dotted 2px).

**Cards (Betting Pools)**
- Proibido usar divider lines.
- Body: `surface_container_low`. Header: `surface_container_highest` (visual de "cartridge").

**Input Fields**
- Background: `surface_container_lowest` (look inset profundo).
- Focus: Frame 2px solid `primary_container` (Neon Green) + blur 4px da mesma cor (efeito glow).

**Scanline Overlay**
- Overlay CSS global de linhas horizontais pretas a 5% opacidade sobre toda a tela.

### Do's and Don'ts

**Do**
- Border-radius `0px` em tudo. O "Retro" vem do grid, nao de curvas.
- "Electric Yellow" (`secondary_fixed`) para odds e numeros criticos.
- Assimetria intencional (ex: betting slip levemente mais largo que a coluna de conteudo).

**Don't**
- Shadows cinza padrao. Glow deve usar a cor do elemento (ex: glow verde para botao verde).
- Borders 1px solid para separar itens de lista. Usar espacamento vertical (16px/24px) ou shifts tonais.
- Transparencia em acoes primarias. Botoes devem parecer solidos e "pesados".

**Acessibilidade:** Garantir ratio 4.5:1 para texto "Toxic Neon" sobre "Deep Arcade". Para texto menor, usar `primary_fixed_dim` (#2ae500).

---

## Paginas

### P01 — Landing Page
Pagina publica que apresenta o KRVOU e converte visitantes.
Estetica arcade completa com pixel grid, CRT overlay e neon glow.
- **Hero:** Logo KRVOU em pixel font grande, tagline ("Onde a resenha vira jogo"), CTA "COMECAR AGORA" (botao arcade), social proof com avatars pixel + contador de usuarios.
- **Power Ups:** Grid bento (8/4, 4/8) com cards dos diferenciais: Wizard IA (card grande), Real-Time Ranking (com mini preview), Convite Rapido, card decorativo VERSUS.
- **CTA Final:** "PRONTO PARA SER O LIDER?" + botao "CRIAR MEU BOLAO".
- **Footer:** Logo, texto pixel "criado com amor para quem ama o jogo", icones sociais.
- **Rota:** `/`

### P02 — Login / Signup
Tela de autenticacao unificada com toggle entre login e signup.
- **Login:** Botao "Continuar com Google" (OAuth) + form email/senha.
- **Signup:** Mesmo layout + campo nome. Toggle "Nao tem conta? Criar conta" / "Ja tem conta? Entrar".
- **Redirect:** Apos auth, redireciona para Home (/home). Se veio de um link de convite, redireciona para a pagina do bolao apos auth.
- **Rota:** `/auth`

### P03 — Home (Meus Boloes)
Dashboard principal do usuario logado. Lista todos os boloes que ele participa ou criou.
- **Top bar:** Logo KRVOU + avatar do usuario.
- **CTA:** Botao "CRIAR BOLAO" em destaque.
- **Lista de boloes:** Cards com nome do bolao, numero de participantes, badge de status (Aberto, Em andamento, Encerrado), e info contextual por status:
  - Aberto: "Palpites pendentes: X categorias"
  - Em andamento: "Sua posicao: Xo — Y pts"
  - Encerrado: "Resultado final: Campeao!" ou "Xo lugar"
- **Empty state:** Quando nao tem nenhum bolao, mostrar CTA para criar ou entrar com link de convite.
- **Bottom nav:** Home (ativo) | Criar | Meus Palpites | Ranking
- **Rota:** `/home`

### P04 — Wizard de Criacao (3 steps)
Fluxo guiado para criar um bolao a partir de um produto pre-definido. Cada step e uma tela com progress bar no topo. Sem IA — pontuacao definida pela plataforma.

#### P04a — Step 1: Selecionar Produto
- **Objetivo:** Escolher o produto (evento esportivo) que o bolao vai acompanhar.
- **Grid de produtos:** Cards com nome do produto, descricao curta e imagem/icone. Estado selecionado: borda primary + overlay check.
- **MVP:** Apenas "Copa do Mundo 2026" disponivel. Outros produtos bloqueados com badge "Em breve".
- **Validacao:** Produto deve estar selecionado para avancar.
- **Rota:** `/pool/new?step=1`

#### P04b — Step 2: Configurar Bolao
- **Objetivo:** Nomear o bolao e escolher as categorias de palpite.
- **Nome:** Input de texto livre para o nome do bolao. Obrigatorio, max 60 chars.
- **Categorias do produto:** Lista de CategoryCheckCards com as categorias pre-definidas do produto. Toggle on/off por categoria. Minimo 1 selecionada para avancar.
- **Categorias da Copa do Mundo 2026:**
  - Resultados dos jogos (placar exato de cada partida)
  - Vencedor da copa (selecao campeã)
  - Artilheiro (jogador com mais gols)
  - Primeiro, segundo e terceiro lugar (pódio de selecoes)
  - Jogador revelacao (nome do jogador)
- **Categoria personalizada:** Botao "+ Adicionar categoria" abre input de texto para o usuario nomear uma categoria livre. Ao confirmar, aparece na lista com badge "Personalizada". Pode adicionar varias.
- **Categorias personalizadas:** Sem tipo fixo — validadas pelo criador do bolao via texto livre ao final da competicao (no painel admin).
- **Rota:** `/pool/new?step=2`

#### P04c — Step 3: Revisao e Criacao
- **Objetivo:** Revisar tudo antes de criar.
- **Resumo:** ReviewCards com produto selecionado, nome do bolao, categorias ativas (pre-definidas + personalizadas com contador). Cada card tem link "Editar" que volta ao step correspondente.
- **Pontuacao:** Nao exibida no wizard — definida pela plataforma por produto.
- **CTA:** Botao "CRIAR BOLAO" que salva tudo no banco e redireciona para P05.
- **Rota:** `/pool/new?step=3`

### P05 — Bolao Criado (Tela de Sucesso + Convite)
Confirmacao apos criar o bolao com destaque no link de convite.
- **Celebracao:** Texto pixel "BOLAO CRIADO!" + nome do bolao.
- **Link de convite:** URL exibida em campo monospace + botao "Copiar link".
- **Navegacao:** Botao "Ir para o painel do bolao".
- **Rota:** `/pool/[poolId]/created`

### P06 — Pagina de Convite (publica)
Pagina acessivel sem login que apresenta o bolao para convidados.
- **Info:** Nome do bolao, criador, numero de participantes.
- **Categorias:** Lista das categorias de palpite disponiveis.
- **CTA:** Botao "ENTRAR NO BOLAO" que redireciona para auth (se nao logado) e depois entra no bolao automaticamente.
- **Nota:** "Precisa de conta para participar".
- **Rota:** `/join/[inviteCode]`

### P07 — Painel do Bolao (Participante)
Central do participante dentro de um bolao. Navegacao por tabs.

#### Tab: Ranking
- **Destaque:** Card com posicao do usuario, pontuacao e diferenca para o lider.
- **Lista:** Ranking completo com posicao, nome, pontuacao. Linha do usuario destacada em verde.

#### Tab: Palpites
- **Lista de categorias:** Cards com nome da categoria, status (Feito/Pendente), palpite registrado (se feito). Borda colorida por status (verde = feito, rosa = pendente).
- **Progress bar:** X de Y categorias preenchidas.
- **Tap em categoria:** Abre tela de palpite (P08).

#### Tab: Resultados
- **Lista:** Resultados ja inseridos pelo admin, com palpite do usuario ao lado para comparacao e pontuacao recebida.

- **Bottom nav:** Home | Criar | Meus Palpites (ativo) | Ranking
- **Rota:** `/pool/[poolId]`

### P08 — Registrar Palpite
Tela para registrar/editar palpite em uma categoria especifica.

#### P08a — Palpite: Escolha Unica
- **Descricao da categoria** no topo.
- **Lista de opcoes:** Cards selecionaveis (radio) com as opcoes disponiveis (ex: selecoes para "Campeao").
- **Botao salvar.**

#### P08b — Palpite: Placar Exato
- **Lista de jogos** agrupados por rodada/fase.
- **Cada jogo:** Bandeira/nome do time A, inputs de placar (2 campos numericos), bandeira/nome do time B.
- **Jogo preenchido** fica com borda verde.
- **Botao salvar.**

#### P08c — Palpite: Texto Livre
- **Campo de texto** para palpite aberto (ex: nome do artilheiro).
- **Botao salvar.**

- **Rota:** `/pool/[poolId]/bet/[categoryId]`

### P09 — Painel do Bolao (Admin)
Visao do admin com controles de gerenciamento. Navegacao por tabs.

#### Tab: Resultados
- **Stats:** Cards com numero de participantes e progresso de resultados (X/Y inseridos).
- **Secao Pendentes:** Cards com jogos/categorias sem resultado, cada um com botao "Inserir". Borda dourada.
- **Secao Inseridos:** Cards com resultados ja informados, com badge "Inserido". Opacity reduzida.
- **Inserir resultado:** Abre input inline ou modal com mesmo layout de P08 (dependendo do tipo).

#### Tab: Membros
- **Lista de participantes** com nome, data de entrada, role (admin/participante).
- **Acoes:** Remover participante (com confirmacao).

#### Tab: Config
- **Nome do bolao** (editavel).
- **Link de convite** (copiavel).
- **Botao "Encerrar bolao"** (com confirmacao). So aparece quando todos os resultados foram inseridos.

- **Rota:** `/pool/[poolId]/admin`

### P10 — Bolao Encerrado
Tela celebratoria exibida quando o bolao e encerrado.
- **Header:** "GAME OVER" em pixel font dourado + nome do bolao.
- **Podio:** Visual com 1o, 2o e 3o lugar em blocos de alturas proporcionais. Nomes e pontuacoes.
- **Ranking completo:** Lista abaixo do podio com todos os participantes.
- **Acoes:** "Ver pontuacao detalhada" + "Criar novo bolao".
- **Rota:** `/pool/[poolId]` (mesmo painel, mas com layout de encerramento)

### P11 — Perfil / Settings
Configuracoes da conta do usuario.
- **Dados:** Nome, email (read-only se Google), avatar.
- **Acoes:** Editar nome, trocar senha (so email/senha), logout.
- **Rota:** `/settings`

---

## Componentes

### P01 — Landing Page

#### C01 — TopBar
Barra fixa no topo. Logo KRVOU em pixel font a esquerda. Links de navegacao (Home, Ranking, Jogos) no desktop. Icone de menu hamburger no mobile. Icone de notificacoes a direita. Background surface (#1f0438), borda inferior 4px, box-shadow arcade.

#### C02 — HeroSection
Secao central com titulo "KRVOU!" em pixel font grande (5xl mobile, 8xl desktop), tagline em Space Grotesk uppercase, botao CTA arcade "COMECAR AGORA" (primary com borda inferior e direita 8px), grupo de avatars pixel com contador "+1.2k". Background com pixel grid (radial-gradient dots verdes) e blur decorativo roxo.

#### C03 — PowerUpsGrid
Grid bento com 4 cards:
- **WizardIACard** (8 colunas): Badge "AI ENHANCED", titulo "WIZARD IA" em pixel font, descricao, icone auto_awesome em background. Borda outline.
- **RankingCard** (4 colunas): Icone leaderboard, titulo "REAL-TIME RANKING", descricao, mini barra de progresso com posicao. Borda primary com box-shadow verde.
- **ConviteCard** (4 colunas): Icone share, titulo "CONVITE RAPIDO", descricao. Hover muda borda para secondary.
- **VersusCard** (8 colunas): Decorativo. Texto "VERSUS" grande com sombra roxa, "MULTIPLAYER MODE" em pixel font pequeno, icones de esporte nas laterais. Background com dot grid.

#### C04 — CTASection
Secao com titulo "PRONTO PARA SER O LIDER?" (pixel font, span primary), botao arcade "CRIAR MEU BOLAO" (branco com borda cinza, hover primary). Background surface com textura carbon fibre.

#### C05 — Footer
Logo KRVOU com neon glow, texto pixel "criado com amor para quem ama o jogo", icones sociais com hover primary.

#### C06 — BottomNavBar
Navegacao fixa inferior (mobile only). 4 itens: Home, Criar, Meus Palpites, Ranking. Item ativo com background primary e cor de texto background. Icones Material Symbols. Borda superior 4px, box-shadow arcade invertido. Estilo retangular (sem border-radius).

### P02 — Login / Signup

#### C07 — AuthForm
Logo KRVOU no topo. Botao "Continuar com Google" (branco, icone Google SVG). Divider "ou". Form com campos email (text) e senha (password). Se signup: campo nome adicional. Botao submit arcade (primary). Link toggle "Nao tem conta? / Ja tem conta?".

### P03 — Home (Meus Boloes)

#### C08 — PoolCard
Card de um bolao na lista. Contem: titulo do bolao, contador de participantes (subtitle), badge de status (Aberto = verde, Em andamento = amarelo, Encerrado = rosa), info contextual na parte inferior separada por borda (posicao, palpites pendentes, ou resultado final). Bolao encerrado tem opacity reduzida. Borda outline, background surface. Clicavel.

#### C09 — EmptyState
Exibido quando o usuario nao tem boloes. Mensagem convidando a criar ou entrar com link. Dois botoes: "Criar Bolao" e "Tenho um convite".

### P04 — Wizard de Criacao

#### C10 — WizardProgressBar
Barra de progresso no topo. 3 steps. Preenchimento com gradient primary→cyan. Mostra step atual (ex: "STEP 2/3" em pixel font).

#### C11 — WizardHeader
Card com step number em pixel font verde e titulo do step em texto body bold.

#### C12 — ProductCard
Card de produto selecionavel. Imagem/icone do produto no topo, nome em font-heading bold, descricao curta em body muted. Estado selecionado: borda primary 2px + overlay com icone check (cor primary). Estado nao selecionado: borda outline. Badge "Em breve" para produtos indisponiveis (opacity reduzida, nao clicavel).

#### C13 — PoolNameInput
Input de texto para o nome do bolao. Label "Nome do bolao" em pixel font pequeno. Placeholder "ex: Bolao do Trampo 2026". Contador de chars (X/60) alinhado a direita. Estilo arcade (borda outline, focus glow neon green).

#### C14 — CategoryCheckCard
Card de categoria de palpite com checkbox. Estado selecionado: checkbox preenchido em primary com check, borda accent, background sutil. Estado nao selecionado: checkbox vazio com borda, opacity reduzida. Conteudo: nome da categoria, descricao, badge de tipo (Placar exato / Escolha unica / Texto livre). Badge adicional "Personalizada" em secondary para categorias criadas pelo usuario.

#### C15 — CustomCategoryInput
Botao "+ Adicionar categoria" que expande para um input inline de texto. Campo para digitar o nome da categoria personalizada. Botao "Adicionar" confirma e fecha o input — categoria aparece na lista C14 com badge "Personalizada". Botao "Cancelar" descarta. Pode adicionar multiplas.

#### C16 — ReviewCard
Card de resumo com label (small muted), titulo (bold), subtitle opcional, e link "Editar" alinhado a direita (cor cyan).

### P05 — Bolao Criado

#### C17 — SuccessScreen
Texto "BOLAO CRIADO!" em pixel font verde com glow. Nome do bolao abaixo. Card com link de convite em fonte monospace + botao "Copiar link". Botao outline "Ir para o painel do bolao".

### P06 — Pagina de Convite

#### C18 — InviteCard
Card centralizado com: texto "Voce foi convidado para", nome do bolao (bold grande), criador + contador de participantes. Card interno com background elevated listando categorias de palpite com bullet points dourados. Botao "ENTRAR NO BOLAO" arcade. Nota de rodape sobre conta obrigatoria.

### P07 — Painel do Bolao (Participante)

#### C19 — TabBar
Barra de tabs com background card e borda. Tabs: Ranking, Palpites, Resultados. Tab ativa com background elevated e cor primary. Texto muted nas inativas.

#### C20 — UserPositionCard
Card destacado com posicao do usuario (pixel font grande dourado), pontuacao (pixel font verde), e diferenca para o lider (texto dim). Borda accent dim, background gradient sutil.

#### C21 — RankingList
Lista de participantes com posicao (pixel font dourado), nome, pontuacao (pixel font verde). Linha do usuario com background highlight verde sutil. Encapsulada em card com borda e border-radius (0 por ser arcade).

#### C22 — BetCategoryCard
Card de categoria de palpite com borda esquerda colorida (3px): verde se feito, rosa se pendente. Nome da categoria, palpite registrado (verde) ou "Nenhum palpite", badge de status (Feito/Pendente).

#### C23 — ResultComparisonCard
Card mostrando resultado real vs palpite do usuario. Nome da categoria, resultado oficial, palpite do usuario, pontuacao recebida (com cor: verde se acertou, rosa se errou).

### P08 — Registrar Palpite

#### C24 — ChoiceSelector
Lista de opcoes selecionaveis (radio-style). Card por opcao, borda primary quando selecionado.

#### C25 — ScoreInput
Card de jogo para palpite de placar. Flag/nome time A, dois inputs numericos centralizados (pixel font, cor accent), separador "x", flag/nome time B. Card preenchido com borda verde.

#### C26 — FreeTextInput
Campo de texto para palpite aberto. Input com estilo arcade (borda, background input).

### P09 — Painel do Bolao (Admin)

#### C27 — AdminStatsRow
Row com dois stat boxes: participantes (numero em pixel font verde) e resultados inseridos (X/Y em pixel font dourado). Background card, borda.

#### C28 — PendingResultCard
Card de resultado pendente. Borda esquerda dourada (3px). Nome do jogo/categoria, subtitulo (grupo/fase), botao "Inserir" (arcade small).

#### C29 — InsertedResultCard
Card de resultado ja inserido. Borda esquerda verde, opacity reduzida. Nome + resultado, badge "Inserido".

#### C30 — MemberRow
Linha de participante na aba Membros. Nome, data de entrada, badge de role (Admin em roxo, Participante sem badge). Botao remover (com confirmacao) para admins.

#### C31 — PoolConfigPanel
Form com nome do bolao (editavel), link de convite (copiavel), botao "Encerrar bolao" (outline com cor error, confirmacao via modal). Botao encerrar so aparece quando 100% dos resultados foram inseridos.

### P10 — Bolao Encerrado

#### C32 — GameOverHeader
"GAME OVER" em pixel font dourado com text-shadow e glow. Nome do bolao em pixel font verde menor. Estetica arcade celebratoria.

#### C33 — Podium
Visual de podio com 3 blocos de alturas proporcionais (1o mais alto no centro). Cada bloco: posicao em pixel font (dourado para 1o, prata para 2o, bronze para 3o), pontuacao em pixel font verde. Nome acima de cada bloco. 1o lugar com borda dourada e glow.

#### C34 — FinalRankingList
Ranking completo abaixo do podio (do 4o em diante). Mesma estrutura do C21 mas sem destaque de usuario. Link "+ X participantes" para expandir se lista for longa.

### P11 — Perfil / Settings

#### C35 — ProfileForm
Form com campos: nome (editavel), email (read-only se Google), avatar (placeholder). Botao salvar. Secao separada para trocar senha (so usuarios email/senha). Botao logout em outline vermelho.

### Componentes Globais

#### C36 — Toast
Notificacao temporaria no topo. Tipos: sucesso (borda verde), erro (borda vermelha), info (borda cyan). Texto body + icone. Auto-dismiss em 4s.

#### C37 — ConfirmModal
Modal de confirmacao para acoes destrutivas (remover participante, encerrar bolao). Titulo, descricao, dois botoes: "Cancelar" (outline) e "Confirmar" (primary ou error). Background overlay escuro.

#### C38 — LoadingState
Indicador de carregamento. Pixel art spinner ou barra animada em primary. Texto "Carregando..." em pixel font pequeno.

#### C39 — ErrorState
Tela de erro generico. Icone de erro, mensagem, botao "Tentar novamente".

---

## Comportamentos

### P01 — Landing Page

#### B01 — Clicar CTA "COMECAR AGORA" (C02)
- **Acao:** Navega para pagina de auth (/auth)
- **Se logado:** Redireciona para Home (/home)

#### B02 — Clicar CTA "CRIAR MEU BOLAO" (C04)
- **Acao:** Mesmo que B01

#### B03 — Navegar pelo BottomNav (C06)
- **Acao:** Navega para a rota do item clicado
- **Se nao logado:** Redireciona para auth, depois para a rota pretendida

### P02 — Login / Signup

#### B04 — Login com Google (C07)
- **Acao:** Inicia fluxo OAuth com Google via NextAuth
- **Sucesso:** Cria/atualiza usuario no banco, redireciona para Home (ou para link de convite pendente)
- **Erro:** Toast "Falha ao autenticar com Google"

#### B05 — Login com email/senha (C07)
- **Acao:** Envia credenciais para NextAuth Credentials provider
- **Validacao:** Email formato valido, senha nao vazia
- **Sucesso:** Sessao criada, redireciona para Home
- **Erro credenciais:** Mensagem "Email ou senha incorretos" (generica, sem revelar qual)
- **Erro servidor:** Toast "Erro ao fazer login"

#### B06 — Signup com email/senha (C07)
- **Acao:** Cria novo usuario no banco
- **Validacao:** Nome obrigatorio (min 2 chars), email formato valido e unico, senha min 8 chars
- **Sucesso:** Cria usuario, faz login automatico, redireciona para Home
- **Erro email duplicado:** Mensagem "Ja existe uma conta com esse email"
- **Erro validacao:** Highlight nos campos invalidos

#### B07 — Toggle login/signup (C07)
- **Acao:** Alterna entre modo login e signup no mesmo layout
- **Dados:** Campos sao limpos na troca

### P03 — Home (Meus Boloes)

#### B08 — Clicar "CRIAR BOLAO" (P03)
- **Acao:** Navega para Wizard step 1 (/pool/new?step=1)

#### B09 — Clicar em PoolCard (C08)
- **Acao:** Navega para o painel do bolao
- **Se admin:** Vai para /pool/[poolId]/admin
- **Se participante:** Vai para /pool/[poolId]
- **Se encerrado:** Vai para tela de encerramento (P10)

#### B10 — Acessar Home sem boloes (C09)
- **Acao:** Mostra empty state com CTAs
- **"Criar Bolao":** Navega para wizard
- **"Tenho um convite":** Abre input para colar link/codigo

### P04 — Wizard de Criacao

#### B11 — Selecionar produto no Step 1 (C12)
- **Acao:** Clica no ProductCard do produto desejado
- **Estado:** Card fica marcado com borda primary + check
- **Validacao:** Produto deve estar selecionado para habilitar botao "Proximo"
- **Edge case produto indisponivel:** Badge "Em breve", clique nao seleciona

#### B12 — Preencher nome do bolao no Step 2 (C13)
- **Acao:** Digita nome no input
- **Validacao:** Nao vazio, max 60 chars. Contador atualiza em tempo real
- **Edge case nome vazio:** Botao "Proximo" desabilitado

#### B13 — Toggle categoria on/off no Step 2 (C14)
- **Acao:** Marca/desmarca categoria do produto como ativa
- **Validacao:** Minimo 1 categoria ativa (pre-definida ou personalizada) para avancar
- **Edge case 0 categorias:** Botao "Proximo" desabilitado

#### B14 — Adicionar categoria personalizada no Step 2 (C15)
- **Acao:** Clica "+ Adicionar categoria" → input expande inline
- **Preenche nome:** Texto livre, nao vazio, max 80 chars
- **Confirma:** Categoria aparece na lista (C14) com badge "Personalizada" e ja selecionada
- **Tipo de resultado:** Definido como "texto livre" — sem resultado de API, validado pelo criador ao final da competicao
- **Cancela:** Input fecha sem adicionar
- **Multiplas:** Pode adicionar quantas quiser

#### B15 — Confirmar criacao no Step 3 (C16)
- **Acao:** Clica "CRIAR BOLAO" → Server Action
- **Dados criados:** Pool (status: open, productId, name), PoolCategory para cada categoria ativa (pre-definidas e personalizadas), PoolMember (role: admin)
- **Pontuacao:** Nao configurada pelo usuario — ScoringRules herdadas do produto via productCategoryId
- **Sucesso:** Gera inviteCode unico (8 chars), redireciona para P05
- **Erro:** Toast "Erro ao criar bolao" + nao redireciona
- **Edge case nome duplicado:** Permitido (boloes podem ter nomes iguais, ID diferencia)
- **Sessao expirada:** Redirect para /auth

#### B16 — Navegar entre steps (C10)
- **Acao:** Botoes "Voltar" e "Proximo" navegam entre steps
- **Estado:** Dados de cada step sao mantidos em state client-side ate confirmacao final
- **Voltar no step 1:** Volta para Home

### P05 — Bolao Criado

#### B19 — Copiar link de convite (C17)
- **Acao:** Copia URL do convite para clipboard
- **Sucesso:** Toast "Link copiado!" + texto do botao muda para "Copiado!" por 2s
- **Fallback:** Se Clipboard API nao disponivel, seleciona o texto do input

#### B20 — Ir para painel do bolao (C17)
- **Acao:** Navega para /pool/[poolId]/admin

### P06 — Pagina de Convite

#### B21 — Clicar "ENTRAR NO BOLAO" (C18)
- **Se logado:** Cria PoolMember (role: participant), redireciona para P07 (painel participante)
- **Se nao logado:** Salva inviteCode em cookie/session, redireciona para auth. Apos auth, processa o convite automaticamente
- **Ja e membro:** Toast "Voce ja participa desse bolao", redireciona para painel
- **Bolao fechado:** Botao desabilitado, mensagem "Este bolao nao aceita mais participantes"

### P07 — Painel do Bolao (Participante)

#### B22 — Alternar tabs (C19)
- **Acao:** Muda o conteudo exibido (Ranking, Palpites, Resultados)
- **Dados:** Cada tab faz fetch dos dados correspondentes
- **Default:** Tab Ranking ao abrir

#### B23 — Ver ranking (C20, C21)
- **Acao:** Carrega ranking do bolao
- **Dados:** Lista de PoolMembers ordenada por totalScore DESC com rank calculado
- **Destaque:** Linha do usuario logado com background highlight
- **Edge case empate:** Mesma posicao para pontuacoes iguais

#### B24 — Clicar em categoria de palpite (C22)
- **Acao:** Navega para tela de palpite (P08) da categoria
- **Se categoria trancada (isLocked):** Toast "Palpites encerrados para esta categoria" + nao navega
- **Se deadline passou:** Mesmo comportamento de trancada

#### B25 — Ver resultados (C23)
- **Acao:** Carrega resultados ja inseridos com comparacao
- **Dados:** Results + Bets do usuario, calcula acertos
- **Sem resultados:** Empty state "Nenhum resultado inserido ainda"

### P08 — Registrar Palpite

#### B26 — Selecionar opcao em Escolha Unica (C24)
- **Acao:** Seleciona uma opcao (radio)
- **Validacao:** Exatamente 1 opcao selecionada para salvar
- **Salvar:** Cria/atualiza Bet com value = opcao selecionada
- **Sucesso:** Toast "Palpite salvo!" + volta para P07

#### B27 — Preencher placar em Placar Exato (C25)
- **Acao:** Digita numeros nos inputs de placar
- **Validacao:** Ambos os campos preenchidos para cada jogo, valores 0-99
- **Salvar:** Cria/atualiza Bet com value = JSON {home: X, away: Y} por jogo
- **Sucesso:** Toast "Palpites salvos!" + volta para P07
- **Parcial:** Pode salvar com jogos incompletos (salva apenas os preenchidos)

#### B28 — Digitar palpite em Texto Livre (C26)
- **Acao:** Digita texto no campo
- **Validacao:** Nao vazio, max 100 chars
- **Salvar:** Cria/atualiza Bet com value = texto
- **Sucesso:** Toast "Palpite salvo!" + volta para P07

#### B29 — Editar palpite existente (C24/C25/C26)
- **Acao:** Ao abrir P08, se ja tem Bet, pre-preenche com valores salvos
- **Salvar:** Atualiza Bet existente (UPDATE, nao INSERT)
- **Edge case deadline:** Se deadline da categoria passou, campos sao read-only + mensagem

### P09 — Painel do Bolao (Admin)

#### B30 — Inserir resultado (C28)
- **Acao:** Abre input para inserir resultado real da categoria/jogo
- **Interface:** Mesmo layout de P08 mas para resultado real (nao palpite)
- **Salvar:** Cria Result no banco, dispara calculo de pontuacao
- **Calculo:** Server Action compara Result com todas as Bets da categoria, aplica ScoringRules, atualiza pointsEarned em cada Bet e totalScore/rank em PoolMember
- **Sucesso:** Toast "Resultado inserido! Ranking atualizado." + card move de Pendente para Inserido
- **Erro:** Toast "Erro ao inserir resultado"

#### B31 — Remover participante (C30)
- **Acao:** Clica em remover + confirma no modal (C37)
- **Efeito:** Deleta PoolMember e Bets associadas, recalcula ranking
- **Nao pode remover:** O proprio admin (unico admin) nao pode se remover
- **Sucesso:** Toast "Participante removido"

#### B32 — Editar nome do bolao (C31)
- **Acao:** Edita inline o nome
- **Validacao:** Nao vazio, max 100 chars
- **Salvar:** Atualiza Pool.name
- **Sucesso:** Toast "Nome atualizado"

#### B33 — Encerrar bolao (C31)
- **Pre-condicao:** Todos os resultados inseridos (100%)
- **Acao:** Clica em "Encerrar" + confirma no modal
- **Efeito:** Muda Pool.status para "closed", define Pool.closedAt, calcula ranking final definitivo
- **Sucesso:** Redireciona para P10 (tela de encerramento)
- **Se faltam resultados:** Botao desabilitado + mensagem "Insira todos os resultados antes de encerrar"

### P10 — Bolao Encerrado

#### B34 — Ver pontuacao detalhada (C34)
- **Acao:** Expande lista completa de ranking com detalhamento por categoria
- **Dados:** Bets + Results + pontuacao por categoria para cada participante

#### B35 — Criar novo bolao (P10)
- **Acao:** Navega para Wizard step 1

### P11 — Perfil / Settings

#### B36 — Editar perfil (C35)
- **Acao:** Edita nome e/ou avatar
- **Salvar:** Atualiza User no banco
- **Sucesso:** Toast "Perfil atualizado"

#### B37 — Trocar senha (C35)
- **Pre-condicao:** So usuarios com auth email/senha (nao Google)
- **Validacao:** Senha atual correta, nova senha min 8 chars, confirmacao confere
- **Sucesso:** Toast "Senha alterada"
- **Erro:** "Senha atual incorreta"

#### B38 — Logout (C35)
- **Acao:** Encerra sessao via NextAuth signOut
- **Redireciona:** Para landing page (/)

---

## Decisoes

### D01 — Painel unico com tabs (nao paginas separadas)
**Contexto:** O participante precisa ver ranking, palpites e resultados do bolao.
**Decisao:** Uma unica pagina com tabs em vez de paginas separadas.
**Justificativa:** Navegacao mais rapida, menos full-page loads, melhor UX mobile. Cada tab faz fetch independente.

### D02 — Admin e participante em rotas diferentes
**Contexto:** Admin tem funcionalidades extras (inserir resultados, gerenciar membros).
**Decisao:** /pool/[poolId] para participante, /pool/[poolId]/admin para admin.
**Justificativa:** Separar responsabilidades, evitar UI condicional complexa. Middleware checa role.

### D03 — Wizard state em client-side ate confirmacao
**Contexto:** O wizard tem 3 steps e o usuario pode voltar e editar.
**Decisao:** Manter estado dos steps em React state (client). So salva no banco no step 3 (confirmacao).
**Justificativa:** Evita criar boloes incompletos no banco. Simplicidade. Se o usuario abandona, nada e criado.

### D04 — Calculo de pontuacao no momento da insercao do resultado
**Contexto:** Quando o admin insere um resultado, o ranking precisa ser atualizado.
**Decisao:** Calcular pontuacao via Server Action imediatamente apos inserir resultado. Nao usar cron/queue.
**Justificativa:** Volume baixo (poucos resultados por vez). Feedback imediato para o admin. Simplicidade.

### D05 — Palpites parciais permitidos em Placar Exato
**Contexto:** Um bolao pode ter 64 jogos. Obrigar preencher todos de uma vez e friction alta.
**Decisao:** Permitir salvar palpites parciais (so os jogos preenchidos). Jogos sem palpite = 0 pontos.
**Justificativa:** Melhor UX. Participante pode palpitar aos poucos conforme o torneio avanca.

### D06 — Deadline por categoria, nao por bolao
**Contexto:** Em um bolao da Copa, o palpite de "Campeao" pode ser ate o inicio do torneio, mas palpites de jogos da fase de grupos podem ser ate minutos antes de cada jogo.
**Decisao:** Cada BetCategory tem seu proprio deadline (nullable). Se null, palpite aberto ate resultado ser inserido.
**Justificativa:** Flexibilidade. Admin pode travar categorias individualmente via isLocked.

### D07 — Link de convite com inviteCode, nao poolId
**Contexto:** URL de convite precisa ser compartilhavel mas nao expor IDs internos.
**Decisao:** Gerar inviteCode unico (ex: 8 chars alfanumericos). URL: /join/[inviteCode].
**Justificativa:** Seguranca (nao enumera boloes), URLs mais curtas e amigaveis.

### D08 — Bottom nav com 4 itens
**Contexto:** O Stitch define 4 itens: Home, Criar, Meus Palpites, Ranking.
**Decisao:** Manter os 4 itens. "Criar" navega direto para wizard step 1. "Meus Palpites" mostra palpites consolidados de todos os boloes (pode ser simplificado no MVP como redirect para Home com filtro).
**Justificativa:** Consistencia com referencia visual do Stitch. "Criar" como item fixo incentiva criacao.

### D09 — Sem role "moderador" — apenas admin e participant
**Contexto:** Poderia haver roles intermediarios.
**Decisao:** Apenas admin (criador) e participant. Admin pode inserir resultados e gerenciar.
**Justificativa:** Simplicidade para MVP. Multi-admin pode ser v2.

### D10 — Pontuacao definida pela plataforma, nao pelo usuario
**Contexto:** No modelo anterior, o usuario podia editar e rebalancear as regras de pontuacao via IA.
**Decisao:** Cada ProductCategory tem ScoringRules pre-definidas pela plataforma. O usuario nao configura pontuacao no wizard — ela e herdada automaticamente do produto ao criar o bolao.
**Justificativa:** Consistencia entre boloes do mesmo produto. Elimina complexidade de configuracao. Garante fairness (ninguem pode inflar pontos de uma categoria que conhece melhor).

### D11 — Produtos gerenciados por admins da plataforma (hardcoded no MVP)
**Contexto:** Os produtos (Copa do Mundo 2026, Brasileirao, etc.) precisam ser cadastrados de alguma forma.
**Decisao:** No MVP, produtos e suas categorias sao inseridos via seed do Prisma (hardcoded). Nao ha painel admin de produtos. Adicionar novo produto = novo arquivo de seed + deploy.
**Justificativa:** Simplicidade para MVP. Painel de gestao de produtos e escopo pos-MVP.

### D12 — Categorias personalizadas validadas pelo criador via texto livre
**Contexto:** O criador do bolao pode adicionar categorias livres que nao existem no produto (ex: "Tecnico destaque", "Jogador mais feio"). Essas nao tem resultado de API.
**Decisao:** Categoria personalizada tem type "custom". Ao final da competicao, o criador do bolao insere o resultado via campo de texto no painel admin (P09). Nao ha validacao automatica de formato — o resultado e um texto livre que o admin digita.
**Justificativa:** Flexibilidade maxima para categorias criativas. Responsabilidade do criador garantir o resultado.

### D13 — Resultados das categorias pre-definidas virao de API externa
**Contexto:** Categorias como "Resultados dos jogos", "Vencedor da copa", etc. precisam de resultados reais.
**Decisao:** Cada ProductCategory tem um campo resultSource ("api" | "manual"). Categorias da Copa do Mundo 2026 tem resultSource "api". A integracao com a API de resultados e escopo pos-MVP — no MVP o admin insere manualmente (mesmo fluxo que categorias personalizadas).
**Justificativa:** Desacopla o lançamento do MVP da integracao com API externa. A arquitetura ja suporta o campo resultSource para implementacao futura.
