import { PoolNameInput } from "./PoolNameInput";
import { CategoryCheckCard } from "./CategoryCheckCard";
import { CustomCategoryInput } from "./CustomCategoryInput";
import type { WizardCategory } from "@/types/wizard";

interface StepConfigureProps {
  poolName: string;
  onPoolNameChange: (value: string) => void;
  categories: WizardCategory[];
  onToggleCategory: (key: string) => void;
  onAddCustomCategory: (name: string) => void;
  productName: string;
}

export function StepConfigure({
  poolName,
  onPoolNameChange,
  categories,
  onToggleCategory,
  onAddCustomCategory,
  productName,
}: StepConfigureProps) {
  const activeCount = categories.filter((c) => c.isActive).length;

  return (
    <div className="flex flex-col gap-6">
      <PoolNameInput value={poolName} onChange={onPoolNameChange} />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="font-heading text-[10px] uppercase tracking-widest text-on-surface-variant-light">
            Categorias — {productName}
          </p>
          {activeCount === 0 && categories.length > 0 && (
            <p className="font-heading text-xs font-medium text-destructive">
              Min. 1 obrigatória
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {categories.map((category) => (
            <CategoryCheckCard
              key={category.key}
              category={category}
              selected={category.isActive}
              onToggle={() => onToggleCategory(category.key)}
            />
          ))}
        </div>

        <CustomCategoryInput onAdd={onAddCustomCategory} />
      </div>
    </div>
  );
}
