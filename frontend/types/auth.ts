export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  age: number | null;
  gender: "male" | "female" | "other" | null;
  activity_level: "sedentary" | "light" | "moderate" | "active" | "very_active" | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  full_name?: string;
  avatar_url?: string;
  height_cm?: number;
  weight_kg?: number;
  age?: number;
  gender?: "male" | "female" | "other";
  activity_level?: "sedentary" | "light" | "moderate" | "active" | "very_active";
}
