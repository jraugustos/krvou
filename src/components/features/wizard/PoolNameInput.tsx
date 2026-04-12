import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const MAX_LENGTH = 60;

interface PoolNameInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function PoolNameInput({ value, onChange }: PoolNameInputProps) {
  const over = value.length > MAX_LENGTH;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="pool-name"
          className="font-pixel text-[10px] tracking-wider text-on-surface-variant"
        >
          NOME DO BOLAO
        </label>
        <span
          className={cn(
            "font-pixel text-[9px]",
            over ? "text-destructive" : "text-on-surface-variant"
          )}
        >
          {value.length}/{MAX_LENGTH}
        </span>
      </div>
      <Input
        id="pool-name"
        type="text"
        placeholder="Ex: Bolao do Trampo 2026"
        value={value}
        maxLength={MAX_LENGTH + 10}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={over}
      />
      {over && (
        <p className="font-sans text-xs text-destructive">
          Nome deve ter no maximo {MAX_LENGTH} caracteres.
        </p>
      )}
    </div>
  );
}
