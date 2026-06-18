import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import {
  ACTIVE_APPOINTMENT_STATUSES,
  AppointmentStatus,
  UserRole,
} from "@/lib/enums";
import { BUSINESS_HOURS, MAX_ADVANCE_DAYS, MIN_LEAD_TIME_MINUTES } from "@/lib/config";
import { addMinutes, overlaps, timeToMinutes } from "@/lib/datetime";
import { Conflict, Forbidden, Invalid, NotFound } from "@/lib/errors";
import { notifyAppointment } from "@/server/services/notifications";

/** Violação de constraint única do Prisma (ex.: (barberId, startTime)). */
function isUniqueViolation(err: unknown): boolean {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002"
  );
}

/** Valida que o horário cai dentro do expediente do dia. */
function assertWithinBusinessHours(start: Date, end: Date) {
  const hours = BUSINESS_HOURS[start.getDay()];
  if (!hours) throw Invalid("A barbearia está fechada nesse dia");
  const openMin = timeToMinutes(hours.open);
  const closeMin = timeToMinutes(hours.close);
  const startMin = start.getHours() * 60 + start.getMinutes();
  const endMin = end.getHours() * 60 + end.getMinutes();
  if (startMin < openMin || endMin > closeMin) {
    throw Invalid("Horário fora do expediente");
  }
}

/**
 * Garante, dentro da transação, que [start,end) está livre para o barbeiro:
 * sem sobreposição com agendamentos ativos e sem colidir com bloqueios (TimeOff).
 * Usado tanto na criação quanto no reagendamento.
 */
async function assertSlotAvailable(
  tx: Prisma.TransactionClient,
  params: {
    barberId: string;
    start: Date;
    end: Date;
    excludeAppointmentId?: string;
  },
) {
  const { barberId, start, end, excludeAppointmentId } = params;

  const sameDayStart = new Date(start);
  sameDayStart.setHours(0, 0, 0, 0);
  const sameDayEnd = new Date(start);
  sameDayEnd.setHours(23, 59, 59, 999);

  const existing = await tx.appointment.findMany({
    where: {
      barberId,
      status: { in: ACTIVE_APPOINTMENT_STATUSES },
      startTime: { gte: sameDayStart, lte: sameDayEnd },
      ...(excludeAppointmentId ? { id: { not: excludeAppointmentId } } : {}),
    },
    select: { startTime: true, endTime: true },
  });
  if (existing.some((a) => overlaps(start, end, a.startTime, a.endTime))) {
    throw Conflict("Esse horário acabou de ser ocupado");
  }

  const blocked = await tx.timeOff.findFirst({
    where: { barberId, startTime: { lt: end }, endTime: { gt: start } },
    select: { id: true },
  });
  if (blocked) throw Conflict("Horário indisponível (bloqueado)");
}

/**
 * Cria um agendamento de forma segura contra overbooking.
 *
 * Em transação: revalida que o slot continua livre (sobreposição) e cria.
 * A constraint única (barberId, startTime) é a última linha de defesa para
 * corridas no mesmo instante exato.
 */
