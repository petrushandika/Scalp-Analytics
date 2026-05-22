export interface Habit {
  id: string;
  user_id: string;
  log_date: string;
  stress_level: number | null;
  sleep_hours: number | null;
  activity: string | null;
  activity_duration_min: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateHabitRequest {
  log_date: string;
  stress_level?: number;
  sleep_hours?: number;
  activity?: string;
  activity_duration_min?: number;
  notes?: string;
}
