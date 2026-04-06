import Link from "next/link";
import { auth } from "@/lib/auth";
import { getUserPools } from "@/actions/pool";
import { DashboardTopBar } from "@/components/layouts/DashboardTopBar";
import { BottomNavBar } from "@/components/layouts/BottomNavBar";
import { PoolCard } from "@/components/features/home/PoolCard";
import { EmptyState } from "@/components/features/home/EmptyState";
import { buttonVariants } from "@/components/ui/button-variants";

export default async function HomePage() {
  const session = await auth();
  const pools = session?.user?.id
    ? await getUserPools(session.user.id)
    : [];
  const hasNoPools = pools.length === 0;

  return (
    <>
      <DashboardTopBar />

      <main className="pt-20 pb-24 px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-lg font-bold uppercase tracking-wide text-on-surface">
            Meus Boloes
          </h1>
          <Link
            href="/pool/new?step=1"
            className={buttonVariants({ variant: "default", size: "sm" })}
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
