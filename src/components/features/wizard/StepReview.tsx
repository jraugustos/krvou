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
  const predefined = review.activeCategories.filter((c) => !c.isCustom);
  const custom = review.activeCategories.filter((c) => c.isCustom);
  const allNames = review.activeCategories.map((c) => c.name).join(", ");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <ReviewCard
          label="Produto"
          title={review.productName}
          editStep={1}
          onEdit={onEdit}
        />
        <ReviewCard
          label="Nome do Bolao"
          title={review.poolName}
          editStep={2}
          onEdit={onEdit}
        />
        <ReviewCard
          label="Categorias"
          title={`${predefined.length} pre-definidas${custom.length > 0 ? ` + ${custom.length} personalizada${custom.length > 1 ? "s" : ""}` : ""}`}
          subtitle={allNames}
          editStep={2}
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
