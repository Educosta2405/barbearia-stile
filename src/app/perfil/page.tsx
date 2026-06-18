import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { AppointmentStatus } from "@/lib/enums";
import { Navbar } from "@/components/layout/navbar";
import { AppointmentCard } from "@/components/booking/appointment-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function PerfilPage() {
  const user = await requireUser();
  const now = new Date();

  const appointments = await db.appointment.findMany({
    where: { customerId: user.id },
    include: {
      service: { select: { name: true, durationMinutes: true, priceCents: true } },
      barber: { include: { user: { select: { name: true } } } },
    },
    orderBy: { startTime: "desc" },
  });

  const upcoming = appointments
    .filter(
      (a) =>
        a.startTime >= now &&
        a.status !== AppointmentStatus.CANCELLED &&
        a.status !== AppointmentStatus.COMPLETED,
    )
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  const history = appointments.filter((a) => !upcoming.includes(a));

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-3 animate-fade-up">
          <div>
            <p className="eyebrow">Área do cliente</p>
            <h1 className="mt-1.5 font-display text-3xl font-semibold tracking-tight text-silver-bright">
              Meus horários
            </h1>
            <p className="mt-1 text-silver-dim">Olá, {user.name?.split(" ")[0] ?? "cliente"}.</p>
          </div>
          <Link href="/agendar">
            <Button>Novo agendamento</Button>
          </Link>
        </header>

        <section>
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-silver-dim">
            Próximos
          </h2>
          {upcoming.length === 0 ? (
            <p className="rounded-2xl border border-nardo-line/50 bg-ink-800/50 p-6 text-center text-silver-dim">
              Você não tem horários marcados.{" "}
              <Link href="/agendar" className="text-gold-glow hover:text-gold-soft">
                Agendar agora
              </Link>
            </p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((a) => (
                <AppointmentCard
                  key={a.id}
                  appointment={{
                    id: a.id,
                    serviceName: a.service.name,
                    serviceId: a.serviceId,
                    barberId: a.barberId,
                    barberName: a.barber.user.name ?? "Barbeiro",
                    startTime: a.startTime.toISOString(),
                    status: a.status,
                    priceCents: a.service.priceCents,
                  }}
                  canManage
                />
              ))}
            </div>
          )}
        </section>

        {history.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-silver-dim">
              Histórico
            </h2>
            <div className="space-y-3">
              {history.map((a) => (
                <AppointmentCard
                  key={a.id}
                  appointment={{
                    id: a.id,
                    serviceName: a.service.name,
                    serviceId: a.serviceId,
                    barberId: a.barberId,
                    barberName: a.barber.user.name ?? "Barbeiro",
                    startTime: a.startTime.toISOString(),
                    status: a.status,
                    priceCents: a.service.priceCents,
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
