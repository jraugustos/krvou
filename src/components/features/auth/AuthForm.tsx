"use client";

import { useState, useActionState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <main className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6">
      {/* Brand Identity */}
      <div className="mb-12 text-center">
        <h1 className="font-pixel text-5xl uppercase tracking-[0.2em] text-primary drop-shadow-[0_0_15px_rgba(57,255,20,0.8)] md:text-7xl">
          KRVOU
        </h1>
        <p className="mt-4 font-heading text-sm font-bold uppercase tracking-widest text-secondary md:text-base">
          Terminal de Apostas Retro-Futurista
        </p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md border-l-4 border-t-4 border-surface-highest bg-surface-container p-8 shadow-[inset_4px_4px_0px_rgba(0,0,0,0.5)] md:p-10">
        {/* Google Auth */}
        <Button
          className="mb-8 h-14 w-full gap-4 bg-white font-heading text-base font-bold uppercase tracking-tight text-neutral-900 shadow-[4px_4px_0px_#9ca3af] hover:bg-neutral-100 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || isPending}
        >
          <GoogleIcon />
          {googleLoading ? "CONECTANDO..." : "Continuar com Google"}
        </Button>

        {/* Divider */}
        <div className="mb-8 flex items-center gap-4">
          <div className="h-1 flex-1 bg-surface-highest" />
          <span className="font-heading text-xs font-black uppercase tracking-[0.3em] text-on-surface-variant">
            ou
          </span>
          <div className="h-1 flex-1 bg-surface-highest" />
        </div>

        {/* Server error message */}
        {state?.message && (
          <div className="mb-6 border-2 border-destructive bg-destructive/10 p-3 text-center font-heading text-sm font-bold text-destructive">
            {state.message}
          </div>
        )}

        {/* Form */}
        <form key={mode} action={handleSubmit} className="space-y-6">
          {/* Nome (signup only) */}
          {isSignup && (
            <div>
              <label
                htmlFor="auth-name"
                className="mb-2 block font-heading text-xs font-bold uppercase tracking-widest text-primary"
              >
                Nome
              </label>
              <div className="group relative">
                <Input
                  id="auth-name"
                  name="name"
                  type="text"
                  placeholder="INSIRA SEU NOME"
                  aria-invalid={!!state?.errors?.name}
                  className={`h-auto border-0 bg-surface-lowest p-4 font-heading text-base placeholder:text-on-surface-variant/30 focus:border-0 ${
                    state?.errors?.name
                      ? "border-2 border-destructive shadow-glow-destructive"
                      : ""
                  }`}
                />
                <div className="pointer-events-none absolute inset-0 border-2 border-primary opacity-0 blur-[4px] group-focus-within:opacity-100" />
              </div>
              {state?.errors?.name && (
                <p className="mt-1 font-heading text-xs font-bold text-destructive">
                  {state.errors.name[0]}
                </p>
              )}
            </div>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="auth-email"
              className="mb-2 block font-heading text-xs font-bold uppercase tracking-widest text-primary"
            >
              Email
            </label>
            <div className="group relative">
              <Input
                id="auth-email"
                name="email"
                type="email"
                placeholder="USER@TERMINAL.NET"
                aria-invalid={!!state?.errors?.email}
                className={`h-auto border-0 bg-surface-lowest p-4 font-heading text-base placeholder:text-on-surface-variant/30 focus:border-0 ${
                  state?.errors?.email
                    ? "border-2 border-destructive shadow-glow-destructive"
                    : ""
                }`}
              />
              <div className="pointer-events-none absolute inset-0 border-2 border-primary opacity-0 blur-[4px] group-focus-within:opacity-100" />
            </div>
            {state?.errors?.email && (
              <p className="mt-1 font-heading text-xs font-bold text-destructive">
                {state.errors.email[0]}
              </p>
            )}
          </div>

          {/* Senha */}
          <div>
            <label
              htmlFor="auth-password"
              className="mb-2 block font-heading text-xs font-bold uppercase tracking-widest text-primary"
            >
              Senha
            </label>
            <div className="group relative">
              <Input
                id="auth-password"
                name="password"
                type="password"
                placeholder="********"
                aria-invalid={!!state?.errors?.password}
                className={`h-auto border-0 bg-surface-lowest p-4 font-heading text-base placeholder:text-on-surface-variant/30 focus:border-0 ${
                  state?.errors?.password
                    ? "border-2 border-destructive shadow-glow-destructive"
                    : ""
                }`}
              />
              <div className="pointer-events-none absolute inset-0 border-2 border-primary opacity-0 blur-[4px] group-focus-within:opacity-100" />
            </div>
            {state?.errors?.password && (
              <p className="mt-1 font-heading text-xs font-bold text-destructive">
                {state.errors.password[0]}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            size="xl"
            className="h-16 w-full text-xl tracking-widest"
            disabled={isPending || googleLoading}
          >
            {isPending
              ? isSignup
                ? "CRIANDO..."
                : "ENTRANDO..."
              : isSignup
                ? "CRIAR CONTA"
                : "ENTRAR NO TERMINAL"}
          </Button>
        </form>

        {/* Toggle Link */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={handleToggle}
            disabled={isPending}
            className="font-heading text-sm font-bold uppercase tracking-widest text-on-surface-variant transition-colors duration-75 hover:text-primary"
          >
            {isSignup ? (
              <>
                Ja tem conta?{" "}
                <span className="ml-1 border-b-2 border-dotted border-secondary text-secondary">
                  Entrar
                </span>
              </>
            ) : (
              <>
                Nao possui conta?{" "}
                <span className="ml-1 border-b-2 border-dotted border-secondary text-secondary">
                  Criar Conta
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* System Status Footer */}
      <div className="mt-12 flex flex-col items-center gap-2 opacity-50">
        <div className="flex items-center gap-4 font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
          <div className="flex items-center gap-1">
            <span className="size-2 animate-pulse bg-primary" />
            SISTEMA ONLINE
          </div>
          <span>v 2.0.84</span>
          <span>ENC-MOD: AES-256</span>
        </div>
      </div>

      {/* Decorative Background — Desktop */}
      <div className="pointer-events-none fixed right-0 top-0 z-0 hidden p-8 opacity-20 lg:block">
        <div className="select-none text-[120px] font-black leading-none text-surface-highest">
          AUTH_MODE
          <br />
          002
        </div>
      </div>
      <div className="pointer-events-none fixed bottom-0 left-0 z-0 hidden p-8 opacity-20 lg:block">
        <div className="flex flex-col gap-1 font-heading font-bold uppercase tracking-widest text-primary">
          <span>READY PLAYER 1</span>
          <span>INSERT COIN TO CONTINUE</span>
          <div className="mt-2 h-2 w-48 bg-primary" />
        </div>
      </div>
    </main>
  );
}
