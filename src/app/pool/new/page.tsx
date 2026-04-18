import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardTopBar } from "@/components/layouts/DashboardTopBar";
import { BottomNavBar } from "@/components/layouts/BottomNavBar";
import { WizardShell } from "@/components/features/wizard/WizardShell";
import { prisma } from "@/lib/prisma";
import type { WizardStep } from "@/types/wizard";

export default async function NewPoolPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth");
  }

  const { step } = await searchParams;
  const stepNumber = Number(step) || 1;
  const validStep = ([1, 2, 3].includes(stepNumber)
    ? stepNumber
    : 1) as WizardStep;

  // Fetch all products — active ones are selectable, inactive show as "Em breve"
  const allProducts = await prisma.product.findMany({
    include: {
      categories: {
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: [{ isActive: "desc" }, { createdAt: "asc" }],
  });

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <DashboardTopBar />
      <main className="flex flex-1 flex-col pt-20 pb-28">
        <Suspense>
          <WizardShell initialStep={validStep} products={allProducts} />
        </Suspense>
      </main>
      <BottomNavBar />
    </div>
  );
}
