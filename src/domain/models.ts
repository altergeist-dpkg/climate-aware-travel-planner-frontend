/**
 * Domain entity models: TypeScript interfaces mirroring backend API contracts.
 * Pure TypeScript — no React or external libraries.
 */

export interface PackingItem {
  name: string;
  justification: string;
}

export interface WeatherData {
  temperature: number;
  real_feel: number;
  condition: string;
}

export interface ClimatePlan {
  city: string;
  month: string;
  weather: WeatherData;
  packing_list: PackingItem[];
  hex_code: string;
  icon_name: string;
  confidence_score: number;
}
