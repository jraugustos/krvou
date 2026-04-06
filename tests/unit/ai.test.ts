import { describe, it, expect, vi, beforeEach } from "vitest";

// Hoist mock so vi.mock can reference it
const { mockCreate } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
}));

vi.mock("@anthropic-ai/sdk", () => ({
  default: class MockAnthropic {
    messages = { create: mockCreate };
  },
}));

import {
  analyzeEvent,
  suggestCategory,
  generateScoringRules,
  rebalanceScoring,
} from "@/lib/ai";

function mockResponse(text: string) {
  mockCreate.mockResolvedValueOnce({
    content: [{ type: "text", text }],
  });
}

describe("AI wrapper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("analyzeEvent", () => {
    it("parses valid JSON response", async () => {
      mockResponse(
        JSON.stringify({
          name: "Copa do Mundo 2026",
          eventType: "football_tournament",
          categories: [
            {
              name: "Campeao",
              description: "Quem sera o campeao",
              type: "single_choice",
            },
          ],
        })
      );

      const result = await analyzeEvent("Copa do Mundo 2026");
      expect(result.name).toBe("Copa do Mundo 2026");
      expect(result.eventType).toBe("football_tournament");
      expect(result.categories).toHaveLength(1);
      expect(result.categories[0].type).toBe("single_choice");
    });

    it("parses JSON wrapped in markdown code block", async () => {
      mockResponse(
        '```json\n{"name": "Test", "eventType": "generic", "categories": []}\n```'
      );

      const result = await analyzeEvent("test");
      expect(result.name).toBe("Test");
    });

    it("throws on empty response", async () => {
      mockCreate.mockResolvedValueOnce({ content: [] });
      await expect(analyzeEvent("test")).rejects.toThrow(
        "No text response from AI"
      );
    });

    it("throws on invalid JSON", async () => {
      mockResponse("this is not JSON");
      await expect(analyzeEvent("test")).rejects.toThrow();
    });
  });

  describe("suggestCategory", () => {
    it("returns a single category", async () => {
      mockResponse(
        JSON.stringify({
          name: "Artilheiro",
          description: "Maior goleador",
          type: "free_text",
        })
      );

      const result = await suggestCategory("Copa", ["Campeao"], "artilheiro");
      expect(result.name).toBe("Artilheiro");
      expect(result.type).toBe("free_text");
    });
  });

  describe("generateScoringRules", () => {
    it("returns grouped rules", async () => {
      mockResponse(
        JSON.stringify({
          groups: [
            {
              group: "Resultados",
              groupColor: "cyan",
              rules: [{ name: "Placar exato", points: 25 }],
            },
          ],
        })
      );

      const result = await generateScoringRules("Copa", [
        { name: "Campeao", type: "single_choice" },
      ]);
      expect(result.groups).toHaveLength(1);
      expect(result.groups[0].rules[0].points).toBe(25);
    });
  });

  describe("rebalanceScoring", () => {
    it("returns rebalanced rules", async () => {
      const currentRules = {
        groups: [
          {
            group: "Resultados",
            groupColor: "cyan" as const,
            rules: [{ name: "Placar", points: 10 }],
          },
        ],
      };

      mockResponse(
        JSON.stringify({
          groups: [
            {
              group: "Resultados",
              groupColor: "cyan",
              rules: [{ name: "Placar", points: 30 }],
            },
          ],
        })
      );

      const result = await rebalanceScoring(currentRules, "aumenta placar");
      expect(result.groups[0].rules[0].points).toBe(30);
    });
  });
});
