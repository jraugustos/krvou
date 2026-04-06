"use server";

import { prisma } from "@/lib/prisma";
import type { PoolCardData, PoolStatus } from "@/types/pool";

function getContextInfo(
  status: string,
  totalScore: number,
  rankPosition: number
): string {
  switch (status) {
    case "open":
      return "Aguardando inicio";
    case "in_progress":
      return `Sua posicao: ${rankPosition}o — ${totalScore} pts`;
    case "finished":
      return rankPosition === 1
        ? "Resultado final: Campeao!"
        : `Resultado final: ${rankPosition}o lugar`;
    default:
      return "";
  }
}

function getPoolHref(
  poolId: string,
  role: string,
  status: string
): string {
  if (status === "finished") {
    return `/pool/${poolId}`;
  }
  if (role === "admin") {
    return `/pool/${poolId}/admin`;
  }
  return `/pool/${poolId}`;
}

function getRankPosition(
  members: { userId: string; totalScore: number }[],
  userId: string
): number {
  const sorted = [...members].sort((a, b) => b.totalScore - a.totalScore);
  const index = sorted.findIndex((m) => m.userId === userId);
  return index + 1;
}

export async function getUserPools(
  userId: string
): Promise<PoolCardData[]> {
  const memberships = await prisma.poolMember.findMany({
    where: { userId },
    include: {
      pool: {
        include: {
          members: {
            select: { userId: true, totalScore: true },
          },
        },
      },
    },
    orderBy: { pool: { updatedAt: "desc" } },
  });

  return memberships.map((membership) => {
    const { pool } = membership;
    const rankPosition = getRankPosition(pool.members, userId);

    return {
      id: pool.id,
      title: pool.name,
      participantCount: pool.members.length,
      status: pool.status as PoolStatus,
      contextInfo: getContextInfo(
        pool.status,
        membership.totalScore,
        rankPosition
      ),
      href: getPoolHref(pool.id, membership.role, pool.status),
    };
  });
}
