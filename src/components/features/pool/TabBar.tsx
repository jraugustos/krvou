"use client";

import { cn } from "@/lib/utils";
import type { PanelTab } from "@/components/features/pool/PoolPanelTabs";

const TABS: { id: PanelTab; label: string }[] = [
  { id: "ranking", label: "Ranking" },
  { id: "palpites", label: "Palpites" },
  { id: "resultados", label: "Resultados" },
];

interface TabBarProps {
  activeTab: PanelTab;
  onTabChange: (tab: PanelTab) => void;
}

/**
 * TabBar — Pill flutuante editorial com 3 tabs.
 * Aba ativa: fundo escuro (hero-surface) com glow sutil.
 */
export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div
      role="tablist"
      className="inline-flex items-center gap-1 self-start overflow-x-auto rounded-pill bg-surface-low-light p-1 shadow-drop-soft"
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "rounded-pill px-4 py-1.5 font-heading text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
              isActive
                ? "bg-hero-surface text-on-surface shadow-drop-soft"
                : "text-on-surface-variant-light hover:text-on-surface-light"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
