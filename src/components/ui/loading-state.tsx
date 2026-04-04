import { cn } from "@/lib/utils";

interface LoadingStateProps {
  className?: string;
  text?: string;
  size?: "sm" | "default" | "lg";
}

export function LoadingState({
  className,
  text = "Carregando...",
  size = "default",
}: LoadingStateProps) {
  const sizeMap = {
    sm: "size-6",
    default: "size-12",
    lg: "size-16",
  };

  const textSizeMap = {
    sm: "text-[8px]",
    default: "text-[10px]",
    lg: "text-xs",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        className
      )}
    >
      {/* Pixel art spinner — 4 blocks rotating */}
      <div className={cn("relative", sizeMap[size])}>
        <div className="absolute inset-0 animate-spin duration-1000">
          <div className="absolute top-0 left-0 size-[45%] bg-primary" />
          <div className="absolute top-0 right-0 size-[45%] bg-primary/70" />
          <div className="absolute bottom-0 right-0 size-[45%] bg-primary/40" />
          <div className="absolute bottom-0 left-0 size-[45%] bg-primary/20" />
        </div>
      </div>
      {text && (
        <p
          className={cn(
            "font-pixel uppercase tracking-widest text-primary-dim",
            textSizeMap[size]
          )}
        >
          {text}
        </p>
      )}
    </div>
  );
}
