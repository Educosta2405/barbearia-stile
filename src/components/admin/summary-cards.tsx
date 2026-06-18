import { cn } from "@/lib/cn";
import {
  CalendarIcon,
  ClockIcon,
  StarIcon,
  RazorIcon,
} from "@/components/ui/icons";

export type Summary = {
  today: number;
  pending: number;
  completed: number;
  blocked: number;
};

const CARDS = [
  { key: "today", label: "Agendamentos hoje", icon: <CalendarIcon />, tone: "gold" },
  { key: "pending", label: "Pendentes", icon: <ClockIcon />, tone: "pending" },
  { key: "completed", label: "Concluídos", icon: <StarIcon />, tone: "silver" },
  { key: "blocked", label: "Horários bloqueados", icon: <RazorIcon />, tone: "nardo" },
] as const;

const TONE: Record<string, string> = {
  gold: "border-gold/35 bg-gold/[0.07] text-gold-glow",
  pending: "border-nardo-line/70 bg-ink-700/40 text-silver-dim",
  silver: "border-nardo-line/60 bg-ink-700/50 text-silver-bright",
  nardo: "border-nardo-line/50 bg-ink-700/40 text-silver",
};

export function SummaryCards({ summary }: { summary: Summary }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {CARDS.map((c) => (
        <div
          key={c.key}
          className="hover-lift rounded-2xl border border-nardo-line/50 bg-ink-800/60 p-4 shadow-card"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-silver-dim">
              {c.label}
            </span>
            <span
              className={cn(
                "grid h-9 w-9 place-items-center rounded-xl border",
                TONE[c.tone],
              )}
            >
              {c.icon}
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-semibold text-silver-bright">
            {summary[c.key]}
          </p>
        </div>
      ))}
    </div>
  );
}
