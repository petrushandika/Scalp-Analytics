export type TreatmentFrequency = "daily" | "weekly" | "custom";

export interface Treatment {
  id: string;
  user_id: string;
  name: string;
  frequency: TreatmentFrequency;
  dosage: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTreatmentRequest {
  name: string;
  frequency: TreatmentFrequency;
  dosage?: string;
  description?: string;
}
