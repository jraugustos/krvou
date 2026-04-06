import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Email invalido"),
  password: z.string().min(1, "Senha obrigatoria"),
});

export const SignupSchema = z.object({
  name: z
    .string()
    .min(2, "Nome obrigatorio (min 2 caracteres)")
    .trim(),
  email: z.string().trim().email("Email invalido"),
  password: z
    .string()
    .min(8, "Senha deve ter no minimo 8 caracteres"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type SignupInput = z.infer<typeof SignupSchema>;

export type AuthFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string;
} | null;
