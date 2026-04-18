import Link from "next/link";
import { auth } from "@/lib/auth";
import { getUserPools } from "@/actions/pool";
import { getUpcomingGamesMock } from "@/actions/home";
import { DashboardTopBar } from "@/components/layouts/DashboardTopBar";
import { BottomNavBar } from "@/components/layouts/BottomNavBar";
import { HeroSection } from "@/components/features/home/HeroSection";
import { PoolCard } from "@/components/features/home/PoolCard";
import { EmptyState } from "@/components/features/home/EmptyState";
import { buttonVariants } from "@/components/ui/button-variants";

export default async function HomePage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [pools, upcomingGames] = await Promise.all([
    userId ? getUserPools(userId) : Promise.resolve([]),
    userId ? getUpcomingGamesMock(userId) : Promise.resolve([]),
  ]);

  const hasNoPools = pools.length === 0;

  return (
    <>
      <DashboardTopBar />

      <main className="bg-background-light min-h-screen pt-20 pb-28 px-4 md:px-6 max-w-2xl mx-auto">
        <HeroSection
          userName={session?.user?.name}
          upcomingGames={upcomingGames}
        />

        <div className="flex items-center justify-between mb-4">
          <h1 className="font-heading text-lg font-bold uppercase tracking-wide text-on-surface-light">
            Meus Boloes
          </h1>
          <Link
            href="/pool/new?step=1"
            className={buttonVariants({ variant: "pill", size: "sm" })}
          >
            Criar Bolao
          </Link>
        </div>

        {hasNoPools ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-3">
            {pools.map((pool) => (
              <PoolCard key={pool.id} {...pool} />
            ))}
          </div>
        )}
      </main>

      <BottomNavBar />
    </>
  );
}
