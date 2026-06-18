import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { UserRole } from "@/lib/enums";
import { Conflict } from "@/lib/errors";
import type { RegisterInput } from "@/lib/validations/auth";

/** Cria uma conta de cliente (CUSTOMER). */
export async function registerCustomer(input: RegisterInput) {
  const email = input.email.toLowerCase().trim();
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) throw Conflict("Já existe uma conta com este e-mail");

  return db.user.create({
    data: {
      email,
      name: input.name.trim(),
      phone: input.phone || null,
      passwordHash: hashPassword(input.password),
      role: UserRole.CUSTOMER,
    },
    select: { id: true, email: true, name: true },
  });
}
