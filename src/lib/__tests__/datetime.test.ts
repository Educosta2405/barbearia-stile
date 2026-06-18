import { describe, it, expect } from "vitest";
import {
  timeToMinutes,
  addMinutes,
  overlaps,
  dayRange,
  dateAtMinutes,
} from "@/lib/datetime";

describe("timeToMinutes", () => {
  it("converte HH:mm em minutos desde meia-noite", () => {
    expect(timeToMinutes("00:00")).toBe(0);
    expect(timeToMinutes("09:30")).toBe(570);
    expect(timeToMinutes("20:00")).toBe(1200);
  });
});

describe("addMinutes", () => {
  it("soma minutos sem mutar a data original", () => {
    const base = new Date("2026-06-17T10:00:00.000Z");
    const after = addMinutes(base, 45);
    expect(after.getTime() - base.getTime()).toBe(45 * 60_000);
    expect(base.toISOString()).toBe("2026-06-17T10:00:00.000Z");
  });
});

describe("overlaps (núcleo anti-conflito)", () => {
  const a0 = new Date("2026-06-17T10:00:00");
  const a1 = new Date("2026-06-17T10:30:00");

  it("detecta sobreposição parcial", () => {
    const b0 = new Date("2026-06-17T10:15:00");
    const b1 = new Date("2026-06-17T10:45:00");
    expect(overlaps(a0, a1, b0, b1)).toBe(true);
  });

  it("considera intervalos adjacentes como NÃO sobrepostos", () => {
    const b0 = new Date("2026-06-17T10:30:00"); // começa quando o outro termina
    const b1 = new Date("2026-06-17T11:00:00");
    expect(overlaps(a0, a1, b0, b1)).toBe(false);
  });

  it("não acusa conflito para intervalos disjuntos", () => {
    const b0 = new Date("2026-06-17T12:00:00");
    const b1 = new Date("2026-06-17T12:30:00");
    expect(overlaps(a0, a1, b0, b1)).toBe(false);
  });

  it("detecta um intervalo contido no outro", () => {
    const b0 = new Date("2026-06-17T09:00:00");
    const b1 = new Date("2026-06-17T12:00:00");
    expect(overlaps(a0, a1, b0, b1)).toBe(true);
  });
});

describe("dayRange / dateAtMinutes", () => {
  it("cobre o dia inteiro", () => {
    const { start, end } = dayRange("2026-06-17");
    expect(start.getHours()).toBe(0);
    expect(start.getMinutes()).toBe(0);
    expect(end.getHours()).toBe(23);
    expect(end.getMinutes()).toBe(59);
    expect(start.getDate()).toBe(17);
    expect(end.getDate()).toBe(17);
  });

  it("posiciona o horário a partir de minutos", () => {
    const d = dateAtMinutes("2026-06-17", 9 * 60 + 30);
    expect(d.getHours()).toBe(9);
    expect(d.getMinutes()).toBe(30);
  });
});
