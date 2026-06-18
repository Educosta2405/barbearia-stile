import { db } from "@/lib/db";
import {
  NotificationStatus,
  NotificationType,
  type NotificationType as NType,
} from "@/lib/enums";
import { formatBR } from "@/lib/datetime";
import { BRAND } from "@/lib/brand";

/**
 * Envia notificação por e-mail referente a um agendamento e registra na tabela
 * Notification (auditoria). Se RESEND_API_KEY não estiver configurada, apenas
 * loga — o sistema continua funcionando em dev sem credenciais.
 */
export async function notifyAppointment(
  appointmentId: string,
  type: NType,
): Promise<void> {
  const appt = await db.appointment.findUnique({
    where: { id: appointmentId },
    include: { customer: true, barber: { include: { user: true } }, service: true },
  });
  if (!appt) return;

  const recipient = appt.customer.email;
  const subject = subjectFor(type, appt.service.name);
  const body = bodyFor(type, {
    customer: appt.customer.name ?? "cliente",
    service: appt.service.name,
    barber: appt.barber.user.name ?? "barbeiro",
    when: formatBR(appt.startTime),
  });

  const record = await db.notification.create({
    data: {
      appointmentId,
      type,
      recipient,
      status: NotificationStatus.PENDING,
    },
  });

  try {
    await deliverEmail({ to: recipient, subject, text: body });
    await db.notification.update({
      where: { id: record.id },
      data: { status: NotificationStatus.SENT, sentAt: new Date() },
    });
  } catch (err) {
    await db.notification.update({
      where: { id: record.id },
      data: {
        status: NotificationStatus.FAILED,
        error: err instanceof Error ? err.message : "unknown",
      },
    });
  }
}

function subjectFor(type: NType, service: string): string {
  switch (type) {
    case NotificationType.CONFIRMATION:
      return `Agendamento recebido — ${service}`;
    case NotificationType.CANCELLATION:
      return `Agendamento cancelado — ${service}`;
    case NotificationType.RESCHEDULE:
      return `Agendamento remarcado — ${service}`;
    case NotificationType.REMINDER:
      return `Lembrete do seu horário — ${service}`;
    default:
      return "Atualização do seu agendamento";
  }
}

function bodyFor(
  type: NType,
  data: { customer: string; service: string; barber: string; when: string },
): string {
  const head = `Olá, ${data.customer}!`;
  const detail = `Serviço: ${data.service}\nBarbeiro: ${data.barber}\nQuando: ${data.when}`;
  switch (type) {
    case NotificationType.CONFIRMATION:
      return `${head}\n\nRecebemos seu agendamento.\n\n${detail}\n\nAté breve!`;
    case NotificationType.CANCELLATION:
      return `${head}\n\nSeu agendamento foi cancelado.\n\n${detail}`;
    case NotificationType.RESCHEDULE:
      return `${head}\n\nSeu agendamento foi remarcado.\n\n${detail}`;
    case NotificationType.REMINDER:
      return `${head}\n\nLembrete do seu horário.\n\n${detail}`;
    default:
      return `${head}\n\n${detail}`;
  }
}

async function deliverEmail(msg: {
  to: string;
  subject: string;
  text: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? `${BRAND.name} <onboarding@resend.dev>`;

  if (!apiKey) {
    // Dev sem credenciais: apenas loga.
    console.info(`[email:dev] -> ${msg.to} | ${msg.subject}\n${msg.text}`);
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: msg.to,
    subject: msg.subject,
    text: msg.text,
  });
  if (error) throw new Error(error.message);
}
