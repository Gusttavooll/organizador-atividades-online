import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-soft hover:text-background focus-visible:outline-accent-soft",
  secondary:
    "bg-transparent text-foreground border border-border hover:border-accent-soft hover:text-accent-soft focus-visible:outline-accent-soft",
  ghost:
    "bg-transparent text-foreground-muted hover:text-foreground focus-visible:outline-accent-soft",
};

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(BASE_CLASSES, VARIANT_CLASSES[variant], className)}
      {...props}
    />
  );
}

interface LinkButtonProps {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

export function LinkButton({ href, variant = "primary", className, children }: LinkButtonProps) {
  return (
    <Link href={href} className={cn(BASE_CLASSES, VARIANT_CLASSES[variant], className)}>
      {children}
    </Link>
  );
}
