import { Input } from "@/components/ui/input";
import { AIBubble } from "./AIBubble";
import { TemplateChips } from "./TemplateChips";
import type { Template } from "@/types/wizard";

const MOCK_TEMPLATES: Template[] = [
  { id: "copa", label: "Copa do Mundo" },
  { id: "champions", label: "Champions League" },
  { id: "brasileirao", label: "Brasileirao" },
  { id: "custom", label: "Personalizado" },
];

interface StepEventProps {
  eventText: string;
  onEventTextChange: (text: string) => void;
  selectedTemplateId: string | null;
  onTemplateSelect: (id: string) => void;
  onTemplateActivate: (label: string) => void;
}

export function StepEvent({
  eventText,
  onEventTextChange,
  selectedTemplateId,
  onTemplateSelect,
  onTemplateActivate,
}: StepEventProps) {
  function handleTemplateClick(id: string) {
    onTemplateSelect(id);
    const template = MOCK_TEMPLATES.find((t) => t.id === id);
    if (template) {
      onEventTextChange(template.label);
      onTemplateActivate(template.label);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <AIBubble message="Ola! Descreva o evento que voce quer acompanhar no seu bolao. Pode ser um campeonato, uma competicao ou qualquer evento esportivo." />

      <Input
        type="text"
        placeholder="Ex: Copa do Mundo 2026, quero palpites em todos os jogos e no campeao"
        value={eventText}
        onChange={(e) => onEventTextChange(e.target.value)}
      />

      <div className="flex flex-col gap-2">
        <span className="font-heading text-xs font-medium uppercase tracking-wider text-on-surface-variant">
          Ou escolha um template
        </span>
        <TemplateChips
          templates={MOCK_TEMPLATES}
          onSelect={handleTemplateClick}
          selectedId={selectedTemplateId}
        />
      </div>
    </div>
  );
}
