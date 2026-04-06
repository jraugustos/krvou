import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock auth
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    pool: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    betCategory: { create: vi.fn() },
    scoringRule: { create: vi.fn() },
    poolMember: { create: vi.fn() },
    $transaction: vi.fn(),
  },
}));

// Mock AI functions
vi.mock("@/lib/ai", () => ({
  analyzeEvent: vi.fn(),
  suggestCategory: vi.fn(),
  generateScoringRules: vi.fn(),
  rebalanceScoring: vi.fn(),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error("NEXT_REDIRECT");
  }),
}));

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzeEvent, suggestCategory } from "@/lib/ai";
import {
  analyzeEventAction,
  suggestCategoryAction,
  createPoolAction,
} from "@/actions/wizard";

const mockAuth = auth as ReturnType<typeof vi.fn>;
const mockAnalyzeEvent = analyzeEvent as ReturnType<typeof vi.fn>;
const mockSuggestCategory = suggestCategory as ReturnType<typeof vi.fn>;
const mockTransaction = prisma.$transaction as ReturnType<typeof vi.fn>;
const mockFindUnique = prisma.pool.findUnique as ReturnType<typeof vi.fn>;

describe("Wizard Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("analyzeEventAction", () => {
    it("returns error for empty input", async () => {
      const formData = new FormData();
      formData.set("eventText", "");

      const result = await analyzeEventAction(null, formData);
      expect(result?.success).toBe(false);
    });

    it("returns AI response for valid input", async () => {
      const mockData = {
        name: "Copa do Mundo",
        eventType: "football_tournament",
        categories: [
          { name: "Campeao", description: "Campeao do torneio", type: "single_choice" },
        ],
      };
      mockAnalyzeEvent.mockResolvedValueOnce(mockData);

      const formData = new FormData();
      formData.set("eventText", "Copa do Mundo 2026");

      const result = await analyzeEventAction(null, formData);
      expect(result?.success).toBe(true);
      if (result?.success) {
        expect(result.data.name).toBe("Copa do Mundo");
        expect(result.data.categories).toHaveLength(1);
      }
    });

    it("returns error when AI fails", async () => {
      mockAnalyzeEvent.mockRejectedValueOnce(new Error("API error"));

      const formData = new FormData();
      formData.set("eventText", "Copa do Mundo 2026");

      const result = await analyzeEventAction(null, formData);
      expect(result?.success).toBe(false);
      if (!result?.success) {
        expect(result?.error).toContain("Nao consegui entender");
      }
    });
  });

  describe("suggestCategoryAction", () => {
    it("returns error for empty request", async () => {
      const formData = new FormData();
      formData.set("eventName", "Copa");
      formData.set("existingCategories", "[]");
      formData.set("request", "");

      const result = await suggestCategoryAction(null, formData);
      expect(result?.success).toBe(false);
    });

    it("returns new category from AI", async () => {
      mockSuggestCategory.mockResolvedValueOnce({
        name: "Artilheiro",
        description: "Maior goleador",
        type: "free_text",
      });

      const formData = new FormData();
      formData.set("eventName", "Copa");
      formData.set("existingCategories", '["Campeao"]');
      formData.set("request", "artilheiro do torneio");

      const result = await suggestCategoryAction(null, formData);
      expect(result?.success).toBe(true);
      if (result?.success) {
        expect(result.data.name).toBe("Artilheiro");
      }
    });
  });

  describe("createPoolAction", () => {
    it("requires authentication", async () => {
      mockAuth.mockResolvedValueOnce(null);

      const formData = new FormData();
      formData.set("name", "Test");
      formData.set("categories", "[]");
      formData.set("scoringRules", "[]");

      await expect(createPoolAction(null, formData)).rejects.toThrow(
        "NEXT_REDIRECT"
      );
    });

    it("creates pool with transaction and redirects", async () => {
      mockAuth.mockResolvedValueOnce({
        user: { id: "user-1" },
      });
      mockFindUnique.mockResolvedValueOnce(null); // inviteCode unique

      const mockPool = { id: "pool-1" };
      mockTransaction.mockImplementationOnce(async (fn: Function) => {
        return fn({
          pool: { create: vi.fn().mockResolvedValue(mockPool) },
          betCategory: { create: vi.fn().mockResolvedValue({ id: "cat-1" }) },
          scoringRule: { create: vi.fn().mockResolvedValue({ id: "rule-1" }) },
          poolMember: { create: vi.fn().mockResolvedValue({}) },
        });
      });

      const formData = new FormData();
      formData.set("name", "Copa do Mundo 2026");
      formData.set("eventType", "football_tournament");
      formData.set(
        "categories",
        JSON.stringify([
          {
            name: "Campeao",
            description: "Campeao do torneio",
            type: "single_choice",
          },
        ])
      );
      formData.set(
        "scoringRules",
        JSON.stringify([{ name: "Acertou", points: 50 }])
      );

      // Should redirect on success (throws NEXT_REDIRECT)
      await expect(createPoolAction(null, formData)).rejects.toThrow(
        "NEXT_REDIRECT"
      );

      expect(mockTransaction).toHaveBeenCalledOnce();
    });

    it("returns error for invalid data", async () => {
      mockAuth.mockResolvedValueOnce({
        user: { id: "user-1" },
      });

      const formData = new FormData();
      formData.set("name", "");
      formData.set("categories", "[]");
      formData.set("scoringRules", "[]");

      const result = await createPoolAction(null, formData);
      expect(result?.success).toBe(false);
    });
  });
});
