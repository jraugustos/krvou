import { Suspense } from "react";
import { DashboardTopBar } from "@/components/layouts/DashboardTopBar";
import { BottomNavBar } from "@/components/layouts/BottomNavBar";
import { WizardShell } from "@/components/features/wizard/WizardShell";
import type { WizardStep } from "@/types/wizard";

export default async function NewPoolPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { step } = await searchParams;
  const stepNumber = Number(step) || 1;
  const validStep = ([1, 2, 3, 4].includes(stepNumber)
    ? stepNumber
    : 1) as WizardStep;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <DashboardTopBar />
      <main className="mt-16 flex flex-1 flex-col">
        <Suspense>
          <WizardShell initialStep={validStep} />
        </Suspense>
      </main>
      <BottomNavBar />
    </div>
  );
}
