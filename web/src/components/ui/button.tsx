import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  as?: "button" | "a";
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:
    "bg-navy text-white hover:bg-navy-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40 disabled:opacity-50 disabled:pointer-events-none",
  secondary:
    "bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 disabled:opacity-50 disabled:pointer-events-none",
  outline:
    "border border-slate-300 text-slate-900 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 disabled:opacity-50 disabled:pointer-events-none",
  ghost:
    "text-slate-900 hover:bg-slate-100 disabled:opacity-50 disabled:pointer-events-none",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement & HTMLAnchorElement, ButtonProps>(
  ({ className, variant = "default", size = "md", as = "button", ...props }, ref) => {
    const Comp: any = as === "a" ? "a" : "button";
    return (
      <Comp
        ref={ref as any}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
