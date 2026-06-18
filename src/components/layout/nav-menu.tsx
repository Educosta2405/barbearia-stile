"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { logoutAction } from "@/server/actions/auth";
import { DashboardIcon } from "@/components/ui/icons";

export type NavLink = { label: string; href: string; highlight?: boolean };

export function NavMenu({
  links,
  identity,
}: {
  links: NavLink[];
  identity?: { name: string; href: string; subtitle: string };
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <>
      {/* Desktop */}
      <div className="hidden items-center gap-1 md:flex">
        {links.map((l) =>
          l.highlight ? (
            <Link
              key={l.href + l.label}
              href={l.href}
              className="mr-1 inline-flex items-center gap-1.5 rounded-xl border border-gold/45 bg-gold/10 px-3.5 py-1.5 text-sm font-semibold text-gold-glow transition-all hover:-translate-y-0.5 hover:border-gold/70 hover:bg-gold/15"
            >
              <DashboardIcon className="h-4 w-4" />
              {l.label}
            </Link>
          ) : (
            <Link
              key={l.href + l.label}
              href={l.href}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm transition-colors",
                isActive(l.href)
                  ? "text-gold-glow"
                  : "text-silver-dim hover:text-silver-bright",
              )}
            >
              {l.label}
            </Link>
          ),
        )}

        {identity && (
          <Link
            href={identity.href}
            className="ml-1 flex items-center gap-2 rounded-xl border border-nardo-line/50 bg-ink-800/60 px-2.5 py-1.5 transition-colors hover:border-gold/40"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-gold-soft to-gold-deep text-[11px] font-bold text-ink-950">
              {identity.name.charAt(0).toUpperCase()}
            </span>
            <span className="max-w-28 truncate text-sm text-silver">{identity.name}</span>
          </Link>
        )}

        <LogoutButton className="ml-2" />
      </div>

      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Menu"
        className="grid h-9 w-9 place-items-center rounded-lg border border-nardo-line/50 text-silver md:hidden"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>}
        </svg>
      </button>

      {/* Mobile panel */}
      {open && (
        <div className="absolute inset-x-0 top-16 z-40 origin-top animate-fade-up border-b border-nardo-line/40 bg-ink-900/95 p-4 backdrop-blur-xl md:hidden">
          {identity && (
            <Link
              href={identity.href}
              onClick={() => setOpen(false)}
              className="mb-2 flex items-center gap-3 rounded-xl border border-nardo-line/50 bg-ink-800/60 p-3"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-gold-soft to-gold-deep text-sm font-bold text-ink-950">
                {identity.name.charAt(0).toUpperCase()}
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-medium text-silver-bright">{identity.name}</span>
                <span className="text-xs text-silver-dim">{identity.subtitle}</span>
              </span>
            </Link>
          )}
          <div className="flex flex-col">
            {links.map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm transition-colors",
                  l.highlight
                    ? "font-semibold text-gold-glow"
                    : isActive(l.href)
                      ? "text-gold-glow"
                      : "text-silver hover:text-silver-bright",
                )}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-1 border-t border-nardo-line/40 pt-1">
              <LogoutButton className="px-3 py-2.5" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function LogoutButton({ className }: { className?: string }) {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className={cn(
          "text-sm text-silver-dim transition-colors hover:text-silver-bright",
          className,
        )}
      >
        Sair
      </button>
    </form>
  );
}
