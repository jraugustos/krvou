import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative px-6 py-16 md:py-28 flex flex-col items-center text-center overflow-hidden">
      {/* Background pixel grid */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle, #39ff14 0.5px, transparent 0.5px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      {/* Decorative purple blur */}
      <div
        className="absolute -top-10 -right-10 w-64 h-64 bg-tertiary/20 blur-[100px] rounded-full"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 -left-20 w-48 h-48 bg-primary/10 blur-[80px] rounded-full"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl">
        {/* Title */}
        <h1 className="text-5xl md:text-8xl font-pixel text-primary mb-6 md:mb-8 leading-tight tracking-tighter drop-shadow-[4px_4px_0px_var(--surface-container)]">
          KRVOU!
        </h1>

        {/* Tagline */}
        <p className="text-sm md:text-lg font-heading font-bold text-on-surface mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed uppercase tracking-wider">
          Onde a resenha vira jogo.{" "}
          <span className="text-secondary">
            Crie seu bolão com nossa IA
          </span>{" "}
          e vença seus amigos!
        </p>

        {/* CTA + Social proof */}
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          {/* CTA button — hero variant with thicker border */}
          <Link
            href="/auth"
            className={cn(
              buttonVariants({ variant: "default", size: "xl" }),
              "border-b-8 border-r-8 border-primary-dim px-8 py-5 font-pixel text-xs hover:brightness-110 active:translate-x-1 active:translate-y-1 active:border-0"
            )}
          >
            COMEÇAR AGORA
          </Link>

          {/* Avatars pixel + counter */}
          <div className="flex items-center" aria-hidden="true">
            <div className="relative z-4 size-10 border-2 border-white bg-tertiary flex items-center justify-center text-white font-heading text-xs font-bold shadow-arcade-dark">
              J
            </div>
            <div className="relative z-3 -ml-3 size-10 border-2 border-white bg-primary/80 flex items-center justify-center text-primary-foreground font-heading text-xs font-bold shadow-arcade-dark">
              A
            </div>
            <div className="relative z-2 -ml-3 size-10 border-2 border-white bg-secondary-container flex items-center justify-center text-secondary-foreground font-heading text-xs font-bold shadow-arcade-dark">
              M
            </div>
            <div className="relative z-1 -ml-3 h-10 w-14 border-2 border-white bg-tertiary flex items-center justify-center text-white font-pixel text-[7px]">
              +1.2k
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
