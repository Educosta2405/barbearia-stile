"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/session";
import {
  AppointmentStatus,
  UserRole,
  type AppointmentStatus as AStatus,
} from "@/lib/enums";
import { hashPassword } from "@/lib/password";
import { cancelAppointment, setAppointmentStatus } from "@/server/services/appointments";

export type AdminResult = { ok: boolean; error?: string };

const STAFF_STATUS = new Set<string>([
  AppointmentStatus.CONFIRMED,
  AppointmentStatus.COMPLETED,
  AppointmentStatus.NO_SHOW,
]);

/** Confirmar / concluir / no-show. */
export async function updateAppointmentStatusAction(
  appointmentId: string,
  status: AStatus,
): Promise<AdminResult> {
  await requireStaff();
  if (!STAFF_STATUS.has(status)) return { ok: false, error: "Status inválido" };
  await setAppointmentStatus({ appointmentId, status });
  revalidatePath("/admin");
  return { ok: true };
}

export async function cancelAsStaffAction(appointmentId: string): Promise<AdminResult> {
  const staff = await requireStaff();
  try {
    await cancelAppointment({ appointmentId, userId: staff.id, role: staff.role ?? UserRole.ADMIN });
    revalidatePath("/admin");
    return { ok: true };
  } catch {
    return { ok: false, error: "Não foi possível cancelar" };
  }
}

// ---------------- Bloqueio de horário ----------------
const blockSchema = z.object({
  barberId: z.string().min(1),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  reason: z.string().max(120).optional(),
});

export async function createTimeOffAction(input: {
  barberId: string;
  startTime: string;
  endTime: string;
  reason?: string;
}): Promise<AdminResult> {
  await requireStaff();
  const parsed = blockSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Dados inválidos" };
  if (new Date(parsed.data.endTime) <= new Date(parsed.data.startTime)) {
    return { ok: false, error: "Fim deve ser depois do início" };
  }
  await db.timeOff.create({ data: parsed.data });
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteTimeOffAction(id: string): Promise<AdminResult> {
  await requireStaff();
  await db.timeOff.delete({ where: { id } });
  revalidatePath("/admin");
  return { ok: true };
}

// ---------------- Barbeiros ----------------
const barberSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  bio: z.string().max(160).optional(),
});

export async function createBarberAction(input: {
  name: string;
  email: string;
  password: string;
  bio?: string;
}): Promise<AdminResult> {
  await requireStaff();
  const parsed = barberSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Dados inválidos" };
  const email = parsed.data.email.toLowerCase().trim();

  const exists = await db.user.findUnique({ where: { email } });
  if (exists) return { ok: false, error: "E-mail já cadastrado" };

  const services = await db.service.findMany({ select: { id: true } });
  await db.user.create({
    data: {
      email,
      name: parsed.data.name,
      role: UserRole.BARBER,
      passwordHash: hashPassword(parsed.data.password),
      emailVerified: new Date(),
      barber: {
        create: {
          bio: parsed.data.bio,
          services: { create: services.map((s) => ({ serviceId: s.id })) },
        },
      },
    },
  });
  revalidatePath("/admin/barbeiros");
  return { ok: true };
}

export async function toggleBarberAction(barberId: string, active: boolean): Promise<AdminResult> {
  await requireStaff();
  await db.barber.update({ where: { id: barberId }, data: { active } });
  revalidatePath("/admin/barbeiros");
  return { ok: true };
}

// ---------------- Serviços ----------------
const serviceSchema = z.object({
  name: z.string().min(2).max(80),
  durationMinutes: z.coerce.number().int().min(5).max(480),
  priceCents: z.coerce.number().int().min(0).max(10_000_00),
});

export async function createServiceAction(input: {
  name: string;
  durationMinutes: number;
  priceCents: number;
}): Promise<AdminResult> {
  await requireStaff();
  const parsed = serviceSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Dados inválidos" };

  const service = await db.service.create({ data: parsed.data });
  // vincula a todos os barbeiros existentes
  const barbers = await db.barber.findMany({ select: { id: true } });
  if (barbers.length) {
    await db.barberService.createMany({
      data: barbers.map((b) => ({ barberId: b.id, serviceId: service.id })),
    });
  }
  revalidatePath("/admin/servicos");
  return { ok: true };
}

export async function updateServiceAction(
  id: string,
  input: { name: string; durationMinutes: number; priceCents: number },
): Promise<AdminResult> {
  await requireStaff();
  const parsed = serviceSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Dados inválidos" };
  await db.service.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/servicos");
  return { ok: true };
}

export async function toggleServiceAction(id: string, active: boolean): Promise<AdminResult> {
  await requireStaff();
  await db.service.update({ where: { id }, data: { active } });
  revalidatePath("/admin/servicos");
  return { ok: true };
}
