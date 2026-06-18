"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import { DomainError } from "@/lib/errors";
import {
  createAppointment,
  cancelAppointment,
  rescheduleAppointment,
} from "@/server/services/appointments";
import {
  createAppointmentSchema,
  rescheduleAppointmentSchema,
} from "@/lib/validations/appointment";

export type ActionResult = { ok: boolean; error?: string };

export async function createAppointmentAction(input: {
  barberId: string;
  serviceId: string;
  startTime: string;
  notes?: string;
}): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = createAppointmentSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  try {
    await createAppointment({ customerId: user.id, ...parsed.data });
    revalidatePath("/perfil");
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    if (err instanceof DomainError) return { ok: false, error: err.message };
    console.error(err);
    return { ok: false, error: "Não foi possível agendar. Tente novamente." };
  }
}

export async function cancelAppointmentAction(
  appointmentId: string,
): Promise<ActionResult> {
  const user = await requireUser();
  try {
    await cancelAppointment({
      appointmentId,
      userId: user.id,
      role: user.role ?? "CUSTOMER",
    });
    revalidatePath("/perfil");
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    if (err instanceof DomainError) return { ok: false, error: err.message };
    return { ok: false, error: "Não foi possível cancelar." };
  }
}

export async function rescheduleAppointmentAction(input: {
  appointmentId: string;
  startTime: string;
}): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = rescheduleAppointmentSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Dados inválidos" };
  }
  try {
    await rescheduleAppointment({
      appointmentId: parsed.data.appointmentId,
      startTime: parsed.data.startTime,
      userId: user.id,
      role: user.role ?? "CUSTOMER",
    });
    revalidatePath("/perfil");
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    if (err instanceof DomainError) return { ok: false, error: err.message };
    return { ok: false, error: "Não foi possível reagendar." };
  }
}
