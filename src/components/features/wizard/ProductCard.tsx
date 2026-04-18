import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Product } from "@/types/wizard";

interface ProductCardProps {
  product: Product;
  selected: boolean;
  onSelect: () => void;
}

export function ProductCard({ product, selected, onSelect }: ProductCardProps) {
  const unavailable = !product.isActive;
  const initial = product.name.charAt(0).toUpperCase();

  return (
    <button
      type="button"
      onClick={unavailable ? undefined : onSelect}
      disabled={unavailable}
      aria-pressed={selected}
      aria-label={`Selecionar produto ${product.name}`}
      className={cn(
        "group w-full text-left outline-none",
        unavailable && "cursor-not-allowed"
      )}
    >
      <Card
        padding="sm"
        className={cn(
          "flex flex-row items-start gap-4 transition-all duration-200",
          selected
            ? "ring-2 ring-primary shadow-neon-glow-sm"
            : "hover:-translate-y-0.5 hover:shadow-drop-soft-md",
          unavailable && "opacity-50 pointer-events-none"
        )}
      >
        {/* Crest */}
        <span
          aria-hidden="true"
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 font-pixel text-sm text-primary"
        >
          {initial}
        </span>

        {/* Selected check */}
        {selected && (
          <span
            aria-hidden="true"
            className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-neon-glow-sm"
          >
            <Check className="size-3.5" />
          </span>
        )}

        {/* Coming soon badge */}
        {unavailable && (
          <span className="absolute right-3 top-3 rounded-pill bg-surface-high-light px-2.5 py-0.5 font-heading text-[10px] font-medium uppercase tracking-wider text-on-surface-variant-light">
            Em breve
          </span>
        )}

        <div className="flex flex-1 flex-col gap-1 pr-10">
          <span className="font-heading text-base font-bold text-on-surface-light">
            {product.name}
          </span>
          {product.description && (
            <span className="font-sans text-xs text-on-surface-variant-light">
              {product.description}
            </span>
          )}
          <span className="mt-1 font-heading text-[10px] uppercase tracking-widest text-on-surface-variant-light">
            {product.categories.length} categorias disponíveis
          </span>
        </div>
      </Card>
    </button>
  );
}
