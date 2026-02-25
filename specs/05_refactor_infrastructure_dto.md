# Specification: Refactor - Infrastructure Decoupling (DTO & Mapper)

## Overview
This refactor aims to decouple the Domain layer from the Backend API's specific naming conventions (e.g., `weather_data` vs `weather`). We are introducing the DTO (Data Transfer Object) pattern and a Mapper function to ensure the `travelApi.ts` client returns a clean Domain Entity.

## 1. Data Transfer Object (`src/infrastructure/dtos/climatePlan.dto.ts`)
Define the exact contract of the FastAPI backend.
* **Interface `ClimatePlanApiResponse`**:
    * `city`: string
    * `month`: string
    * `weather_data`: { temperature: number; real_feel: number; condition: string }
    * `packing_list`: { item: string; justification: string }[]
    * `hex_code`: string
    * `icon_name`: string
    * `confidence_score`: number

## 2. Domain Mapper (`src/infrastructure/mappers/climatePlan.mapper.ts`)
Create a pure function to bridge the DTO and the Domain Model.
* **Function `mapToClimatePlan(raw: ClimatePlanApiResponse): ClimatePlan`**:
    * Map `raw.weather_data` to the domain's `weather` and `packing_list` properties.
    * Return a strictly typed `ClimatePlan` object as defined in `src/domain/models.ts`.

## 3. Refactor Instructions for `src/infrastructure/travelApi.ts`
Modify the existing `getClimatePlan` function to:
1.  **Keep** all existing logic for Environment Configuration and Security-First Error Handling (masking 500s, parsing 404/502).
2.  **Change** the success path:
    * Parse the successful response as `ClimatePlanApiResponse`.
    * Use `mapToClimatePlan` to transform the data.
    * Return the resulting domain entity.
3.  **Remove** any direct casting like `as ClimatePlan`.

## Execution Instructions for Cursor
1. Create the `dtos/` and `mappers/` subdirectories inside `src/infrastructure/`.
2. Implement the new files.
3. Refactor `travelApi.ts` by applying the mapping logic without compromising the error handling and security rules previously implemented.