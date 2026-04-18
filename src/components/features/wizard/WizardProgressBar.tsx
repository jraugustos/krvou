import { cn } from "@/lib/utils";

interface WizardProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function WizardProgressBar({
  currentStep,
  totalSteps,
}: WizardProgressBarProps) {
  return (
    <div className="sticky top-4 z-20 flex justify-center">
      <div className="inline-flex items-center gap-3 rounded-pill bg-hero-surface/95 px-4 py-2 shadow-drop-soft-md backdrop-blur">
        <span className="font-heading text-[10px] uppercase tracking-widest text-on-surface-variant">
          Passo {currentStep}/{totalSteps}
        </span>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalSteps }, (_, i) => {
            const stepIndex = i + 1;
            const isActiveOrCompleted = stepIndex <= currentStep;
            return (
              <span
                key={stepIndex}
                aria-hidden="true"
                className={cn(
                  "size-2 rounded-full transition-all",
                  isActiveOrCompleted
                    ? "bg-primary shadow-neon-glow-sm"
                    : "bg-white/20"
                )}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
