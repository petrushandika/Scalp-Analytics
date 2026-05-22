import axios, { type AxiosInstance, type AxiosResponse } from "axios";

import type { Analytics } from "@/types/analytics";
import type { ApiSuccessResponse } from "@/types/api";
import { ApiError } from "@/types/api";
import type { Habit, CreateHabitRequest } from "@/types/habit";
import type { Food, Meal, CreateMealRequest, WaterToday, WaterLog } from "@/types/nutrition";
import type { Photo, AnalyzeResult, PhotoAngle } from "@/types/photo";
import type { Treatment, CreateTreatmentRequest } from "@/types/treatment";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const TOKEN_KEY = "scalp_access_token";
const REFRESH_TOKEN_KEY = "scalp_refresh_token";

// ─── Token storage helpers ────────────────────────────────────────────────────

export const tokenStorage = {
  getAccessToken: () =>
    typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null,
  getRefreshToken: () =>
    typeof window !== "undefined" ? localStorage.getItem(REFRESH_TOKEN_KEY) : null,
  setTokens: (access: string, refresh: string) => {
    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    // sync to cookie so Next.js middleware can read it
    document.cookie = `${TOKEN_KEY}=${access}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  },
  clearTokens: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
  },
};

// ─── Axios instance ───────────────────────────────────────────────────────────

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

// Request interceptor: tambahkan Authorization header
apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle token refresh dan error normalization
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    // Auto-refresh jika 401 dan belum pernah dicoba
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = tokenStorage.getRefreshToken();

      if (refreshToken) {
        try {
          const res = await axios.post(`${API_URL}/api/auth/refresh`, {
            refresh_token: refreshToken,
          });
          const { access_token, refresh_token } = res.data.data;
          tokenStorage.setTokens(access_token, refresh_token);
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        } catch {
          tokenStorage.clearTokens();
          window.location.href = "/login";
        }
      } else {
        tokenStorage.clearTokens();
        window.location.href = "/login";
      }
    }

    // Normalize error ke ApiError
    if (error.response?.data) {
      const data = error.response.data;
      if (!data.success && data.error) {
        throw new ApiError(
          data.error.code,
          data.error.message,
          data.error.details ?? [],
          error.response.status,
        );
      }
    }
    throw error;
  },
);

// ─── Generic request helper ───────────────────────────────────────────────────

async function request<T>(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data?: unknown,
): Promise<T> {
  const response = await apiClient.request<ApiSuccessResponse<T>>({
    method,
    url,
    data,
  });
  return response.data.data;
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = {
  register: (payload: { email: string; password: string; full_name: string }) =>
    request<{ user: object; message: string }>("post", "/api/auth/register", payload),

  login: (payload: { email: string; password: string }) =>
    request<{
      access_token: string;
      refresh_token: string;
      token_type: string;
      expires_in: number;
    }>("post", "/api/auth/login", payload),

  logout: (refresh_token: string) =>
    apiClient.post("/api/auth/logout", { refresh_token }),

  refresh: (refresh_token: string) =>
    request<{
      access_token: string;
      refresh_token: string;
      token_type: string;
      expires_in: number;
    }>("post", "/api/auth/refresh", { refresh_token }),
};

// ─── Users API ────────────────────────────────────────────────────────────────

export const usersApi = {
  getProfile: () => request<object>("get", "/api/users/me"),

  updateProfile: (payload: object) => request<object>("put", "/api/users/me", payload),

  uploadAvatar: (formData: FormData) =>
    apiClient
      .post<ApiSuccessResponse<object>>("/api/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data.data),

  deleteAccount: () => apiClient.delete("/api/users/me"),
};

// ─── Photo API ────────────────────────────────────────────────────────────────

export const photoApi = {
  analyze: (file: File): Promise<AnalyzeResult> => {
    const form = new FormData();
    form.append("file", file);
    return apiClient
      .post<ApiSuccessResponse<AnalyzeResult>>("/api/photos/analyze", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data.data);
  },

  upload: ({ file, angle }: { file: File; angle: PhotoAngle }): Promise<Photo> => {
    const form = new FormData();
    form.append("file", file);
    form.append("angle", angle);
    return apiClient
      .post<ApiSuccessResponse<Photo>>("/api/photos/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data.data);
  },

  list: () => request<Photo[]>("get", "/api/photos/"),
  get: (id: string) => request<Photo>("get", `/api/photos/${id}`),
  delete: (id: string) => apiClient.delete(`/api/photos/${id}`),
};

// ─── Habit API ────────────────────────────────────────────────────────────────

export const habitApi = {
  list: () => request<Habit[]>("get", "/api/habits/"),
  get: (id: string) => request<Habit>("get", `/api/habits/${id}`),
  create: (payload: CreateHabitRequest) => request<Habit>("post", "/api/habits/", payload),
  update: (id: string, payload: Partial<CreateHabitRequest>) =>
    request<Habit>("put", `/api/habits/${id}`, payload),
  delete: (id: string) => apiClient.delete(`/api/habits/${id}`),
};

// ─── Treatment API ────────────────────────────────────────────────────────────

export const treatmentApi = {
  list: (activeOnly?: boolean) =>
    request<Treatment[]>("get", `/api/treatments/${activeOnly ? "?active_only=true" : ""}`),
  get: (id: string) => request<Treatment>("get", `/api/treatments/${id}`),
  create: (payload: CreateTreatmentRequest) =>
    request<Treatment>("post", "/api/treatments/", payload),
  update: (id: string, payload: Partial<CreateTreatmentRequest>) =>
    request<Treatment>("put", `/api/treatments/${id}`, payload),
  deactivate: (id: string) => request<Treatment>("patch", `/api/treatments/${id}/deactivate`),
  delete: (id: string) => apiClient.delete(`/api/treatments/${id}`),
};

// ─── Analytics API ────────────────────────────────────────────────────────────

export const analyticsApi = {
  get: () => request<Analytics>("get", "/api/analytics/"),
};

// ─── Nutrition API ────────────────────────────────────────────────────────────

export const nutritionApi = {
  searchFoods: (q: string) => request<Food[]>("get", `/api/nutrition/foods?q=${encodeURIComponent(q)}`),
  createMeal: (payload: CreateMealRequest) => request<Meal>("post", "/api/nutrition/meals", payload),
  getMeals: (logDate: string) =>
    request<Meal[]>("get", `/api/nutrition/meals?log_date=${logDate}`),
  deleteMeal: (id: string) => apiClient.delete(`/api/nutrition/meals/${id}`),
  logWater: (payload: { amount_ml: number; log_date: string }) =>
    request<WaterLog>("post", "/api/nutrition/water", payload),
  getWaterToday: () => request<WaterToday>("get", "/api/nutrition/water/today"),
};

export default apiClient;
