"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { WizardCategory } from "@/types/wizard";

interface CategoryCheckCardProps {
  category: WizardCategory;
  selected: boolean;
  onToggle: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  single_choice: "Escolha única",
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
      aria-pressed={selected}
      className="w-full text-left outline-none"
    >
      <Card
        padding="sm"
        className={cn(
          "flex flex-row items-start gap-3 border transition-all duration-200",
          selected
            ? "border-primary bg-primary/10"
            : "border-outline-variant-light bg-surface-lowest-light hover:-translate-y-0.5 hover:shadow-drop-soft-md"
        )}
      >
        {/* Checkbox */}
        <div
          aria-hidden="true"
          className={cn(
            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-all",
            selected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-outline-variant-light bg-surface-lowest-light"
          )}
        >
          {selected && <Check className="size-3" />}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-1">
          <span className="font-heading text-sm font-bold text-on-surface-light">
            {category.name}
          </span>
          {category.description && (
            <span className="font-sans text-xs text-on-surface-variant-light">
              {category.description}
            </span>
          )}
          <span
            className={cn(
              "mt-1 inline-flex w-fit rounded-pill px-2.5 py-0.5 font-heading text-[10px] font-medium uppercase tracking-wider",
              category.isCustom
                ? "bg-tertiary/10 text-tertiary"
                : "bg-surface-high-light text-on-surface-variant-light"
            )}
          >
            {category.isCustom ? "Personalizada" : (TYPE_LABELS[category.type] ?? category.type)}
          </span>
        </div>
      </Card>
    </button>
  );
}
