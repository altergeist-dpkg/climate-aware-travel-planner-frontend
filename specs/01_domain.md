# Specification: Domain Layer (Frontend)

## Overview
This specification defines the Domain layer of the Clean Architecture for the Next.js frontend. This layer is the innermost part of the application and contains the core business entities, TypeScript interfaces, and strict domain constants.

**Strict Rule:** This layer MUST NOT contain any React components, hooks, external libraries (like `axios` or `swr`), or UI-related code. It is pure TypeScript.

## 1. Constants and Enums (`src/domain/constants.ts`)
Define the core business constraints and options that the application supports.
* **`MONTHS`**: Export a constant array or Enum containing the 12 months in English (matching the backend expected input).
* **`SUPPORTED_LANGUAGES`**: Export a constant array or Enum containing 'en' and 'es'.

## 2. Entity Models (`src/domain/models.ts`)
Define the strict TypeScript interfaces that mirror the backend's API contracts.
* **`PackingItem`**:
  * `name`: string
  * `justification`: string
* **`WeatherData`**:
  * `temperature`: number
  * `real_feel`: number
  * `condition`: string
* **`ClimatePlan`**:
  * `city`: string
  * `month`: string
  * `weather`: WeatherData
  * `packing_list`: PackingItem[]
  * `hex_code`: string
  * `icon_name`: string
  * `confidence_score`: number

## 3. Custom Exceptions/Errors (`src/domain/errors.ts`)
Define custom error classes to handle business and infrastructure failures gracefully on the frontend.
* **`ApiError`**: Extends standard `Error`. Should include an optional `statusCode` (number).
* **`CityNotFoundError`**: Extends `ApiError`. Specific to 404 responses from the backend.
* **`ExternalServiceError`**: Extends `ApiError`. Specific to 500/502 responses from the backend.

## Execution Instructions for Cursor
1.  Create the `src/domain/` directory. (Note: Next.js might have created an `app/` directory at the root or inside `src/`. Ensure these domain files go into `src/domain/`).
2. Implement `constants.ts`, `models.ts`, and `errors.ts` strictly as pure TypeScript files.
3. Ensure all interfaces, types, classes, and constants are properly exported.