import { z } from "zod";

export const PoolStatusSchema = z.enum(["open", "in_progress", "finished"]);
export type PoolStatus = z.infer<typeof PoolStatusSchema>;

export const PoolMemberRoleSchema = z.enum(["admin", "participant"]);
export type PoolMemberRole = z.infer<typeof PoolMemberRoleSchema>;

export interface PoolCardData {
  id: string;
  title: string;
  participantCount: number;
  status: PoolStatus;
  contextInfo: string;
  href: string;
}

export interface InvitePageData {
  poolId: string;
  poolName: string;
  creatorName: string;
  participantCount: number;
  categories: string[];
  status: PoolStatus;
}

// --- Painel do Participante (issue-08) ---

export interface RankingMember {
  id: string;
  userId: string;
  name: string;
  image: string | null;
  totalScore: number;
  rank: number;
}

export type BetStatus = "feito" | "pendente";

export interface BetCategoryData {
  id: string;
  name: string;
  type: string;
  isLocked: boolean;
  deadline: Date | null;
  status: BetStatus;
  betValue: string | null;
}

export interface ResultComparisonData {
  id: string;
  name: string;
  resultValue: string;
  betValue: string | null;
  pointsEarned: number | null;
}

export interface PoolPanelData {
  poolId: string;
  poolName: string;
  poolStatus: PoolStatus;
  currentUserId: string;
  ranking: RankingMember[];
  currentUserRank: RankingMember | null;
  leaderScore: number;
  betCategories: BetCategoryData[];
  results: ResultComparisonData[];
}
