# Brief — KRVOU

> Data: 2026-04-03
> Status: Aprovado
> Artefatos: user-flows.mermaid, architecture.mermaid, wireframes.html, data-model.mermaid, decisions.md

## Problema

Criar boloes hoje e uma experiencia fragmentada e manual. Grupos de WhatsApp, planilhas no Google Sheets, regras confusas e ninguem sabe quem ta ganhando. Nao existe uma plataforma simples que permita criar boloes flexiveis para qualquer tipo de evento esportivo (ou nao), com regras claras e acompanhamento facil.

## Solucao

KRVOU e uma webapp mobile-first para criar e participar de boloes de forma intuitiva. O diferencial e um wizard conversacional com IA (Claude) que ajuda o criador a montar o bolao — entendendo o tipo de evento, sugerindo categorias de palpite e regras de pontuacao. A identidade visual e pixel art retro com interface clean.

## Publico-alvo

Pessoas que organizam boloes entre amigos ou colegas de trabalho. Geralmente quem toma iniciativa de criar um bolao no grupo, quer algo mais organizado que uma planilha, e gosta de competicao casual. Tambem empresas que fazem boloes internos em epocas de grandes eventos (Copa, Champions, etc.).

## Funcionalidades Core (MVP)

1. **Wizard de criacao com IA** — Conversa guiada por LLM que parametriza o bolao (evento, categorias de palpite, regras de pontuacao)
2. **Gerenciamento de bolao** — Dashboard do criador/admin com controle de participantes, resultados e status
3. **Convite por link** — Compartilhar link para convidar participantes (requer conta para entrar)
4. **Registro de palpites** — Interface para participantes registrarem seus palpites nas categorias definidas
5. **Entrada manual de resultados** — Admin insere resultados reais conforme eventos acontecem
6. **Ranking e acompanhamento** — Central do participante com seus palpites, pontuacao e posicao no ranking
7. **Fechamento e campeao** — Apuracao automatica de pontuacao e definicao do vencedor ao encerrar o bolao

## Fora do Escopo (NAO e MVP)

- Agente IA para buscar resultados automaticamente (v2)
- Bolao com dinheiro real / premiacao monetaria
- Atualizacao em tempo real durante jogos
- App nativo (iOS/Android)
- Notificacoes push
- Chat entre participantes
- Integracao com WhatsApp/Telegram
- Multiplos idiomas (apenas PT-BR no MVP)

## Fluxo Principal

1. Usuario cria conta (Google ou email/senha)
2. Clica em "Criar Bolao"
3. Wizard com IA conduz a configuracao: nome, tipo de evento, categorias de palpite, regras de pontuacao
4. Bolao criado — usuario recebe link de convite
5. Compartilha link com amigos
6. Convidados criam conta e entram no bolao
7. Cada participante registra seus palpites
8. Admin insere resultados conforme eventos ocorrem
9. Sistema calcula pontuacao automaticamente
10. Ao encerrar, ranking final e campeao definido

Ver diagrama completo em `user-flows.mermaid`

## Telas Principais

- **Landing Page** — Apresentacao do produto + CTA para criar bolao
- **Auth (Login/Signup)** — Google + email/senha
- **Home (logado)** — Meus boloes (criados e participando)
- **Wizard de Criacao** — Fluxo conversacional step-by-step com IA
- **Painel do Bolao (admin)** — Gerenciar participantes, inserir resultados, encerrar
- **Painel do Bolao (participante)** — Meus palpites, ranking, resultados
- **Tela de Palpites** — Registrar/editar palpites nas categorias
- **Ranking** — Classificacao geral com pontuacao detalhada
- **Convite** — Pagina publica do bolao para quem recebe o link

Ver wireframes em `wireframes.html`

## Modelo de Dados

Entidades principais:
- **User** — Conta do usuario (auth)
- **Pool** — O bolao em si (nome, evento, status, regras)
- **PoolMember** — Relacao usuario-bolao (role: admin/participant)
- **BetCategory** — Categorias de palpite do bolao (ex: "Campeao", "Artilheiro", "Resultado do jogo X")
- **Bet** — Palpite de um participante em uma categoria
- **Result** — Resultado real inserido pelo admin
- **ScoringRule** — Regras de pontuacao por categoria

Ver diagrama completo em `data-model.mermaid`

## Arquitetura

App monolitico Next.js com App Router. Server Actions para logica de backend.
Banco PostgreSQL. Auth via NextAuth.js. IA via Claude API (Anthropic SDK).
Deploy na Vercel.

Ver diagrama completo em `architecture.mermaid`

## Referencia Visual

### Fonte de Interface
- **Ferramenta:** Google Stitch (prototipos e layouts)
- **MCP disponivel:** Sim (stitch MCP configurado)

### Estilo (definido via Google Stitch — Landing Page v5)
- **Tom visual:** Arcade hard-edge — neon vibrante, bordas retas (border-radius: 0), efeitos CRT
- **Referencia:** Google Stitch project 17036510969533916249, screen 647b2da2b9b74ce3b77814350810295c
- **Identidade existente:** Nome "KRVOU" com logo pixel font

#### Paleta
| Token | Hex | Uso |
|---|---|---|
| Primary | #39ff14 | Neon green — CTAs, logo, destaques |
| Secondary | #ffff00 | Neon yellow — enfase textual |
| Tertiary | #bd00ff | Neon purple — decorativo |
| Background | #120224 | Deep dark purple — fundo |
| Surface | #1f0438 | Cards, navbar |
| Surface Container | #2c1245 | Elevacao intermediaria |
| Outline | #43295b | Bordas de cards |
| Error | #ff3131 | Alertas |

#### Tipografia
- **Headlines/Logo/Pontuacoes:** Press Start 2P (pixel font)
- **Labels/Navegacao:** Space Grotesk (geometrica)
- **Body text:** Inter (legibilidade)

#### Padroes Visuais
- Border-radius 0px em tudo (hard-edge arcade)
- Botoes com box-shadow 4px 4px arcade + press effect no :active
- Pixel grid no background (radial-gradient dots)
- CRT scanline overlay sutil
- Neon glow (drop-shadow) em elementos-chave
- Bordas grossas (4px) com cores solidas

#### Bottom Nav (4 itens)
Home | Criar | Meus Palpites | Ranking

NOTA: Os wireframes em wireframes.html estao DESATUALIZADOS.
Usar o Stitch como referencia visual oficial para todas as telas.

## Stack Tecnica

- **Framework:** Next.js 14+ (App Router)
- **Linguagem:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Banco:** PostgreSQL (Vercel Postgres ou Supabase)
- **ORM:** Prisma
- **Auth:** NextAuth.js (Auth.js) — Google + Credentials
- **IA:** Claude API (Anthropic SDK) — wizard de criacao
- **Hosting:** Vercel
- **Componentes UI:** shadcn/ui como base, customizado com estetica pixel art

Ver justificativas completas em `decisions.md`

## Restricoes e Contexto

- **Prazo:** Nao definido
- **Equipe:** Solo dev, IA-assisted (usando workflow estruturado)
- **Mobile-first:** Toda a UI deve ser projetada primeiro para mobile
- **Custo de IA:** Cada criacao de bolao consome tokens da Claude API — considerar caching/templates para reduzir custo
- **Sem monetizacao:** Nao ha cobranca nem transacao financeira no MVP

## Proximos Passos

1. Usar este brief como input para `/spec`
2. No /spec, detalhar paginas, componentes e comportamentos a partir do que esta definido aqui
3. Os wireframes e diagramas servem de referencia durante todo o workflow
4. Definir design system (paleta pixel art retro + tokens) antes de prototipar
