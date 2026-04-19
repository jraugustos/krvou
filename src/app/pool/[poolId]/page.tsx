import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardTopBar } from "@/components/layouts/DashboardTopBar";
import { BottomNavBar } from "@/components/layouts/BottomNavBar";
import { PoolPanelTabs } from "@/components/features/pool/PoolPanelTabs";
import type {
  PoolPanelData,
  RankingMember,
  BetCategoryData,
  ResultComparisonData,
  PoolStatus,
} from "@/types/pool";

// --- Dados mockados para Subtask V ---
// TODO(Subtask F): substituir por queries Prisma reais + calculateRanking()

function getMockRanking(currentUserId: string): RankingMember[] {
  return [
    { id: "m1", userId: currentUserId, name: "Você", image: null, totalScore: 42, rank: 1 },
    { id: "m2", userId: "u2", name: "Ana Lima", image: null, totalScore: 38, rank: 2 },
    { id: "m3", userId: "u3", name: "Carlos", image: null, totalScore: 38, rank: 2 },
    { id: "m4", userId: "u4", name: "Beatriz", image: null, totalScore: 25, rank: 4 },
    { id: "m5", userId: "u5", name: "Diego", image: null, totalScore: 10, rank: 5 },
  ];
}

function getMockBetCategories(): BetCategoryData[] {
  return [
    { id: "c1", name: "Campeão da Copa", type: "single_choice", isLocked: false, deadline: null, status: "feito", betValue: "Brasil" },
    { id: "c2", name: "Artilheiro", type: "single_choice", isLocked: false, deadline: null, status: "feito", betValue: "Mbappé" },
    { id: "c3", name: "Brasil x Argentina", type: "exact_score", isLocked: true, deadline: null, status: "feito", betValue: "2x1" },
    { id: "c4", name: "Segundo Lugar", type: "single_choice", isLocked: false, deadline: null, status: "pendente", betValue: null },
    { id: "c5", name: "Terceiro Lugar", type: "single_choice", isLocked: false, deadline: null, status: "pendente", betValue: null },
  ];
}

function getMockResults(): ResultComparisonData[] {
  return [
    { id: "r1", name: "Campeão da Copa", resultValue: "Brasil", betValue: "Brasil", pointsEarned: 10 },
    { id: "r2", name: "Brasil x Argentina", resultValue: "2x1", betValue: "2x1", pointsEarned: 5 },
    { id: "r3", name: "Artilheiro", resultValue: "Haaland", betValue: "Mbappé", pointsEarned: 0 },
  ];
}

export default async function PoolPanelPage({
  params,
}: {
  params: Promise<{ poolId: string }>;
}) {
  const { poolId } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth");
  }
  const userId = session.user.id;

  let pool: { id: string; name: string; status: string } | null = null;
  try {
    pool = await prisma.pool.findUnique({
      where: { id: poolId },
      select: { id: true, name: true, status: true },
    });
  } catch {
    notFound();
  }

  if (!pool) notFound();

  // Verificar se o usuário é membro
  const membership = await prisma.poolMember.findUnique({
    where: { userId_poolId: { userId, poolId } },
    select: { id: true },
  });

  if (!membership) {
    redirect("/home");
  }

  // --- Subtask V: dados mockados ---
  const mockRanking = getMockRanking(userId);
  const currentUserRank = mockRanking.find((m) => m.userId === userId) ?? null;
  const leaderScore = mockRanking[0]?.totalScore ?? 0;

  const panelData: PoolPanelData = {
    poolId: pool.id,
    poolName: pool.name,
    poolStatus: pool.status as PoolStatus,
    currentUserId: userId,
    ranking: mockRanking,
    currentUserRank,
    leaderScore,
    betCategories: getMockBetCategories(),
    results: getMockResults(),
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <DashboardTopBar />
      <main className="flex flex-1 flex-col pt-20 pb-28">
        <PoolPanelTabs data={panelData} />
      </main>
      <BottomNavBar />
    </div>
  );
}
