import type { Metadata } from "next";
import { AuthForm } from "@/components/features/auth/AuthForm";

export const metadata: Metadata = {
  title: "KRVOU — Entrar",
  description: "Faca login ou crie sua conta no KRVOU.",
};

export default function AuthPage() {
  return <AuthForm />;
}
