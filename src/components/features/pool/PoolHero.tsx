import { Card, CardAura } from "@/components/ui/card";

interface PoolHeroProps {
  poolName: string;
  participantCount: number;
  categoryCount: number;
  roundCount?: number;
}

interface StatProps {
  value: number | string;
  label: string;
}

function Stat({ value, label }: StatProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-pixel text-xl text-primary leading-none">
        {value}
      </span>
      <span className="font-heading text-[9px] text-on-surface-variant uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

/**
 * PoolHero — Hero editorial do painel do bolão.
 * Dark hero card com aura neon + nome do bolão + stats editoriais.
 *
 * Server Component (sem state).
 */
export function PoolHero({
  poolName,
  participantCount,
  categoryCount,
  roundCount,
}: PoolHeroProps) {
  return (
    <Card variant="hero" padding="lg">
      <CardAura />
      <div className="relative flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span className="font-heading text-[10px] text-primary uppercase tracking-widest">
            Painel do Participante
          </span>
          <h1 className="font-heading text-2xl font-bold text-on-surface leading-tight">
            {poolName}
          </h1>
        </div>

        <div className="flex flex-wrap gap-6">
          <Stat
            value={participantCount}
            label={participantCount === 1 ? "Participante" : "Participantes"}
          />
          <Stat
            value={categoryCount}
            label={categoryCount === 1 ? "Categoria" : "Categorias"}
          />
          {typeof roundCount === "number" && (
            <Stat
              value={roundCount}
              label={roundCount === 1 ? "Rodada" : "Rodadas"}
            />
          )}
        </div>
      </div>
    </Card>
  );
}
