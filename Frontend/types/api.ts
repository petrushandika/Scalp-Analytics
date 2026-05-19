export interface ApiMeta {
  timestamp: string;
  request_id: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta: ApiMeta;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorInfo {
  code: string;
  message: string;
  details: ApiErrorDetail[];
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorInfo;
  meta: ApiMeta;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly details: ApiErrorDetail[] = [],
    public readonly status: number = 0,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
