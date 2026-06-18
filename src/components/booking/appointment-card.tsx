"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RescheduleDialog } from "@/components/booking/reschedule-dialog";
import {
  cancelAppointmentAction,
} from "@/server/actions/appointments";

export type AppointmentView = {
  id: string;
  serviceName: string;
  serviceId: string;
  barberId: string;
  barberName: string;
  startTime: string;
  status: string;
  priceCents: number;
};

export function AppointmentCard({
  appointment,
  canManage = false,
}: {
  appointment: AppointmentView;
  canManage?: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [rescheduling, setRescheduling] = useState(false);

  const when = new Date(appointment.startTime).toLocaleString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  async function onCancel() {
    if (!confirm("Deseja realmente cancelar este agendamento?")) return;
    setBusy(true);
    setError(undefined);
    const res = await cancelAppointmentAction(appointment.id);
    setBusy(false);
    if (res.ok) router.refresh();
    else setError(res.error);
  }

  return (
    <div className={cn("rounded-2xl border border-nardo-line/50 bg-ink-800/60 p-4 shadow-card sm:p-5")}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-semibold text-silver-bright">
              {appointment.serviceName}
            </h3>
            <StatusBadge status={appointment.status} />
          </div>
          <p className="mt-1 text-sm capitalize text-silver-dim">
            {when} · {appointment.barberName}
          </p>
        </div>
        <span className="text-gradient shrink-0 font-semibold">
          {formatPrice(appointment.priceCents)}
        </span>
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      {canManage && (
        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setRescheduling(true)} disabled={busy}>
            Reagendar
          </Button>
          <Button size="sm" variant="danger" onClick={onCancel} disabled={busy}>
            {busy ? "..." : "Cancelar"}
          </Button>
        </div>
      )}

      {rescheduling && (
        <RescheduleDialog
          appointmentId={appointment.id}
          barberId={appointment.barberId}
          serviceId={appointment.serviceId}
          onClose={() => setRescheduling(false)}
          onDone={() => {
            setRescheduling(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
