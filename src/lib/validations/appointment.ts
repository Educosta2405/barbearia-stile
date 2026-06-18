import { z } from "zod";

export const createAppointmentSchema = z.object({
  barberId: z.string().min(1, "Selecione um barbeiro"),
  serviceId: z.string().min(1, "Selecione um serviço"),
  // ISO datetime do início do atendimento
  startTime: z.string().datetime({ message: "Horário inválido" }),
  notes: z.string().max(500).optional(),
});

export const rescheduleAppointmentSchema = z.object({
  appointmentId: z.string().min(1),
  startTime: z.string().datetime({ message: "Horário inválido" }),
});

export const availabilityQuerySchema = z.object({
  barberId: z.string().min(1),
  serviceId: z.string().min(1),
  // data no formato YYYY-MM-DD
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type RescheduleAppointmentInput = z.infer<
  typeof rescheduleAppointmentSchema
>;
export type AvailabilityQuery = z.infer<typeof availabilityQuerySchema>;
