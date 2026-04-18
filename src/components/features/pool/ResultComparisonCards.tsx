import { cn } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";
import type { ResultComparisonData } from "@/types/pool";

interface ResultComparisonCardsProps {
  results: ResultComparisonData[];
}

export function ResultComparisonCards({ results }: ResultComparisonCardsProps) {
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 border-2 border-outline-variant p-8 text-center">
        <span className="font-pixel text-xs text-on-surface-variant leading-relaxed">
          Nenhum resultado
          <br />
          inserido ainda
        </span>
        <p className="font-sans text-xs text-on-surface-variant">
          O administrador do bolão ainda não inseriu resultados.
        </p>
      </div>
    );
  }

  const totalPoints = results.reduce((sum, r) => sum + (r.pointsEarned ?? 0), 0);
  const hits = results.filter((r) => (r.pointsEarned ?? 0) > 0).length;

  return (
    <div className="flex flex-col gap-4">
      {/* Resumo */}
      <div className="flex items-center justify-between border-2 border-outline-variant bg-surface-container p-4">
        <div className="flex flex-col gap-0.5">
          <span className="font-heading text-[9px] text-on-surface-variant uppercase tracking-widest">
            Acertos
          </span>
          <span className="font-pixel text-lg text-secondary leading-none">
            {hits}/{results.length}
          </span>
        </div>
        <div className="h-8 w-[2px] bg-outline-variant" />
        <div className="flex flex-col gap-0.5 items-end">
          <span className="font-heading text-[9px] text-on-surface-variant uppercase tracking-widest">
            Pontos
          </span>
          <span className="font-pixel text-lg text-primary leading-none">
            {totalPoints}
          </span>
        </div>
      </div>

      {/* Cards individuais */}
      <div className="flex flex-col gap-2">
        {results.map((result) => {
          const hit = (result.pointsEarned ?? 0) > 0;
          const noBet = result.betValue === null;

          return (
            <div
              key={result.id}
              className={cn(
                "flex flex-col gap-3 border-2 border-outline-variant p-4",
                "border-l-[3px]",
                hit
                  ? "border-l-primary bg-surface-container"
                  : "border-l-destructive bg-surface-container"
              )}
            >
              {/* Nome da categoria */}
              <div className="flex items-center justify-between gap-2">
                <span className="font-heading text-sm text-on-surface">
                  {result.name}
                </span>
                {hit ? (
                  <CheckCircle className="size-4 text-primary shrink-0" />
                ) : (
                  <XCircle className="size-4 text-destructive shrink-0" />
                )}
              </div>

              {/* Comparação */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <span className="font-heading text-[9px] text-on-surface-variant uppercase tracking-widest">
                    Resultado
                  </span>
                  <span className="font-sans text-sm text-on-surface font-medium">
                    {result.resultValue}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-heading text-[9px] text-on-surface-variant uppercase tracking-widest">
                    Seu palpite
                  </span>
                  <span
                    className={cn(
                      "font-sans text-sm",
                      noBet
                        ? "text-on-surface-variant italic"
                        : hit
                        ? "text-primary font-medium"
                        : "text-destructive font-medium"
                    )}
                  >
                    {result.betValue ?? "Sem palpite"}
                  </span>
                </div>
              </div>

              {/* Pontuação */}
              <div className="flex items-center justify-end gap-2 border-t border-outline-variant pt-2">
                <span className="font-heading text-[9px] text-on-surface-variant uppercase tracking-widest">
                  Pontos:
                </span>
                <span
                  className={cn(
                    "font-pixel text-xs leading-none",
                    hit ? "text-primary" : "text-destructive"
                  )}
                >
                  +{result.pointsEarned ?? 0}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
