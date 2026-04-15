"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type JoinResult =
  | { success: true; poolId: string; alreadyMember?: true }
  | { success: false; error: string };

export async function joinPoolAction(poolId: string): Promise<JoinResult> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth");
  }
  const userId = session.user.id;

  const pool = await prisma.pool.findUnique({
    where: { id: poolId },
    select: { id: true, status: true },
  });

  if (!pool) {
    return { success: false, error: "Bolao nao encontrado." };
  }

  if (pool.status !== "open") {
    return { success: false, error: "Este bolao nao aceita mais participantes." };
  }

  const existing = await prisma.poolMember.findUnique({
    where: { userId_poolId: { userId, poolId } },
  });

  if (existing) {
    return { success: true, poolId, alreadyMember: true };
  }

  try {
    await prisma.poolMember.create({
      data: { userId, poolId, role: "participant" },
    });
    return { success: true, poolId };
  } catch (error) {
    console.error("[joinPoolAction] Failed:", error);
    return { success: false, error: "Erro ao entrar no bolao. Tente novamente." };
  }
}

export async function saveInviteAndRedirectAction(inviteCode: string): Promise<never> {
  const cookieStore = await cookies();
  cookieStore.set("pendingInvite", inviteCode, {
    maxAge: 60 * 30,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });
  redirect("/auth");
}