export async function createAppointment(input: {
  customerId: string;
  barberId: string;
  serviceId: string;
  startTime: string; // ISO
  notes?: string;
}) {
  const start = new Date(input.startTime);
  if (Number.isNaN(start.getTime())) throw Invalid("Horário inválido");

  const now = new Date();
  if (start.getTime() < now.getTime() + MIN_LEAD_TIME_MINUTES * 60_000) {
    throw Invalid("Antecedência mínima para agendar não respeitada");
  }
  const maxDate = addMinutes(now, MAX_ADVANCE_DAYS * 24 * 60);
  if (start > maxDate) throw Invalid("Data muito distante para agendar");

  const service = await db.service.findUnique({
    where: { id: input.serviceId },
  });
  if (!service || !service.active) throw NotFound("Serviço não encontrado");

  const barber = await db.barber.findUnique({ where: { id: input.barberId } });
  if (!barber || !barber.active) throw NotFound("Barbeiro não encontrado");

  const end = addMinutes(start, service.durationMinutes);
  assertWithinBusinessHours(start, end);

  try {
    const appointment = await db.$transaction(async (tx) => {
      await assertSlotAvailable(tx, { barberId: input.barberId, start, end });
      return tx.appointment.create({
        data: {
          customerId: input.customerId,
          barberId: input.barberId,
          serviceId: input.serviceId,
          startTime: start,
          endTime: end,
          status: AppointmentStatus.PENDING,
          notes: input.notes,
        },
      });
    });

    await notifyAppointment(appointment.id, "CONFIRMATION");
    return appointment;
  } catch (err: unknown) {
    // Última linha de defesa: corrida no mesmo instante exato → constraint única.
    if (isUniqueViolation(err)) {
      throw Conflict("Esse horário acabou de ser ocupado");
    }
    throw err;
  }
}

async function loadOwnedAppointment(appointmentId: string) {
  const appt = await db.appointment.findUnique({
    where: { id: appointmentId },
  });
  if (!appt) throw NotFound("Agendamento não encontrado");
  return appt;
}

/** Cancela um agendamento. Cliente só cancela o próprio; staff cancela qualquer. */
export async function cancelAppointment(params: {
  appointmentId: string;
  userId: string;
  role: string;
}) {
  const appt = await loadOwnedAppointment(params.appointmentId);
  const isStaff =
    params.role === UserRole.ADMIN || params.role === UserRole.BARBER;
  if (!isStaff && appt.customerId !== params.userId) {
    throw Forbidden("Você não pode cancelar este agendamento");
  }
  if (
    appt.status === AppointmentStatus.CANCELLED ||
    appt.status === AppointmentStatus.COMPLETED
  ) {
    throw Invalid("Agendamento não pode ser cancelado");
  }

  const updated = await db.appointment.update({
    where: { id: appt.id },
    data: { status: AppointmentStatus.CANCELLED },
  });
  await notifyAppointment(updated.id, "CANCELLATION");
  return updated;
}

/** Reagenda para um novo horário, revalidando disponibilidade em transação. */
export async function rescheduleAppointment(params: {
  appointmentId: string;
  userId: string;
  role: string;
  startTime: string; // ISO
}) {
  const appt = await loadOwnedAppointment(params.appointmentId);
  const isStaff =
    params.role === UserRole.ADMIN || params.role === UserRole.BARBER;
  if (!isStaff && appt.customerId !== params.userId) {
    throw Forbidden("Você não pode reagendar este agendamento");
  }

  const service = await db.service.findUnique({
    where: { id: appt.serviceId },
  });
  if (!service) throw NotFound("Serviço não encontrado");

  const start = new Date(params.startTime);
  if (Number.isNaN(start.getTime())) throw Invalid("Horário inválido");
  const end = addMinutes(start, service.durationMinutes);
  assertWithinBusinessHours(start, end);

  try {
    const updated = await db.$transaction(async (tx) => {
      await assertSlotAvailable(tx, {
        barberId: appt.barberId,
        start,
        end,
        excludeAppointmentId: appt.id,
      });
      return tx.appointment.update({
        where: { id: appt.id },
        data: { startTime: start, endTime: end },
      });
    });

    await notifyAppointment(updated.id, "RESCHEDULE");
    return updated;
  } catch (err: unknown) {
    if (isUniqueViolation(err)) {
      throw Conflict("Esse horário acabou de ser ocupado");
    }
    throw err;
  }
}

/** Transição de status feita pelo staff (confirmar / concluir / no-show). */
export async function setAppointmentStatus(params: {
  appointmentId: string;
  status: AppointmentStatus;
}) {
  return db.appointment.update({
    where: { id: params.appointmentId },
    data: { status: params.status },
  });
}
