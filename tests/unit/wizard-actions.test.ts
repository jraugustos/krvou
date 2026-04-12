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
    poolCategory: { create: vi.fn() },
    poolMember: { create: vi.fn() },
    $transaction: vi.fn(),
  },
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error("NEXT_REDIRECT");
  }),
}));

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPoolAction } from "@/actions/wizard";

const mockAuth = auth as ReturnType<typeof vi.fn>;
const mockTransaction = prisma.$transaction as ReturnType<typeof vi.fn>;
const mockFindUnique = prisma.pool.findUnique as ReturnType<typeof vi.fn>;

describe("createPoolAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to /auth when unauthenticated", async () => {
    mockAuth.mockResolvedValueOnce(null);

    const formData = new FormData();
    formData.set("name", "Meu Bolao");
    formData.set("productId", "prod-1");
    formData.set("activeProductCategoryIds", JSON.stringify(["cat-1"]));
    formData.set("customCategoryNames", JSON.stringify([]));

    await expect(createPoolAction(null, formData)).rejects.toThrow(
      "NEXT_REDIRECT"
    );
  });

  it("returns error for empty pool name", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "user-1" } });

    const formData = new FormData();
    formData.set("name", "");
    formData.set("productId", "prod-1");
    formData.set("activeProductCategoryIds", JSON.stringify(["cat-1"]));
    formData.set("customCategoryNames", JSON.stringify([]));

    const result = await createPoolAction(null, formData);
    expect(result?.success).toBe(false);
  });

  it("returns error when name exceeds 60 characters", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "user-1" } });

    const formData = new FormData();
    formData.set("name", "A".repeat(61));
    formData.set("productId", "prod-1");
    formData.set("activeProductCategoryIds", JSON.stringify(["cat-1"]));
    formData.set("customCategoryNames", JSON.stringify([]));

    const result = await createPoolAction(null, formData);
    expect(result?.success).toBe(false);
  });

  it("returns error when no categories are selected", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "user-1" } });

    const formData = new FormData();
    formData.set("name", "Meu Bolao");
    formData.set("productId", "prod-1");
    formData.set("activeProductCategoryIds", JSON.stringify([]));
    formData.set("customCategoryNames", JSON.stringify([]));

    const result = await createPoolAction(null, formData);
    expect(result?.success).toBe(false);
    if (!result?.success) {
      expect(result?.error).toContain("categoria");
    }
  });

  it("creates pool with predefined categories and redirects", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "user-1" } });
    mockFindUnique.mockResolvedValueOnce(null); // inviteCode is unique

    const mockPool = { id: "pool-1" };
    mockTransaction.mockImplementationOnce(async (fn: Function) => {
      return fn({
        pool: { create: vi.fn().mockResolvedValue(mockPool) },
        poolCategory: { create: vi.fn().mockResolvedValue({ id: "poolcat-1" }) },
        poolMember: { create: vi.fn().mockResolvedValue({}) },
      });
    });

    const formData = new FormData();
    formData.set("name", "Copa do Mundo 2026");
    formData.set("productId", "prod-copa");
    formData.set(
      "activeProductCategoryIds",
      JSON.stringify(["cat-1", "cat-2"])
    );
    formData.set("customCategoryNames", JSON.stringify([]));

    await expect(createPoolAction(null, formData)).rejects.toThrow(
      "NEXT_REDIRECT"
    );

    expect(mockTransaction).toHaveBeenCalledOnce();
  });

  it("creates pool with custom categories and redirects", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "user-1" } });
    mockFindUnique.mockResolvedValueOnce(null);

    const mockPool = { id: "pool-2" };
    mockTransaction.mockImplementationOnce(async (fn: Function) => {
      return fn({
        pool: { create: vi.fn().mockResolvedValue(mockPool) },
        poolCategory: { create: vi.fn().mockResolvedValue({ id: "poolcat-1" }) },
        poolMember: { create: vi.fn().mockResolvedValue({}) },
      });
    });

    const formData = new FormData();
    formData.set("name", "Bolao Custom");
    formData.set("productId", "prod-copa");
    formData.set("activeProductCategoryIds", JSON.stringify([]));
    formData.set("customCategoryNames", JSON.stringify(["Quem chora mais"]));

    await expect(createPoolAction(null, formData)).rejects.toThrow(
      "NEXT_REDIRECT"
    );

    expect(mockTransaction).toHaveBeenCalledOnce();
  });

  it("returns error on database failure", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "user-1" } });
    mockFindUnique.mockResolvedValueOnce(null);

    mockTransaction.mockRejectedValueOnce(new Error("DB connection failed"));

    const formData = new FormData();
    formData.set("name", "Meu Bolao");
    formData.set("productId", "prod-1");
    formData.set("activeProductCategoryIds", JSON.stringify(["cat-1"]));
    formData.set("customCategoryNames", JSON.stringify([]));

    const result = await createPoolAction(null, formData);
    expect(result?.success).toBe(false);
    if (!result?.success) {
      expect(result?.error).toContain("Erro ao criar");
    }
  });
});
