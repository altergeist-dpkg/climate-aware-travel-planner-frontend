import { describe, it, expect } from 'vitest';
import { ApiError, CityNotFoundError, ExternalServiceError } from '../errors';

describe('Custom Errors', () => {
  it('ApiError correctly captures the message and status code', () => {
    const err = new ApiError('Bad request', 400);

    expect(err).toBeInstanceOf(ApiError);
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('Bad request');
    expect(err.name).toBe('ApiError');
    expect(err.statusCode).toBe(400);
  });

  it('ExternalServiceError correctly captures the message and statusCode (500 or 502)', () => {
    const err502 = new ExternalServiceError('Gateway unavailable', 502);

    expect(err502).toBeInstanceOf(ExternalServiceError);
    expect(err502).toBeInstanceOf(ApiError);
    expect(err502.message).toBe('Gateway unavailable');
    expect(err502.name).toBe('ExternalServiceError');
    expect(err502.statusCode).toBe(502);

    const err500 = new ExternalServiceError('Server error', 500);
    expect(err500.statusCode).toBe(500);
  });

  it('CityNotFoundError correctly captures the message and status code', () => {
    const message = 'City "Unknown" could not be found';
    const err = new CityNotFoundError(message);

    expect(err).toBeInstanceOf(CityNotFoundError);
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe(message);
    expect(err.name).toBe('CityNotFoundError');
    expect(err.statusCode).toBe(404);
  });

  it('CityNotFoundError uses default message when none provided', () => {
    const err = new CityNotFoundError();

    expect(err.message).toBe('City not found');
    expect(err.statusCode).toBe(404);
  });
});
