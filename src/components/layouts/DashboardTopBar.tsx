import Link from "next/link";
import { User } from "lucide-react";
import { auth } from "@/lib/auth";

export async function DashboardTopBar() {
  const session = await auth();

  return (
    <header className="fixed top-0 left-0 w-full z-40 flex items-center justify-between px-4 md:px-6 h-16 bg-background border-b-4 border-surface-container shadow-arcade-dark">
      <Link
        href="/home"
        className="font-pixel text-lg text-primary drop-shadow-[2px_2px_0px_var(--surface-container)] uppercase tracking-wider"
      >
        KRVOU
      </Link>

      <div
        className="flex size-8 items-center justify-center bg-surface-high"
        aria-label="Perfil do usuario"
      >
        {session?.user?.image ? (
          <img
            src={session.user.image}
            alt={session.user.name ?? "Avatar"}
            className="size-8 object-cover"
          />
        ) : (
          <User className="size-4 text-on-surface-variant" />
        )}
      </div>
    </header>
  );
}
