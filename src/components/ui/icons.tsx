/**
 * Ícones lineares minimalistas, consistentes entre si.
 * Traço fino (1.5), sem preenchimento, herdam currentColor.
 * Conjunto enxuto e sofisticado — usar só onde agrega.
 */
import { cn } from "@/lib/cn";

type IconProps = React.SVGProps<SVGSVGElement>;

function Svg({ className, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6", className)}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/* ---- Principais (barbearia) ---- */

export function ScissorsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="6" cy="6" r="2.6" />
      <circle cx="6" cy="18" r="2.6" />
      <line x1="20" y1="4" x2="8.1" y2="15.9" />
      <line x1="14.5" y1="14.5" x2="20" y2="20" />
      <line x1="8.1" y1="8.1" x2="12" y2="12" />
    </Svg>
  );
}

export function RazorIcon(props: IconProps) {
  return (
    <Svg {...props}>
      {/* lâmina */}
      <path d="M4 20l3.2-3.2" />
      <path d="M7.2 16.8 18.6 5.4a1.2 1.2 0 0 1 1.7 1.7L8.9 18.5Z" />
      {/* eixo do cabo */}
      <circle cx="5.2" cy="18.8" r="0.6" />
    </Svg>
  );
}

export function ClipperIcon(props: IconProps) {
  return (
    <Svg {...props}>
      {/* corpo */}
      <rect x="7" y="8" width="10" height="12" rx="2" />
      {/* lâmina/pente superior */}
      <path d="M9 8V5.5" />
      <path d="M12 8V4.5" />
      <path d="M15 8V5.5" />
      <line x1="7.5" y1="13" x2="16.5" y2="13" />
    </Svg>
  );
}

export function ChairIcon(props: IconProps) {
  return (
    <Svg {...props}>
      {/* encosto */}
      <path d="M8 13V7a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v6" />
      {/* assento */}
      <path d="M6 13h11a1.5 1.5 0 0 1 1.5 1.5V17a1.5 1.5 0 0 1-1.5 1.5H7.5A1.5 1.5 0 0 1 6 17Z" />
      {/* base */}
      <path d="M9 18.5v2.5" />
      <path d="M15.5 18.5v2.5" />
      <path d="M7.5 21h9" />
    </Svg>
  );
}

/* ---- Secundários (discretos) ---- */

export function CalendarIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9.5h17" />
      <path d="M8 3.5v3" />
      <path d="M16 3.5v3" />
    </Svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8v4.2l2.8 1.8" />
    </Svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </Svg>
  );
}

export function DashboardIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="5" rx="1.5" />
      <rect x="13" y="11" width="7" height="9" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
    </Svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </Svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L12 16.77l-5.2 2.73.99-5.78-4.21-4.1 5.82-.85Z" />
    </Svg>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </Svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6.5 4h3l1.4 3.5-1.8 1.3a11 11 0 0 0 5 5l1.3-1.8L19 16.5v3a1.5 1.5 0 0 1-1.6 1.5A14.5 14.5 0 0 1 4 6.1 1.5 1.5 0 0 1 5.5 4Z" />
    </Svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 20l1.4-4.1A7.5 7.5 0 1 1 8.6 19L4 20Z" />
      <path d="M9.2 8.4c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .6.5l.6 1.4c.1.2 0 .4-.1.6l-.4.5c-.1.2-.2.3-.1.5a4.5 4.5 0 0 0 2.2 2.1c.2.1.4.1.5-.1l.5-.6c.2-.2.3-.2.5-.1l1.3.6c.3.1.4.3.4.5a1.6 1.6 0 0 1-1.1 1.4c-.5.2-1.6.2-3.3-.8a6.3 6.3 0 0 1-2.8-3.4c-.2-.8-.1-1.6.3-2.5Z" />
    </Svg>
  );
}
