import Link from "next/link";
import { getCurrentUser, isStaff } from "@/lib/session";
import { UserRole } from "@/lib/enums";
import { BrandLogo } from "@/components/layout/brand-logo";
import { NavMenu, type NavLink } from "@/components/layout/nav-menu";
import { Button } from "@/components/ui/button";

export async function Navbar() {
  const user = await getCurrentUser();
  const staff = isStaff(user?.role);

  // Navegação por perfil — sem misturar linguagem de cliente com a de staff.
  const links: NavLink[] = staff
    ? [
        { label: "Painel", href: "/admin", highlight: true },
        { label: "Agenda", href: "/admin" },
        { label: "Serviços", href: "/admin/servicos" },
        { label: "Barbeiros", href: "/admin/barbeiros" },
        { label: "Clientes", href: "/admin/clientes" },
      ]
    : [
        { label: "Agendar", href: "/agendar" },
        { label: "Meus horários", href: "/perfil" },
      ];

  const identity = user
    ? {
        name: user.name ?? user.email ?? "Conta",
        href: staff ? "/admin" : "/perfil",
        subtitle:
          user.role === UserRole.ADMIN
            ? "Administrador"
            : user.role === UserRole.BARBER
              ? "Barbeiro"
              : "Cliente",
      }
    : undefined;

  return (
    <header className="sticky top-0 z-50 border-b border-nardo-line/40 bg-ink-900/75 backdrop-blur-xl">
      <nav className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <BrandLogo />

        {user ? (
          <NavMenu links={links} identity={identity} />
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="px-2 text-sm text-silver-dim transition-colors hover:text-silver-bright"
            >
              Entrar
            </Link>
            <Link href="/cadastro">
              <Button size="sm">Criar conta</Button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
