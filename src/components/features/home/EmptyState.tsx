import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { Gamepad2 } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <Gamepad2 className="size-12 text-on-surface-variant/40" />

      <h2 className="mt-6 font-heading text-lg font-bold uppercase tracking-wide text-on-surface">
        Nenhum bolao ainda
      </h2>
      <p className="mt-2 max-w-xs text-sm text-on-surface-variant">
        Crie seu primeiro bolao ou entre em um usando um link de convite.
      </p>

      <div className="mt-8 flex flex-col gap-3 w-full max-w-xs">
        <Link
          href="/pool/new?step=1"
          className={buttonVariants({ variant: "default", size: "lg" })}
        >
          Criar Bolao
        </Link>
        <Link
          href="#"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Tenho um convite
        </Link>
      </div>
    </div>
  );
}
