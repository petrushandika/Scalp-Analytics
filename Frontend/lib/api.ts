import axios, { type AxiosInstance, type AxiosResponse } from "axios";

import type { ApiSuccessResponse } from "@/types/api";
import { ApiError } from "@/types/api";

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
  },
  clearTokens: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
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

  deleteAccount: () => apiClient.delete("/api/users/me"),
};

export default apiClient;
