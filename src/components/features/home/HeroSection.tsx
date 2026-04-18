import { Trophy } from "lucide-react";
import { Card, CardAura } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { UpcomingGame } from "@/types/home";

interface HeroSectionProps {
  userName?: string | null;
  upcomingGames: UpcomingGame[];
}

function formatKickoff(kickoff: Date): string {
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  return formatter.format(kickoff).replace(/\.$/, "");
}

/**
 * Hero dark da home autenticada.
 *
 * Exibe greeting com o primeiro nome do usuario (ou apenas "Ola." como
 * fallback) e lista ate 3 jogos proximos dentro de um bloco glassmorphism.
 *
 * Referencia: Stitch "MEUS PALPITES" (organismos mobile).
 */
export function HeroSection({ userName, upcomingGames }: HeroSectionProps) {
  const firstName = userName?.trim().split(/\s+/)[0];
  const greeting = firstName ? (
    <>
      Ola, <span className="text-primary">{firstName}</span>.
    </>
  ) : (
    <>Ola.</>
  );

  const hasGames = upcomingGames.length > 0;

  return (
    <Card variant="hero" padding="lg" className="mb-6">
      <CardAura />
      <div className="relative flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <h2 className="font-heading text-2xl font-bold leading-tight text-on-surface">
            {greeting}
          </h2>
          <p className="text-sm text-on-surface-variant">
            Proximos jogos na sua lista
          </p>
        </div>

        <div
          className={cn(
            "rounded-card border border-white/5 bg-white/5 p-4 backdrop-blur-md",
            !hasGames && "flex items-center justify-center"
          )}
        >
          {hasGames ? (
            <ul className="flex flex-col divide-y divide-white/5">
              {upcomingGames.map((game) => (
                <li
                  key={game.id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary"
                    aria-hidden="true"
                  >
                    <Trophy className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-heading text-sm font-bold uppercase tracking-wide text-on-surface">
                      {game.homeTeam} <span className="text-on-surface-variant">x</span>{" "}
                      {game.awayTeam}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-on-surface-variant">
                      {formatKickoff(game.kickoff)}
                      {game.poolName ? ` — ${game.poolName}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-2 text-center text-sm text-on-surface-variant">
              Sem jogos proximos por enquanto.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
