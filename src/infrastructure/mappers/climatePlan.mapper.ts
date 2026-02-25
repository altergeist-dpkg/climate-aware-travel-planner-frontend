/**
 * Mapper: bridges DTO (API response) and Domain model.
 * Pure function, no side effects.
 */

import type { ClimatePlan } from '../../domain/models';
import type { ClimatePlanApiResponse } from '../dtos/climatePlan.dto';

function capitalizeWords(text: string): string {
  return text
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function mapToClimatePlan(raw: ClimatePlanApiResponse, city: string, month: string): ClimatePlan {
  return {
    city: capitalizeWords(city),
    month: month,
    weather: {
      temperature: raw.weather_data.temperature,
      real_feel: raw.weather_data.real_feel,
      condition: raw.weather_data.condition,
    },
    packing_list: raw.packing_list.map((entry) => ({
      name: entry.item,
      justification: entry.justification,
    })),
    hex_code: raw.hex_code,
    icon_name: raw.icon_name,
    confidence_score: raw.confidence_score,
  };
}
