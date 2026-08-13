export interface ApiErrorResponse {
  error?: string;
  message?: string;
  details?: Record<string, unknown> | Array<unknown> | unknown;
}
