import type { Metadata } from "next";
import { Inter, Sora, Playfair_Display } from "next/font/google";
import { BRAND } from "@/lib/brand";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// UI headings pequenos (cards, badges) — sans geométrica
const sora = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

// Títulos grandes / chamadas premium — serifada editorial
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} · Barbearia Premium`,
    template: `%s · ${BRAND.name}`,
  },
  description:
    "Agende seu corte, barba e mais com os melhores barbeiros. Experiência premium, rápida e sem complicação.",
  icons: { icon: BRAND.logo.src },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${sora.variable} ${playfair.variable}`}
    >
      <body className="font-sans">{children}</body>
    </html>
  );
}
