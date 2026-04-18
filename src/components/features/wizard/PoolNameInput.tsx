import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const MAX_LENGTH = 60;
const WARN_AT = 55;

interface PoolNameInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function PoolNameInput({ value, onChange }: PoolNameInputProps) {
  const over = value.length > MAX_LENGTH;
  const near = value.length > WARN_AT;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="pool-name"
          className="font-heading text-[10px] uppercase tracking-widest text-on-surface-variant-light"
        >
          Nome do Bolão
        </label>
        <span
          className={cn(
            "font-heading text-[10px] uppercase tracking-widest",
            over
              ? "text-destructive"
              : near
                ? "text-destructive/70"
                : "text-on-surface-variant-light"
          )}
        >
          {value.length}/{MAX_LENGTH}
        </span>
      </div>
      <Input
        id="pool-name"
        type="text"
        variant="default"
        placeholder="Ex: Bolão do Trampo 2026"
        value={value}
        maxLength={MAX_LENGTH + 10}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={over}
      />
      {over && (
        <p className="font-sans text-xs text-destructive">
          Nome deve ter no máximo {MAX_LENGTH} caracteres.
        </p>
      )}
    </div>
  );
}
