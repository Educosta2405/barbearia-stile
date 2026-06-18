import { db } from "@/lib/db";
import { BarberManager } from "@/components/admin/barber-manager";

export default async function BarbeirosPage() {
  const barbers = await db.barber.findMany({
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { appointments: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <BarberManager
      barbers={barbers.map((b) => ({
        id: b.id,
        name: b.user.name ?? "Barbeiro",
        email: b.user.email,
        bio: b.bio,
        active: b.active,
        appointments: b._count.appointments,
      }))}
    />
  );
}
