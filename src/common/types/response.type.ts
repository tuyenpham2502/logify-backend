export interface BaseResponse<T = unknown> {
  statusCode: number;
  message: string;
  data?: T;
  timestamp: string;
  path: string;
}

export interface SuccessResponse<T = unknown> extends BaseResponse<T> {
  success: true;
}

export interface ErrorResponse extends BaseResponse {
  success: false;
  error: {
    code: string;
    details?: Record<string, unknown>;
  };
}

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;
