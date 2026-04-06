interface WizardProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function WizardProgressBar({
  currentStep,
  totalSteps,
}: WizardProgressBarProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-pixel text-[10px] text-on-surface-variant tracking-wider">
        STEP {currentStep}/{totalSteps}
      </p>
      <div className="flex gap-1.5">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepIndex = i + 1;
          const isCompleted = stepIndex <= currentStep;
          return (
            <div
              key={stepIndex}
              className="h-2 flex-1 border-2 border-outline-variant"
            >
              {isCompleted && (
                <div
                  className="h-full w-full"
                  style={{
                    background: `linear-gradient(to right, var(--primary), var(--accent-cyan))`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
