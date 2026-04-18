"use server";

import type { UpcomingGame } from "@/types/home";
import { USE_UPCOMING_GAMES_MOCK } from "@/types/home";

const MOCK_UPCOMING_GAMES: UpcomingGame[] = [
  {
    id: "mock-game-1",
    homeTeam: "Palmeiras",
    awayTeam: "Flamengo",
    kickoff: new Date("2026-04-20T20:00:00-03:00"),
    poolName: "Brasileirao 2026",
  },
  {
    id: "mock-game-2",
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    kickoff: new Date("2026-04-22T16:00:00-03:00"),
    poolName: "La Liga",
  },
  {
    id: "mock-game-3",
    homeTeam: "Sao Paulo",
    awayTeam: "Corinthians",
    kickoff: new Date("2026-04-24T21:30:00-03:00"),
    poolName: "Brasileirao 2026",
  },
];

/**
 * Retorna ate 3 jogos proximos mockados para o `HeroSection` da home.
 *
 * Enquanto `USE_UPCOMING_GAMES_MOCK = true`, devolve a lista estatica
 * local. O parametro `userId` e aceito para manter a assinatura quando
 * a query real for introduzida (filtrara por bolões do usuario).
 *
 * TODO(design-refresh-followup): substituir por query real quando o
 * backend introduzir a entidade `Match` (ver
 * `docs/issues/design-refresh-p03/PLAN.md` decisao D03).
 */
export async function getUpcomingGamesMock(
  userId: string
): Promise<UpcomingGame[]> {
  if (!USE_UPCOMING_GAMES_MOCK || !userId) {
    return [];
  }

  return MOCK_UPCOMING_GAMES.slice(0, 3);
}
