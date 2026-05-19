export type TreatmentCategory = "topical" | "supplement" | "lifestyle" | "medical";

export interface Treatment {
  id: string;
  user_id: string;
  name: string;
  category: TreatmentCategory;
  frequency: string;
  start_date: string;
  end_date: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTreatmentRequest {
  name: string;
  category: TreatmentCategory;
  frequency: string;
  start_date: string;
  end_date?: string;
  notes?: string;
  is_active?: boolean;
}
