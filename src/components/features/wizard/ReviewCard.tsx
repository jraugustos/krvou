import { Card } from "@/components/ui/card";

interface ReviewCardProps {
  label: string;
  title: string;
  subtitle?: string;
  editStep?: number;
  onEdit?: (step: number) => void;
}

export function ReviewCard({
  label,
  title,
  subtitle,
  editStep,
  onEdit,
}: ReviewCardProps) {
  return (
    <Card padding="sm" className="flex flex-row items-start justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-1">
        <span className="font-heading text-[10px] font-medium uppercase tracking-widest text-on-surface-variant-light">
          {label}
        </span>
        <span className="font-heading text-sm font-bold text-on-surface-light">
          {title}
        </span>
        {subtitle && (
          <span className="font-sans text-xs text-on-surface-variant-light">
            {subtitle}
          </span>
        )}
      </div>
      {editStep !== undefined && onEdit && (
        <button
          type="button"
          onClick={() => onEdit(editStep)}
          aria-label={`Editar ${label}`}
          className="shrink-0 font-heading text-xs font-bold uppercase tracking-wider text-primary underline-offset-4 transition-colors hover:underline"
        >
          Editar
        </button>
      )}
    </Card>
  );
}
