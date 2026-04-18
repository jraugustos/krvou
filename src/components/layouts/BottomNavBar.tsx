"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, Target, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Criar", href: "/pool/new?step=1", icon: PlusCircle },
  { label: "Palpites", href: "/bets", icon: Target },
  { label: "Ranking", href: "/ranking", icon: Trophy },
] as const;

export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 flex bg-background border-t-4 border-surface-container shadow-arcade-dark-invert md:hidden">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/home"
            ? pathname === "/home"
            : item.href === "/bets"
            ? pathname.startsWith("/bets") || pathname.startsWith("/pool/")
            : pathname.startsWith(item.href.split("?")[0]);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 overflow-hidden py-2 transition-colors",
              isActive
                ? "bg-primary text-background"
                : "text-on-surface-variant hover:text-primary"
            )}
          >
            <item.icon className="size-5" />
            <span className="font-heading text-[10px] uppercase tracking-wide truncate">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
