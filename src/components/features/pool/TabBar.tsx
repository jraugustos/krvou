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

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="flex border-2 border-outline-variant bg-surface-container">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex flex-1 items-center justify-center py-3 font-heading text-xs uppercase tracking-widest transition-colors",
              isActive
                ? "bg-surface-high text-primary border-b-2 border-primary"
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
