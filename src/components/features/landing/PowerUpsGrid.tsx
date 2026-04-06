import { Sparkles, Trophy, Share2, Gamepad2, Swords } from "lucide-react";

export function PowerUpsGrid() {
  return (
    <section className="px-6 py-16 max-w-7xl mx-auto">
      {/* Section title */}
      <h2 className="text-2xl md:text-3xl font-pixel text-on-surface mb-12 border-l-8 border-primary pl-6">
        POWER UPS
      </h2>

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {/* Wizard IA — 8 cols */}
        <div className="md:col-span-8 bg-surface-container border-4 border-outline p-6 md:p-8 relative overflow-hidden group">
          {/* Decorative icon */}
          <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-25 transition-opacity duration-300">
            <Sparkles className="size-24 md:size-32 text-primary" />
          </div>

          {/* Badge */}
          <span className="inline-block bg-primary text-primary-foreground px-3 py-1 font-pixel text-[8px] mb-6 tracking-wider">
            AI ENHANCED
          </span>

          <h3 className="text-xl md:text-3xl font-pixel text-on-surface mb-4 md:mb-6">
            WIZARD IA
          </h3>

          <p className="text-on-surface-variant font-heading text-sm md:text-base max-w-md leading-relaxed">
            O Claude ajuda você a definir as melhores regras, analisar
            estatísticas e criar bolões equilibrados automaticamente.
          </p>

          {/* Decorative pixel blocks */}
          <div className="mt-8 flex gap-3">
            <div className="size-4 bg-primary shadow-[2px_2px_0px_white]" />
            <div className="size-4 bg-primary/50" />
            <div className="size-4 bg-primary/20" />
          </div>
        </div>

        {/* Real-Time Ranking — 4 cols */}
        <div className="md:col-span-4 bg-surface-container border-4 border-primary p-6 md:p-8 flex flex-col justify-between shadow-arcade-primary">
          <div>
            <Trophy className="size-12 text-primary mb-6" />

            <h3 className="text-base md:text-lg font-pixel text-on-surface mb-4">
              REAL-TIME RANKING
            </h3>

            <p className="text-on-surface/60 font-heading text-sm leading-relaxed">
              Sua posição sobe assim que o juiz apita o fim do jogo. Sem espera.
            </p>
          </div>

          {/* Mini progress bar */}
          <div className="mt-8 border-t-2 border-primary/20 pt-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-pixel text-primary">
                #1 VOCÊ
              </span>
              <span className="text-[10px] font-pixel text-on-surface">
                450 PTS
              </span>
            </div>
            <div className="w-full bg-background h-3 p-0.5">
              <div className="bg-primary w-3/4 h-full" />
            </div>
          </div>
        </div>

        {/* Convite Rápido — 4 cols */}
        <div className="md:col-span-4 bg-surface-container border-4 border-outline p-6 md:p-8 group hover:border-secondary-container transition-colors duration-200 cursor-pointer">
          <Share2 className="size-12 text-secondary-container mb-6" />

          <h3 className="text-base md:text-lg font-pixel text-on-surface mb-4">
            CONVITE RÁPIDO
          </h3>

          <p className="text-on-surface/60 font-heading text-sm leading-relaxed">
            Compartilhe o código da sala via WhatsApp e comece a resenha em
            segundos.
          </p>
        </div>

        {/* Versus — 8 cols, decorativo */}
        <div className="md:col-span-8 bg-background border-4 border-outline p-2 flex items-center justify-center overflow-hidden">
          <div
            className="relative w-full h-48 flex items-center justify-around"
            style={{
              backgroundImage: "radial-gradient(#2c1245 1px, transparent 1px)",
              backgroundSize: "10px 10px",
            }}
          >
            {/* Left icon */}
            <Gamepad2 className="size-14 md:size-16 text-primary opacity-30" />

            {/* Center text */}
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-pixel text-on-surface italic drop-shadow-[3px_3px_0px_#bd00ff]">
                VERSUS
              </div>
              <div className="text-primary font-pixel text-[8px] mt-4 tracking-[0.3em]">
                MULTIPLAYER MODE
              </div>
            </div>

            {/* Right icon */}
            <Swords className="size-14 md:size-16 text-primary opacity-30" />
          </div>
        </div>
      </div>
    </section>
  );
}
