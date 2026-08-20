export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
  };
}