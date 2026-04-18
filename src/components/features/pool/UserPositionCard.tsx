import { Card, CardAura } from "@/components/ui/card";

interface UserPositionCardProps {
  rank: number;
  score: number;
  leaderScore: number;
}

function getOrdinal(n: number): string {
  return `${n}º`;
}

/**
 * UserPositionCard — Bloco de gamification editorial.
 * Card stat (dark) + aura neon + grid glassmorphism (4 células).
 */
export function UserPositionCard({
  rank,
  score,
  leaderScore,
}: UserPositionCardProps) {
  const diff = leaderScore - score;
  const isLeader = diff === 0 || rank === 1;
  const nextTarget = Math.max(0, diff);

  return (
    <Card variant="stat" padding="lg">
      <CardAura className="-left-10 -top-10" />
      <div className="relative flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <span className="font-heading text-[10px] text-primary uppercase tracking-widest">
            Sua posição
          </span>
          <span className="font-heading text-[10px] text-on-surface-variant uppercase tracking-widest">
            {isLeader ? "Liderando" : `-${diff} pts do líder`}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-card border border-white/5 bg-white/5 p-4 backdrop-blur-md">
            <p className="font-heading text-[10px] uppercase tracking-widest text-on-surface-variant">
              Ranking
            </p>
            <p className="mt-1 font-pixel text-lg text-primary">
              {getOrdinal(rank)}
            </p>
          </div>
          <div className="rounded-card border border-white/5 bg-white/5 p-4 backdrop-blur-md">
            <p className="font-heading text-[10px] uppercase tracking-widest text-on-surface-variant">
              Pontuação
            </p>
            <p className="mt-1 font-pixel text-lg text-primary">{score}</p>
          </div>
          <div className="rounded-card border border-white/5 bg-white/5 p-4 backdrop-blur-md">
            <p className="font-heading text-[10px] uppercase tracking-widest text-on-surface-variant">
              Líder
            </p>
            <p className="mt-1 font-pixel text-lg text-secondary">
              {leaderScore}
            </p>
          </div>
          <div className="rounded-card border border-white/5 bg-white/5 p-4 backdrop-blur-md">
            <p className="font-heading text-[10px] uppercase tracking-widest text-on-surface-variant">
              Próximo alvo
            </p>
            <p className="mt-1 font-pixel text-lg text-primary">
              {isLeader ? "—" : `+${nextTarget}`}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
