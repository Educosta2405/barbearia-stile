/** Tipos e helpers compartilhados pelo fluxo de agendamento (cliente). */

export type Slot = { startTime: string; endTime: string };

export type DayOption = {
  iso: string; // YYYY-MM-DD
  weekday: string; // ex.: "seg"
  day: number; // dia do mês
  month: string; // ex.: "jun"
};

/** Próximos `count` dias a partir de hoje, em horário local. */
export function upcomingDays(count: number): DayOption[] {
  const days: DayOption[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    days.push({
      iso,
      weekday: d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""),
      day: d.getDate(),
      month: d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
    });
  }
  return days;
}
