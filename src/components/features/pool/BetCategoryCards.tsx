"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { BetCategoryData } from "@/types/pool";

interface BetCategoryCardsProps {
  categories: BetCategoryData[];
  poolId: string;
}

function isExpired(deadline: Date | null): boolean {
  if (!deadline) return false;
  return new Date() > new Date(deadline);
}

function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-heading text-[10px] text-on-surface-variant-light uppercase tracking-widest">
          Progresso
        </span>
        <span className="font-pixel text-[10px] text-primary-dim">
          {done}/{total}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-pill bg-primary/10">
        <div
          className="h-full rounded-pill bg-primary shadow-neon-glow-sm transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function BetCategoryCards({ categories, poolId }: BetCategoryCardsProps) {
  const router = useRouter();

  const done = categories.filter((c) => c.status === "feito").length;
  const total = categories.length;

  function handleCategoryClick(category: BetCategoryData) {
    const locked = category.isLocked || isExpired(category.deadline);
    if (locked) {
      toast.error("Palpites encerrados para esta categoria");
      return;
    }
    router.push(`/pool/${poolId}/bet/${category.id}`);
  }

  if (categories.length === 0) {
    return (
      <Card padding="default">
        <p className="text-center text-sm text-on-surface-variant-light">
          Nenhuma categoria disponível.
        </p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ProgressBar done={done} total={total} />

      <div className="flex flex-col gap-3">
        {categories.map((category) => {
          const locked = category.isLocked || isExpired(category.deadline);
          const isFeit = category.status === "feito";

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryClick(category)}
              className={cn(
                "group flex items-center gap-3 rounded-card border-l-4 bg-surface-lowest-light p-4 text-left shadow-drop-soft transition-all",
                isFeit ? "border-l-primary" : "border-l-destructive",
                !locked && "hover:-translate-y-0.5 hover:shadow-drop-soft-md",
                locked && "cursor-not-allowed opacity-60"
              )}
              aria-disabled={locked || undefined}
            >
              <div className="flex flex-1 flex-col gap-1 min-w-0">
                <span className="font-heading text-sm font-bold text-on-surface-light truncate">
                  {category.name}
                </span>
                <span
                  className={cn(
                    "font-sans text-xs truncate",
                    isFeit
                      ? "text-on-surface-variant-light"
                      : "italic text-on-surface-variant-light"
                  )}
                >
                  {category.betValue ?? "Nenhum palpite"}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={cn(
                    "rounded-pill px-3 py-1 font-heading text-[9px] uppercase tracking-widest",
                    isFeit
                      ? "bg-primary/10 text-primary-dim"
                      : "bg-destructive/10 text-destructive"
                  )}
                >
                  {isFeit ? "Feito" : "Pendente"}
                </span>
                {locked ? (
                  <Lock className="size-4 text-on-surface-variant-light" />
                ) : (
                  <ChevronRight className="size-4 text-on-surface-variant-light transition-transform group-hover:translate-x-0.5" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
