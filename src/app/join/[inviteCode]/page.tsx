import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InviteCard } from "@/components/features/invite/InviteCard";
import type { InvitePageData, PoolStatus } from "@/types/pool";

export default async function JoinPage({
  params,
  searchParams,
}: {
  params: Promise<{ inviteCode: string }>;
  searchParams: Promise<{ autoJoin?: string }>;
}) {
  const { inviteCode } = await params;
  const { autoJoin } = await searchParams;

  const [session, pool] = await Promise.all([
    auth(),
    prisma.pool
      .findUnique({
        where: { inviteCode },
        select: {
          id: true,
          name: true,
          status: true,
          creator: { select: { name: true } },
          _count: { select: { members: true } },
          categories: {
            where: { isActive: true },
            select: {
              customName: true,
              isCustom: true,
              productCategory: { select: { name: true } },
            },
            orderBy: { createdAt: "asc" },
          },
        },
      })
      .catch(() => null),
  ]);

  if (!pool) notFound();

  const isLoggedIn = !!session?.user?.id;

  const pageData: InvitePageData = {
    poolId: pool.id,
    poolName: pool.name,
    creatorName: pool.creator.name ?? "Alguem",
    participantCount: pool._count.members,
    categories: pool.categories
      .map((c) =>
        c.isCustom ? (c.customName ?? "") : (c.productCategory?.name ?? "")
      )
      .filter(Boolean),
    status: pool.status as PoolStatus,
  };

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background p-5">
      <InviteCard
        inviteCode={inviteCode}
        poolData={pageData}
        isLoggedIn={isLoggedIn}
        autoJoin={autoJoin === "1" && isLoggedIn}
      />
    </main>
  );
}
