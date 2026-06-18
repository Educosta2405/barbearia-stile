export type AgendaView = "day" | "week" | "month";

/** Calcula o intervalo [start,end] para a visão da agenda a partir de uma data base. */
export function agendaRange(view: AgendaView, baseISO?: string) {
  const base = baseISO ? new Date(`${baseISO}T00:00:00`) : new Date();
  base.setHours(0, 0, 0, 0);

  const start = new Date(base);
  const end = new Date(base);

  if (view === "day") {
    end.setHours(23, 59, 59, 999);
  } else if (view === "week") {
    // semana começando no domingo
    start.setDate(base.getDate() - base.getDay());
    end.setTime(start.getTime());
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
  } else {
    start.setDate(1);
    end.setMonth(start.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);
  }

  return { start, end, base };
}

export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function shiftDate(view: AgendaView, baseISO: string, dir: 1 | -1): string {
  const d = new Date(`${baseISO}T00:00:00`);
  if (view === "day") d.setDate(d.getDate() + dir);
  else if (view === "week") d.setDate(d.getDate() + dir * 7);
  else d.setMonth(d.getMonth() + dir);
  return toISODate(d);
}
