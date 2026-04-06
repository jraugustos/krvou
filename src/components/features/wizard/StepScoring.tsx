import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AIBubble } from "./AIBubble";
import { ScoringRuleGroup } from "./ScoringRuleGroup";
import { rebalanceScoringAction } from "@/actions/wizard";
import type { ScoringGroup } from "@/types/wizard";

interface StepScoringProps {
  scoringRules: ScoringGroup[];
  onEditRule: (ruleId: string, newPoints: number) => void;
  onRebalance: (newGroups: ScoringGroup[]) => void;
  eventName: string;
  isPending: boolean;
}

export function StepScoring({
  scoringRules,
  onEditRule,
  onRebalance,
  eventName,
  isPending,
}: StepScoringProps) {
  const [rebalanceRequest, setRebalanceRequest] = useState("");
  const [isRebalancing, startRebalancing] = useTransition();

  function handleRebalance() {
    if (!rebalanceRequest.trim()) return;

    startRebalancing(async () => {
      const formData = new FormData();
      formData.set("eventName", eventName);
      formData.set(
        "currentRules",
        JSON.stringify({ groups: scoringRules })
      );
      formData.set("request", rebalanceRequest);

      const result = await rebalanceScoringAction(null, formData);

      if (result?.success) {
        const newGroups: ScoringGroup[] = result.data.groups.map((g) => ({
          group: g.group,
          groupColor: g.groupColor,
          rules: g.rules.map((r, i) => ({
            id: `${g.group}-${i}`,
            name: r.name,
            points: r.points,
          })),
        }));
        onRebalance(newGroups);
        setRebalanceRequest("");
        toast.success("Pontuacao rebalanceada!");
      } else if (result) {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <AIBubble message="Defini as regras de pontuacao equilibradas para o seu bolao. Toque nos valores para ajustar, ou peca para eu rebalancear!" />

      <div className="flex flex-col gap-3">
        {scoringRules.map((group) => (
          <ScoringRuleGroup
            key={group.group}
            group={group}
            onEditRule={onEditRule}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-heading text-xs font-medium uppercase tracking-wider text-on-surface-variant">
          Pedir rebalanceamento a IA
        </span>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Ex: Aumenta o peso do placar exato"
            value={rebalanceRequest}
            onChange={(e) => setRebalanceRequest(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRebalance()}
            disabled={isRebalancing || isPending}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleRebalance}
            disabled={isRebalancing || !rebalanceRequest.trim() || isPending}
          >
            {isRebalancing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Enviar"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
