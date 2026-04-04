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
            <div className="bg-primary p-6 text-primary-foreground shadow-[4px_4px_0px_0px_#2ae500]">
              <p className="font-heading text-sm font-bold">Primary Card</p>
            </div>
            <div className="bg-secondary-container p-6 text-secondary-foreground shadow-[4px_4px_0px_0px_#b8b603]">
              <p className="font-heading text-sm font-bold">Secondary Card</p>
            </div>
            <div className="border-2 border-outline-variant bg-surface-highest p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
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
