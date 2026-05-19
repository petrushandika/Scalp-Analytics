import { cn } from "@/lib/utils";
import type { SeverityStage } from "@/types/photo";

interface BadgeProps {
  stage: SeverityStage;
  className?: string;
}

const stageConfig: Record<SeverityStage, { label: string; classes: string }> = {
  normal: { label: "Normal", classes: "bg-green-100 text-green-800" },
  stage_1: { label: "Stage 1", classes: "bg-yellow-100 text-yellow-800" },
  stage_2: { label: "Stage 2", classes: "bg-yellow-100 text-yellow-800" },
  stage_3: { label: "Stage 3", classes: "bg-orange-100 text-orange-800" },
  stage_4: { label: "Stage 4", classes: "bg-orange-100 text-orange-800" },
  stage_5: { label: "Stage 5", classes: "bg-red-100 text-red-800" },
  stage_6: { label: "Stage 6", classes: "bg-red-100 text-red-800" },
  stage_7: { label: "Stage 7", classes: "bg-red-100 text-red-800" },
};

export function Badge({ stage, className }: BadgeProps) {
  const { label, classes } = stageConfig[stage];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        classes,
        className,
      )}
    >
      {label}
    </span>
  );
}
