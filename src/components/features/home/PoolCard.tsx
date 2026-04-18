import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

import type { PoolStatus } from "@/types/pool";

interface PoolCardProps {
  id: string;
  title: string;
  participantCount: number;
  status: PoolStatus;
  contextInfo: string;
  href?: string;
}

const STATUS_CONFIG: Record<
  PoolStatus,
  { label: string; badgeClass: string }
> = {
  open: {
    label: "Aberto",
    badgeClass: "bg-primary/10 text-primary-dim",
  },
  in_progress: {
    label: "Em andamento",
    badgeClass: "bg-secondary-container text-on-surface-light",
  },
  finished: {
    label: "Encerrado",
    badgeClass: "bg-destructive/10 text-destructive",
  },
};

function getCrestInitial(title: string): string {
  const trimmed = title.trim();
  if (!trimmed) return "?";
  return trimmed[0]!.toUpperCase();
}

export function PoolCard({
  id,
  title,
  participantCount,
  status,
  contextInfo,
  href,
}: PoolCardProps) {
  const { label, badgeClass } = STATUS_CONFIG[status];
  const targetHref = href ?? `/pool/${id}`;
  const crestInitial = getCrestInitial(title);

  return (
    <Card
      padding="none"
      className={cn(
        "group/poolcard p-4 transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-drop-soft-md",
        status === "finished" && "opacity-60"
      )}
    >
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-pixel text-xs text-primary-dim"
            aria-hidden="true"
          >
            {crestInitial}
          </div>
          <div className="min-w-0 flex-1">
            <Link
              href={targetHref}
              className="block font-heading text-sm font-bold uppercase tracking-wide text-on-surface-light truncate outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-sm"
            >
              <span className="absolute inset-0" aria-hidden="true" />
              {title}
            </Link>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-on-surface-variant-light">
              <Users className="size-3.5 shrink-0" />
              {participantCount} participantes
            </p>
          </div>
        </div>

        <span
          className={cn(
            "relative shrink-0 rounded-pill px-2.5 py-1 font-heading text-[10px] font-bold uppercase tracking-wider",
            badgeClass
          )}
        >
          {label}
        </span>
      </CardHeader>

      <CardContent className="mt-3 gap-0">
        <p className="text-xs text-on-surface-variant-light">{contextInfo}</p>
      </CardContent>

      <CardFooter className="mt-4 justify-end">
        <span
          className={cn(
            buttonVariants({ variant: "pill", size: "sm" }),
            "relative pointer-events-none"
          )}
          aria-hidden="true"
        >
          Entrar
          <ArrowRight className="size-3.5" />
        </span>
      </CardFooter>
    </Card>
  );
}
