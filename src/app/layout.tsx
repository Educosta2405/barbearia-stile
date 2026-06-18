import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { BRAND } from "@/lib/brand";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
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
    <html lang="pt-BR" className={`${inter.variable} ${sora.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
