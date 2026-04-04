import { OctagonXIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  className?: string;
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  className,
  title = "Algo deu errado",
  message = "Ocorreu um erro inesperado. Tente novamente.",
  onRetry,
  retryLabel = "Tentar novamente",
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 p-8 text-center",
        className
      )}
    >
      <div className="flex size-16 items-center justify-center bg-error-container">
        <OctagonXIcon className="size-8 text-destructive" />
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-heading text-lg font-bold text-secondary">
          {title}
        </h3>
        <p className="text-sm text-on-surface-variant">{message}</p>
      </div>

      {onRetry && (
        <Button variant="default" size="default" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
