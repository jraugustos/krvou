/**
 * Home feature types.
 *
 * `UpcomingGame` representa um jogo mockado exibido no `HeroSection` da home
 * autenticada. Enquanto o schema nao possui a entidade `Match`, usamos esse
 * tipo em conjunto com `getUpcomingGamesMock` (ver `src/actions/home.ts`).
 *
 * TODO(design-refresh-followup): substituir por query real quando o backend
 * suportar `Match` e `Product` ganhar logo URL (ver PLAN `D03`/`D04`).
 */

export interface UpcomingGame {
  id: string;
  homeTeam: string;
  awayTeam: string;
  kickoff: Date;
  poolName?: string;
}

/**
 * Flag temporaria que indica que a lista de jogos proximos da home
 * provem de um mock local (o schema atual nao possui `Match`).
 *
 * Vive aqui em `types/home.ts` — e nao em `actions/home.ts` — porque
 * arquivos `"use server"` so podem exportar funcoes assincronas (regra do
 * Next.js App Router). Ao remover o mock, esta flag pode ser excluida junto.
 */
export const USE_UPCOMING_GAMES_MOCK = true;
