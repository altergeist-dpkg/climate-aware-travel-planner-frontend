/**
 * Travel API client: fetches climate plan data from the FastAPI backend.
 * Uses native fetch only. Parses API response as DTO and maps to Domain via mapper.
 * Security: backend error detail is only used for 404 and 502 responses.
 */

import type { ClimatePlan } from '../domain/models';
import type { Month, SupportedLanguage } from '../domain/constants';
import {
  ApiError,
  CityNotFoundError,
  ExternalServiceError,
} from '../domain/errors';
import type { ClimatePlanApiResponse } from './dtos/climatePlan.dto';
import { mapToClimatePlan } from './mappers/climatePlan.mapper';

const getBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (url === undefined || url === '') {
    throw new Error('NEXT_PUBLIC_API_URL is not set');
  }
  return url.replace(/\/$/, '');
};

/** Safely parse JSON body and return the `detail` string if present. */
async function safeParseErrorDetail(response: Response): Promise<string | undefined> {
  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    return undefined;
  }
  try {
    const body = await response.json();
    if (body && typeof body.detail === 'string') {
      return body.detail;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

/**
 * Fetches the climate plan for a given city, month, and language.
 * @throws {CityNotFoundError} When the backend returns 404.
 * @throws {ExternalServiceError} When the backend returns 502.
 * @throws {ApiError} For any other non-ok response (message masked for security).
 */
export async function getClimatePlan(
  city: string,
  month: Month,
  language: SupportedLanguage
): Promise<ClimatePlan> {
  const baseUrl = getBaseUrl();
  const params = new URLSearchParams({
    city: city.trim(),
    month,
    language,
  });
  const url = `${baseUrl}/climate-plan?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      const detail = await safeParseErrorDetail(response);
      throw new CityNotFoundError(detail ?? 'City not found');
    }
    if (response.status === 502) {
      const detail = await safeParseErrorDetail(response);
      throw new ExternalServiceError(detail ?? 'External service unavailable', 502);
    }
    // 500 or any other status: do not expose backend detail
    throw new ApiError(
      'An unexpected system error occurred. Please try again later.',
      response.status
    );
  }

  const raw: ClimatePlanApiResponse = await response.json();
  return mapToClimatePlan(raw);
}
