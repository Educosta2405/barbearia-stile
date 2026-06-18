/**
 * Identidade da barbearia — TROQUE AQUI em um único lugar.
 * Nome, contatos, endereço e horários usados em toda a aplicação.
 */
export const BRAND = {
  name: "Stile",
  short: "Stile",
  monogram: "S", // fallback caso a imagem não carregue
  tagline: "Estilo. Precisão. Tradição.",

  // Logo principal (PNG dourado com transparência) — em public/branding/
  logo: {
    src: "/branding/stile-logo.png",
    width: 170,
    height: 222,
    alt: "Stile",
  },

  // Contato / localização
  phoneDisplay: "(11) 4002-8922",
  whatsapp: "5511940028922", // só dígitos, com DDI — usado no link wa.me
  whatsappDisplay: "(11) 94002-8922",
  email: "contato@stile.com",
  instagram: "@stilebarbearia",
  address: "Rua das Tesouras, 123 — Centro, São Paulo/SP",
  hoursWeekday: "Seg–Sex · 9h às 19h",
  hoursSaturday: "Sáb · 9h às 18h",
  foundedYear: 2010,
} as const;

export const whatsappLink = (message?: string) =>
  `https://wa.me/${BRAND.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
