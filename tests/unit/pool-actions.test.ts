import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock prisma
const mockFindMany = vi.fn();
vi.mock("@/lib/prisma", () => ({
  prisma: {
    poolMember: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
    },
  },
}));

import { getUserPools } from "@/actions/pool";

function makeMembership(overrides: {
  poolId?: string;
  poolName?: string;
  poolStatus?: string;
  role?: string;
  totalScore?: number;
  members?: { userId: string; totalScore: number }[];
}) {
  const poolId = overrides.poolId ?? "pool-1";
  const userId = "user-1";
  return {
    id: `member-${poolId}`,
    role: overrides.role ?? "participant",
    totalScore: overrides.totalScore ?? 0,
    userId,
    poolId,
    joinedAt: new Date(),
    pool: {
      id: poolId,
      name: overrides.poolName ?? "Test Pool",
      description: null,
      status: overrides.poolStatus ?? "open",
      inviteCode: `invite-${poolId}`,
      creatorId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      members: overrides.members ?? [{ userId, totalScore: 0 }],
    },
  };
}

describe("getUserPools", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty array when user has no pools", async () => {
    mockFindMany.mockResolvedValueOnce([]);

    const result = await getUserPools("user-1");
    expect(result).toEqual([]);
  });

  it("returns pool data with correct fields", async () => {
    mockFindMany.mockResolvedValueOnce([
      makeMembership({
        poolId: "pool-1",
        poolName: "Copa do Mundo",
        poolStatus: "open",
        members: [
          { userId: "user-1", totalScore: 0 },
          { userId: "user-2", totalScore: 0 },
        ],
      }),
    ]);

    const result = await getUserPools("user-1");
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: "pool-1",
      title: "Copa do Mundo",
      participantCount: 2,
      status: "open",
      contextInfo: "Aguardando inicio",
      href: "/pool/pool-1",
    });
  });

  it('shows "Aguardando inicio" for open pools', async () => {
    mockFindMany.mockResolvedValueOnce([
      makeMembership({ poolStatus: "open" }),
    ]);

    const result = await getUserPools("user-1");
    expect(result[0].contextInfo).toBe("Aguardando inicio");
  });

  it("shows rank and score for in_progress pools", async () => {
    mockFindMany.mockResolvedValueOnce([
      makeMembership({
        poolStatus: "in_progress",
        totalScore: 45,
        members: [
          { userId: "user-2", totalScore: 60 },
          { userId: "user-1", totalScore: 45 },
          { userId: "user-3", totalScore: 30 },
        ],
      }),
    ]);

    const result = await getUserPools("user-1");
    expect(result[0].contextInfo).toBe("Sua posicao: 2o — 45 pts");
  });

  it('shows "Campeao!" for 1st place in finished pools', async () => {
    mockFindMany.mockResolvedValueOnce([
      makeMembership({
        poolStatus: "finished",
        totalScore: 100,
        members: [
          { userId: "user-1", totalScore: 100 },
          { userId: "user-2", totalScore: 80 },
        ],
      }),
    ]);

    const result = await getUserPools("user-1");
    expect(result[0].contextInfo).toBe("Resultado final: Campeao!");
  });

  it("shows placement for non-1st in finished pools", async () => {
    mockFindMany.mockResolvedValueOnce([
      makeMembership({
        poolStatus: "finished",
        totalScore: 80,
        members: [
          { userId: "user-2", totalScore: 100 },
          { userId: "user-1", totalScore: 80 },
          { userId: "user-3", totalScore: 50 },
        ],
      }),
    ]);

    const result = await getUserPools("user-1");
    expect(result[0].contextInfo).toBe("Resultado final: 2o lugar");
  });

  it("returns /pool/[id]/admin href for admin role", async () => {
    mockFindMany.mockResolvedValueOnce([
      makeMembership({
        poolId: "pool-1",
        role: "admin",
        poolStatus: "open",
      }),
    ]);

    const result = await getUserPools("user-1");
    expect(result[0].href).toBe("/pool/pool-1/admin");
  });

  it("returns /pool/[id] href for participant role", async () => {
    mockFindMany.mockResolvedValueOnce([
      makeMembership({
        poolId: "pool-1",
        role: "participant",
        poolStatus: "in_progress",
      }),
    ]);

    const result = await getUserPools("user-1");
    expect(result[0].href).toBe("/pool/pool-1");
  });

  it("returns /pool/[id] href for finished pools regardless of role", async () => {
    mockFindMany.mockResolvedValueOnce([
      makeMembership({
        poolId: "pool-1",
        role: "admin",
        poolStatus: "finished",
      }),
    ]);

    const result = await getUserPools("user-1");
    expect(result[0].href).toBe("/pool/pool-1");
  });

  it("queries prisma with correct parameters", async () => {
    mockFindMany.mockResolvedValueOnce([]);

    await getUserPools("user-1");

    expect(mockFindMany).toHaveBeenCalledWith({
      where: { userId: "user-1" },
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
  });
});
