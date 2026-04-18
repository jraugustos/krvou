"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { joinPoolAction, saveInviteAndRedirectAction } from "@/actions/invite";
import type { InvitePageData } from "@/types/pool";

interface InviteCardProps {
  inviteCode: string;
  poolData: InvitePageData;
  isLoggedIn: boolean;
  autoJoin: boolean;
}

export function InviteCard({
  inviteCode,
  poolData,
  isLoggedIn,
  autoJoin,
}: InviteCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const autoJoinTriggered = useRef(false);
  const isOpen = poolData.status === "open";

  async function handleJoin() {
    setError(null);

    if (!isLoggedIn) {
      startTransition(async () => {
        await saveInviteAndRedirectAction(inviteCode);
      });
      return;
    }

    startTransition(async () => {
      const result = await joinPoolAction(poolData.poolId);
      if (!result.success) {
        setError(result.error);
        return;
      }
      if (result.alreadyMember) {
        toast.warning("Voce ja participa desse bolao");
      }
      router.push(`/pool/${result.poolId}`);
    });
  }

  useEffect(() => {
    if (autoJoin && !autoJoinTriggered.current) {
      autoJoinTriggered.current = true;
      handleJoin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-background-light flex min-h-screen items-center justify-center px-4 py-10">
      <Card padding="lg" className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-3 text-center">
            <p className="font-heading text-on-surface-variant-light text-xs uppercase tracking-widest">
              Voce foi convidado para
            </p>
            <h1 className="font-heading text-on-surface-light text-2xl leading-tight font-bold uppercase">
              {poolData.poolName}
            </h1>
            <p className="font-sans text-on-surface-variant-light text-sm">
              Criado por{" "}
              <span className="text-on-surface-light font-medium">
                {poolData.creatorName}
              </span>{" "}
              ·{" "}
              {poolData.participantCount}{" "}
              {poolData.participantCount === 1 ? "participante" : "participantes"}
            </p>
          </div>

          {/* Categories card */}
          {poolData.categories.length > 0 && (
            <div className="rounded-card bg-surface-low-light border-outline-variant-light flex flex-col gap-3 border p-4">
              <p className="font-heading text-on-surface-variant-light text-xs uppercase tracking-wide">
                Categorias
              </p>
              <ul className="flex flex-col gap-2" role="list">
                {poolData.categories.map((cat, i) => (
                  <li
                    key={i}
                    className="font-sans text-on-surface-light flex items-center gap-2 text-sm"
                  >
                    <span className="text-primary" aria-hidden="true">
                      ▶
                    </span>
                    {cat}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA */}
          <div className="flex flex-col gap-3">
            {error && (
              <p
                role="alert"
                className="rounded-card bg-destructive/10 border-destructive/30 text-destructive border px-4 py-3 text-sm"
              >
                {error}
              </p>
            )}

            <Button
              variant="pill"
              size="pill-lg"
              className="w-full"
              onClick={handleJoin}
              disabled={isPending || !isOpen}
              aria-label={
                isOpen ? "Entrar no bolao" : "Bolao encerrado, nao aceita participantes"
              }
            >
              {isPending
                ? "Entrando..."
                : isOpen
                  ? "ENTRAR NO BOLAO"
                  : "BOLAO ENCERRADO"}
            </Button>

            {!isOpen && (
              <p className="font-sans text-on-surface-variant-light text-center text-xs">
                Este bolao nao aceita mais participantes
              </p>
            )}

            {isOpen && !isLoggedIn && (
              <p className="font-sans text-on-surface-variant-light text-center text-xs">
                Voce precisara criar uma conta ou fazer login para participar
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
