import { db } from "@/lib/db";
import { ServiceManager } from "@/components/admin/service-manager";

export default async function ServicosPage() {
  const services = await db.service.findMany({ orderBy: { createdAt: "asc" } });
  return (
    <ServiceManager
      services={services.map((s) => ({
        id: s.id,
        name: s.name,
        durationMinutes: s.durationMinutes,
        priceCents: s.priceCents,
        active: s.active,
      }))}
    />
  );
}
