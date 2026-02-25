# Specification: Infrastructure Layer (Frontend)

## Overview
This specification defines the Infrastructure layer of the Clean Architecture for the Next.js frontend. This layer is responsible for external communications, specifically fetching data from the FastAPI backend.

**Strict Rule:** This layer MUST NOT contain React components or UI logic. It relies on the native `fetch` API.

## 1. Environment Configuration
The API base URL must be configurable via environment variables.
* We will use `process.env.NEXT_PUBLIC_API_URL` as the base URL.
* If the variable is not defined, throw an Error immediately to prevent silent failures.

## 2. API Client (`src/infrastructure/travelApi.ts`)
Create a service module to interact with the Travel API endpoint.
* **Imports:** Import types (`ClimatePlan`, `Month`, `SupportedLanguage`) and errors (`ApiError`, `CityNotFoundError`, `ExternalServiceError`) from `src/domain`.
* **Method:** `export async function getClimatePlan(city: string, month: Month, language: SupportedLanguage): Promise<ClimatePlan>`
* **Implementation Details:**
  * Construct the URL using `URLSearchParams`. The endpoint path is `/climate-plan`.
  * Use the native `fetch` API.
  * **Security-First Error Handling (Masking):**
    * The backend custom errors are ONLY guaranteed safe for display on 404 and 502 status codes.
    * If `!response.ok`, safely attempt to parse the JSON error body inside a `try/catch` to extract the `detail` string.
    * **If `response.status === 404`:** throw a `CityNotFoundError(detail)`.
    * **If `response.status === 502`:** throw an `ExternalServiceError(detail, 502)`.
    * **For 500 or ANY OTHER status:** DO NOT use the backend's `detail` message (this prevents leaking internal server information). Instead, throw a generic `ApiError("An unexpected system error occurred. Please try again later.", response.status)`.
  * **Success:** Parse and return the JSON response natively as `ClimatePlan`.

## Execution Instructions for Cursor
1. Create the `src/infrastructure/` directory.
2. Implement `travelApi.ts` strictly following the environment variable rules, safe JSON parsing and strict error masking for unhandled status codes.
3. Ensure the native `fetch` API is used.