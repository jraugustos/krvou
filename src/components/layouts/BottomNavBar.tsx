"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, Target, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: typeof Home;
  disabled?: boolean;
};

const NAV_ITEMS: readonly NavItem[] = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Palpites", href: "/bets", icon: Target },
  { label: "Ranking", href: "/ranking", icon: Trophy },
  { label: "Perfil", href: "#", icon: User, disabled: true },
] as const;

export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 z-40 w-[calc(100%-2rem)] max-w-[360px] -translate-x-1/2 md:hidden">
      {/* FAB central — ação canônica "criar bolão" */}
      <Link
        href="/pool/new?step=1"
        aria-label="Criar bolão"
        className="absolute left-1/2 -top-8 z-20 flex size-16 -translate-x-1/2 items-center justify-center rounded-full bg-primary shadow-neon-glow-strong transition-transform hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
      >
        <Plus className="size-7 text-hero-surface" strokeWidth={3} />
      </Link>

      {/* Nav pill */}
      <nav className="relative z-10 flex w-full items-center justify-around rounded-card-xl border border-white/5 bg-[#0d0118] px-4 py-4 shadow-2xl">
        {NAV_ITEMS.slice(0, 2).map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}

        {/* Spacer central — buraco sob o FAB */}
        <div className="w-12" aria-hidden="true" />

        {NAV_ITEMS.slice(2).map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>
    </div>
  );
}

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const { icon: Icon, href, label, disabled } = item;

  const basePath = href.split("?")[0];
  const isActive =
    !disabled &&
    (href === "/home"
      ? pathname === "/home"
      : href === "/bets"
      ? pathname.startsWith("/bets") || pathname.startsWith("/pool/")
      : basePath !== "#" && pathname.startsWith(basePath));

  return (
    <Link
      href={href}
      aria-label={label}
      aria-disabled={disabled || undefined}
      className={cn(
        "flex items-center justify-center rounded-full p-2 transition-colors motion-reduce:transition-none",
        isActive
          ? "text-primary"
          : "text-white/40 hover:text-white/70",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      <Icon className="size-6" />
    </Link>
  );
}
