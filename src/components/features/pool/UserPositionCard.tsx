import { cn } from "@/lib/utils";

interface UserPositionCardProps {
  rank: number;
  score: number;
  leaderScore: number;
}

function getOrdinal(n: number): string {
  return `${n}º`;
}

export function UserPositionCard({ rank, score, leaderScore }: UserPositionCardProps) {
  const diff = leaderScore - score;
  const isLeader = diff === 0;

  return (
    <div
      className={cn(
        "relative flex items-center gap-5 border-2 border-tertiary p-5 shadow-arcade-dark",
        "bg-gradient-to-br from-surface-high to-surface-container overflow-hidden"
      )}
    >
      {/* Decoração de fundo */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-tertiary/10" />

      {/* Posição */}
      <div className="flex flex-col items-center gap-1 min-w-[56px]">
        <span className="font-pixel text-2xl text-secondary leading-none">
          {getOrdinal(rank)}
        </span>
        <span className="font-heading text-[9px] text-on-surface-variant uppercase tracking-widest">
          Lugar
        </span>
      </div>

      {/* Divisor */}
      <div className="h-12 w-[2px] bg-outline-variant" />

      {/* Pontuação e diff */}
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className="font-pixel text-xl text-primary leading-none">
            {score}
          </span>
          <span className="font-heading text-[9px] text-on-surface-variant uppercase tracking-widest">
            pts
          </span>
        </div>
        <p className="font-sans text-[11px] text-on-surface-variant">
          {isLeader
            ? "Você está em primeiro 🏆"
            : `−${diff} pts para o líder`}
        </p>
      </div>
    </div>
  );
}
