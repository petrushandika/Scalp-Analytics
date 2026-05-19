export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface Food {
  id: string;
  name: string;
  calories_per_100g: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

export interface MealItem {
  food_id: string;
  quantity_grams: number;
  food?: Food;
}

export interface Meal {
  id: string;
  user_id: string;
  log_date: string;
  meal_type: MealType;
  items: MealItem[];
  created_at: string;
}

export interface CreateMealRequest {
  log_date: string;
  meal_type: MealType;
  items: { food_id: string; quantity_grams: number }[];
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
