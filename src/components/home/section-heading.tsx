import { Reveal } from "@/components/ui/reveal";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  icon,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}) {
  return (
    <Reveal>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <div className="mt-2.5 flex items-center gap-3">
        {icon && <span className="text-gold">{icon}</span>}
        <h2 className="font-serif text-3xl font-semibold tracking-tight text-silver-bright sm:text-4xl">
          {title}
        </h2>
      </div>
      {subtitle && <p className="mt-2.5 max-w-xl text-silver-dim">{subtitle}</p>}
    </Reveal>
  );
}
