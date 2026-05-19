export type SeverityStage =
  | "normal"
  | "stage_1"
  | "stage_2"
  | "stage_3"
  | "stage_4"
  | "stage_5"
  | "stage_6"
  | "stage_7";

export type PhotoAngle = "front" | "top" | "right" | "left";

export interface Photo {
  id: string;
  user_id: string;
  file_path: string;
  angle: PhotoAngle;
  severity_stage: SeverityStage | null;
  confidence: number | null;
  recommendation: string | null;
  created_at: string;
}

export interface AnalyzeResult {
  severity_stage: SeverityStage;
  confidence: number;
  recommendation: string;
}
