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
    <div className="flex items-start justify-between border-2 border-outline-variant bg-surface-container p-4">
      <div className="flex flex-col gap-1">
        <span className="font-heading text-[10px] font-medium uppercase tracking-widest text-on-surface-variant">
          {label}
        </span>
        <span className="font-heading text-sm font-bold text-foreground">
          {title}
        </span>
        {subtitle && (
          <span className="font-sans text-xs text-on-surface-variant">
            {subtitle}
          </span>
        )}
      </div>
      {editStep !== undefined && onEdit && (
        <button
          type="button"
          onClick={() => onEdit(editStep)}
          aria-label={`Editar ${label}`}
          className="font-heading text-xs font-bold text-accent-cyan transition-colors hover:text-accent-cyan-dim"
        >
          Editar
        </button>
      )}
    </div>
  );
}
