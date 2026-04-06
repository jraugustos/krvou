import Link from "next/link";
import { Menu, Bell } from "lucide-react";

export function TopBar() {
  return (
    <header className="fixed top-0 left-0 w-full z-40 flex items-center justify-between px-4 md:px-6 h-16 bg-background border-b-4 border-surface-container shadow-arcade-dark">
      <div className="flex items-center gap-4">
        {/* Hamburger — mobile only, visual-only nesta issue */}
        <button
          className="md:hidden text-primary"
          aria-label="Menu"
        >
          <Menu className="size-6" />
        </button>

        {/* Logo */}
        <Link href="/" className="font-pixel text-lg text-primary drop-shadow-[2px_2px_0px_var(--surface-container)] uppercase tracking-wider">
          KRVOU
        </Link>
      </div>

      {/* Nav links — desktop only */}
      <nav className="hidden md:flex gap-8">
        <Link
          href="/"
          className="font-heading text-xs font-bold uppercase tracking-widest text-primary"
        >
          Home
        </Link>
        <Link
          href="#"
          className="font-heading text-xs font-bold uppercase tracking-widest text-on-surface hover:text-primary transition-colors"
        >
          Ranking
        </Link>
        <Link
          href="#"
          className="font-heading text-xs font-bold uppercase tracking-widest text-on-surface hover:text-primary transition-colors"
        >
          Jogos
        </Link>
      </nav>

      {/* Notifications icon */}
      <button className="text-primary" aria-label="Notificações">
        <Bell className="size-5" />
      </button>
    </header>
  );
}
