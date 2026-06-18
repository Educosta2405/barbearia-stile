import { describe, it, expect } from "vitest";
import { isStaff, landingPath } from "@/lib/roles";

describe("isStaff", () => {
  it("reconhece ADMIN e BARBER como staff", () => {
    expect(isStaff("ADMIN")).toBe(true);
    expect(isStaff("BARBER")).toBe(true);
  });

  it("não trata CUSTOMER ou indefinido como staff", () => {
    expect(isStaff("CUSTOMER")).toBe(false);
    expect(isStaff(undefined)).toBe(false);
    expect(isStaff("")).toBe(false);
  });
});

describe("landingPath", () => {
  it("staff vai para o painel; cliente para o agendamento", () => {
    expect(landingPath("ADMIN")).toBe("/admin");
    expect(landingPath("BARBER")).toBe("/admin");
    expect(landingPath("CUSTOMER")).toBe("/agendar");
    expect(landingPath(undefined)).toBe("/agendar");
  });
});
