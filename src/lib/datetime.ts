/** Utilitários de data/hora (horário local do servidor). */

/** "HH:mm" -> minutos desde meia-noite. */
export function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Cria um Date local a partir de "YYYY-MM-DD" + minutos desde meia-noite. */
export function dateAtMinutes(dateISO: string, minutes: number): Date {
  const [y, mo, d] = dateISO.split("-").map(Number);
  const date = new Date(y, mo - 1, d, 0, 0, 0, 0);
  date.setMinutes(minutes);
  return date;
}

/** Início (00:00) e fim (23:59:59.999) do dia para uma data "YYYY-MM-DD". */
export function dayRange(dateISO: string): { start: Date; end: Date } {
  const [y, mo, d] = dateISO.split("-").map(Number);
  const start = new Date(y, mo - 1, d, 0, 0, 0, 0);
  const end = new Date(y, mo - 1, d, 23, 59, 59, 999);
  return { start, end };
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

/** Dois intervalos [aStart,aEnd) e [bStart,bEnd) se sobrepõem? */
export function overlaps(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function formatBR(date: Date): string {
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
