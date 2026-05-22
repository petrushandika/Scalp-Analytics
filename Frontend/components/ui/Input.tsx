import { forwardRef } from "react";

import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | undefined;
  hint?: string | undefined;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, leftIcon, rightElement, ...props }, ref) => {
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
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "h-10 w-full rounded-xl border px-3.5 text-sm",
              "bg-white text-slate-900 placeholder:text-slate-400",
              "shadow-sm transition-all duration-150",
              "focus:outline-none focus:ring-2 focus:ring-primary-500/25 focus:border-primary-500",
              error
                ? "border-red-300 focus:ring-red-400/25 focus:border-red-400"
                : "border-slate-200 hover:border-slate-300",
              "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60",
              leftIcon ? "pl-10" : "",
              rightElement ? "pr-10" : "",
              className,
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="flex items-center gap-1 text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
