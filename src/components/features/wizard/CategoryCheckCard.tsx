"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { Category, CategoryType } from "@/types/wizard";

interface CategoryCheckCardProps {
  category: Category;
  selected: boolean;
  onToggle: () => void;
}

const TYPE_LABELS: Record<CategoryType, string> = {
  single_choice: "Escolha unica",
  exact_score: "Placar exato",
  free_text: "Texto livre",
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
        <span className="font-sans text-xs text-on-surface-variant">
          {category.description}
        </span>
        <span className="mt-1 inline-flex w-fit border-2 border-outline-variant px-2 py-0.5 font-heading text-[10px] font-medium uppercase tracking-wider text-on-surface-variant">
          {TYPE_LABELS[category.type]}
        </span>
      </div>
    </button>
  );
}
