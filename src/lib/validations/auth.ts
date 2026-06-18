import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Informe seu nome").max(80),
  email: z.string().email("E-mail inválido"),
  phone: z
    .string()
    .min(8, "Telefone inválido")
    .max(20)
    .optional()
    .or(z.literal("")),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres").max(100),
});

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
