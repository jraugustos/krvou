"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { WizardCategory } from "@/types/wizard";

interface CategoryCheckCardProps {
  category: WizardCategory;
  selected: boolean;
  onToggle: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  single_choice: "Escolha unica",
  exact_score: "Placar exato",
  free_text: "Texto livre",
  custom: "Personalizada",
};

export function CategoryCheckCard({
  category,
  selected,
  onToggle,
}: CategoryCheckCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`${selected ? "Desmarcar" : "Selecionar"} categoria ${category.name}`}
      className={cn(
        "flex w-full items-start gap-3 border-2 p-4 text-left transition-all duration-100",
        selected
          ? "border-primary bg-primary/5"
          : "border-outline-variant bg-surface-container opacity-60 hover:opacity-80"
      )}
    >
      {/* Checkbox */}
      <div
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center border-2 transition-all",
          selected
            ? "border-primary bg-primary"
            : "border-outline-variant bg-surface-lowest"
        )}
      >
        {selected && <Check className="size-3 text-primary-foreground" />}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1">
        <span className="font-heading text-sm font-bold text-foreground">
          {category.name}
        </span>
        {category.description && (
          <span className="font-sans text-xs text-on-surface-variant">
            {category.description}
          </span>
        )}
        <span
          className={cn(
            "mt-1 inline-flex w-fit border-2 px-2 py-0.5 font-heading text-[10px] font-medium uppercase tracking-wider",
            category.isCustom
              ? "border-secondary-container bg-secondary-container/20 text-secondary"
              : "border-outline-variant text-on-surface-variant"
          )}
        >
          {category.isCustom ? "Personalizada" : (TYPE_LABELS[category.type] ?? category.type)}
        </span>
      </div>
    </button>
  );
}
