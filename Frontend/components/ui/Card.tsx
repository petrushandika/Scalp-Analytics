import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className, children }: CardProps) {
  return (
    <div className={cn("rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100", className)}>
      {children}
    </div>
  );
}
