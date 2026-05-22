export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface Food {
  id: string;
  name: string;
  category: string;
  brand: string | null;
  default_serving: number;
  default_unit: string;
  is_verified: boolean;
}

export interface MealItem {
  id: string;
  food_id: string;
  quantity: number;
  unit: string;
  serving_multiplier: number;
}

export interface Meal {
  id: string;
  user_id: string;
  log_date: string;
  log_time: string;
  meal_type: MealType;
  notes: string | null;
  items: MealItem[];
  created_at: string;
}

export interface MealItemRequest {
  food_id: string;
  quantity: number;
  unit: string;
  serving_multiplier?: number;
}

export interface CreateMealRequest {
  log_date: string;
  log_time: string;
  meal_type: MealType;
  notes?: string;
  items: MealItemRequest[];
}

export interface WaterLog {
  id: string;
  user_id: string;
  amount_ml: number;
  log_date: string;
  created_at: string;
}

export interface WaterToday {
  total_ml: number;
  logs: WaterLog[];
}
