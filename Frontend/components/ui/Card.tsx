import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  variant?: "default" | "bordered" | "elevated" | "glass" | "flat";
  hover?: boolean;
  padding?: boolean;
}

const variantClasses = {
  default: "bg-white shadow-card ring-1 ring-black/[0.04]",
  bordered: "bg-white border border-slate-200",
  elevated: "bg-white shadow-card-md",
  glass: "glass border border-white/50 shadow-card",
  flat: "bg-slate-50 border border-slate-100",
};

export function Card({ className, children, variant = "default", hover = false, padding = true }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl",
        variantClasses[variant],
        padding && "p-5",
        hover && "card-hover cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  );
}
