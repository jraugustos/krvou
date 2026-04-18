import { describe, it, expect, vi, beforeEach } from "vitest";
import type React from "react";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    pool: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/components/features/invite/InviteCard", () => ({
  InviteCard: () => null,
}));

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InviteCard } from "@/components/features/invite/InviteCard";

const { default: JoinPage } = await import("@/app/join/[inviteCode]/page");

const mockAuth = vi.mocked(auth);
const mockFindUnique = vi.mocked(prisma.pool.findUnique);

const fakePool = {
  id: "pool-1",
  name: "Bolao do Oscar",
  status: "open",
  creator: { name: "Leo" },
  _count: { members: 5 },
  categories: [
    {
      customName: null,
      isCustom: false,
      productCategory: { name: "Melhor Filme" },
    },
    {
      customName: "Quem vai chorar mais",
      isCustom: true,
      productCategory: null,
    },
  ],
};

/** Traverse a React element tree to find an element by component type */
function findByType(
  node: React.ReactNode,
  type: unknown
): React.ReactElement | null {
  if (!node || typeof node !== "object") return null;
  const el = node as React.ReactElement;
  if (el.type === type) return el;
  const children = (el.props as { children?: React.ReactNode })?.children;
  if (!children) return null;
  if (Array.isArray(children)) {
    for (const child of children) {
      const found = findByType(child, type);
      if (found) return found;
    }
    return null;
  }
  return findByType(children, type);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("JoinPage", () => {
  it("calls notFound when pool does not exist", async () => {
    mockAuth.mockResolvedValue(null as never);
    mockFindUnique.mockResolvedValue(null);

    await expect(
      JoinPage({
        params: Promise.resolve({ inviteCode: "invalid" }),
        searchParams: Promise.resolve({}),
      })
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("calls notFound when prisma throws", async () => {
    mockAuth.mockResolvedValue(null as never);
    mockFindUnique.mockRejectedValue(new Error("DB error"));

    await expect(
      JoinPage({
        params: Promise.resolve({ inviteCode: "abc" }),
        searchParams: Promise.resolve({}),
      })
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("renders InviteCard with isLoggedIn:false when no session", async () => {
    mockAuth.mockResolvedValue(null as never);
    mockFindUnique.mockResolvedValue(fakePool as never);

    const result = await JoinPage({
      params: Promise.resolve({ inviteCode: "abc123" }),
      searchParams: Promise.resolve({}),
    });

    const card = findByType(result, InviteCard);
    expect(card).not.toBeNull();
    const props = card!.props as Record<string, unknown>;
    expect(props.isLoggedIn).toBe(false);
    expect(props.autoJoin).toBe(false);
  });

  it("renders InviteCard with isLoggedIn:true when session exists", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockFindUnique.mockResolvedValue(fakePool as never);

    const result = await JoinPage({
      params: Promise.resolve({ inviteCode: "abc123" }),
      searchParams: Promise.resolve({}),
    });

    const card = findByType(result, InviteCard);
    const props = card!.props as Record<string, unknown>;
    expect(props.isLoggedIn).toBe(true);
    expect(props.autoJoin).toBe(false);
  });

  it("passes autoJoin:true when autoJoin=1 and user is logged in", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockFindUnique.mockResolvedValue(fakePool as never);

    const result = await JoinPage({
      params: Promise.resolve({ inviteCode: "abc123" }),
      searchParams: Promise.resolve({ autoJoin: "1" }),
    });

    const card = findByType(result, InviteCard);
    expect((card!.props as Record<string, unknown>).autoJoin).toBe(true);
  });

  it("passes autoJoin:false when autoJoin=1 but user is not logged in", async () => {
    mockAuth.mockResolvedValue(null as never);
    mockFindUnique.mockResolvedValue(fakePool as never);

    const result = await JoinPage({
      params: Promise.resolve({ inviteCode: "abc123" }),
      searchParams: Promise.resolve({ autoJoin: "1" }),
    });

    const card = findByType(result, InviteCard);
    expect((card!.props as Record<string, unknown>).autoJoin).toBe(false);
  });

  it("passes correct poolData including mapped categories", async () => {
    mockAuth.mockResolvedValue(null as never);
    mockFindUnique.mockResolvedValue(fakePool as never);

    const result = await JoinPage({
      params: Promise.resolve({ inviteCode: "abc123" }),
      searchParams: Promise.resolve({}),
    });

    const card = findByType(result, InviteCard);
    const props = card!.props as Record<string, unknown>;
    expect(props.inviteCode).toBe("abc123");
    expect(props.poolData).toMatchObject({
      poolName: "Bolao do Oscar",
      creatorName: "Leo",
      participantCount: 5,
      categories: ["Melhor Filme", "Quem vai chorar mais"],
      status: "open",
    });
  });
});
