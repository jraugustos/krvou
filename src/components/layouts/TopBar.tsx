"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

type TopBarNavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: readonly TopBarNavItem[] = [
  { label: "Home", href: "/" },
  { label: "Ranking", href: "#ranking" },
  { label: "Jogos", href: "#jogos" },
] as const;

export function TopBar() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between rounded-b-2xl border-b border-white/10 bg-hero-surface px-5 py-4 shadow-drop-soft-md md:px-8">
      <div className="flex items-center gap-4">
        {/* Hamburger — mobile only, visual-only nesta issue */}
        <button
          type="button"
          aria-label="Menu"
          className="flex items-center justify-center rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-primary motion-reduce:transition-none md:hidden"
        >
          <Menu className="size-6" />
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="font-pixel text-lg uppercase tracking-wider text-primary drop-shadow-[0_0_8px_rgba(57,255,20,0.6)]"
        >
          KRVOU
        </Link>
      </div>

      {/* Nav links — desktop only */}
      <nav className="hidden items-center gap-2 md:flex">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-pill px-4 py-2 font-heading text-xs font-bold uppercase tracking-widest transition-colors motion-reduce:transition-none",
                isActive
                  ? "bg-white/10 text-primary"
                  : "text-white/70 hover:bg-white/10 hover:text-primary"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Notifications icon */}
      <button
        type="button"
        aria-label="Notificações"
        className="flex items-center justify-center rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-primary motion-reduce:transition-none"
      >
        <Bell className="size-5" />
      </button>
    </header>
  );
}
