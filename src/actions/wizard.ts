"use server";

import crypto from "crypto";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreatePoolSchema, type WizardActionState } from "@/types/wizard";

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
    productId: formData.get("productId"),
    activeProductCategoryIds: formData.get("activeProductCategoryIds"),
    customCategoryNames: formData.get("customCategoryNames"),
  });

  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors;
    const first = Object.values(flat).flat()[0];
    return { success: false, error: first ?? "Dados invalidos." };
  }

  let activeIds: string[];
  let customNames: string[];

  try {
    activeIds = JSON.parse(parsed.data.activeProductCategoryIds) as string[];
    customNames = JSON.parse(parsed.data.customCategoryNames) as string[];
  } catch {
    return { success: false, error: "Dados de categorias invalidos." };
  }

  if (activeIds.length === 0 && customNames.length === 0) {
    return { success: false, error: "Selecione pelo menos 1 categoria." };
  }

  // Generate unique inviteCode with retry
  let inviteCode = generateInviteCode();
  for (let i = 0; i < 5; i++) {
    const existing = await prisma.pool.findUnique({ where: { inviteCode } });
    if (!existing) break;
    inviteCode = generateInviteCode();
  }

  try {
    const pool = await prisma.$transaction(async (tx) => {
      const newPool = await tx.pool.create({
        data: {
          name: parsed.data.name,
          productId: parsed.data.productId,
          status: "open",
          inviteCode,
          creatorId: session.user!.id!,
        },
      });

      // Pre-defined categories
      for (const productCategoryId of activeIds) {
        await tx.poolCategory.create({
          data: {
            poolId: newPool.id,
            productCategoryId,
            isCustom: false,
            isActive: true,
          },
        });
      }

      // Custom categories
      for (const customName of customNames) {
        if (customName.trim()) {
          await tx.poolCategory.create({
            data: {
              poolId: newPool.id,
              productCategoryId: null,
              isCustom: true,
              customName: customName.trim(),
              isActive: true,
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
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("[createPoolAction] Failed:", error);
    return { success: false, error: "Erro ao criar bolao. Tente novamente." };
  }
}
