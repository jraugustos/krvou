"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { WizardProgressBar } from "./WizardProgressBar";
import { WizardHeader } from "./WizardHeader";
import { StepEvent } from "./StepEvent";
import { StepCategories } from "./StepCategories";
import { StepScoring } from "./StepScoring";
import { StepReview } from "./StepReview";
import {
  analyzeEventAction,
  generateScoringAction,
  createPoolAction,
} from "@/actions/wizard";
import type {
  Category,
  ScoringGroup,
  ReviewData,
  WizardStep,
} from "@/types/wizard";

const STEP_TITLES: Record<WizardStep, string> = {
  1: "Evento",
  2: "Categorias de Palpite",
  3: "Regras de Pontuacao",
  4: "Revisao",
};

interface WizardShellProps {
  initialStep: WizardStep;
}

export function WizardShell({ initialStep }: WizardShellProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState<WizardStep>(initialStep);

  // Step 1 state
  const [eventText, setEventText] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );

  // Step 2 state
  const [categories, setCategories] = useState<Category[]>([]);

  // Step 3 state
  const [scoringRules, setScoringRules] = useState<ScoringGroup[]>([]);

  const navigateToStep = useCallback(
    (step: WizardStep) => {
      setCurrentStep(step);
      router.push(`/pool/new?step=${step}`);
    },
    [router]
  );

  async function handleNextFromStep1(overrideText?: string) {
    const text = overrideText ?? eventText;
    if (!text.trim()) {
      toast.error("Descreva o evento para continuar.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.set("eventText", text);
      const result = await analyzeEventAction(null, formData);

      if (result?.success) {
        setEventName(result.data.name);
        setEventType(result.data.eventType);
        const newCategories: Category[] = result.data.categories.map(
          (cat, i) => ({
            id: String(i + 1),
            name: cat.name,
            description: cat.description,
            type: cat.type,
            selected: true,
          })
        );
        setCategories(newCategories);
        navigateToStep(2);
      } else if (result) {
        toast.error(result.error);
      }
    });
  }

  async function handleNextFromStep2() {
    const selected = categories.filter((c) => c.selected);
    if (selected.length === 0) {
      toast.error("Selecione pelo menos 1 categoria.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.set("eventName", eventName);
      formData.set(
        "categories",
        JSON.stringify(selected.map((c) => ({ name: c.name, type: c.type })))
      );
      const result = await generateScoringAction(null, formData);

      if (result?.success) {
        const groups: ScoringGroup[] = result.data.groups.map((g) => ({
          group: g.group,
          groupColor: g.groupColor,
          rules: g.rules.map((r, i) => ({
            id: `${g.group}-${i}`,
            name: r.name,
            points: r.points,
          })),
        }));
        setScoringRules(groups);
        navigateToStep(3);
      } else if (result) {
        toast.error(result.error);
      }
    });
  }

  function handleNextFromStep3() {
    navigateToStep(4);
  }

  function handleNext() {
    if (currentStep === 1) handleNextFromStep1();
    else if (currentStep === 2) handleNextFromStep2();
    else if (currentStep === 3) handleNextFromStep3();
  }

  function handleBack() {
    if (currentStep > 1) {
      navigateToStep((currentStep - 1) as WizardStep);
    } else {
      router.push("/home");
    }
  }

  function handleToggleCategory(id: string) {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, selected: !cat.selected } : cat
      )
    );
  }

  function handleAddCategory(newCat: Category) {
    setCategories((prev) => [...prev, newCat]);
  }

  function handleEditRule(ruleId: string, newPoints: number) {
    setScoringRules((prev) =>
      prev.map((group) => ({
        ...group,
        rules: group.rules.map((rule) =>
          rule.id === ruleId ? { ...rule, points: newPoints } : rule
        ),
      }))
    );
  }

  function handleTemplateActivate(label: string) {
    setEventText(label);
    handleNextFromStep1(label);
  }

  function handleRebalance(newGroups: ScoringGroup[]) {
    setScoringRules(newGroups);
  }

  function handleEditFromReview(step: number) {
    navigateToStep(step as WizardStep);
  }

  function handleCreate() {
    startTransition(async () => {
      const selectedCats = categories.filter((c) => c.selected);

      const categoriesData = selectedCats.map((cat) => ({
        name: cat.name,
        description: cat.description,
        type: cat.type,
      }));

      const flatRules = scoringRules.flatMap((g) =>
        g.rules.map((r) => ({ name: r.name, points: r.points }))
      );

      const formData = new FormData();
      formData.set("name", eventName || eventText);
      formData.set("eventType", eventType);
      formData.set("categories", JSON.stringify(categoriesData));
      formData.set("scoringRules", JSON.stringify(flatRules));

      const result = await createPoolAction(null, formData);
      if (result && !result.success) {
        toast.error(result.error);
      }
      // On success, redirect happens server-side
    });
  }

  // Build review data from current state
  const selectedCategories = categories.filter((c) => c.selected);
  const allRules = scoringRules.flatMap((g) => g.rules);
  const minPoints = allRules.length > 0 ? Math.min(...allRules.map((r) => r.points)) : 0;
  const maxPoints = allRules.length > 0 ? Math.max(...allRules.map((r) => r.points)) : 0;

  const review: ReviewData = {
    poolName: eventName || eventText || "Meu Bolao",
    event: eventText || "Evento",
    categoriesCount: selectedCategories.length,
    categoriesNames: selectedCategories.map((c) => c.name),
    scoringRange: `${minPoints} — ${maxPoints} pts`,
    rulesCount: allRules.length,
  };

  // Determine if Next button should be disabled
  const isNextDisabled =
    isPending ||
    (currentStep === 1 && !eventText.trim()) ||
    (currentStep === 2 && categories.filter((c) => c.selected).length === 0);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 p-5">
      <WizardProgressBar currentStep={currentStep} totalSteps={4} />
      <WizardHeader
        stepNumber={currentStep}
        title={STEP_TITLES[currentStep]}
      />

      {/* Step content */}
      <div className="flex-1">
        {currentStep === 1 && (
          <StepEvent
            eventText={eventText}
            onEventTextChange={setEventText}
            selectedTemplateId={selectedTemplateId}
            onTemplateSelect={setSelectedTemplateId}
            onTemplateActivate={handleTemplateActivate}
          />
        )}
        {currentStep === 2 && (
          <StepCategories
            categories={categories}
            onToggleCategory={handleToggleCategory}
            onAddCategory={handleAddCategory}
            eventName={eventName}
            isPending={isPending}
          />
        )}
        {currentStep === 3 && (
          <StepScoring
            scoringRules={scoringRules}
            onEditRule={handleEditRule}
            onRebalance={handleRebalance}
            eventName={eventName}
            isPending={isPending}
          />
        )}
        {currentStep === 4 && (
          <StepReview
            review={review}
            onEdit={handleEditFromReview}
            onCreate={handleCreate}
            isPending={isPending}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pb-20">
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex-1"
          disabled={isPending}
        >
          <ChevronLeft className="size-4" />
          {currentStep === 1 ? "Home" : "Voltar"}
        </Button>
        {currentStep < 4 && (
          <Button
            onClick={handleNext}
            className="flex-1"
            disabled={isNextDisabled}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                Proximo
                <ChevronRight className="size-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
