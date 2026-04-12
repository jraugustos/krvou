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
      <p className="font-sans text-sm text-on-surface-variant">
        Escolha o produto que o seu bolao vai acompanhar.
      </p>
      <div className="flex flex-col gap-3">
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
