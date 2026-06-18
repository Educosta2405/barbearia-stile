import Link from "next/link";
import { db } from "@/lib/db";
import { AppointmentStatus } from "@/lib/enums";
import { cn } from "@/lib/cn";
import {
  agendaRange,
  shiftDate,
  toISODate,
  type AgendaView,
} from "@/lib/agenda-range";
import { StatusBadge } from "@/components/ui/badge";
import { ArrowRightIcon } from "@/components/ui/icons";
import { AppointmentActions } from "@/components/admin/appointment-actions";
import { BlockTimeForm } from "@/components/admin/block-time-form";
import { SummaryCards } from "@/components/admin/summary-cards";

const VIEWS: { key: AgendaView; label: string }[] = [
  { key: "day", label: "Diária" },
  { key: "week", label: "Semanal" },
  { key: "month", label: "Mensal" },
];

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; date?: string }>;
}) {
  const sp = await searchParams;
  const view: AgendaView =
    sp.view === "week" || sp.view === "month" ? sp.view : "day";
  const baseISO = sp.date ?? toISODate(new Date());
  const { start, end } = agendaRange(view, baseISO);

  const [appointments, barbers] = await Promise.all([
    db.appointment.findMany({
      where: { startTime: { gte: start, lte: end } },
      include: {
        customer: { select: { name: true, email: true, phone: true } },
        barber: { include: { user: { select: { name: true } } } },
        service: { select: { name: true } },
      },
      orderBy: { startTime: "asc" },
    }),
    db.barber.findMany({
      where: { active: true },
      include: { user: { select: { name: true } } },
    }),
  ]);

  // Resumo do dia (sempre referente a HOJE, independente da visão da agenda)
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  const todayWhere = { startTime: { gte: todayStart, lte: todayEnd } };

  const [todayCount, pendingCount, completedCount, blockedCount] =
    await Promise.all([
      db.appointment.count({ where: todayWhere }),
      db.appointment.count({
        where: { ...todayWhere, status: AppointmentStatus.PENDING },
      }),
      db.appointment.count({
        where: { ...todayWhere, status: AppointmentStatus.COMPLETED },
      }),
      db.timeOff.count({
        where: { startTime: { lte: todayEnd }, endTime: { gte: todayStart } },
      }),
    ]);

  // agrupa por dia
  const byDay = new Map<string, typeof appointments>();
  for (const a of appointments) {
    const key = a.startTime.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    });
    const arr = byDay.get(key) ?? [];
    arr.push(a);
    byDay.set(key, arr);
  }

  const prev = shiftDate(view, baseISO, -1);
  const next = shiftDate(view, baseISO, 1);
  const rangeLabel =
    view === "day"
      ? start.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })
      : `${start.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })} – ${end.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}`;

  return (
    <div className="space-y-6">
      <SummaryCards
        summary={{
          today: todayCount,
          pending: pendingCount,
          completed: completedCount,
          blocked: blockedCount,
        }}
      />

      <div className="gold-divider" />

      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-silver-bright">
          Agenda
        </h2>
      </div>

      {/* Controles */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link
            href={`/admin?view=${view}&date=${prev}`}
            aria-label="Período anterior"
            className="focus-ring grid h-8 w-8 cursor-pointer place-items-center rounded-lg border border-nardo-line/50 text-silver-dim transition-colors hover:border-gold/40 hover:text-silver-bright"
          >
            <ArrowRightIcon className="h-4 w-4 rotate-180" />
          </Link>
          <span className="min-w-44 text-center text-sm font-medium capitalize text-silver-bright">
            {rangeLabel}
          </span>
          <Link
            href={`/admin?view=${view}&date=${next}`}
            aria-label="Próximo período"
            className="focus-ring grid h-8 w-8 cursor-pointer place-items-center rounded-lg border border-nardo-line/50 text-silver-dim transition-colors hover:border-gold/40 hover:text-silver-bright"
          >
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex gap-1 rounded-xl border border-nardo-line/50 bg-ink-800/50 p-1">
          {VIEWS.map((v) => (
            <Link
              key={v.key}
              href={`/admin?view=${v.key}&date=${baseISO}`}
              className={cn(
                "focus-ring cursor-pointer rounded-lg px-3 py-1.5 text-sm transition-colors",
                view === v.key
                  ? "bg-gold-soft/15 text-silver-bright"
                  : "text-silver-dim hover:text-silver",
              )}
            >
              {v.label}
            </Link>
          ))}
        </div>
      </div>

      <BlockTimeForm
        barbers={barbers.map((b) => ({ id: b.id, name: b.user.name ?? "Barbeiro" }))}
        defaultDate={baseISO}
      />

      {/* Lista */}
      {appointments.length === 0 ? (
        <p className="rounded-2xl border border-nardo-line/50 bg-ink-800/50 p-8 text-center text-silver-dim">
          Nenhum agendamento neste período.
        </p>
      ) : (
        <div className="space-y-6">
          {[...byDay.entries()].map(([day, items]) => (
            <div key={day}>
              <h3 className="mb-2 text-sm font-medium capitalize text-silver-dim">{day}</h3>
              <div className="space-y-2">
                {items.map((a) => (
                  <div
                    key={a.id}
                    className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-nardo-line/50 bg-ink-800/60 p-4"
                  >
                    <span className="font-display text-lg font-semibold text-silver-bright">
                      {a.startTime.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <div className="min-w-40 flex-1">
                      <p className="text-sm font-medium text-silver-bright">
                        {a.service.name}{" "}
                        <span className="text-silver-dim">· {a.barber.user.name}</span>
                      </p>
                      <p className="text-sm text-silver-dim">
                        {a.customer.name} · {a.customer.phone ?? a.customer.email}
                      </p>
                    </div>
                    <StatusBadge status={a.status} />
                    {a.status !== AppointmentStatus.CANCELLED &&
                      a.status !== AppointmentStatus.COMPLETED && (
                        <AppointmentActions id={a.id} status={a.status} />
                      )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
