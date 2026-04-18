"use server";

import { redirect } from "next/navigation";
import bcryptjs from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";

const DEV_EMAIL = "dev@krvou.test";
const DEV_PASSWORD = "dev123456";
const DEV_NAME = "Dev User";

export async function devLoginAction() {
  if (process.env.NODE_ENV !== "development") {
    throw new Error("Dev login only available in development");
  }

  const existing = await prisma.user.findUnique({ where: { email: DEV_EMAIL } });

  if (!existing) {
    const hashed = await bcryptjs.hash(DEV_PASSWORD, 10);
    await prisma.user.create({
      data: { name: DEV_NAME, email: DEV_EMAIL, password: hashed },
    });
  }

  await signIn("credentials", {
    email: DEV_EMAIL,
    password: DEV_PASSWORD,
    redirectTo: "/home",
  });

  redirect("/home");
}
