"use server";

import crypto from "crypto";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  analyzeEvent,
  suggestCategory,
  generateScoringRules,
  rebalanceScoring,
} from "@/lib/ai";
import {
  AnalyzeEventSchema,
  SuggestCategorySchema,
  GenerateScoringSchema,
  RebalanceScoringSchema,
  CreatePoolSchema,
  type WizardActionState,
  type AnalyzeEventResponse,
  type SuggestCategoryResponse,
  type GenerateScoringResponse,
  type RebalanceScoringResponse,
} from "@/types/wizard";

export async function analyzeEventAction(
  _prevState: WizardActionState<AnalyzeEventResponse>,
  formData: FormData
): Promise<WizardActionState<AnalyzeEventResponse>> {
  const parsed = AnalyzeEventSchema.safeParse({
    eventText: formData.get("eventText"),
  });

  if (!parsed.success) {
    return { success: false, error: "Descreva o evento para continuar." };
  }

  try {
    const data = await analyzeEvent(parsed.data.eventText);
    return { success: true, data };
  } catch {
    return {
      success: false,
      error: "Nao consegui entender o evento. Tente descrever com mais detalhes.",
    };
  }
}

export async function suggestCategoryAction(
  _prevState: WizardActionState<SuggestCategoryResponse>,
  formData: FormData
): Promise<WizardActionState<SuggestCategoryResponse>> {
  const parsed = SuggestCategorySchema.safeParse({
    eventName: formData.get("eventName"),
    existingCategories: formData.get("existingCategories"),
    request: formData.get("request"),
  });

  if (!parsed.success) {
    return { success: false, error: "Descreva a categoria desejada." };
  }

  try {
    const existing = JSON.parse(parsed.data.existingCategories) as string[];
    const data = await suggestCategory(
      parsed.data.eventName,
      existing,
      parsed.data.request
    );
    return { success: true, data };
  } catch {
    return {
      success: false,
      error: "Erro ao gerar categoria. Tente novamente.",
    };
  }
}

export async function generateScoringAction(
  _prevState: WizardActionState<GenerateScoringResponse>,
  formData: FormData
): Promise<WizardActionState<GenerateScoringResponse>> {
  const parsed = GenerateScoringSchema.safeParse({
    eventName: formData.get("eventName"),
    categories: formData.get("categories"),
  });

  if (!parsed.success) {
    return { success: false, error: "Dados invalidos." };
  }

  try {
    const categories = JSON.parse(parsed.data.categories) as Array<{
      name: string;
      type: "single_choice" | "exact_score" | "free_text";
    }>;
    const data = await generateScoringRules(parsed.data.eventName, categories);
    return { success: true, data };
  } catch {
    return {
      success: false,
      error: "Erro ao gerar regras de pontuacao. Tente novamente.",
    };
  }
}

export async function rebalanceScoringAction(
  _prevState: WizardActionState<RebalanceScoringResponse>,
  formData: FormData
): Promise<WizardActionState<RebalanceScoringResponse>> {
  const parsed = RebalanceScoringSchema.safeParse({
    eventName: formData.get("eventName"),
    currentRules: formData.get("currentRules"),
    request: formData.get("request"),
  });

  if (!parsed.success) {
    return { success: false, error: "Descreva o que deseja rebalancear." };
  }

  try {
    const currentRules = JSON.parse(parsed.data.currentRules) as GenerateScoringResponse;
    const data = await rebalanceScoring(currentRules, parsed.data.request);
    return { success: true, data };
  } catch {
    return {
      success: false,
      error: "Erro ao rebalancear. Valores anteriores mantidos.",
    };
  }
}

function generateInviteCode(): string {
  return crypto.randomBytes(4).toString("hex");
}

export async function createPoolAction(
  _prevState: WizardActionState<{ poolId: string }>,
  formData: FormData
): Promise<WizardActionState<{ poolId: string }>> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth");
  }

  const parsed = CreatePoolSchema.safeParse({
    name: formData.get("name"),
    eventType: formData.get("eventType"),
    categories: formData.get("categories"),
    scoringRules: formData.get("scoringRules"),
  });

  if (!parsed.success) {
    return { success: false, error: "Dados do bolao invalidos." };
  }

  const categoriesData = JSON.parse(parsed.data.categories) as Array<{
    name: string;
    description: string;
    type: string;
  }>;

  const scoringRulesData = JSON.parse(parsed.data.scoringRules) as Array<{
    name: string;
    points: number;
  }>;

  try {
    // Generate unique inviteCode with retry
    let inviteCode = generateInviteCode();
    for (let i = 0; i < 5; i++) {
      const existing = await prisma.pool.findUnique({
        where: { inviteCode },
      });
      if (!existing) break;
      inviteCode = generateInviteCode();
    }

    const pool = await prisma.$transaction(async (tx) => {
      const newPool = await tx.pool.create({
        data: {
          name: parsed.data.name,
          eventType: parsed.data.eventType ?? null,
          status: "open",
          inviteCode,
          creatorId: session.user!.id!,
        },
      });

      const createdCategories = [];
      for (const cat of categoriesData) {
        const created = await tx.betCategory.create({
          data: {
            name: cat.name,
            description: cat.description,
            type: cat.type,
            poolId: newPool.id,
          },
        });
        createdCategories.push(created);
      }

      // Scoring rules are pool-wide; assign to first category
      if (createdCategories.length > 0 && scoringRulesData.length > 0) {
        for (const rule of scoringRulesData) {
          await tx.scoringRule.create({
            data: {
              name: rule.name,
              points: rule.points,
              categoryId: createdCategories[0].id,
            },
          });
        }
      }

      await tx.poolMember.create({
        data: {
          userId: session.user!.id!,
          poolId: newPool.id,
          role: "admin",
        },
      });

      return newPool;
    });

    redirect(`/pool/${pool.id}/created`);
  } catch (error) {
    // redirect() throws a special error, re-throw it
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    return {
      success: false,
      error: "Erro ao criar bolao. Tente novamente.",
    };
  }
}
