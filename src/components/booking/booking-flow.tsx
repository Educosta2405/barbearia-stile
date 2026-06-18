"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { formatPrice, formatDuration } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { ArrowRightIcon } from "@/components/ui/icons";
import { upcomingDays, type Slot } from "@/lib/booking-days";
import { createAppointmentAction } from "@/server/actions/appointments";

type Service = { id: string; name: string; durationMinutes: number; priceCents: number };
type Barber = { id: string; name: string; bio: string | null; serviceIds: string[] };

const STEPS = ["Serviço", "Profissional", "Data", "Horário", "Confirmar"] as const;

export function BookingFlow({
  services,
  barbers,
}: {
  services: Service[];
  barbers: Barber[];
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState<string>();
  const [barberId, setBarberId] = useState<string>();
  const [date, setDate] = useState<string>();
  const [slot, setSlot] = useState<Slot>();
  const [notes, setNotes] = useState("");

  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();
  const [done, setDone] = useState(false);

  const days = useMemo(() => upcomingDays(21), []);
  const service = services.find((s) => s.id === serviceId);
  const barber = barbers.find((b) => b.id === barberId);
  const availableBarbers = useMemo(
    () => barbers.filter((b) => !serviceId || b.serviceIds.includes(serviceId)),
    [barbers, serviceId],
  );

  // Busca horários quando barbeiro + serviço + data definidos.
  useEffect(() => {
    if (step !== 3 || !barberId || !serviceId || !date) return;
    let active = true;
    setLoadingSlots(true);
    setSlots([]);
    fetch(`/api/availability?barberId=${barberId}&serviceId=${serviceId}&date=${date}`)
      .then((r) => r.json())
      .then((data) => {
        if (active) setSlots(data.slots ?? []);
      })
      .catch(() => active && setSlots([]))
      .finally(() => active && setLoadingSlots(false));
    return () => {
      active = false;
    };
  }, [step, barberId, serviceId, date]);

  async function confirm() {
    if (!barberId || !serviceId || !slot) return;
    setSubmitting(true);
    setError(undefined);
    const res = await createAppointmentAction({
      barberId,
      serviceId,
      startTime: slot.startTime,
      notes: notes || undefined,
    });
    setSubmitting(false);
    if (res.ok) {
      setDone(true);
    } else {
      setError(res.error);
      // Se o horário foi ocupado, volta para a seleção de horário.
      if (res.error?.includes("ocupado")) setStep(3);
    }
  }

  if (done) {
    return (
      <div className="surface-texture animate-scale-in overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-b from-gold/[0.06] to-ink-850 p-8 text-center shadow-glow sm:p-10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold-glow">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.2 4.2L19 7" />
          </svg>
        </div>
        <p className="mt-5 eyebrow">Tudo certo</p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-silver-bright">
          Agendamento confirmado
        </h2>
        <p className="mt-2 capitalize text-silver">
          {service?.name} com {barber?.name}
        </p>
        <p className="text-sm text-silver-dim">
          {slot &&
            new Date(slot.startTime).toLocaleString("pt-BR", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
            })}
        </p>
        <p className="mt-3 text-sm text-silver-dim">
          Você receberá a confirmação por e-mail.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={() => router.push("/perfil")}>Ver meus horários</Button>
          <Button variant="outline" onClick={() => router.refresh()}>
            Agendar outro
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Stepper step={step} />

      <div key={step} className="animate-fade-up">
        {/* 1. SERVIÇO */}
        {step === 0 && (
          <Grid>
            {services.map((s) => (
              <SelectCard
                key={s.id}
                active={serviceId === s.id}
                onClick={() => {
                  setServiceId(s.id);
                  if (barberId && !barbers.find((b) => b.id === barberId)?.serviceIds.includes(s.id)) {
                    setBarberId(undefined);
                  }
                  setStep(1);
                }}
                title={s.name}
                subtitle={formatDuration(s.durationMinutes)}
                trailing={<span className="text-gradient font-semibold">{formatPrice(s.priceCents)}</span>}
              />
            ))}
          </Grid>
        )}

        {/* 2. PROFISSIONAL */}
        {step === 1 && (
          <Grid>
            {availableBarbers.map((b) => (
              <SelectCard
                key={b.id}
                active={barberId === b.id}
                onClick={() => {
                  setBarberId(b.id);
                  setStep(2);
                }}
                title={b.name}
                subtitle={b.bio ?? "Profissional"}
                leading={
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-nardo to-ink-600 font-display font-semibold text-silver-bright">
                    {b.name.charAt(0)}
                  </span>
                }
              />
            ))}
          </Grid>
        )}

        {/* 3. DATA */}
        {step === 2 && (
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
            {days.map((d) => (
              <button
                key={d.iso}
                onClick={() => {
                  setDate(d.iso);
                  setSlot(undefined);
                  setStep(3);
                }}
                className={cn(
                  "hover-lift focus-ring flex cursor-pointer flex-col items-center rounded-xl border px-2 py-3 text-center transition-colors",
                  date === d.iso
                    ? "border-gold-soft/60 bg-gold-soft/10"
                    : "border-nardo-line/50 bg-ink-800/50 hover:border-gold-soft/40",
                )}
              >
                <span className="text-xs uppercase text-silver-dim">{d.weekday}</span>
                <span className="font-display text-lg font-semibold text-silver-bright">{d.day}</span>
                <span className="text-xs text-silver-dim">{d.month}</span>
              </button>
            ))}
          </div>
        )}

        {/* 4. HORÁRIO */}
        {step === 3 && (
          <div>
            {loadingSlots ? (
              <SlotsSkeleton />
            ) : slots.length === 0 ? (
              <p className="rounded-xl border border-nardo-line/50 bg-ink-800/50 p-6 text-center text-silver-dim">
                Nenhum horário disponível nesse dia. Tente outra data.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                {slots.map((s) => {
                  const t = new Date(s.startTime).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return (
                    <button
                      key={s.startTime}
                      onClick={() => {
                        setSlot(s);
                        setStep(4);
                      }}
                      className={cn(
                        "hover-lift focus-ring cursor-pointer rounded-xl border py-2.5 text-sm font-medium transition-colors",
                        slot?.startTime === s.startTime
                          ? "border-gold-soft/60 bg-gold-soft/10 text-silver-bright"
                          : "border-nardo-line/50 bg-ink-800/50 text-silver hover:border-gold-soft/40",
                      )}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 5. CONFIRMAR */}
        {step === 4 && service && barber && slot && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-nardo-line/50 bg-ink-800/60 p-5 shadow-card">
              <SummaryRow label="Serviço" value={`${service.name} · ${formatDuration(service.durationMinutes)}`} />
              <SummaryRow label="Profissional" value={barber.name} />
              <SummaryRow
                label="Quando"
                value={new Date(slot.startTime).toLocaleString("pt-BR", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              />
              <SummaryRow label="Valor" value={formatPrice(service.priceCents)} highlight />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-silver-dim">
                Observações (opcional)
              </label>
              <Textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex.: preferência de máquina, alguma referência..."
              />
            </div>

            {error && (
              <p className="animate-fade-in rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}

            <Button size="lg" className="w-full" onClick={confirm} disabled={submitting}>
              {submitting ? "Confirmando..." : "Confirmar agendamento"}
            </Button>
          </div>
        )}
      </div>

      {step > 0 && !done && (
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="focus-ring mt-6 inline-flex cursor-pointer items-center gap-1.5 rounded-lg text-sm text-silver-dim transition-colors hover:text-silver-bright"
        >
          <ArrowRightIcon className="h-4 w-4 rotate-180" />
          Voltar
        </button>
      )}
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <span className="eyebrow">
          Etapa {step + 1} de {STEPS.length}
        </span>
        <span className="text-sm font-medium text-silver">{STEPS[step]}</span>
      </div>
      <div className="mt-2.5 flex gap-1.5">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-500 ease-out",
              i < step
                ? "bg-gold/70"
                : i === step
                  ? "bg-gradient-to-r from-gold-soft to-gold shadow-[0_0_12px_-2px_rgba(200,162,74,0.6)]"
                  : "bg-nardo-line/40",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-2.5 sm:grid-cols-2">{children}</div>;
}

function SelectCard({
  active,
  onClick,
  title,
  subtitle,
  leading,
  trailing,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group hover-lift focus-ring relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-2xl border p-4 text-left transition-all",
        active
          ? "border-gold/55 bg-gold/[0.08] shadow-[inset_0_0_0_1px_rgba(200,162,74,0.25)]"
          : "border-nardo-line/50 bg-ink-800/50 hover:border-gold/40 hover:bg-ink-800/70",
      )}
    >
      {/* acento lateral quando selecionado */}
      <span
        className={cn(
          "absolute inset-y-0 left-0 w-0.5 bg-gold transition-opacity",
          active ? "opacity-100" : "opacity-0",
        )}
      />
      {leading}
      <div className="min-w-0 flex-1">
        <p className="font-medium text-silver-bright">{title}</p>
        <p className="truncate text-sm text-silver-dim">{subtitle}</p>
      </div>
      {trailing ?? (
        <ArrowRightIcon className="h-4 w-4 shrink-0 text-silver-dim transition-all group-hover:translate-x-0.5 group-hover:text-gold-glow" />
      )}
    </button>
  );
}

function SummaryRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-nardo-line/30 py-2.5 last:border-0">
      <span className="text-sm text-silver-dim">{label}</span>
      <span className={cn("text-sm font-medium capitalize", highlight ? "text-gradient" : "text-silver-bright")}>
        {value}
      </span>
    </div>
  );
}

function SlotsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-10 animate-pulse rounded-xl bg-ink-700/60" />
      ))}
    </div>
  );
}
