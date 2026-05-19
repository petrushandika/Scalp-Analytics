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
          <label htmlFor={textareaId} className="text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "w-full rounded-lg border px-3 py-2 text-sm",
            "bg-white text-gray-900 placeholder:text-gray-400",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0",
            error
              ? "border-red-400 focus:ring-red-400"
              : "border-gray-300 focus:border-primary-500",
            "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
