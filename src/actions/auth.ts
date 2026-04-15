"use server";

import bcryptjs from "bcryptjs";
import { AuthError } from "next-auth";
import { cookies } from "next/headers";
import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  LoginSchema,
  SignupSchema,
  type AuthFormState,
} from "@/types/auth";

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const cookieStore = await cookies();
  const pendingInvite = cookieStore.get("pendingInvite")?.value;
  const redirectTo = pendingInvite ? `/join/${pendingInvite}?autoJoin=1` : "/home";
  cookieStore.delete("pendingInvite");

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo,
    });
    return null;
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        if (pendingInvite) {
          cookieStore.set("pendingInvite", pendingInvite, {
            maxAge: 60 * 30,
            path: "/",
            httpOnly: true,
            sameSite: "lax",
          });
        }
        return { message: "Email ou senha incorretos" };
      }
    }
    throw error;
  }
}

export async function signupAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = SignupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, password } = parsed.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      errors: { email: ["Ja existe uma conta com esse email"] },
    };
  }

  const hashedPassword = await bcryptjs.hash(password, 12);

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  } catch {
    return { message: "Erro ao criar conta" };
  }

  const cookieStore = await cookies();
  const pendingInvite = cookieStore.get("pendingInvite")?.value;
  const redirectTo = pendingInvite ? `/join/${pendingInvite}?autoJoin=1` : "/home";
  cookieStore.delete("pendingInvite");

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo,
    });
    return null;
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: "Erro ao criar conta" };
    }
    throw error;
  }
}
