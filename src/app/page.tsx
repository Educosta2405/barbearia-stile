import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser, isStaff } from "@/lib/session";
import { BRAND, whatsappLink } from "@/lib/brand";
import { Navbar } from "@/components/layout/navbar";
import { BrandLogo } from "@/components/layout/brand-logo";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { AccessCard, type AccessItem } from "@/components/home/access-card";
import { SectionHeading } from "@/components/home/section-heading";
import {
  ScissorsIcon,
  RazorIcon,
  ChairIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  DashboardIcon,
  StarIcon,
  MapPinIcon,
  PhoneIcon,
  WhatsAppIcon,
  ArrowRightIcon,
} from "@/components/ui/icons";
import { formatPrice, formatDuration } from "@/lib/format";

const DIFERENCIAIS = [
  {
    icon: <CalendarIcon />,
    title: "Hora marcada",
    text: "Sem fila e sem espera. Seu horário é só seu.",
  },
  {
    icon: <ScissorsIcon />,
    title: "Profissionais especializados",
    text: "Barbeiros experientes em corte, barba e acabamento.",
  },
  {
    icon: <StarIcon />,
    title: "Ambiente premium",
    text: "Conforto, atenção aos detalhes e atmosfera masculina.",
  },
  {
    icon: <ClockIcon />,
    title: "Agendamento rápido",
    text: "Marque em segundos, direto pelo celular.",
  },
];

