import { db } from "@/lib/db";
import { UserRole } from "@/lib/enums";

export default async function ClientesPage() {
  const customers = await db.user.findMany({
    where: { role: UserRole.CUSTOMER },
    include: { _count: { select: { appointments: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-silver-bright">Clientes</h2>
        <span className="text-sm text-silver-dim">{customers.length} no total</span>
      </div>

      {customers.length === 0 ? (
        <p className="rounded-2xl border border-nardo-line/50 bg-ink-800/50 p-8 text-center text-silver-dim">
          Nenhum cliente cadastrado ainda.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-nardo-line/50">
          <table className="w-full min-w-[480px] text-sm">
            <thead className="bg-ink-800/80 text-left text-silver-dim">
              <tr>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Contato</th>
                <th className="px-4 py-3 text-right font-medium">Agendamentos</th>
                <th className="hidden px-4 py-3 text-right font-medium sm:table-cell">
                  Desde
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr
                  key={c.id}
                  className={i % 2 ? "bg-ink-800/30" : "bg-ink-800/50"}
                >
                  <td className="px-4 py-3 font-medium text-silver-bright">
                    {c.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-silver-dim">
                    {c.phone ? `${c.phone} · ` : ""}
                    {c.email}
                  </td>
                  <td className="px-4 py-3 text-right text-silver">
                    {c._count.appointments}
                  </td>
                  <td className="hidden px-4 py-3 text-right text-silver-dim sm:table-cell">
                    {c.createdAt.toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
