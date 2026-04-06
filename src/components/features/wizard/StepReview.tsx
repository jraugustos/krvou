import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewCard } from "./ReviewCard";
import type { ReviewData } from "@/types/wizard";

interface StepReviewProps {
  review: ReviewData;
  onEdit: (step: number) => void;
  onCreate: () => void;
  isPending: boolean;
}

export function StepReview({ review, onEdit, onCreate, isPending }: StepReviewProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <ReviewCard
          label="Nome do Bolao"
          title={review.poolName}
          editStep={1}
          onEdit={onEdit}
        />
        <ReviewCard
          label="Evento"
          title={review.event}
          editStep={1}
          onEdit={onEdit}
        />
        <ReviewCard
          label="Categorias"
          title={`${review.categoriesCount} categorias ativas`}
          subtitle={review.categoriesNames.join(", ")}
          editStep={2}
          onEdit={onEdit}
        />
        <ReviewCard
          label="Pontuacao"
          title={`${review.rulesCount} regras — ${review.scoringRange}`}
          editStep={3}
          onEdit={onEdit}
        />
      </div>

      <Button
        size="xl"
        className="mt-2 w-full"
        onClick={onCreate}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          "CRIAR BOLAO"
        )}
      </Button>
    </div>
  );
}
