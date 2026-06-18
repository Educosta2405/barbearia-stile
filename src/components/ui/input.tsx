import { forwardRef } from "react";
import { cn } from "@/lib/cn";

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-11 w-full rounded-xl border border-nardo-line/60 bg-ink-850/80 px-4 text-sm text-silver-bright placeholder:text-silver-dim/60",
      "transition-all duration-200 focus:border-gold-soft/70 focus:bg-ink-800 focus:outline-none focus:ring-2 focus:ring-gold-glow/25",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "mb-1.5 block text-xs font-medium uppercase tracking-wide text-silver-dim",
        className,
      )}
      {...props}
    />
  );
}

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-xl border border-nardo-line/60 bg-ink-850/80 px-4 py-3 text-sm text-silver-bright placeholder:text-silver-dim/60",
      "transition-all duration-200 focus:border-gold-soft/70 focus:bg-ink-800 focus:outline-none focus:ring-2 focus:ring-gold-glow/25",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
