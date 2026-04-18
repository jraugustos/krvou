import { CheckCircle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ResultComparisonData } from "@/types/pool";

interface ResultComparisonCardsProps {
  results: ResultComparisonData[];
}

export function ResultComparisonCards({ results }: ResultComparisonCardsProps) {
  if (results.length === 0) {
    return (
      <Card padding="lg">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="font-heading text-sm font-bold uppercase tracking-widest text-on-surface-variant-light">
            Aguardando resultados
          </span>
          <p className="font-sans text-xs text-on-surface-variant-light">
            O administrador do bolão ainda não inseriu resultados.
          </p>
        </div>
      </Card>
    );
  }

  const totalPoints = results.reduce(
    (sum, r) => sum + (r.pointsEarned ?? 0),
    0
  );
  const hits = results.filter((r) => (r.pointsEarned ?? 0) > 0).length;

  return (
    <div className="flex flex-col gap-4">
      {/* Resumo */}
      <Card padding="default">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-heading text-[10px] uppercase tracking-widest text-on-surface-variant-light">
              Acertos
            </span>
            <span className="font-pixel text-lg text-primary-dim leading-none">
              {hits}/{results.length}
            </span>
          </div>
          <div className="h-10 w-px bg-outline-variant-light" />
          <div className="flex flex-col items-end gap-1">
            <span className="font-heading text-[10px] uppercase tracking-widest text-on-surface-variant-light">
              Pontos
            </span>
            <span className="font-pixel text-lg text-primary-dim leading-none">
              {totalPoints}
            </span>
          </div>
        </div>
      </Card>

      {/* Cards individuais */}
      <div className="flex flex-col gap-3">
        {results.map((result) => {
          const hit = (result.pointsEarned ?? 0) > 0;
          const noBet = result.betValue === null;

          return (
            <Card
              key={result.id}
              padding="default"
              className={cn(
                "border-l-4",
                hit ? "border-l-primary" : "border-l-destructive"
              )}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-heading text-sm font-bold text-on-surface-light truncate">
                    {result.name}
                  </span>
                  {hit ? (
                    <CheckCircle className="size-4 shrink-0 text-primary-dim" />
                  ) : (
                    <XCircle className="size-4 shrink-0 text-destructive" />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-heading text-[9px] uppercase tracking-widest text-on-surface-variant-light">
                      Resultado
                    </span>
                    <span className="font-sans text-sm font-medium text-on-surface-light">
                      {result.resultValue}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-heading text-[9px] uppercase tracking-widest text-on-surface-variant-light">
                      Seu palpite
                    </span>
                    <span
                      className={cn(
                        "font-sans text-sm",
                        noBet
                          ? "italic text-on-surface-variant-light"
                          : hit
                          ? "font-medium text-primary-dim"
                          : "font-medium text-destructive"
                      )}
                    >
                      {result.betValue ?? "Sem palpite"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-outline-variant-light pt-2">
                  <span className="font-heading text-[9px] uppercase tracking-widest text-on-surface-variant-light">
                    Pontos
                  </span>
                  <span
                    className={cn(
                      "rounded-pill px-3 py-0.5 font-heading text-[10px] font-bold uppercase tracking-widest",
                      hit
                        ? "bg-primary/10 text-primary-dim"
                        : "bg-destructive/10 text-destructive"
                    )}
                  >
                    +{result.pointsEarned ?? 0}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
