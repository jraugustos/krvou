import { useState, useTransition } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AIBubble } from "./AIBubble";
import { CategoryCheckCard } from "./CategoryCheckCard";
import { suggestCategoryAction } from "@/actions/wizard";
import type { Category } from "@/types/wizard";

interface StepCategoriesProps {
  categories: Category[];
  onToggleCategory: (id: string) => void;
  onAddCategory: (category: Category) => void;
  eventName: string;
  isPending: boolean;
}

export function StepCategories({
  categories,
  onToggleCategory,
  onAddCategory,
  eventName,
  isPending,
}: StepCategoriesProps) {
  const [showAddInput, setShowAddInput] = useState(false);
  const [addRequest, setAddRequest] = useState("");
  const [isAdding, startAdding] = useTransition();

  function handleAddCategory() {
    if (!addRequest.trim()) return;

    startAdding(async () => {
      const formData = new FormData();
      formData.set("eventName", eventName);
      formData.set(
        "existingCategories",
        JSON.stringify(categories.map((c) => c.name))
      );
      formData.set("request", addRequest);

      const result = await suggestCategoryAction(null, formData);

      if (result?.success) {
        onAddCategory({
          id: String(Date.now()),
          name: result.data.name,
          description: result.data.description,
          type: result.data.type,
          selected: true,
        });
        setAddRequest("");
        setShowAddInput(false);
      } else if (result) {
        toast.error(result.error);
      }
    });
  }

  const selectedCount = categories.filter((c) => c.selected).length;

  return (
    <div className="flex flex-col gap-4">
      <AIBubble message="Com base no evento que voce descreveu, sugiro as seguintes categorias de palpite. Ative ou desative as que preferir!" />

      {selectedCount === 0 && categories.length > 0 && (
        <p className="font-heading text-xs font-medium text-destructive">
          Selecione pelo menos 1 categoria para continuar.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {categories.map((category) => (
          <CategoryCheckCard
            key={category.id}
            category={category}
            selected={category.selected}
            onToggle={() => onToggleCategory(category.id)}
          />
        ))}
      </div>

      {showAddInput ? (
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Ex: Melhor jogador do torneio"
            value={addRequest}
            onChange={(e) => setAddRequest(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
            disabled={isAdding}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddCategory}
            disabled={isAdding || !addRequest.trim()}
          >
            {isAdding ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Criar"
            )}
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() => setShowAddInput(true)}
          disabled={isPending}
        >
          <Plus className="size-4" />
          Adicionar categoria
        </Button>
      )}
    </div>
  );
}
