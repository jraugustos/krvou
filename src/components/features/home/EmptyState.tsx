import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button-variants";

export function EmptyState() {
  return (
    <Card
      padding="lg"
      className="mx-auto flex w-full max-w-sm flex-col items-center justify-center text-center"
    >
      <Gamepad2 className="size-12 text-on-surface-variant-light" />

      <h2 className="mt-6 font-heading text-lg font-bold uppercase tracking-wide text-on-surface-light">
        Nenhum bolao ainda
      </h2>
      <p className="mt-2 max-w-xs text-sm text-on-surface-variant-light">
        Crie seu primeiro bolao ou entre em um usando um link de convite.
      </p>

      <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
        <Link
          href="/pool/new?step=1"
          className={buttonVariants({ variant: "pill", size: "lg" })}
        >
          Criar bolao
        </Link>
        <Link
          href="#"
          className={buttonVariants({ variant: "pill-outline", size: "lg" })}
        >
          Tenho um convite
        </Link>
      </div>
    </Card>
  );
}
