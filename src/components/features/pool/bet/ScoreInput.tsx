"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ScoreInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  "aria-label": string;
  disabled?: boolean;
  className?: string;
}

/**
 * ScoreInput — Input numérico pixel para placares.
 * Visual-only (consumido por issue-09). Quadrado, pixel font, focus com ring neon.
 *
 * D03: input nativo estilizado (sem variante `Input`) pois o caso é muito
 * específico (square, pixel font, grande).
 */
export function ScoreInput({
  value,
  onChange,
  disabled,
  className,
  ...rest
}: ScoreInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (raw === "") {
      onChange(null);
      return;
    }
    const n = Number.parseInt(raw, 10);
    if (Number.isNaN(n) || n < 0) return;
    onChange(n);
  }

  return (
    <input
      type="number"
      inputMode="numeric"
      min={0}
      step={1}
      value={value ?? ""}
      onChange={handleChange}
      disabled={disabled}
      aria-label={rest["aria-label"]}
      className={cn(
        "h-14 w-12 rounded-card border-2 border-outline-variant-light bg-surface-lowest-light text-center font-pixel text-xl text-on-surface-light outline-none transition-all",
        "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
        "focus:border-primary focus:ring-2 focus:ring-primary",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    />
  );
}
