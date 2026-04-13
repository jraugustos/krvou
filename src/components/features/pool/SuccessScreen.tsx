"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
    } else {
      inputRef.current?.select();
    }
    toast.success("Link copiado!");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-5">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="font-pixel text-primary shadow-glow-primary text-xl leading-relaxed uppercase">
          BOLAO
          <br />
          CRIADO!
        </h1>
        <p className="font-heading text-on-surface-variant text-sm uppercase tracking-wide">
          {poolName}
        </p>
      </div>

      <div className="w-full max-w-sm bg-surface-container border-2 border-outline-variant flex flex-col gap-3 p-4">
        <p className="font-heading text-on-surface-variant text-xs uppercase tracking-wide">
          Link de convite
        </p>
        <input
          ref={inputRef}
          type="text"
          readOnly
          value={inviteUrl}
          className="w-full bg-surface-lowest border-2 border-outline-variant font-mono text-xs text-on-surface px-3 py-2 select-all focus:outline-none"
        />
        <Button
          variant="default"
          size="lg"
          className="w-full"
          onClick={handleCopy}
          disabled={copied}
        >
          {copied ? "Copiado!" : "Copiar link"}
        </Button>
      </div>

      <Button
        variant="outline"
        size="lg"
        className="w-full max-w-sm"
        onClick={() => router.push(`/pool/${poolId}/admin`)}
      >
        Ir para o painel do bolao
      </Button>
    </div>
  );
}
