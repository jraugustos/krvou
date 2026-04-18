import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { Product } from "@/types/wizard";

interface ProductCardProps {
  product: Product;
  selected: boolean;
  onSelect: () => void;
}

export function ProductCard({ product, selected, onSelect }: ProductCardProps) {
  const unavailable = !product.isActive;

  return (
    <button
      type="button"
      onClick={unavailable ? undefined : onSelect}
      disabled={unavailable}
      aria-pressed={selected}
      aria-label={`Selecionar produto ${product.name}`}
      className={cn(
        "relative flex w-full flex-col gap-2 border-2 p-4 text-left transition-all duration-100",
        selected
          ? "border-primary bg-primary/5 shadow-arcade-dark"
          : "border-outline-variant bg-surface-container",
        unavailable
          ? "cursor-not-allowed opacity-50"
          : "hover:border-outline active:translate-x-[2px] active:translate-y-[2px]"
      )}
    >
      {/* Selected check */}
      {selected && (
        <span className="absolute right-3 top-3 flex size-5 items-center justify-center bg-primary">
          <Check className="size-3 text-primary-foreground" />
        </span>
      )}

      {/* Coming soon badge */}
      {unavailable && (
        <span className="absolute right-3 top-3 border-2 border-outline-variant px-2 py-0.5 font-heading text-[10px] font-medium uppercase tracking-wider text-on-surface-variant">
          Em breve
        </span>
      )}

      <span className="font-heading text-base font-bold text-foreground pr-10">
        {product.name}
      </span>
      {product.description && (
        <span className="font-sans text-xs text-on-surface-variant">
          {product.description}
        </span>
      )}
      <span className="font-pixel text-[9px] text-on-surface-variant">
        {product.categories.length} categorias disponíveis
      </span>
    </button>
  );
}
