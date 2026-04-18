"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScoreInput } from "@/components/features/pool/bet/ScoreInput";

export interface MatchData {
  id: string;
  homeTeam: string;
  awayTeam: string;
  kickoff: string; // já formatado (ex: "Sab 20h")
  homeScore?: number | null;
  awayScore?: number | null;
}

interface MatchCardProps {
  match: MatchData;
  onSave?: (payload: {
    matchId: string;
    homeScore: number | null;
    awayScore: number | null;
  }) => void;
  disabled?: boolean;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 3).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function TeamCrest({ name }: { name: string }) {
  return (
    <div
      aria-hidden="true"
      className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-xs font-bold text-primary-dim"
    >
      {getInitials(name)}
    </div>
  );
}

/**
 * MatchCard — Card editorial para registrar palpite de uma partida.
 * Visual-only. Controla o próprio state local; dispara `onSave` com o payload.
 * Issue-09 plugará ação de servidor + coleta agregada via `SubmitBetsBar`.
 */
export function MatchCard({ match, onSave, disabled }: MatchCardProps) {
  const [homeScore, setHomeScore] = useState<number | null>(
    match.homeScore ?? null
  );
  const [awayScore, setAwayScore] = useState<number | null>(
    match.awayScore ?? null
  );

  const canSave =
    !disabled && homeScore !== null && awayScore !== null;

  function handleSave() {
    onSave?.({ matchId: match.id, homeScore, awayScore });
  }

  return (
    <Card padding="default">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-heading text-[10px] uppercase tracking-widest text-on-surface-variant-light">
            {match.kickoff}
          </span>
          <span className="font-heading text-[10px] uppercase tracking-widest text-on-surface-variant-light">
            Palpite
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-1 items-center gap-3 min-w-0">
            <TeamCrest name={match.homeTeam} />
            <span className="font-heading text-sm font-bold text-on-surface-light truncate">
              {match.homeTeam}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <ScoreInput
              value={homeScore}
              onChange={setHomeScore}
              disabled={disabled}
              aria-label={`Placar de ${match.homeTeam}`}
            />
            <span className="font-pixel text-xs text-on-surface-variant-light">
              ×
            </span>
            <ScoreInput
              value={awayScore}
              onChange={setAwayScore}
              disabled={disabled}
              aria-label={`Placar de ${match.awayTeam}`}
            />
          </div>

          <div className="flex flex-1 items-center justify-end gap-3 min-w-0">
            <span className="font-heading text-sm font-bold text-on-surface-light truncate text-right">
              {match.awayTeam}
            </span>
            <TeamCrest name={match.awayTeam} />
          </div>
        </div>

        <Button
          variant="pill"
          size="default"
          className="w-full"
          disabled={!canSave}
          onClick={handleSave}
        >
          Salvar palpite
        </Button>
      </div>
    </Card>
  );
}
