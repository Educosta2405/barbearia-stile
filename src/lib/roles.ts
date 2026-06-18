import { UserRole } from "@/lib/enums";

/**
 * Helpers de papel — funções puras (sem dependência de Auth/DB),
 * portanto facilmente testáveis e usáveis em qualquer camada.
 */
export function isStaff(role?: string): boolean {
  return role === UserRole.ADMIN || role === UserRole.BARBER;
}

/** Página inicial conforme o papel: staff → painel; cliente → agendamento. */
export function landingPath(role?: string): string {
  return isStaff(role) ? "/admin" : "/agendar";
}
