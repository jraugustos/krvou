import Image from "next/image";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { RankingMember } from "@/types/pool";

interface RankingListProps {
  members: RankingMember[];
  currentUserId: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function Avatar({ name, image }: { name: string; image: string | null }) {
  if (image) {
    return (
      <Image
        src={image}
        alt={name}
        width={32}
        height={32}
        className="size-8 rounded-full object-cover"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-[10px] font-bold uppercase text-primary-dim"
    >
      {getInitials(name)}
    </div>
  );
}

/**
 * RankingList — Lista editorial de participantes ranqueados.
 * Card branco + linhas divididas + avatares circulares + linha do usuário destacada.
 */
export function RankingList({ members, currentUserId }: RankingListProps) {
  if (members.length === 0) {
    return (
      <Card padding="default">
        <p className="text-center text-sm text-on-surface-variant-light">
          Sem participantes ainda.
        </p>
      </Card>
    );
  }

  return (
    <Card padding="none">
      <ul
        role="list"
        className="flex flex-col divide-y divide-outline-variant-light"
      >
        {members.map((member) => {
          const isCurrentUser = member.userId === currentUserId;
          return (
            <li
              key={member.id}
              className={cn(
                "flex items-center gap-3 px-4 py-3 transition-colors",
                isCurrentUser && "bg-primary/5"
              )}
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center font-pixel text-[11px] leading-none",
                  member.rank === 1
                    ? "text-primary"
                    : "text-primary-dim"
                )}
              >
                {member.rank}
              </span>

              <Avatar name={member.name} image={member.image} />

              <span
                className={cn(
                  "flex-1 truncate font-sans text-sm",
                  isCurrentUser
                    ? "font-semibold text-on-surface-light"
                    : "text-on-surface-light"
                )}
              >
                {member.name}
                {isCurrentUser && (
                  <span className="ml-2 font-heading text-[9px] uppercase tracking-widest text-primary-dim">
                    você
                  </span>
                )}
              </span>

              <span className="font-heading text-sm font-bold text-on-surface-light">
                {member.totalScore}
                <span className="ml-1 font-heading text-[9px] uppercase tracking-widest text-on-surface-variant-light">
                  pts
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
