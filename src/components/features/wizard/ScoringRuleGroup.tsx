"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ScoringGroup } from "@/types/wizard";

interface ScoringRuleGroupProps {
  group: ScoringGroup;
  onEditRule: (ruleId: string, newPoints: number) => void;
}

export function ScoringRuleGroup({ group, onEditRule }: ScoringRuleGroupProps) {
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  function handleStartEdit(ruleId: string, currentPoints: number) {
    setEditingRuleId(ruleId);
    setEditValue(String(currentPoints));
  }

  function handleConfirmEdit(ruleId: string) {
    const parsed = parseInt(editValue, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 999) {
      onEditRule(ruleId, parsed);
    }
    setEditingRuleId(null);
  }

  function handleKeyDown(e: React.KeyboardEvent, ruleId: string) {
    if (e.key === "Enter") handleConfirmEdit(ruleId);
    if (e.key === "Escape") setEditingRuleId(null);
  }

  const colorClass =
    group.groupColor === "cyan" ? "text-accent-cyan" : "text-scoring-gold";

  return (
    <div className="border-2 border-outline-variant bg-surface-container p-4">
      <h3
        className={cn(
          "mb-3 font-heading text-xs font-bold uppercase tracking-widest",
          colorClass
        )}
      >
        {group.group}
      </h3>
      <div className="flex flex-col gap-2">
        {group.rules.map((rule) => (
          <div
            key={rule.id}
            className="flex items-center justify-between gap-3"
          >
            <span className="font-sans text-sm text-on-surface">
              {rule.name}
            </span>
            {editingRuleId === rule.id ? (
              <input
                type="number"
                min={1}
                max={999}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleConfirmEdit(rule.id)}
                onKeyDown={(e) => handleKeyDown(e, rule.id)}
                autoFocus
                className="w-16 border-2 border-primary bg-surface-lowest px-2 py-1 text-center font-pixel text-xs text-primary outline-none focus:shadow-glow-primary"
              />
            ) : (
              <button
                type="button"
                onClick={() => handleStartEdit(rule.id, rule.points)}
                aria-label={`Editar pontuacao de ${rule.name}`}
                className="bg-primary/10 px-3 py-1 font-pixel text-xs text-primary transition-colors hover:bg-primary/20"
              >
                {rule.points} pts
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
