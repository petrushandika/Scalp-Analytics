import { Loader2 } from "lucide-react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "white";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
}

const variantClasses = {
  primary:
    "bg-gradient-to-b from-primary-500 to-primary-600 text-white shadow-sm shadow-primary-900/20 hover:from-primary-400 hover:to-primary-500 active:from-primary-600 active:to-primary-700 border border-primary-600/20",
  secondary:
    "bg-primary-950 text-white shadow-sm hover:bg-primary-900 active:bg-slate-950 border border-primary-900/30",
  outline:
    "border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100",
  ghost:
    "text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200",
  danger:
    "bg-gradient-to-b from-red-500 to-red-600 text-white shadow-sm shadow-red-900/20 hover:from-red-400 hover:to-red-500 border border-red-600/20",
  white:
    "bg-white/15 text-white border border-white/20 backdrop-blur-sm hover:bg-white/25 active:bg-white/10",
};

const sizeClasses = {
  xs: "h-7 px-2.5 text-xs rounded-lg gap-1",
  sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
  md: "h-9 px-4 text-sm rounded-lg gap-2",
  lg: "h-11 px-5 text-sm rounded-xl gap-2 font-semibold",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium tracking-tight",
          "transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1",
          "disabled:pointer-events-none disabled:opacity-50",
          "select-none",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
