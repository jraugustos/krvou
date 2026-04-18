import Link from "next/link";
import { User } from "lucide-react";
import { auth } from "@/lib/auth";

export async function DashboardTopBar() {
  const session = await auth();

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between rounded-b-2xl border-b border-white/10 bg-hero-surface px-5 py-4 shadow-drop-soft-md md:px-8">
      <Link
        href="/home"
        className="font-pixel text-lg uppercase tracking-wider text-primary drop-shadow-[0_0_8px_rgba(57,255,20,0.6)]"
      >
        KRVOU
      </Link>

      {/* TODO: dropdown futuro (user menu) */}
      <div
        className="flex size-9 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10 ring-2 ring-primary/20"
        aria-label="Perfil do usuário"
      >
        {session?.user?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.user.image}
            alt={session.user.name ?? "Avatar"}
            className="size-full rounded-full object-cover"
          />
        ) : (
          <User className="size-4 text-white/70" />
        )}
      </div>
    </header>
  );
}
