import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardTopBar } from "@/components/layouts/DashboardTopBar";
import { BottomNavBar } from "@/components/layouts/BottomNavBar";
import { SuccessScreen } from "@/components/features/pool/SuccessScreen";

export default async function PoolCreatedPage({
  params,
}: {
  params: Promise<{ poolId: string }>;
}) {
  const { poolId } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth");
  }

  let pool: { id: string; name: string; inviteCode: string } | null = null;
  try {
    pool = await prisma.pool.findUnique({
      where: { id: poolId },
      select: { id: true, name: true, inviteCode: true },
    });
  } catch {
    notFound();
  }

  if (!pool) notFound();

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const inviteUrl = `${protocol}://${host}/join/${pool.inviteCode}`;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <DashboardTopBar />
      <main className="mt-16 flex flex-1 flex-col pb-24">
        <SuccessScreen
          poolName={pool.name}
          inviteUrl={inviteUrl}
          poolId={pool.id}
        />
      </main>
      <BottomNavBar />
    </div>
  );
}
