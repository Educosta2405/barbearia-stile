import { requireStaff } from "@/lib/session";
import { UserRole } from "@/lib/enums";
import { Navbar } from "@/components/layout/navbar";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireStaff();
  const roleLabel = user.role === UserRole.ADMIN ? "Administrador" : "Barbeiro";
  const firstName = (user.name ?? user.email ?? "").split(" ")[0];

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Painel administrativo</p>
            <h1 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-silver-bright sm:text-3xl">
              Olá, {firstName}
            </h1>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/[0.07] px-3 py-1 text-xs font-medium text-gold-glow">
            {roleLabel}
          </span>
        </div>
        <AdminNav />
        <div className="mt-6 animate-fade-up">{children}</div>
      </div>
    </>
  );
}
