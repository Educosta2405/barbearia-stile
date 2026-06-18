import { cn } from "@/lib/cn";
import { AppointmentStatus } from "@/lib/enums";

const STATUS_STYLES: Record<string, string> = {
  // Aguardando → neutro Nardo/prata, discreto (baixa ênfase)
  [AppointmentStatus.PENDING]: "bg-ink-700/40 text-silver-dim border-nardo-line/70",
  // Confirmado → dourado preenchido (DESTAQUE principal / ativo)
  [AppointmentStatus.CONFIRMED]: "bg-gold-soft/15 text-gold-glow border-gold-soft/40",
  // Concluído → prata claro, sólido e elegante (finalizado)
  [AppointmentStatus.COMPLETED]: "bg-silver/10 text-silver-bright border-silver/25",
  // Cancelado → vermelho discreto (sinal semântico de negação)
  [AppointmentStatus.CANCELLED]: "bg-red-400/10 text-red-300 border-red-400/20",
  // Não compareceu → alerta bem sutil (vermelho apagado, sem exagero)
  [AppointmentStatus.NO_SHOW]: "bg-red-400/[0.05] text-red-300/70 border-red-400/15",
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
