import { forwardRef } from "react";

import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-slate-700">
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "w-full rounded-xl border px-3.5 py-2.5 text-sm",
            "bg-white text-slate-900 placeholder:text-slate-400",
            "shadow-sm transition-all duration-150",
            "focus:outline-none focus:ring-2 focus:ring-primary-500/25 focus:border-primary-500",
            error
              ? "border-red-300 focus:ring-red-400/25 focus:border-red-400"
              : "border-slate-200 hover:border-slate-300",
            "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60",
            "resize-none",
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
