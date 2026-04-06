"use client";

import { cn } from "@/lib/utils";
import type { Template } from "@/types/wizard";

interface TemplateChipsProps {
  templates: Template[];
  onSelect: (id: string) => void;
  selectedId?: string | null;
}

export function TemplateChips({
  templates,
  onSelect,
  selectedId,
}: TemplateChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {templates.map((template) => (
        <button
          key={template.id}
          type="button"
          onClick={() => onSelect(template.id)}
          className={cn(
            "border-2 px-3 py-1.5 font-heading text-xs font-medium tracking-wide transition-all duration-100",
            selectedId === template.id
              ? "border-primary bg-primary/10 text-primary"
              : "border-outline-variant bg-surface-high text-on-surface-variant hover:border-outline hover:bg-surface-highest"
          )}
        >
          {template.label}
        </button>
      ))}
    </div>
  );
}
