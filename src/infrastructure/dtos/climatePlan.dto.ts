/**
 * DTO: exact contract of the FastAPI backend response.
 * Decouples API naming (e.g. weather_data, item) from domain models.
 */

export interface ClimatePlanApiResponse {
  city: string;
  month: string;
  weather_data: {
    temperature: number;
    real_feel: number;
    condition: string;
  };
  packing_list: Array<{
    item: string;
    justification: string;
  }>;
  hex_code: string;
  icon_name: string;
  confidence_score: number;
}
