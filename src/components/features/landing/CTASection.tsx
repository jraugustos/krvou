import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button-variants";

export function CTASection() {
  return (
    <section className="relative px-6 py-20 md:py-24 text-center bg-surface-container border-y-4 border-outline overflow-hidden">
      {/* Carbon fibre texture */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 1px,
            rgba(0,0,0,0.03) 1px,
            rgba(0,0,0,0.03) 2px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 1px,
            rgba(0,0,0,0.03) 1px,
            rgba(0,0,0,0.03) 2px
          )`,
          backgroundSize: "4px 4px",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10">
        <h2 className="text-3xl md:text-6xl font-pixel text-on-surface mb-10 md:mb-12 leading-tight">
          PRONTO PARA
          <br />
          <span className="text-primary">SER O LÍDER?</span>
        </h2>

        <Link
          href="/auth"
          className={cn(
            buttonVariants({ variant: "default", size: "xl" }),
            "border-b-8 border-r-8 border-primary-dim font-pixel text-xs md:text-sm px-10 py-6 active:translate-x-1 active:translate-y-1 active:border-0"
          )}
        >
          CRIAR MEU BOLÃO
        </Link>
      </div>
    </section>
  );
}
