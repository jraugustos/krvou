import { describe, it, expect, vi, beforeEach } from "vitest";

// Hoist MockAuthError so vi.mock can use it
const { MockAuthError } = vi.hoisted(() => {
  class MockAuthError extends Error {
    type: string;
    constructor(type: string) {
      super(type);
      this.name = "AuthError";
      this.type = type;
    }
  }
  return { MockAuthError };
});

vi.mock("next-auth", () => ({
  AuthError: MockAuthError,
}));

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

// Mock auth signIn
const mockSignIn = vi.fn();
vi.mock("@/lib/auth", () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
}));

// Mock bcryptjs
vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed-password"),
  },
}));

// Mock next/headers (cookies — added in issue-07 for pendingInvite)
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

import { cookies } from "next/headers";

function makeCookieStore(values: Record<string, string> = {}) {
  return {
    get: (key: string) =>
      values[key] ? { name: key, value: values[key] } : undefined,
    set: vi.fn(),
    delete: vi.fn(),
  } as unknown as Awaited<ReturnType<typeof cookies>>;
}

import { loginAction, signupAction } from "@/actions/auth";
import { prisma } from "@/lib/prisma";

function makeFormData(data: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(data)) {
    fd.set(key, value);
  }
  return fd;
}

const mockCookies = vi.mocked(cookies);

describe("loginAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCookies.mockResolvedValue(makeCookieStore() as never);
  });

  it("returns validation errors for invalid email", async () => {
    const fd = makeFormData({ email: "bad", password: "123456" });
    const result = await loginAction(null, fd);
    expect(result?.errors?.email).toBeDefined();
  });

  it("returns validation errors for empty password", async () => {
    const fd = makeFormData({ email: "user@test.com", password: "" });
    const result = await loginAction(null, fd);
    expect(result?.errors?.password).toBeDefined();
  });

  it("returns generic error for wrong credentials", async () => {
    mockSignIn.mockRejectedValueOnce(new MockAuthError("CredentialsSignin"));

    const fd = makeFormData({ email: "user@test.com", password: "wrongpass" });
    const result = await loginAction(null, fd);
    expect(result?.message).toBe("Email ou senha incorretos");
  });

  it("does not reveal which specific field is wrong on login failure", async () => {
    mockSignIn.mockRejectedValueOnce(new MockAuthError("CredentialsSignin"));

    const fd = makeFormData({ email: "user@test.com", password: "wrongpass" });
    const result = await loginAction(null, fd);
    // Should return generic message, not field-specific errors
    expect(result?.errors).toBeUndefined();
    expect(result?.message).toBe("Email ou senha incorretos");
    // Should NOT say things like "email nao encontrado" or "senha errada"
    expect(result?.message).not.toContain("nao encontrado");
    expect(result?.message).not.toContain("errada");
  });

  it("re-throws non-AuthError exceptions", async () => {
    mockSignIn.mockRejectedValueOnce(new Error("NEXT_REDIRECT"));

    const fd = makeFormData({ email: "user@test.com", password: "123456" });
    await expect(loginAction(null, fd)).rejects.toThrow("NEXT_REDIRECT");
  });
});

describe("signupAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCookies.mockResolvedValue(makeCookieStore() as never);
  });

  it("returns validation errors for short name", async () => {
    const fd = makeFormData({
      name: "J",
      email: "j@test.com",
      password: "12345678",
    });
    const result = await signupAction(null, fd);
    expect(result?.errors?.name).toBeDefined();
    expect(result?.errors?.name?.[0]).toContain("min 2");
  });

  it("returns validation errors for short password", async () => {
    const fd = makeFormData({
      name: "Junior",
      email: "j@test.com",
      password: "1234567",
    });
    const result = await signupAction(null, fd);
    expect(result?.errors?.password).toBeDefined();
    expect(result?.errors?.password?.[0]).toContain("8 caracteres");
  });

  it("returns error for duplicate email", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      id: "existing",
      name: "Existing",
      email: "j@test.com",
      emailVerified: null,
      password: "hashed",
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const fd = makeFormData({
      name: "Junior",
      email: "j@test.com",
      password: "12345678",
    });
    const result = await signupAction(null, fd);
    expect(result?.errors?.email?.[0]).toContain("Ja existe uma conta");
  });

  it("creates user and calls signIn on valid data", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);
    vi.mocked(prisma.user.create).mockResolvedValueOnce({
      id: "new-user",
      name: "Junior",
      email: "j@test.com",
      emailVerified: null,
      password: "hashed-password",
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockSignIn.mockResolvedValueOnce(undefined);

    const fd = makeFormData({
      name: "Junior",
      email: "j@test.com",
      password: "12345678",
    });
    const result = await signupAction(null, fd);

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: "Junior",
        email: "j@test.com",
        password: "hashed-password",
      },
    });
    expect(mockSignIn).toHaveBeenCalledWith("credentials", {
      email: "j@test.com",
      password: "12345678",
      redirectTo: "/home",
    });
    expect(result).toBeNull();
  });

  it("returns error when prisma.create fails", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);
    vi.mocked(prisma.user.create).mockRejectedValueOnce(
      new Error("DB connection failed")
    );

    const fd = makeFormData({
      name: "Junior",
      email: "j@test.com",
      password: "12345678",
    });
    const result = await signupAction(null, fd);
    expect(result?.message).toBe("Erro ao criar conta");
  });
});
