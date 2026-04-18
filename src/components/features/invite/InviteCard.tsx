"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
    <div className="w-full max-w-sm flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3 text-center">
        <p className="font-heading text-on-surface-variant text-xs uppercase tracking-widest">
          Voce foi convidado para
        </p>
        <h1 className="font-heading font-bold text-2xl text-on-surface leading-tight uppercase">
          {poolData.poolName}
        </h1>
        <p className="font-sans text-on-surface-variant text-sm">
          Criado por{" "}
          <span className="text-on-surface font-medium">
            {poolData.creatorName}
          </span>{" "}
          ·{" "}
          {poolData.participantCount}{" "}
          {poolData.participantCount === 1 ? "participante" : "participantes"}
        </p>
      </div>

      {/* Categories card */}
      {poolData.categories.length > 0 && (
        <div className="bg-surface-container border-2 border-outline-variant p-4 flex flex-col gap-3">
          <p className="font-heading text-on-surface-variant text-xs uppercase tracking-wide">
            Categorias
          </p>
          <ul className="flex flex-col gap-2" role="list">
            {poolData.categories.map((cat, i) => (
              <li
                key={i}
                className="flex items-center gap-2 font-sans text-sm text-on-surface"
              >
                <span className="text-secondary" aria-hidden="true">
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
            className="font-heading text-destructive text-sm text-center"
          >
            {error}
          </p>
        )}

        <Button
          variant="default"
          size="xl"
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
          <p className="font-sans text-on-surface-variant text-xs text-center">
            Este bolao nao aceita mais participantes
          </p>
        )}

        {isOpen && !isLoggedIn && (
          <p className="font-sans text-on-surface-variant text-xs text-center">
            Voce precisara criar uma conta ou fazer login para participar
          </p>
        )}
      </div>
    </div>
  );
}
