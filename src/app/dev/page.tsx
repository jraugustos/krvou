"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import {
  Card,
  CardAura,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bell,
  Home,
  Menu,
  Plus,
  SendIcon,
  Target,
  Trophy,
  User,
} from "lucide-react";
import { toast } from "sonner";

const colors = [
  { name: "background", var: "#1f0438" },
  { name: "surface-lowest", var: "#190032" },
  { name: "surface-low", var: "#280e40" },
  { name: "surface-container", var: "#2c1245" },
  { name: "surface-high", var: "#371e50" },
  { name: "surface-highest", var: "#43295b" },
  { name: "surface-bright", var: "#472d60" },
  { name: "primary", var: "#39ff14" },
  { name: "primary-dim", var: "#2ae500" },
  { name: "secondary", var: "#fffeac" },
  { name: "secondary-container", var: "#e4e403" },
  { name: "tertiary", var: "#bd00ff" },
  { name: "destructive", var: "#ff3131" },
  { name: "on-surface", var: "#f0dbff" },
  { name: "on-surface-variant", var: "#baccb0" },
  { name: "outline", var: "#85967c" },
  { name: "outline-variant", var: "#3c4b35" },
];

export default function DevPage() {
  return (
    <div className="min-h-screen bg-background p-5 md:p-10">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Header */}
        <header>
          <h1 className="font-pixel text-2xl text-primary md:text-4xl">
            KRVOU
          </h1>
          <p className="mt-2 font-heading text-lg text-secondary">
            Design System Preview
          </p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Todos os componentes e tokens do design system.
          </p>
        </header>

        {/* ================================================
            Digital Arena — Fundação nova (issue/design-refresh)
            ================================================ */}
        <section className="space-y-6 rounded-card-lg bg-background-light p-6 md:p-10">
          <div>
            <span className="font-heading text-xs font-bold uppercase tracking-widest text-on-surface-variant-light">
              Novo · Fundação
            </span>
            <h2 className="mt-1 font-heading text-2xl font-bold text-on-surface-light md:text-3xl">
              Digital Arena
            </h2>
            <p className="mt-2 text-sm text-on-surface-variant-light">
              Editorial-gaming híbrido: dark hero sobre light canvas, cantos
              suaves, glow neon e sombras editoriais.
            </p>
          </div>

          {/* Card default (branco) */}
          <div className="space-y-3">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-on-surface-variant-light">
              Card · default (branco)
            </h3>
            <Card>
              <CardHeader>
                <CardTitle>Bolão da Copa 2026</CardTitle>
                <CardDescription>
                  32 participantes · encerra em 3 dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-on-surface-light">
                  Cards brancos com sombra drop-soft para conteúdo editorial em
                  canvas claro. Raio 1rem (rounded-card).
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="pill" size="pill-lg">
                  Entrar
                </Button>
                <Button variant="pill-outline" size="pill-lg">
                  Compartilhar
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Card hero (dark com aura) */}
          <div className="space-y-3">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-on-surface-variant-light">
              Card · hero (dark + aura neon)
            </h3>
            <Card variant="hero" padding="lg">
              <CardAura />
              <div className="relative space-y-4">
                <span className="font-heading text-[10px] uppercase tracking-widest text-primary">
                  Meus Palpites
                </span>
                <h3 className="font-pixel text-xl text-secondary">
                  3 jogos hoje
                </h3>
                <p className="text-sm text-on-surface-variant">
                  Hero cards em roxo profundo com aura neon difusa. Ideal para
                  seções destacadas com personalidade editorial.
                </p>
                <Button variant="pill" size="pill-lg" className="w-full">
                  Ver palpites
                </Button>
              </div>
            </Card>
          </div>

          {/* Card stat (glassmorphism grid) */}
          <div className="space-y-3">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-on-surface-variant-light">
              Card · stat (gamification block)
            </h3>
            <Card variant="stat" padding="lg">
              <CardAura className="-left-10 -top-10" />
              <div className="relative space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-xs uppercase tracking-widest text-on-surface-variant">
                    Nível 12
                  </span>
                  <span className="font-heading text-[10px] uppercase tracking-widest text-primary">
                    8,450 XP
                  </span>
                </div>
                <div className="h-4 w-full overflow-hidden rounded-pill border border-white/5 bg-white/10 backdrop-blur-sm">
                  <div
                    className="h-full w-3/4 rounded-pill bg-primary shadow-neon-glow"
                    aria-label="75% para próximo nível"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-card border border-white/5 bg-white/5 p-4 backdrop-blur-md">
                    <p className="font-heading text-[10px] uppercase tracking-widest text-on-surface-variant">
                      Acertos
                    </p>
                    <p className="mt-1 font-pixel text-lg text-primary">128</p>
                  </div>
                  <div className="rounded-card border border-white/5 bg-white/5 p-4 backdrop-blur-md">
                    <p className="font-heading text-[10px] uppercase tracking-widest text-on-surface-variant">
                      Ranking
                    </p>
                    <p className="mt-1 font-pixel text-lg text-primary">#3</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Buttons pill */}
          <div className="space-y-3">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-on-surface-variant-light">
              Button · pill
            </h3>
            <div className="flex flex-wrap items-center gap-4 rounded-card bg-surface-lowest-light p-6 shadow-drop-soft">
              <Button variant="pill">Pill default</Button>
              <Button variant="pill" size="pill-lg">
                Pill large
              </Button>
              <Button variant="pill-outline">Pill outline</Button>
              <Button variant="pill-outline" size="pill-lg">
                Pill outline large
              </Button>
              <Button variant="pill" disabled>
                Disabled
              </Button>
            </div>
          </div>

          {/* Input pill (chat) */}
          <div className="space-y-3">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-on-surface-variant-light">
              Input · pill (chat messenger)
            </h3>
            <div className="rounded-card bg-surface-low-light p-6">
              <div className="relative">
                <Input
                  variant="pill"
                  placeholder="Digite uma mensagem para a IA..."
                  type="text"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-pill bg-hero-surface text-primary transition-colors hover:bg-surface-container"
                  aria-label="Enviar"
                >
                  <SendIcon className="size-4" />
                </button>
              </div>
            </div>
          </div>

          <p className="rounded-card border-2 border-dashed border-outline-variant-light bg-surface-lowest-light p-4 text-xs text-on-surface-variant-light">
            ℹ️ <strong>Fundação opt-in:</strong> componentes de feature
            (landing, home, wizard, etc.) continuam usando o sistema{' '}
            <em>Neon Arcade Terminal</em> até cada issue de migração rodar.
          </p>
        </section>

        {/* ================================================
            Digital Arena — Layouts (issue/design-refresh-layouts)
            ================================================ */}
        <section className="space-y-6 rounded-card-lg bg-background-light p-6 md:p-10">
          <div>
            <span className="font-heading text-xs font-bold uppercase tracking-widest text-on-surface-variant-light">
              Novo · Layouts
            </span>
            <h2 className="mt-1 font-heading text-2xl font-bold text-on-surface-light md:text-3xl">
              Digital Arena — Layouts
            </h2>
            <p className="mt-2 text-sm text-on-surface-variant-light">
              Previews estáticos (sem <code>fixed</code>) dos 3 chromes migrados:
              <code className="mx-1">TopBar</code>,{" "}
              <code className="mx-1">DashboardTopBar</code> e{" "}
              <code className="mx-1">BottomNavBar</code> com FAB central.
            </p>
          </div>

          {/* TopBar preview */}
          <div className="space-y-3">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-on-surface-variant-light">
              TopBar (pública)
            </h3>
            <div className="flex items-center justify-between rounded-b-2xl border-b border-white/10 bg-hero-surface px-5 py-4 shadow-drop-soft-md md:px-8">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  aria-label="Menu (preview)"
                  className="flex items-center justify-center rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-primary md:hidden"
                >
                  <Menu className="size-6" />
                </button>
                <span className="font-pixel text-lg uppercase tracking-wider text-primary drop-shadow-[0_0_8px_rgba(57,255,20,0.6)]">
                  KRVOU
                </span>
              </div>
              <nav className="hidden items-center gap-2 md:flex">
                <span className="rounded-pill bg-white/10 px-4 py-2 font-heading text-xs font-bold uppercase tracking-widest text-primary">
                  Home
                </span>
                <span className="rounded-pill px-4 py-2 font-heading text-xs font-bold uppercase tracking-widest text-white/70">
                  Ranking
                </span>
                <span className="rounded-pill px-4 py-2 font-heading text-xs font-bold uppercase tracking-widest text-white/70">
                  Jogos
                </span>
              </nav>
              <button
                type="button"
                aria-label="Notificações (preview)"
                className="flex items-center justify-center rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-primary"
              >
                <Bell className="size-5" />
              </button>
            </div>
            <p className="text-xs text-on-surface-variant-light">
              <code>bg-hero-surface</code> · <code>rounded-b-2xl</code> ·
              <code className="mx-1">shadow-drop-soft-md</code> · logo com glow
              neon · nav items em pills.
            </p>
          </div>

          {/* DashboardTopBar preview */}
          <div className="space-y-3">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-on-surface-variant-light">
              DashboardTopBar (autenticada)
            </h3>
            <div className="flex items-center justify-between rounded-b-2xl border-b border-white/10 bg-hero-surface px-5 py-4 shadow-drop-soft-md md:px-8">
              <span className="font-pixel text-lg uppercase tracking-wider text-primary drop-shadow-[0_0_8px_rgba(57,255,20,0.6)]">
                KRVOU
              </span>
              <div
                className="flex size-9 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10 ring-2 ring-primary/20"
                aria-label="Perfil do usuário (preview)"
              >
                <User className="size-4 text-white/70" />
              </div>
            </div>
            <p className="text-xs text-on-surface-variant-light">
              Mesmo chrome do <code>TopBar</code> com avatar redondo{" "}
              <code>size-9</code> e <code>ring-2 ring-primary/20</code>.
            </p>
          </div>

          {/* BottomNavBar preview */}
          <div className="space-y-3">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-on-surface-variant-light">
              BottomNavBar (mobile) · floating pill + FAB
            </h3>
            <div className="flex items-center justify-center rounded-card bg-surface-lowest-light px-4 pb-10 pt-16">
              <div className="relative w-full max-w-[360px]">
                <div
                  aria-label="Criar bolão (preview)"
                  className="absolute left-1/2 -top-8 z-20 flex size-16 -translate-x-1/2 items-center justify-center rounded-full bg-primary shadow-neon-glow-strong"
                >
                  <Plus className="size-7 text-hero-surface" strokeWidth={3} />
                </div>
                <nav className="relative z-10 flex w-full items-center justify-around rounded-card-xl border border-white/5 bg-[#0d0118] px-4 py-4 shadow-2xl">
                  <span
                    aria-label="Home"
                    className="flex items-center justify-center rounded-full p-2 text-primary"
                  >
                    <Home className="size-6" />
                  </span>
                  <span
                    aria-label="Palpites"
                    className="flex items-center justify-center rounded-full p-2 text-white/40"
                  >
                    <Target className="size-6" />
                  </span>
                  <div className="w-12" aria-hidden="true" />
                  <span
                    aria-label="Ranking"
                    className="flex items-center justify-center rounded-full p-2 text-white/40"
                  >
                    <Trophy className="size-6" />
                  </span>
                  <span
                    aria-label="Perfil"
                    className="flex items-center justify-center rounded-full p-2 text-white/40 opacity-50"
                  >
                    <User className="size-6" />
                  </span>
                </nav>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant-light">
              <code>bg-[#0d0118]</code> · <code>rounded-card-xl</code> · FAB
              verde neon <code>size-16</code> com{" "}
              <code>shadow-neon-glow-strong</code> · 4 slots laterais + spacer
              central · ícones-only.
            </p>
          </div>
        </section>

        {/* ================================================
            Neon Arcade Terminal — Legado (preservado para migração gradual)
            ================================================ */}
        <div className="space-y-2 border-t-2 border-dashed border-outline-variant pt-8">
          <span className="font-heading text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            Legado · arcade terminal
          </span>
          <h2 className="font-pixel text-xl text-secondary">
            Sistema atual (features)
          </h2>
          <p className="text-sm text-on-surface-variant">
            Tokens e componentes do “Neon Arcade Terminal” ainda em uso pelas
            features. Serão migrados em issues subsequentes.
          </p>
        </div>

        {/* Typography */}
        <section className="space-y-4">
          <h2 className="font-heading text-xl font-bold text-secondary">
            Tipografia
          </h2>
          <div className="space-y-3 bg-surface-container p-6">
            <p className="font-pixel text-xl text-primary">
              Press Start 2P — Display / Logo / Scores
            </p>
            <p className="font-heading text-2xl font-bold text-secondary">
              Space Grotesk — Headlines / Labels / Nav
            </p>
            <p className="font-sans text-base text-on-surface">
              Inter — Body text, descricoes, dados do sistema. A legibilidade e
              prioridade.
            </p>
            <p className="font-sans text-sm text-on-surface-variant">
              Inter (variant) — Texto secundario, metadados, timestamps.
            </p>
          </div>
        </section>

        {/* Colors */}
        <section className="space-y-4">
          <h2 className="font-heading text-xl font-bold text-secondary">
            Paleta de Cores
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {colors.map((c) => (
              <div key={c.name} className="space-y-1">
                <div
                  className="h-16 border-2 border-outline-variant"
                  style={{ backgroundColor: c.var }}
                />
                <p className="font-heading text-xs text-on-surface-variant">
                  {c.name}
                </p>
                <p className="font-mono text-[10px] text-on-surface-variant/60">
                  {c.var}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-4">
          <h2 className="font-heading text-xl font-bold text-secondary">
            Botoes Arcade
          </h2>
          <div className="space-y-6 bg-surface-container p-6">
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="default">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="tertiary">Tertiary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button disabled>Disabled</Button>
            </div>
          </div>
        </section>

        {/* Inputs */}
        <section className="space-y-4">
          <h2 className="font-heading text-xl font-bold text-secondary">
            Inputs
          </h2>
          <div className="max-w-md space-y-4 bg-surface-container p-6">
            <div className="space-y-1">
              <label className="font-heading text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Nome do bolao
              </label>
              <Input placeholder="Ex: Bolao da Copa 2026" />
            </div>
            <div className="space-y-1">
              <label className="font-heading text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Email
              </label>
              <Input type="email" placeholder="seu@email.com" />
            </div>
            <div className="space-y-1">
              <label className="font-heading text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Com erro
              </label>
              <Input aria-invalid="true" defaultValue="valor invalido" />
            </div>
            <div className="space-y-1">
              <label className="font-heading text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Desabilitado
              </label>
              <Input disabled placeholder="Campo desabilitado" />
            </div>
          </div>
        </section>

        {/* Toast */}
        <section className="space-y-4">
          <h2 className="font-heading text-xl font-bold text-secondary">
            Toast (C36)
          </h2>
          <div className="flex flex-wrap gap-3 bg-surface-container p-6">
            <Button
              size="sm"
              onClick={() => toast.success("Bolao criado com sucesso!")}
            >
              Success
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => toast.error("Erro ao salvar palpite.")}
            >
              Error
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                toast.info("Voce tem 3 dias para registrar seus palpites.")
              }
            >
              Info
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                toast.warning("O bolao sera encerrado em 24 horas.")
              }
            >
              Warning
            </Button>
          </div>
        </section>

        {/* ConfirmModal (C37) */}
        <section className="space-y-4">
          <h2 className="font-heading text-xl font-bold text-secondary">
            ConfirmModal (C37)
          </h2>
          <div className="flex flex-wrap gap-3 bg-surface-container p-6">
            <AlertDialog>
              <AlertDialogTrigger
                render={<Button variant="destructive">Encerrar Bolao</Button>}
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Encerrar bolao?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Essa acao nao pode ser desfeita. O ranking final sera
                    calculado e o campeao definido.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => toast.success("Bolao encerrado!")}
                  >
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger
                render={<Button variant="outline">Remover Participante</Button>}
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remover participante?</AlertDialogTitle>
                  <AlertDialogDescription>
                    O participante perdera acesso ao bolao e seus palpites serao
                    removidos.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => toast.success("Participante removido.")}
                  >
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </section>

        {/* LoadingState (C38) */}
        <section className="space-y-4">
          <h2 className="font-heading text-xl font-bold text-secondary">
            LoadingState (C38)
          </h2>
          <div className="grid grid-cols-3 gap-6 bg-surface-container p-6">
            <div className="flex flex-col items-center gap-2">
              <LoadingState size="sm" text="" />
              <p className="text-xs text-on-surface-variant">Small</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <LoadingState size="default" />
              <p className="text-xs text-on-surface-variant">Default</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <LoadingState size="lg" text="Processando..." />
              <p className="text-xs text-on-surface-variant">Large</p>
            </div>
          </div>
        </section>

        {/* ErrorState (C39) */}
        <section className="space-y-4">
          <h2 className="font-heading text-xl font-bold text-secondary">
            ErrorState (C39)
          </h2>
          <div className="bg-surface-container p-6">
            <ErrorState
              title="Falha ao carregar bolao"
              message="Nao foi possivel conectar ao servidor. Verifique sua conexao e tente novamente."
              onRetry={() => toast.info("Tentando novamente...")}
            />
          </div>
        </section>

        {/* Surface Hierarchy */}
        <section className="space-y-4">
          <h2 className="font-heading text-xl font-bold text-secondary">
            Hierarquia de Superficies
          </h2>
          <div className="space-y-2">
            <div className="bg-surface-lowest p-4">
              <p className="text-sm text-on-surface-variant">
                surface-lowest (#190032)
              </p>
            </div>
            <div className="bg-surface-low p-4">
              <p className="text-sm text-on-surface-variant">
                surface-low (#280e40)
              </p>
            </div>
            <div className="bg-background p-4">
              <p className="text-sm text-on-surface-variant">
                background / surface (#1f0438)
              </p>
            </div>
            <div className="bg-surface-container p-4">
              <p className="text-sm text-on-surface-variant">
                surface-container (#2c1245)
              </p>
            </div>
            <div className="bg-surface-high p-4">
              <p className="text-sm text-on-surface-variant">
                surface-high (#371e50)
              </p>
            </div>
            <div className="bg-surface-highest p-4">
              <p className="text-sm text-on-surface-variant">
                surface-highest (#43295b)
              </p>
            </div>
            <div className="bg-surface-bright p-4">
              <p className="text-sm text-on-surface-variant">
                surface-bright (#472d60)
              </p>
            </div>
          </div>
        </section>

        {/* 4px Offset Demo */}
        <section className="space-y-4">
          <h2 className="font-heading text-xl font-bold text-secondary">
            4px Offset — Signature Move
          </h2>
          <div className="flex flex-wrap gap-8 bg-surface-container p-6">
            <div className="bg-primary p-6 text-primary-foreground shadow-arcade-primary">
              <p className="font-heading text-sm font-bold">Primary Card</p>
            </div>
            <div className="bg-secondary-container p-6 text-secondary-foreground shadow-arcade-secondary">
              <p className="font-heading text-sm font-bold">Secondary Card</p>
            </div>
            <div className="border-2 border-outline-variant bg-surface-highest p-6 shadow-arcade-dark">
              <p className="font-heading text-sm font-bold text-foreground">
                Surface Card
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t-2 border-outline-variant pt-6 text-center">
          <p className="font-pixel text-[10px] text-on-surface-variant/50">
            KRVOU DESIGN SYSTEM v1.0
          </p>
        </footer>
      </div>
    </div>
  );
}
