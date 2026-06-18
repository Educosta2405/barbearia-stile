import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { UserRole } from "@/lib/enums";

// Reexporta os helpers puros para manter os imports existentes (@/lib/session).
export { isStaff, landingPath } from "@/lib/roles";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireStaff() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== UserRole.ADMIN && user.role !== UserRole.BARBER) {
    redirect("/");
  }
  return user;
}
