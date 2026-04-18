"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SubmitBetsBarProps {
  filled: number;
  total: number;
  onSubmit?: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * SubmitBetsBar — Barra pill flutuante para submeter palpites da rodada.
 * Visual-only. Sticky em `bottom-24` (96px) para não sobrepor a BottomNavBar
 * flutuante (`bottom-6` / 24px) — ver D04 do PLAN.
 */
export function SubmitBetsBar({
  filled,
  total,
  onSubmit,
  disabled,
  className,
}: SubmitBetsBarProps) {
  const allFilled = total > 0 && filled === total;
  const submitDisabled = disabled || !allFilled;

  return (
    <div
      role="region"
      aria-label="Resumo e envio de palpites"
      className={cn(
        "fixed inset-x-4 bottom-24 z-40 flex items-center justify-between gap-3 rounded-pill bg-hero-surface p-2 pl-5 shadow-drop-soft-lg",
        className
      )}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="font-heading text-[9px] uppercase tracking-widest text-primary">
          Progresso
        </span>
        <span className="font-sans text-sm text-on-surface truncate">
          <span className="font-pixel text-xs text-primary">{filled}</span>
          <span className="mx-1 text-on-surface-variant">de</span>
          <span className="font-pixel text-xs text-primary">{total}</span>
          <span className="ml-2 text-on-surface-variant">preenchidos</span>
        </span>
      </div>

      <Button
        variant="pill"
        size="pill-lg"
        disabled={submitDisabled}
        onClick={onSubmit}
      >
        Registrar
      </Button>
    </div>
  );
}
