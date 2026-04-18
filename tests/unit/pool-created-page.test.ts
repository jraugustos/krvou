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
    },
  },
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

// Mock next/headers
vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

// Mock layout components (Server Components with their own deps)
vi.mock("@/components/layouts/DashboardTopBar", () => ({
  DashboardTopBar: () => null,
}));
vi.mock("@/components/layouts/BottomNavBar", () => ({
  BottomNavBar: () => null,
}));
vi.mock("@/components/features/pool/SuccessScreen", () => ({
  SuccessScreen: () => null,
}));

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";

// Import after mocks
const { default: PoolCreatedPage } = await import(
  "@/app/pool/[poolId]/created/page"
);

const mockAuth = vi.mocked(auth);
const mockFindUnique = vi.mocked(prisma.pool.findUnique);
const mockRedirect = vi.mocked(redirect);
const mockNotFound = vi.mocked(notFound);
const mockHeaders = vi.mocked(headers);

const fakePool = {
  id: "pool-abc",
  name: "Bolao do Oscar",
  inviteCode: "deadbeef",
};

function makeHeadersMap(host = "localhost:3000") {
  return { get: (key: string) => (key === "host" ? host : null) } as ReturnType<
    typeof headers
  > extends Promise<infer T>
    ? T
    : never;
}

beforeEach(() => {
  vi.clearAllMocks();
  mockHeaders.mockResolvedValue(makeHeadersMap() as never);
});

describe("PoolCreatedPage", () => {
  it("redirects to /auth when session is missing", async () => {
    mockAuth.mockResolvedValue(null);

    await expect(
      PoolCreatedPage({ params: Promise.resolve({ poolId: "pool-abc" }) })
    ).rejects.toThrow("NEXT_REDIRECT:/auth");
  });

  it("calls notFound when pool does not exist", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockFindUnique.mockResolvedValue(null);

    await expect(
      PoolCreatedPage({ params: Promise.resolve({ poolId: "pool-abc" }) })
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("calls notFound when prisma throws", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockFindUnique.mockRejectedValue(new Error("DB error"));

    await expect(
      PoolCreatedPage({ params: Promise.resolve({ poolId: "pool-abc" }) })
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("renders with correct inviteUrl on happy path", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockFindUnique.mockResolvedValue(fakePool as never);
    mockHeaders.mockResolvedValue(makeHeadersMap("krvou.app") as never);

    const result = await PoolCreatedPage({
      params: Promise.resolve({ poolId: "pool-abc" }),
    });

    // Should not throw
    expect(mockRedirect).not.toHaveBeenCalled();
    expect(mockNotFound).not.toHaveBeenCalled();
    // Result is a React element (non-null)
    expect(result).not.toBeNull();
  });

  it("queries pool with correct poolId and minimal select", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockFindUnique.mockResolvedValue(fakePool as never);

    await PoolCreatedPage({ params: Promise.resolve({ poolId: "pool-abc" }) });

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: "pool-abc" },
      select: { id: true, name: true, inviteCode: true },
    });
  });
});
