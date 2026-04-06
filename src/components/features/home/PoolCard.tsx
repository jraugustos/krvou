import Link from "next/link";
import { Users } from "lucide-react";
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
    badgeClass: "bg-primary text-primary-foreground",
  },
  in_progress: {
    label: "Em andamento",
    badgeClass: "bg-secondary-container text-secondary-foreground",
  },
  finished: {
    label: "Encerrado",
    badgeClass: "bg-status-finished text-status-finished-foreground",
  },
};

export function PoolCard({
  id,
  title,
  participantCount,
  status,
  contextInfo,
  href,
}: PoolCardProps) {
  const { label, badgeClass } = STATUS_CONFIG[status];

  return (
    <Link
      href={href ?? `/pool/${id}`}
      className={cn(
        "block border-2 border-outline-variant bg-surface-container p-4 transition-colors hover:bg-surface-high",
        status === "finished" && "opacity-60"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-on-surface truncate">
            {title}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-on-surface-variant">
            <Users className="size-3.5 shrink-0" />
            {participantCount} participantes
          </p>
        </div>

        <span
          className={cn(
            "shrink-0 px-2.5 py-1 font-heading text-[10px] font-bold uppercase tracking-wider",
            badgeClass
          )}
        >
          {label}
        </span>
      </div>

      <div className="mt-3 border-t-2 border-outline-variant/20 pt-3">
        <p className="text-xs text-on-surface-variant">{contextInfo}</p>
      </div>
    </Link>
  );
}
