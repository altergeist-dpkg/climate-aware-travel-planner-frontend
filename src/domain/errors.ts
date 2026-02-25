/**
 * Domain errors: custom exception classes for API and business failures.
 * Pure TypeScript — no React or external libraries.
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class CityNotFoundError extends ApiError {
  constructor(message: string = 'City not found') {
    super(message, 404);
    this.name = 'CityNotFoundError';
    Object.setPrototypeOf(this, CityNotFoundError.prototype);
  }
}

export class ExternalServiceError extends ApiError {
  constructor(message: string = 'External service unavailable', statusCode: 500 | 502 = 500) {
    super(message, statusCode);
    this.name = 'ExternalServiceError';
    Object.setPrototypeOf(this, ExternalServiceError.prototype);
  }
}
