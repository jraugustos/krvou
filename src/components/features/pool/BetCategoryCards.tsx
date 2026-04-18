"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock, ChevronRight } from "lucide-react";
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
        <span className="font-heading text-[10px] text-on-surface-variant uppercase tracking-widest">
          Progresso
        </span>
        <span className="font-pixel text-[10px] text-primary">
          {done}/{total}
        </span>
      </div>
      <div className="h-2 w-full bg-surface-highest border border-outline-variant overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-500"
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
      <div className="border-2 border-outline-variant p-5 text-center">
        <p className="font-sans text-sm text-on-surface-variant">
          Nenhuma categoria disponível.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ProgressBar done={done} total={total} />

      <div className="flex flex-col gap-2">
        {categories.map((category) => {
          const locked = category.isLocked || isExpired(category.deadline);
          const isFeit = category.status === "feito";

          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className={cn(
                "flex items-center gap-3 border-2 border-outline-variant p-4 text-left transition-colors",
                "border-l-[3px]",
                isFeit
                  ? "border-l-primary bg-surface-container hover:bg-surface-high"
                  : "border-l-destructive bg-surface-container hover:bg-surface-high",
                locked && "opacity-60 cursor-not-allowed"
              )}
            >
              {/* Info */}
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <span className="font-heading text-sm text-on-surface truncate">
                  {category.name}
                </span>
                <span
                  className={cn(
                    "font-sans text-xs truncate",
                    isFeit ? "text-primary" : "text-on-surface-variant italic"
                  )}
                >
                  {category.betValue ?? "Nenhum palpite"}
                </span>
              </div>

              {/* Badge status + chevron */}
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={cn(
                    "font-heading text-[9px] uppercase tracking-widest px-2 py-1 border",
                    isFeit
                      ? "text-primary border-primary bg-primary/10"
                      : "text-destructive border-destructive bg-destructive/10"
                  )}
                >
                  {isFeit ? "Feito" : "Pendente"}
                </span>
                {locked ? (
                  <Lock className="size-3.5 text-on-surface-variant" />
                ) : (
                  <ChevronRight className="size-3.5 text-on-surface-variant" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
