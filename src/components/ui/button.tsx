import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex cursor-pointer select-none items-center justify-center gap-2 rounded-xl font-medium tracking-tight transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-glow/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] active:duration-75";

const variants: Record<Variant, string> = {
  // Ação principal — dourado premium com brilho sutil
  primary:
    "bg-gradient-to-b from-gold-soft to-gold-deep text-ink-950 font-semibold shadow-[0_10px_30px_-12px_rgba(200,162,74,0.6),inset_0_1px_0_0_rgba(255,255,255,0.25)] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-12px_rgba(200,162,74,0.7),inset_0_1px_0_0_rgba(255,255,255,0.35)] hover:brightness-[1.06]",
  // Ação secundária forte — superfície escura com contorno dourado
  secondary:
    "border border-gold/40 bg-ink-700/70 text-gold-glow shadow-card hover:border-gold/70 hover:bg-ink-600/70 hover:-translate-y-0.5",
  outline:
    "border border-nardo-line/70 bg-ink-800/40 text-silver hover:border-gold/50 hover:bg-ink-700/60 hover:text-silver-bright",
  ghost: "text-silver-dim hover:bg-ink-700/60 hover:text-silver-bright",
  danger:
    "border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:text-red-200",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-[15px]",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";
