import { cn } from "@/lib/utils";
import type { RankingMember } from "@/types/pool";

interface RankingListProps {
  members: RankingMember[];
  currentUserId: string;
}

export function RankingList({ members, currentUserId }: RankingListProps) {
  if (members.length === 0) {
    return (
      <div className="border-2 border-outline-variant p-5 text-center">
        <p className="font-sans text-sm text-on-surface-variant">
          Nenhum participante ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col border-2 border-outline-variant shadow-arcade-dark overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 bg-surface-highest px-4 py-2 border-b-2 border-outline-variant">
        <span className="font-heading text-[9px] text-on-surface-variant uppercase tracking-widest w-8 text-center">
          #
        </span>
        <span className="font-heading text-[9px] text-on-surface-variant uppercase tracking-widest flex-1">
          Participante
        </span>
        <span className="font-heading text-[9px] text-on-surface-variant uppercase tracking-widest text-right">
          Pts
        </span>
      </div>

      {/* Linhas */}
      {members.map((member) => {
        const isCurrentUser = member.userId === currentUserId;
        return (
          <div
            key={member.id}
            className={cn(
              "flex items-center gap-3 px-4 py-3 border-b border-outline-variant last:border-b-0 transition-colors",
              isCurrentUser
                ? "bg-primary/10 border-l-[3px] border-l-primary"
                : "bg-surface-container"
            )}
          >
            {/* Posição */}
            <span
              className={cn(
                "font-pixel text-xs w-8 text-center leading-none",
                member.rank === 1
                  ? "text-secondary"
                  : member.rank === 2
                  ? "text-on-surface-variant"
                  : member.rank === 3
                  ? "text-tertiary"
                  : "text-on-surface-variant"
              )}
            >
              {member.rank}
            </span>

            {/* Nome */}
            <span
              className={cn(
                "font-sans text-sm flex-1 truncate",
                isCurrentUser ? "text-primary font-medium" : "text-on-surface"
              )}
            >
              {member.name}
              {isCurrentUser && (
                <span className="ml-2 font-heading text-[9px] text-primary uppercase tracking-widest">
                  você
                </span>
              )}
            </span>

            {/* Score */}
            <span className="font-pixel text-xs text-primary leading-none">
              {member.totalScore}
            </span>
          </div>
        );
      })}
    </div>
  );
}
