import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    pool: {
      findUnique: vi.fn(),
    },
    poolMember: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { joinPoolAction, saveInviteAndRedirectAction } from "@/actions/invite";

const mockAuth = vi.mocked(auth);
const mockFindPool = vi.mocked(prisma.pool.findUnique);
const mockFindMember = vi.mocked(prisma.poolMember.findUnique);
const mockCreateMember = vi.mocked(prisma.poolMember.create);
const mockRedirect = vi.mocked(redirect);
const mockCookies = vi.mocked(cookies);

function makeCookieStore(values: Record<string, string> = {}) {
  return {
    get: (key: string) =>
      values[key] ? { name: key, value: values[key] } : undefined,
    set: vi.fn(),
    delete: vi.fn(),
  } as unknown as Awaited<ReturnType<typeof cookies>>;
}

beforeEach(() => {
  vi.clearAllMocks();
  mockCookies.mockResolvedValue(makeCookieStore() as never);
});

// ─── joinPoolAction ───────────────────────────────────────────────────────────

describe("joinPoolAction", () => {
  it("redirects to /auth when not authenticated", async () => {
    mockAuth.mockResolvedValue(null as never);

    await expect(joinPoolAction("pool-1")).rejects.toThrow(
      "NEXT_REDIRECT:/auth"
    );
  });

  it("returns error when pool does not exist", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockFindPool.mockResolvedValue(null);

    const result = await joinPoolAction("pool-1");
    expect(result).toEqual({ success: false, error: "Bolao nao encontrado." });
  });

  it("returns error when pool is not open (in_progress)", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockFindPool.mockResolvedValue({ id: "pool-1", status: "in_progress" } as never);

    const result = await joinPoolAction("pool-1");
    expect(result).toEqual({
      success: false,
      error: "Este bolao nao aceita mais participantes.",
    });
  });

  it("returns error when pool is finished", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockFindPool.mockResolvedValue({ id: "pool-1", status: "finished" } as never);

    const result = await joinPoolAction("pool-1");
    expect(result).toEqual({
      success: false,
      error: "Este bolao nao aceita mais participantes.",
    });
  });

  it("returns alreadyMember:true when user is already a member", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockFindPool.mockResolvedValue({ id: "pool-1", status: "open" } as never);
    mockFindMember.mockResolvedValue({ id: "member-1" } as never);

    const result = await joinPoolAction("pool-1");
    expect(result).toEqual({
      success: true,
      poolId: "pool-1",
      alreadyMember: true,
    });
    expect(mockCreateMember).not.toHaveBeenCalled();
  });

  it("creates PoolMember and returns success on happy path", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockFindPool.mockResolvedValue({ id: "pool-1", status: "open" } as never);
    mockFindMember.mockResolvedValue(null);
    mockCreateMember.mockResolvedValue({} as never);

    const result = await joinPoolAction("pool-1");
    expect(result).toEqual({ success: true, poolId: "pool-1" });
    expect(mockCreateMember).toHaveBeenCalledWith({
      data: { userId: "user-1", poolId: "pool-1", role: "participant" },
    });
  });

  it("returns error on database failure", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockFindPool.mockResolvedValue({ id: "pool-1", status: "open" } as never);
    mockFindMember.mockResolvedValue(null);
    mockCreateMember.mockRejectedValue(new Error("DB error"));

    const result = await joinPoolAction("pool-1");
    expect(result).toEqual({
      success: false,
      error: "Erro ao entrar no bolao. Tente novamente.",
    });
  });
});

// ─── saveInviteAndRedirectAction ─────────────────────────────────────────────

describe("saveInviteAndRedirectAction", () => {
  it("sets pendingInvite cookie and redirects to /auth", async () => {
    const cookieStore = makeCookieStore();
    mockCookies.mockResolvedValue(cookieStore as never);

    await expect(saveInviteAndRedirectAction("abc123")).rejects.toThrow(
      "NEXT_REDIRECT:/auth"
    );

    expect(cookieStore.set).toHaveBeenCalledWith(
      "pendingInvite",
      "abc123",
      expect.objectContaining({ httpOnly: true, path: "/" })
    );
  });
});
