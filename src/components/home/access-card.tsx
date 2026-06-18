import Link from "next/link";
import { cn } from "@/lib/cn";
import { ArrowRightIcon } from "@/components/ui/icons";

export type AccessItem = {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  highlight?: boolean;
};

/**
 * Card clicável de acesso a uma área do sistema.
 * Ícone discreto + título + descrição + seta com microinteração no hover.
 */
export function AccessCard({ item }: { item: AccessItem }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "group relative flex h-full flex-col rounded-2xl border p-5 shadow-card transition-all duration-300 ease-out hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-glow/50",
        item.highlight
          ? "border-gold/45 bg-gradient-to-b from-gold/[0.08] to-transparent hover:border-gold/70"
          : "border-nardo-line/50 bg-ink-800/60 hover:border-gold/40 hover:bg-ink-800/80",
      )}
    >
      <div
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-xl border transition-colors duration-300",
          item.highlight
            ? "border-gold/40 bg-gold/10 text-gold-glow"
            : "border-nardo-line/50 bg-ink-700/60 text-silver group-hover:border-gold/40 group-hover:text-gold-glow",
        )}
      >
        {item.icon}
      </div>

      <h3 className="mt-4 font-display text-lg font-semibold text-silver-bright">
        {item.title}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-silver-dim">
        {item.description}
      </p>

      <span
        className={cn(
          "mt-4 inline-flex items-center gap-1.5 text-sm font-medium transition-colors",
          item.highlight ? "text-gold-glow" : "text-silver-dim group-hover:text-gold-glow",
        )}
      >
        Acessar
        <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
