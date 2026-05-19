import type { SeverityStage } from "./photo";

export interface ProgressPoint {
  date: string;
  severity_stage: SeverityStage;
}

export interface Analytics {
  total_photos: number;
  latest_severity_stage: SeverityStage | null;
  progress: ProgressPoint[];
  avg_stress_level: number | null;
  avg_sleep_hours: number | null;
  active_treatments: number;
  treatment_names: string[];
}
