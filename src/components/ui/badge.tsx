import { cn } from "@/lib/cn";
import { AppointmentStatus } from "@/lib/enums";

const STATUS_STYLES: Record<string, string> = {
  [AppointmentStatus.PENDING]: "bg-amber-400/10 text-amber-300 border-amber-400/20",
  [AppointmentStatus.CONFIRMED]: "bg-gold-soft/15 text-gold-glow border-gold-soft/30",
  [AppointmentStatus.COMPLETED]: "bg-silver/10 text-silver-bright border-silver/25",
  [AppointmentStatus.CANCELLED]: "bg-red-400/10 text-red-300 border-red-400/20",
  [AppointmentStatus.NO_SHOW]: "bg-ink-600 text-silver-dim border-nardo-line/40",
};

const STATUS_LABELS: Record<string, string> = {
  [AppointmentStatus.PENDING]: "Pendente",
  [AppointmentStatus.CONFIRMED]: "Confirmado",
  [AppointmentStatus.COMPLETED]: "Concluído",
  [AppointmentStatus.CANCELLED]: "Cancelado",
  [AppointmentStatus.NO_SHOW]: "Não compareceu",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status] ?? "bg-ink-600 text-silver-dim border-nardo-line/40",
      )}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
