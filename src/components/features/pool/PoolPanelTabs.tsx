"use client";

import { useState } from "react";
import { TabBar } from "@/components/features/pool/TabBar";
import { UserPositionCard } from "@/components/features/pool/UserPositionCard";
import { RankingList } from "@/components/features/pool/RankingList";
import { BetCategoryCards } from "@/components/features/pool/BetCategoryCards";
import { ResultComparisonCards } from "@/components/features/pool/ResultComparisonCards";
import type { PoolPanelData } from "@/types/pool";

export type PanelTab = "ranking" | "palpites" | "resultados";

interface PoolPanelTabsProps {
  data: PoolPanelData;
}

export function PoolPanelTabs({ data }: PoolPanelTabsProps) {
  const [activeTab, setActiveTab] = useState<PanelTab>("ranking");

  return (
    <div className="flex flex-1 flex-col gap-4 p-5">
      {/* Header do bolão */}
      <div className="flex flex-col gap-1">
        <h1 className="font-pixel text-xs text-primary leading-relaxed">
          {data.poolName}
        </h1>
        <p className="font-heading text-xs text-on-surface-variant uppercase tracking-widest">
          Painel do Participante
        </p>
      </div>

      {/* TabBar */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Conteúdo da tab ativa */}
      {activeTab === "ranking" && (
        <div className="flex flex-col gap-4">
          {data.currentUserRank && (
            <UserPositionCard
              rank={data.currentUserRank.rank}
              score={data.currentUserRank.totalScore}
              leaderScore={data.leaderScore}
            />
          )}
          <RankingList
            members={data.ranking}
            currentUserId={data.currentUserId}
          />
        </div>
      )}

      {activeTab === "palpites" && (
        <BetCategoryCards
          categories={data.betCategories}
          poolId={data.poolId}
        />
      )}

      {activeTab === "resultados" && (
        <ResultComparisonCards results={data.results} />
      )}
    </div>
  );
}
