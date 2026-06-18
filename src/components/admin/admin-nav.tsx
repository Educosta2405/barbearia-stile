"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/admin", label: "Agenda" },
  { href: "/admin/barbeiros", label: "Barbeiros" },
  { href: "/admin/servicos", label: "Serviços" },
  { href: "/admin/clientes", label: "Clientes" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="mt-5 flex gap-1 overflow-x-auto border-b border-nardo-line/40">
      {LINKS.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "relative whitespace-nowrap px-4 py-2.5 text-sm transition-colors",
              active ? "text-silver-bright" : "text-silver-dim hover:text-silver",
            )}
          >
            {l.label}
            {active && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-gold-soft" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
