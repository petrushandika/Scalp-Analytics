export interface Habit {
  id: string;
  user_id: string;
  log_date: string;
  stress_level: number;
  sleep_hours: number;
  water_intake_ml: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateHabitRequest {
  log_date: string;
  stress_level: number;
  sleep_hours: number;
  water_intake_ml: number;
  notes?: string;
}
