import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { Navbar } from "@/components/layout/navbar";
import { BookingFlow } from "@/components/booking/booking-flow";

export default async function AgendarPage() {
  await requireUser();

  const [services, barbers] = await Promise.all([
    db.service.findMany({
      where: { active: true },
      orderBy: { durationMinutes: "asc" },
    }),
    db.barber.findMany({
      where: { active: true },
      include: {
        user: { select: { name: true } },
        services: { select: { serviceId: true } },
      },
    }),
  ]);

  const barberData = barbers.map((b) => ({
    id: b.id,
    name: b.user.name ?? "Barbeiro",
    bio: b.bio,
    serviceIds: b.services.map((s) => s.serviceId),
  }));

  const serviceData = services.map((s) => ({
    id: s.id,
    name: s.name,
    durationMinutes: s.durationMinutes,
    priceCents: s.priceCents,
  }));

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <header className="mb-8 animate-fade-up">
          <p className="eyebrow">Novo agendamento</p>
          <h1 className="mt-1.5 font-display text-3xl font-semibold tracking-tight text-silver-bright">
            Agendar horário
          </h1>
          <p className="mt-1 text-silver-dim">
            Escolha o serviço, o profissional e o melhor horário para você.
          </p>
        </header>
        <BookingFlow services={serviceData} barbers={barberData} />
      </main>
    </>
  );
}
