"use client";

import { useState, useActionState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardAura,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { GoogleIcon } from "@/components/features/auth/GoogleIcon";
import { loginAction, signupAction } from "@/actions/auth";
import type { AuthFormState } from "@/types/auth";

type AuthMode = "login" | "signup";

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [googleLoading, setGoogleLoading] = useState(false);

  const [loginState, loginDispatch, loginPending] = useActionState<
    AuthFormState,
    FormData
  >(loginAction, null);

  const [signupState, signupDispatch, signupPending] = useActionState<
    AuthFormState,
    FormData
  >(signupAction, null);

  const state = mode === "login" ? loginState : signupState;
  const isPending = mode === "login" ? loginPending : signupPending;
  const isSignup = mode === "signup";

  function handleToggle() {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/home" });
    } catch {
      toast.error("Falha ao autenticar com Google");
      setGoogleLoading(false);
    }
  }

  function handleSubmit(formData: FormData) {
    if (isSignup) {
      signupDispatch(formData);
    } else {
      loginDispatch(formData);
    }
  }

  useEffect(() => {
    if (state?.message && !state.errors) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-background-light p-6">
      <Card
        variant="hero"
        padding="lg"
        className="w-full max-w-md rounded-card-lg"
      >
        <CardAura />

        <CardHeader className="items-center gap-3 text-center">
          <h1 className="font-pixel text-4xl uppercase tracking-[0.2em] text-primary drop-shadow-[0_0_15px_rgba(57,255,20,0.8)] md:text-5xl">
            KRVOU
          </h1>
          <p className="font-heading text-xs font-bold uppercase tracking-widest text-secondary md:text-sm">
            Bolões inteligentes com IA
          </p>
        </CardHeader>

        <CardContent className="mt-8 gap-6">
          {/* Google Auth */}
          <Button
            variant="pill-outline"
            size="pill-lg"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || isPending}
            className="w-full gap-3 border-outline-light bg-white text-neutral-900 hover:bg-neutral-100 hover:text-neutral-900"
          >
            <GoogleIcon />
            {googleLoading ? "Conectando..." : "Continuar com Google"}
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-on-surface-variant/20" />
            <span className="font-heading text-[11px] font-bold uppercase tracking-[0.3em] text-on-surface-variant">
              ou
            </span>
            <div className="h-px flex-1 bg-on-surface-variant/20" />
          </div>

          {/* Server error message */}
          {state?.message && (
            <div className="rounded-card border-2 border-destructive bg-destructive/10 p-3 text-center font-heading text-sm font-bold text-destructive">
              {state.message}
            </div>
          )}

          {/* Form */}
          <form key={mode} action={handleSubmit} className="flex flex-col gap-4">
            {/* Nome (signup only) */}
            {isSignup && (
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="auth-name"
                  className="px-2 font-heading text-xs font-bold uppercase tracking-widest text-on-surface-variant"
                >
                  Nome
                </label>
                <Input
                  variant="pill"
                  id="auth-name"
                  name="name"
                  type="text"
                  placeholder="Seu nome"
                  aria-invalid={!!state?.errors?.name}
                />
                {state?.errors?.name && (
                  <p className="px-2 font-heading text-xs font-bold text-destructive">
                    {state.errors.name[0]}
                  </p>
                )}
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="auth-email"
                className="px-2 font-heading text-xs font-bold uppercase tracking-widest text-on-surface-variant"
              >
                Email
              </label>
              <Input
                variant="pill"
                id="auth-email"
                name="email"
                type="email"
                placeholder="voce@exemplo.com"
                aria-invalid={!!state?.errors?.email}
              />
              {state?.errors?.email && (
                <p className="px-2 font-heading text-xs font-bold text-destructive">
                  {state.errors.email[0]}
                </p>
              )}
            </div>

            {/* Senha */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="auth-password"
                className="px-2 font-heading text-xs font-bold uppercase tracking-widest text-on-surface-variant"
              >
                Senha
              </label>
              <Input
                variant="pill"
                id="auth-password"
                name="password"
                type="password"
                placeholder="********"
                aria-invalid={!!state?.errors?.password}
              />
              {state?.errors?.password && (
                <p className="px-2 font-heading text-xs font-bold text-destructive">
                  {state.errors.password[0]}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="pill"
              size="pill-lg"
              className="mt-2 w-full"
              disabled={isPending || googleLoading}
            >
              {isPending
                ? isSignup
                  ? "Criando..."
                  : "Entrando..."
                : isSignup
                  ? "Criar conta"
                  : "Entrar"}
            </Button>
          </form>

          {/* Toggle Link */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleToggle}
              disabled={isPending}
              className="font-heading text-sm font-bold uppercase tracking-widest text-on-surface-variant transition-colors duration-75 hover:text-primary disabled:opacity-50"
            >
              {isSignup ? (
                <>
                  Já tem conta?{" "}
                  <span className="ml-1 border-b-2 border-dotted border-primary text-primary">
                    Entrar
                  </span>
                </>
              ) : (
                <>
                  Não possui conta?{" "}
                  <span className="ml-1 border-b-2 border-dotted border-primary text-primary">
                    Criar conta
                  </span>
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
