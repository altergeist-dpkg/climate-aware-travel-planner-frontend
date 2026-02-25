import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getClimatePlan } from '../travelApi';
import {
  ApiError,
  CityNotFoundError,
  ExternalServiceError,
} from '../../domain/errors';

const MOCK_API_URL = 'https://api.example.com';

describe('travelApi', () => {
  const originalFetch = globalThis.fetch;
  const originalEnv = process.env.NEXT_PUBLIC_API_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = MOCK_API_URL;
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_API_URL = originalEnv;
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  describe('Success Mapping', () => {
    it('returns domain object with weather (camelCase) when API returns weather_data (snake_case)', async () => {
      const apiResponse = {
        city: 'London',
        month: 'January',
        weather_data: {
          temperature: 5,
          real_feel: 2,
          condition: 'Cloudy',
        },
        packing_list: [
          { item: 'Umbrella', justification: 'Rain likely' },
        ],
        hex_code: '#4A90D9',
        icon_name: 'cloud-rain',
        confidence_score: 0.92,
      };

      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        new Response(JSON.stringify(apiResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await getClimatePlan('London', 'January', 'en');

      expect(result).toHaveProperty('weather');
      expect(result.weather).toEqual({
        temperature: 5,
        real_feel: 2,
        condition: 'Cloudy',
      });
      expect(result).not.toHaveProperty('weather_data');
      expect(result.packing_list).toHaveLength(1);
      expect(result.packing_list[0]).toEqual({
        name: 'Umbrella',
        justification: 'Rain likely',
      });
    });
  });

  describe('Security Masking', () => {
    it('throws generic message on 500 and does not expose backend detail', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        new Response(
          JSON.stringify({ detail: 'Internal database connection failed' }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );

      await expect(getClimatePlan('London', 'January', 'en')).rejects.toThrow(
        'An unexpected system error occurred. Please try again later.'
      );
    });
  });

  describe('Specific Errors', () => {
    it('throws CityNotFoundError on 404', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        new Response(
          JSON.stringify({ detail: 'City not found in database' }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );

      await expect(getClimatePlan('UnknownCity', 'January', 'en')).rejects.toThrow(
        CityNotFoundError
      );
    });

    it('404 City Not Found: throws CityNotFoundError with response detail message', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        new Response(
          JSON.stringify({ detail: 'City not found locally' }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );

      const err = await getClimatePlan('Paris', 'January', 'en').catch((e) => e);
      expect(err).toBeInstanceOf(CityNotFoundError);
      expect((err as CityNotFoundError).message).toBe('City not found locally');
    });

    it('502 External Service Error: throws ExternalServiceError with response detail', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        new Response(
          JSON.stringify({ detail: 'Gemini API down' }),
          {
            status: 502,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );

      const err = await getClimatePlan('London', 'January', 'en').catch((e) => e);
      expect(err).toBeInstanceOf(ExternalServiceError);
      expect((err as ExternalServiceError).message).toBe('Gemini API down');
      expect((err as ExternalServiceError).statusCode).toBe(502);
    });
  });

  describe('Missing Environment Variable', () => {
    it('throws Error when NEXT_PUBLIC_API_URL is not set', async () => {
      delete process.env.NEXT_PUBLIC_API_URL;

      await expect(getClimatePlan('London', 'January', 'en')).rejects.toThrow(
        'NEXT_PUBLIC_API_URL is not set'
      );
    });
  });

  describe('500 Internal Server Error (Security Masking)', () => {
    it('throws ApiError with generic masked message and ignores sensitive detail', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        new Response(
          JSON.stringify({ detail: 'Secret DB connection string failed' }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );

      const err = await getClimatePlan('London', 'January', 'en').catch((e) => e);
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).message).toBe(
        'An unexpected system error occurred. Please try again later.'
      );
    });
  });

  describe('JSON Parse Failure (safeParseErrorDetail fallback)', () => {
    it('falls back gracefully and throws ApiError when error body .json() rejects', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: () => Promise.reject(new SyntaxError('Unexpected token')),
      };

      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        mockResponse
      );

      const err = await getClimatePlan('London', 'January', 'en').catch((e) => e);
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).message).toBe(
        'An unexpected system error occurred. Please try again later.'
      );
    });
  });
});
