import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { BRAND } from "@/lib/brand";

/**
 * Marca da barbearia: logo (PNG dourado com transparência) + nome "Stile".
 * O nome pode ser ocultado para usos compactos. A logo herda o dourado
 * original — sem filtros que alterem o desenho.
 */
export function BrandLogo({
  href = "/",
  showName = true,
  size = "md",
  className,
}: {
  href?: string | null;
  showName?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  // Altura da logo por tamanho (largura mantém a proporção 170:222).
  const logoHeight = { sm: 30, md: 38, lg: 84 }[size];
  const logoWidth = Math.round(logoHeight * (BRAND.logo.width / BRAND.logo.height));

  const nameSize = { sm: "text-base", md: "text-lg", lg: "text-2xl" }[size];

  const content = (
    <span className={cn("group flex items-center gap-2.5", className)}>
      <Image
        src={BRAND.logo.src}
        alt={BRAND.logo.alt}
        width={logoWidth}
        height={logoHeight}
        priority
        className="select-none"
        style={{ height: logoHeight, width: logoWidth }}
      />
      {showName && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-serif font-semibold tracking-[0.02em] text-silver-bright",
              nameSize,
            )}
          >
            {BRAND.name}
          </span>
          <span className="mt-0.5 text-[10px] uppercase tracking-[0.3em] text-gold/80">
            Barbearia
          </span>
        </span>
      )}
    </span>
  );

  if (href === null) return content;
  return <Link href={href}>{content}</Link>;
}
