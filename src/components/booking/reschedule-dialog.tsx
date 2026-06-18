"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { upcomingDays, type Slot } from "@/lib/booking-days";
import { rescheduleAppointmentAction } from "@/server/actions/appointments";

export function RescheduleDialog({
  appointmentId,
  barberId,
  serviceId,
  onClose,
  onDone,
}: {
  appointmentId: string;
  barberId: string;
  serviceId: string;
  onClose: () => void;
  onDone: () => void;
}) {
  const days = useMemo(() => upcomingDays(14), []);
  const [date, setDate] = useState(days[0].iso);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setSlots([]);
    fetch(`/api/availability?barberId=${barberId}&serviceId=${serviceId}&date=${date}`)
      .then((r) => r.json())
      .then((d) => active && setSlots(d.slots ?? []))
      .catch(() => active && setSlots([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [date, barberId, serviceId]);

  async function pick(slot: Slot) {
    setSaving(true);
    setError(undefined);
    const res = await rescheduleAppointmentAction({
      appointmentId,
      startTime: slot.startTime,
    });
    setSaving(false);
    if (res.ok) onDone();
    else setError(res.error);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/70 p-4 backdrop-blur-sm animate-fade-in sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg animate-scale-in rounded-2xl border border-nardo-line/60 bg-ink-850 p-5 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-silver-bright">
            Reagendar
          </h3>
          <button onClick={onClose} className="text-silver-dim hover:text-silver-bright">
            ✕
          </button>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {days.map((d) => (
            <button
              key={d.iso}
              onClick={() => setDate(d.iso)}
              className={cn(
                "flex shrink-0 flex-col items-center rounded-xl border px-3 py-2",
                date === d.iso
                  ? "border-gold-soft/60 bg-gold-soft/10"
                  : "border-nardo-line/50 bg-ink-800/50",
              )}
            >
              <span className="text-[11px] uppercase text-silver-dim">{d.weekday}</span>
              <span className="font-semibold text-silver-bright">{d.day}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 min-h-24">
          {loading ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-9 animate-pulse rounded-lg bg-ink-700/60" />
              ))}
            </div>
          ) : slots.length === 0 ? (
            <p className="py-6 text-center text-sm text-silver-dim">
              Sem horários nesse dia.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map((s) => (
                <Button
                  key={s.startTime}
                  size="sm"
                  variant="outline"
                  disabled={saving}
                  onClick={() => pick(s)}
                >
                  {new Date(s.startTime).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-3 rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
