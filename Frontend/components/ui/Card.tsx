import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  bordered?: boolean;
}

export function Card({ className, children, hover, bordered }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-white p-6",
        bordered ? "border border-slate-200" : "shadow-sm shadow-slate-200/60 ring-1 ring-slate-100",
        hover && "transition-shadow duration-200 hover:shadow-md hover:shadow-slate-200/80",
        className,
      )}
    >
      {children}
    </div>
  );
}
