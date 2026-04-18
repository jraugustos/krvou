import { ProductCard } from "./ProductCard";
import type { Product } from "@/types/wizard";

interface StepProductProps {
  products: Product[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function StepProduct({ products, selectedId, onSelect }: StepProductProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-heading text-sm text-on-surface-variant-light">
        Escolha o produto que o seu bolão vai acompanhar.
      </p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            selected={selectedId === product.id}
            onSelect={() => onSelect(product.id)}
          />
        ))}
      </div>
    </div>
  );
}
