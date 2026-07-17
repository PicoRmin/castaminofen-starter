export type AppErrorCode = 'network' | 'http' | 'unknown';

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly status?: number;
  readonly details?: unknown;

  constructor(message: string, code: AppErrorCode = 'unknown', options?: { status?: number; details?: unknown }) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = options?.status;
    this.details = options?.details;
  }
}

export class ApiError extends AppError {
  constructor(message: string, status: number, details?: unknown) {
    super(message, 'http', { status, details });
    this.name = 'ApiError';
  }
}

export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    const message = error.message || 'Unexpected error occurred';
    return new AppError(message, 'unknown', { details: error });
  }

  if (typeof error === 'string') {
    return new AppError(error, 'unknown');
  }

  return new AppError('Unexpected error occurred', 'unknown', { details: error });
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong') {
  if (error instanceof AppError) {
    return error.message || fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
