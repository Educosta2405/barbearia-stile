import { describe, it, expect } from "vitest";
import { agendaRange, shiftDate } from "@/lib/agenda-range";

// 2026-06-17 é uma quarta-feira (getDay() === 3).
const WED = "2026-06-17";

describe("agendaRange", () => {
  it("visão diária cobre apenas o dia base", () => {
    const { start, end } = agendaRange("day", WED);
    expect(start.getDate()).toBe(17);
    expect(start.getHours()).toBe(0);
    expect(end.getDate()).toBe(17);
    expect(end.getHours()).toBe(23);
  });

  it("visão semanal vai de domingo a sábado", () => {
    const { start, end } = agendaRange("week", WED);
    expect(start.getDay()).toBe(0); // domingo
    expect(start.getDate()).toBe(14);
    expect(end.getDate()).toBe(20); // sábado
  });

  it("visão mensal cobre o mês inteiro", () => {
    const { start, end } = agendaRange("month", WED);
    expect(start.getDate()).toBe(1);
    expect(end.getDate()).toBe(30); // junho tem 30 dias
  });
});

describe("shiftDate", () => {
  it("avança e retrocede por dia/semana/mês", () => {
    expect(shiftDate("day", WED, 1)).toBe("2026-06-18");
    expect(shiftDate("day", WED, -1)).toBe("2026-06-16");
    expect(shiftDate("week", WED, 1)).toBe("2026-06-24");
    expect(shiftDate("month", WED, 1)).toBe("2026-07-17");
  });
});
