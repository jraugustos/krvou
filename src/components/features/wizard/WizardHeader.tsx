interface WizardHeaderProps {
  stepNumber: number;
  title: string;
}

export function WizardHeader({ stepNumber, title }: WizardHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-pixel text-sm text-primary">{stepNumber}.</span>
      <h2 className="font-heading text-lg font-bold text-foreground">
        {title}
      </h2>
    </div>
  );
}
