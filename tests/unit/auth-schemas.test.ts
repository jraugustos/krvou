import { describe, it, expect } from "vitest";
import { LoginSchema, SignupSchema } from "@/types/auth";

describe("LoginSchema", () => {
  it("accepts valid email and password", () => {
    const result = LoginSchema.safeParse({
      email: "user@test.com",
      password: "123456",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = LoginSchema.safeParse({
      email: "not-an-email",
      password: "123456",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it("rejects empty password", () => {
    const result = LoginSchema.safeParse({
      email: "user@test.com",
      password: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toBeDefined();
    }
  });

  it("rejects missing fields", () => {
    const result = LoginSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("SignupSchema", () => {
  it("accepts valid name, email, and password", () => {
    const result = SignupSchema.safeParse({
      name: "Junior",
      email: "junior@test.com",
      password: "12345678",
    });
    expect(result.success).toBe(true);
  });

  it("rejects name shorter than 2 characters", () => {
    const result = SignupSchema.safeParse({
      name: "J",
      email: "junior@test.com",
      password: "12345678",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.name?.[0]).toContain("min 2");
    }
  });

  it("rejects password shorter than 8 characters", () => {
    const result = SignupSchema.safeParse({
      name: "Junior",
      email: "junior@test.com",
      password: "1234567",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.password?.[0]).toContain("8 caracteres");
    }
  });

  it("rejects invalid email", () => {
    const result = SignupSchema.safeParse({
      name: "Junior",
      email: "bad-email",
      password: "12345678",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it("trims name and email", () => {
    const result = SignupSchema.safeParse({
      name: "  Junior  ",
      email: "  junior@test.com  ",
      password: "12345678",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Junior");
      expect(result.data.email).toBe("junior@test.com");
    }
  });
});
