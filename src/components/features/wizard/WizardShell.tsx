"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { WizardProgressBar } from "./WizardProgressBar";
import { WizardHeader } from "./WizardHeader";
import { StepProduct } from "./StepProduct";
import { StepConfigure } from "./StepConfigure";
import { StepReview } from "./StepReview";
import { createPoolAction } from "@/actions/wizard";
import type {
  Product,
  WizardCategory,
  WizardStep,
  ReviewData,
} from "@/types/wizard";

const STEP_TITLES: Record<WizardStep, string> = {
  1: "Selecionar Produto",
  2: "Configurar Bolao",
  3: "Revisao",
};

interface WizardShellProps {
  initialStep: WizardStep;
  products: Product[];
}

export function WizardShell({ initialStep, products }: WizardShellProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState<WizardStep>(initialStep);

  // Step 1 state
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Step 2 state
  const [poolName, setPoolName] = useState("");
  const [categories, setCategories] = useState<WizardCategory[]>([]);

  const navigateToStep = useCallback(
    (step: WizardStep) => {
      setCurrentStep(step);
      router.push(`/pool/new?step=${step}`);
    },
    [router]
  );

  function handleSelectProduct(id: string) {
    setSelectedProductId(id);

    // Populate categories from selected product
    const product = products.find((p) => p.id === id);
    if (product) {
      const productCategories: WizardCategory[] = product.categories.map((cat) => ({
        key: cat.id,
        productCategoryId: cat.id,
        name: cat.name,
        description: cat.description,
        type: cat.type,
        isCustom: false,
        isActive: true,
      }));
      setCategories(productCategories);
    }
  }

  function handleToggleCategory(key: string) {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.key === key ? { ...cat, isActive: !cat.isActive } : cat
      )
    );
  }

  function handleAddCustomCategory(name: string) {
    const newCat: WizardCategory = {
      key: `custom-${Date.now()}`,
      productCategoryId: null,
      name,
      description: null,
      type: "custom",
      isCustom: true,
      isActive: true,
    };
    setCategories((prev) => [...prev, newCat]);
  }

  function handleNext() {
    if (currentStep === 1) {
      if (!selectedProductId) {
        toast.error("Selecione um produto para continuar.");
        return;
      }
      navigateToStep(2);
    } else if (currentStep === 2) {
      if (!poolName.trim() || poolName.length > 60) {
        toast.error("Preencha um nome valido para o bolao.");
        return;
      }
      const activeCount = categories.filter((c) => c.isActive).length;
      if (activeCount === 0) {
        toast.error("Selecione pelo menos 1 categoria.");
        return;
      }
      navigateToStep(3);
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      navigateToStep((currentStep - 1) as WizardStep);
    } else {
      router.push("/home");
    }
  }

  function handleCreate() {
    startTransition(async () => {
      const activeProductCategoryIds = categories
        .filter((c) => !c.isCustom && c.isActive && c.productCategoryId)
        .map((c) => c.productCategoryId as string);

      const customCategoryNames = categories
        .filter((c) => c.isCustom && c.isActive)
        .map((c) => c.name);

      const formData = new FormData();
      formData.set("name", poolName);
      formData.set("productId", selectedProductId ?? "");
      formData.set("activeProductCategoryIds", JSON.stringify(activeProductCategoryIds));
      formData.set("customCategoryNames", JSON.stringify(customCategoryNames));

      const result = await createPoolAction(null, formData);
      if (result && !result.success) {
        toast.error(result.error);
      }
      // On success, redirect happens server-side
    });
  }

  // Build review data
  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const review: ReviewData = {
    productName: selectedProduct?.name ?? "—",
    poolName: poolName || "—",
    activeCategories: categories.filter((c) => c.isActive),
  };

  // Disable next button
  const isNextDisabled =
    isPending ||
    (currentStep === 1 && !selectedProductId) ||
    (currentStep === 2 &&
      (!poolName.trim() ||
        poolName.length > 60 ||
        categories.filter((c) => c.isActive).length === 0));

  // Selected product name for step 2 header
  const selectedProductName = selectedProduct?.name ?? "Produto";

  return (
    <div className="min-h-screen bg-background-light px-4 pt-6 pb-32 text-on-surface-light">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <WizardProgressBar currentStep={currentStep} totalSteps={3} />
        <WizardHeader stepNumber={currentStep} title={STEP_TITLES[currentStep]} />

        {/* Step content */}
        <div className="flex-1">
          {currentStep === 1 && (
            <StepProduct
              products={products}
              selectedId={selectedProductId}
              onSelect={handleSelectProduct}
            />
          )}
          {currentStep === 2 && (
            <StepConfigure
              poolName={poolName}
              onPoolNameChange={setPoolName}
              categories={categories}
              onToggleCategory={handleToggleCategory}
              onAddCustomCategory={handleAddCustomCategory}
              productName={selectedProductName}
            />
          )}
          {currentStep === 3 && (
            <StepReview
              review={review}
              onEdit={(step) => navigateToStep(step as WizardStep)}
              onCreate={handleCreate}
              isPending={isPending}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="pill-outline"
            onClick={handleBack}
            className="flex-1"
            disabled={isPending}
          >
            <ChevronLeft className="size-4" />
            {currentStep === 1 ? "Home" : "Voltar"}
          </Button>
          {currentStep < 3 && (
            <Button
              variant="pill"
              onClick={handleNext}
              className="flex-1"
              disabled={isNextDisabled}
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  Próximo
                  <ChevronRight className="size-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
