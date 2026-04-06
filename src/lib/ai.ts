import Anthropic from "@anthropic-ai/sdk";
import type {
  AnalyzeEventResponse,
  SuggestCategoryResponse,
  GenerateScoringResponse,
  RebalanceScoringResponse,
  CategoryType,
} from "@/types/wizard";

const client = new Anthropic();

const MODEL = "claude-sonnet-4-6";

function parseJSON<T>(text: string): T {
  const match = text.match(/```json\s*([\s\S]*?)```/) || text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in response");
  const jsonStr = match[1] ?? match[0];
  return JSON.parse(jsonStr) as T;
}

async function askClaude(system: string, userMessage: string): Promise<string> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system,
    messages: [{ role: "user", content: userMessage }],
  });
  const textBlock = response.content.find(
    (b): b is Anthropic.TextBlock => b.type === "text"
  );
  if (!textBlock) throw new Error("No text response from AI");
  return textBlock.text;
}

export async function analyzeEvent(
  eventText: string
): Promise<AnalyzeEventResponse> {
  const system = `Voce e um assistente especializado em boloes esportivos.
O usuario vai descrever um evento. Extraia o nome do evento, o tipo e sugira categorias de palpite.

Responda APENAS com JSON neste formato:
{
  "name": "Nome do evento",
  "eventType": "tipo (ex: football_tournament, football_league, generic)",
  "categories": [
    { "name": "Nome", "description": "Descricao curta", "type": "single_choice|exact_score|free_text" }
  ]
}

Sugira entre 4 e 8 categorias relevantes para o evento. Tipos validos: single_choice, exact_score, free_text.`;

  const text = await askClaude(system, eventText);
  return parseJSON<AnalyzeEventResponse>(text);
}

export async function suggestCategory(
  eventName: string,
  existingCategories: string[],
  request: string
): Promise<SuggestCategoryResponse> {
  const system = `Voce e um assistente especializado em boloes esportivos.
O usuario quer adicionar uma nova categoria de palpite para o evento "${eventName}".
Categorias ja existentes: ${existingCategories.join(", ")}

Responda APENAS com JSON neste formato:
{ "name": "Nome", "description": "Descricao curta", "type": "single_choice|exact_score|free_text" }

Tipos validos: single_choice, exact_score, free_text.`;

  const text = await askClaude(system, request);
  return parseJSON<SuggestCategoryResponse>(text);
}

export async function generateScoringRules(
  eventName: string,
  categories: Array<{ name: string; type: CategoryType }>
): Promise<GenerateScoringResponse> {
  const system = `Voce e um assistente especializado em boloes esportivos.
Crie regras de pontuacao equilibradas para o bolao "${eventName}".

Categorias do bolao:
${categories.map((c) => `- ${c.name} (${c.type})`).join("\n")}

Agrupe as regras em 2-3 grupos tematicos. Cada grupo com 2-4 regras.
Pontos devem variar de 5 a 50, equilibrados.

Responda APENAS com JSON neste formato:
{
  "groups": [
    {
      "group": "Nome do Grupo",
      "groupColor": "cyan|gold",
      "rules": [
        { "name": "Nome da regra", "points": 10 }
      ]
    }
  ]
}`;

  const categoriesStr = categories.map((c) => `${c.name} (${c.type})`).join(", ");
  const text = await askClaude(system, `Categorias: ${categoriesStr}`);
  return parseJSON<GenerateScoringResponse>(text);
}

export async function rebalanceScoring(
  currentRules: GenerateScoringResponse,
  request: string
): Promise<RebalanceScoringResponse> {
  const system = `Voce e um assistente especializado em boloes esportivos.
O usuario quer rebalancear as regras de pontuacao do bolao.

Regras atuais:
${JSON.stringify(currentRules, null, 2)}

Ajuste os valores conforme o pedido do usuario, mantendo a estrutura de grupos.
Pontos devem estar entre 1 e 999.

Responda APENAS com JSON no mesmo formato das regras atuais.`;

  const text = await askClaude(system, request);
  return parseJSON<RebalanceScoringResponse>(text);
}
