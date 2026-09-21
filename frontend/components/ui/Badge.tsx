import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  colorClass?: string;
}

export function Badge({ colorClass, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground",
        className,
      )}
      {...props}
    >
      {colorClass && (
        <span className={cn("h-2 w-2 rounded-full", colorClass)} aria-hidden="true" />
      )}
      {children}
    </span>
  );
}
