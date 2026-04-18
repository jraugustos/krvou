"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardAura } from "@/components/ui/card";

interface SuccessScreenProps {
  poolName: string;
  inviteUrl: string;
  poolId: string;
}

export function SuccessScreen({ poolName, inviteUrl, poolId }: SuccessScreenProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(inviteUrl);
      toast.success("Link copiado!");
    } else {
      inputRef.current?.select();
      toast.info("Selecione e copie o link manualmente");
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-background-light flex min-h-screen items-center justify-center px-4 py-10">
      <Card
        variant="hero"
        padding="lg"
        className="w-full max-w-md"
      >
        <CardAura />

        <div className="relative flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="font-pixel text-primary text-2xl leading-relaxed uppercase drop-shadow-[0_0_15px_rgba(57,255,20,0.8)]">
              BOLAO
              <br />
              CRIADO!
            </h1>
            <p className="font-heading text-on-surface-variant text-sm uppercase tracking-wide">
              {poolName}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3">
            <p className="font-heading text-on-surface-variant text-xs uppercase tracking-wide">
              Link de convite
            </p>
            <input
              ref={inputRef}
              type="text"
              readOnly
              value={inviteUrl}
              aria-label="Link de convite"
              className="rounded-card text-on-surface w-full border border-white/10 bg-white/10 px-3 py-2 font-mono text-xs select-all focus:outline-none"
            />
            <Button
              variant="pill"
              size="pill-lg"
              className="w-full"
              onClick={handleCopy}
              disabled={copied}
            >
              {copied ? "Copiado!" : "Copiar link"}
            </Button>
          </div>

          <Button
            variant="pill-outline"
            size="pill-lg"
            className="w-full"
            onClick={() => router.push(`/pool/${poolId}/admin`)}
          >
            Ir para o painel do bolao
          </Button>
        </div>
      </Card>
    </div>
  );
}
