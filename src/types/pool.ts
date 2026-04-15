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
