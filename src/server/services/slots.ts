import { db } from "@/lib/db";
import { ACTIVE_APPOINTMENT_STATUSES } from "@/lib/enums";
import {
  BUSINESS_HOURS,
  SLOT_INTERVAL_MINUTES,
  MIN_LEAD_TIME_MINUTES,
} from "@/lib/config";
import {
  addMinutes,
  dateAtMinutes,
  dayRange,
  overlaps,
  timeToMinutes,
} from "@/lib/datetime";
import { NotFound } from "@/lib/errors";

export interface Slot {
  /** ISO string do início do slot. */
  startTime: string;
  /** ISO string do fim (início + duração do serviço). */
  endTime: string;
}

/**
 * Calcula os horários livres de um barbeiro em uma data, para um serviço.
 *
 * Disponibilidade = expediente do dia
 *   − agendamentos ativos (PENDING/CONFIRMED)
 *   − horários bloqueados (TimeOff)
 *   − antecedência mínima
 */
export async function getAvailableSlots(params: {
  barberId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
}): Promise<Slot[]> {
  const { barberId, serviceId, date } = params;

  const service = await db.service.findUnique({ where: { id: serviceId } });
  if (!service || !service.active) throw NotFound("Serviço não encontrado");

  const weekday = dateAtMinutes(date, 0).getDay();
  const hours = BUSINESS_HOURS[weekday];
  if (!hours) return []; // fechado nesse dia

  const openMin = timeToMinutes(hours.open);
  const closeMin = timeToMinutes(hours.close);
  const duration = service.durationMinutes;

  const { start: dayStart, end: dayEnd } = dayRange(date);

  // Agendamentos que ocupam a agenda nesse dia.
  const appointments = await db.appointment.findMany({
    where: {
      barberId,
      status: { in: ACTIVE_APPOINTMENT_STATUSES },
      startTime: { gte: dayStart, lte: dayEnd },
    },
    select: { startTime: true, endTime: true },
  });

  // Bloqueios (folga/almoço) que tocam esse dia.
  const timeOffs = await db.timeOff.findMany({
    where: {
      barberId,
      startTime: { lte: dayEnd },
      endTime: { gte: dayStart },
    },
    select: { startTime: true, endTime: true },
  });

  const busy = [...appointments, ...timeOffs];
  const now = new Date();
  const earliest = addMinutes(now, MIN_LEAD_TIME_MINUTES);

  const slots: Slot[] = [];
  for (let m = openMin; m + duration <= closeMin; m += SLOT_INTERVAL_MINUTES) {
    const start = dateAtMinutes(date, m);
    const end = addMinutes(start, duration);

    if (start < earliest) continue; // respeita antecedência mínima

    const conflict = busy.some((b) =>
      overlaps(start, end, b.startTime, b.endTime),
    );
    if (conflict) continue;

    slots.push({ startTime: start.toISOString(), endTime: end.toISOString() });
  }

  return slots;
}
