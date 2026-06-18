"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole } from "@/lib/enums";
import { registerSchema, loginSchema } from "@/lib/validations/auth";
import { registerCustomer } from "@/server/services/users";
import { DomainError } from "@/lib/errors";

export type FormState = { error?: string; fieldErrors?: Record<string, string> };

export async function loginAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Preencha e-mail e senha corretamente" };
  }

  // Destino conforme o papel: staff vai direto ao painel; cliente, ao agendamento.
  const account = await db.user.findUnique({
    where: { email: parsed.data.email.toLowerCase().trim() },
    select: { role: true },
  });
  const redirectTo =
    account?.role === UserRole.ADMIN || account?.role === UserRole.BARBER
      ? "/admin"
      : "/agendar";

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo,
    });
    return {};
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "E-mail ou senha incorretos" };
    }
    throw err; // redirect interno do Next
  }
}

export async function registerAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path[0] as string] = issue.message;
    }
    return { error: "Confira os campos destacados", fieldErrors };
  }

  try {
    await registerCustomer(parsed.data);
  } catch (err) {
    if (err instanceof DomainError) return { error: err.message };
    throw err;
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/agendar",
    });
    return {};
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Conta criada. Faça login para continuar." };
    }
    throw err;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
