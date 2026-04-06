import { Gamepad2, Monitor, Joystick } from "lucide-react";

export function Footer() {
  return (
    <footer className="px-6 py-16 text-center bg-background border-t-4 border-outline">
      {/* Logo with neon glow */}
      <div className="font-pixel text-xl text-primary mb-8 drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]">
        KRVOU
      </div>

      {/* Pixel text */}
      <p className="font-pixel text-[8px] text-on-surface/40 uppercase tracking-widest mb-8 leading-relaxed">
        CRIADO COM{" "}
        <span className="text-destructive">❤</span>{" "}
        PARA QUEM AMA O JOGO
      </p>

      {/* Social icons */}
      <div className="flex justify-center gap-8">
        <a
          href="#"
          className="text-on-surface/30 hover:text-primary transition-colors duration-200"
          aria-label="Games"
        >
          <Gamepad2 className="size-6" />
        </a>
        <a
          href="#"
          className="text-on-surface/30 hover:text-primary transition-colors duration-200"
          aria-label="Desktop"
        >
          <Monitor className="size-6" />
        </a>
        <a
          href="#"
          className="text-on-surface/30 hover:text-primary transition-colors duration-200"
          aria-label="Joystick"
        >
          <Joystick className="size-6" />
        </a>
      </div>

      {/* Copyright */}
      <p className="mt-10 text-[10px] text-on-surface/20 font-heading uppercase tracking-wider">
        © 2026 KRVOU. Todos os direitos reservados.
      </p>
    </footer>
  );
}