export default async function HomePage() {
  const [services, barbers, user] = await Promise.all([
    db.service.findMany({ where: { active: true }, orderBy: { durationMinutes: "asc" } }),
    db.barber.findMany({
      where: { active: true },
      include: { user: { select: { name: true } } },
    }),
    getCurrentUser(),
  ]);

  const loggedIn = !!user;
  const staff = isStaff(user?.role);
  const ctaHref = loggedIn ? "/agendar" : "/cadastro";

  const access: AccessItem[] = [];
  if (staff) {
    access.push({
      title: "Painel administrativo",
      description: "Agenda, barbeiros, serviços e clientes.",
      href: "/admin",
      icon: <DashboardIcon />,
      highlight: true,
    });
  }
  access.push({
    title: "Agendar horário",
    description: "Escolha serviço, profissional e horário.",
    href: ctaHref,
    icon: <CalendarIcon />,
    highlight: !staff,
  });
  if (loggedIn) {
    access.push({
      title: "Meus horários",
      description: "Veja, reagende ou cancele seus horários.",
      href: "/perfil",
      icon: <ClockIcon />,
    });
  }
  access.push(
    {
      title: "Serviços",
      description: "Corte, barba, sobrancelha e progressiva.",
      href: "#servicos",
      icon: <ScissorsIcon />,
    },
    {
      title: "Barbeiros",
      description: "Conheça os profissionais da casa.",
      href: "#barbeiros",
      icon: <ChairIcon />,
    },
  );
  if (!loggedIn) {
    access.push({
      title: "Área do cliente",
      description: "Entre para acompanhar seus horários.",
      href: "/login",
      icon: <UserIcon />,
    });
  }

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="surface-texture relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_-5%,rgba(200,162,74,0.12),transparent_60%)]" />
        <div className="mx-auto max-w-5xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
          <div className="flex animate-blur-in justify-center">
            <BrandLogo href={null} showName={false} size="lg" />
          </div>
          <div className="mt-5 flex animate-fade-in items-center justify-center gap-3 text-gold/70">
            <RazorIcon className="h-4 w-4" />
            <p className="eyebrow">
              {BRAND.name} · desde {BRAND.foundedYear}
            </p>
            <ScissorsIcon className="h-4 w-4" />
          </div>

          <h1 className="mt-6 animate-blur-in font-display text-4xl font-bold leading-[1.04] tracking-tight text-silver-bright sm:text-6xl">
            Estilo é detalhe.
            <br className="hidden sm:block" />{" "}
            <span className="text-gradient">Precisão</span> é assinatura.
          </h1>

          <p className="mx-auto mt-6 max-w-xl animate-fade-up text-balance text-base text-silver-dim delay-2 sm:text-lg">
            Cortes, barba e cuidados executados por profissionais especializados,
            em um ambiente pensado para a sua experiência. Agende em segundos.
          </p>

          <div className="mt-9 flex animate-fade-up flex-col items-center justify-center gap-3 delay-3 sm:flex-row">
            <Link href={ctaHref} className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                <CalendarIcon className="h-5 w-5" />
                Agendar horário
              </Button>
            </Link>
            <a
              href={whatsappLink(`Olá! Gostaria de agendar um horário na ${BRAND.name}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <WhatsAppIcon className="h-5 w-5" />
                Falar no WhatsApp
              </Button>
            </a>
          </div>

          <p className="mt-6 animate-fade-in text-xs text-silver-dim delay-4">
            {BRAND.hoursWeekday} · {BRAND.hoursSaturday}
          </p>
        </div>
        <div className="gold-divider" />
      </section>

      {/* ACESSO RÁPIDO */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <SectionHeading eyebrow="Navegação" title="Acesso rápido" />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {access.map((item, i) => (
            <Reveal key={item.title} delay={i * 50}>
              <AccessCard item={item} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <SectionHeading eyebrow="Por que a casa" title={`A experiência ${BRAND.short}`} />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {DIFERENCIAIS.map((d, i) => (
            <Reveal key={d.title} delay={i * 50}>
              <div className="hover-lift h-full rounded-2xl border border-nardo-line/50 bg-ink-800/50 p-5 shadow-card hover:border-gold/40">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/30 bg-gold/[0.07] text-gold-glow">
                  {d.icon}
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-silver-bright">
                  {d.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-silver-dim">{d.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SERVIÇOS */}
      <section id="servicos" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6">
        <SectionHeading
          eyebrow="O que fazemos"
          title="Serviços"
          subtitle="Escolha o cuidado ideal para o seu estilo."
          icon={<ScissorsIcon />}
        />
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={i * 50}>
              <Link
                href={ctaHref}
                className="group hover-lift flex h-full flex-col rounded-2xl border border-nardo-line/50 bg-ink-800/60 p-5 shadow-card transition-colors hover:border-gold/45"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-nardo-line/50 bg-ink-700/60 text-silver transition-colors group-hover:border-gold/40 group-hover:text-gold-glow">
                  <ScissorsIcon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-silver-bright">
                  {s.name}
                </h3>
                <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-full border border-nardo-line/50 px-2 py-0.5 text-xs text-silver-dim">
                  <ClockIcon className="h-3 w-3" />
                  {formatDuration(s.durationMinutes)}
                </span>
                <p className="mt-auto pt-5 text-xl font-semibold text-gradient">
                  {formatPrice(s.priceCents)}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* BARBEIROS */}
      <section id="barbeiros" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6">
        <SectionHeading
          eyebrow="Quem cuida de você"
          title="Nossos barbeiros"
          icon={<ChairIcon />}
        />
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {barbers.map((b, i) => (
            <Reveal key={b.id} delay={i * 50}>
              <Link
                href={ctaHref}
                className="group hover-lift flex h-full items-center gap-4 rounded-2xl border border-nardo-line/50 bg-ink-800/60 p-5 shadow-card transition-colors hover:border-gold/45"
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-gold/25 bg-gradient-to-br from-ink-700 to-ink-600 font-display text-xl font-semibold text-gold-glow">
                  {(b.user.name ?? "B").charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display font-semibold text-silver-bright">
                    {b.user.name}
                  </h3>
                  <p className="truncate text-sm text-silver-dim">
                    {b.bio ?? "Barbeiro profissional"}
                  </p>
                  <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-gold-glow opacity-0 transition-opacity group-hover:opacity-100">
                    Agendar <ArrowRightIcon className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CONTATO / LOCALIZAÇÃO */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Reveal>
          <div className="surface-texture overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-b from-ink-800/80 to-ink-850 shadow-card">
            <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-2">
              <div>
                <p className="eyebrow">Visite-nos</p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-silver-bright sm:text-3xl">
                  Venha tomar um café e sair renovado.
                </h2>
                <ul className="mt-6 space-y-3 text-sm">
                  <li className="flex items-center gap-3 text-silver">
                    <MapPinIcon className="h-5 w-5 shrink-0 text-gold" />
                    {BRAND.address}
                  </li>
                  <li className="flex items-center gap-3 text-silver">
                    <ClockIcon className="h-5 w-5 shrink-0 text-gold" />
                    {BRAND.hoursWeekday} · {BRAND.hoursSaturday}
                  </li>
                  <li className="flex items-center gap-3 text-silver">
                    <PhoneIcon className="h-5 w-5 shrink-0 text-gold" />
                    {BRAND.phoneDisplay}
                  </li>
                </ul>
              </div>

              <div className="flex flex-col justify-center gap-3 rounded-2xl border border-nardo-line/40 bg-ink-900/40 p-6">
                <p className="text-sm text-silver-dim">
                  Prefere falar com a gente? Chame no WhatsApp e tire suas dúvidas.
                </p>
                <a
                  href={whatsappLink(`Olá! Vim pelo site da ${BRAND.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="w-full">
                    <WhatsAppIcon className="h-5 w-5" />
                    {BRAND.whatsappDisplay}
                  </Button>
                </a>
                <Link href={ctaHref}>
                  <Button size="lg" variant="outline" className="w-full">
                    <CalendarIcon className="h-5 w-5" />
                    Agendar pelo site
                  </Button>
                </Link>
                <p className="text-center text-xs text-silver-dim">
                  {BRAND.instagram}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-nardo-line/40 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 sm:flex-row sm:justify-between sm:px-6">
          <p className="text-sm text-silver-dim">
            © {new Date().getFullYear()} {BRAND.name}
          </p>
          <p className="text-xs text-silver-dim">{BRAND.tagline}</p>
        </div>
      </footer>
    </>
  );
}
