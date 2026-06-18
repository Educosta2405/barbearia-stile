/**
 * Enums de domínio.
 *
 * O SQLite não suporta enum no banco, então os campos são `String` no Prisma.
 * Aqui ficam os valores válidos + tipos, usados na aplicação e na validação Zod.
 * Ao migrar para PostgreSQL, estes podem virar enums nativos sem alterar a app.
 */

export const UserRole = {
  CUSTOMER: "CUSTOMER",
  BARBER: "BARBER",
  ADMIN: "ADMIN",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const AppointmentStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  NO_SHOW: "NO_SHOW",
} as const;
export type AppointmentStatus =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus];

/** Status que ainda ocupam o slot na agenda (para cálculo de conflito). */
export const ACTIVE_APPOINTMENT_STATUSES: AppointmentStatus[] = [
  AppointmentStatus.PENDING,
  AppointmentStatus.CONFIRMED,
];

export const NotificationType = {
  CONFIRMATION: "CONFIRMATION",
  CANCELLATION: "CANCELLATION",
  REMINDER: "REMINDER",
  RESCHEDULE: "RESCHEDULE",
} as const;
export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export const NotificationChannel = {
  EMAIL: "EMAIL",
} as const;
export type NotificationChannel =
  (typeof NotificationChannel)[keyof typeof NotificationChannel];

export const NotificationStatus = {
  PENDING: "PENDING",
  SENT: "SENT",
  FAILED: "FAILED",
} as const;
export type NotificationStatus =
  (typeof NotificationStatus)[keyof typeof NotificationStatus];
