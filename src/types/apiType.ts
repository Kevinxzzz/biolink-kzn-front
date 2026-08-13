export interface ApiErrorResponse {
  error?: string;
  message?: string;
  details?: Record<string, any> | Array<any> | any;
}
