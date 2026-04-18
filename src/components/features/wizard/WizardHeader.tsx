interface WizardHeaderProps {
  stepNumber: number;
  title: string;
}

export function WizardHeader({ stepNumber, title }: WizardHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-pixel text-[10px] text-hero-surface">
        {stepNumber}
      </span>
      <h2 className="font-heading text-lg font-bold text-on-surface-light">
        {title}
      </h2>
    </div>
  );
}
