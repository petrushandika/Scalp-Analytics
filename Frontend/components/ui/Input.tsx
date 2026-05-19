import { forwardRef } from "react";

import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | undefined;
  hint?: string | undefined;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, leftIcon, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "h-9 w-full rounded-lg border px-3 text-sm",
              "bg-white text-slate-900 placeholder:text-slate-400",
              "transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:ring-offset-0 focus:border-primary-500",
              error
                ? "border-red-400 focus:ring-red-400/30 focus:border-red-400"
                : "border-slate-200 hover:border-slate-300",
              "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
              leftIcon ? "pl-9" : "",
              className,
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
