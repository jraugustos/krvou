interface AIBubbleProps {
  message: string;
}

export function AIBubble({ message }: AIBubbleProps) {
  return (
    <div
      className="border-2 p-4"
      style={{
        background: `linear-gradient(135deg, var(--ai-bubble-from), var(--ai-bubble-to))`,
        borderColor: `var(--ai-bubble-border)`,
      }}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="bg-tertiary/30 border-2 border-tertiary/50 px-2 py-0.5 font-pixel text-[10px] text-tertiary">
          IA
        </span>
      </div>
      <p className="font-sans text-sm leading-relaxed text-on-surface">
        {message}
      </p>
    </div>
  );
}
