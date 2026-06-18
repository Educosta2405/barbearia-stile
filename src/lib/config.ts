/**
 * Configuração de funcionamento da barbearia.
 * (Numa evolução, isto pode virar tabela no banco por barbeiro.)
 */

/** 0 = domingo ... 6 = sábado. Horário de funcionamento por dia. */
export const BUSINESS_HOURS: Record<number, { open: string; close: string } | null> = {
  0: null, // domingo fechado
  1: { open: "09:00", close: "19:00" },
  2: { open: "09:00", close: "19:00" },
  3: { open: "09:00", close: "19:00" },
  4: { open: "09:00", close: "19:00" },
  5: { open: "09:00", close: "20:00" },
  6: { open: "09:00", close: "18:00" },
};

/** Granularidade da agenda, em minutos (de quanto em quanto começa um slot). */
export const SLOT_INTERVAL_MINUTES = 15;

/** Antecedência mínima para agendar (minutos a partir de agora). */
export const MIN_LEAD_TIME_MINUTES = 30;

/** Janela máxima para agendar no futuro (dias). */
export const MAX_ADVANCE_DAYS = 60;
