# Specification: Testing - Sad Paths & Branch Coverage

## Overview
The goal of this specification is to increase our `% Branch` coverage by explicitly testing the error states, fallbacks, and catch blocks across our Domain, Infrastructure, and Application layers.

## 1. Domain Tests (`src/domain/__tests__/errors.test.ts`)
Add tests to ensure all custom error classes are instantiated correctly.
* **Test Case:** Instantiate `ExternalServiceError` and verify its `message` and `statusCode` (which should be strongly typed to 500 or 502).
* **Test Case:** Instantiate `ApiError` and verify its `message` and `statusCode`.

## 2. Infrastructure Tests (`src/infrastructure/__tests__/travelApi.test.ts`)
Add tests to simulate all `fetch` failure branches in `getClimatePlan`.
* **Test Case: Missing Environment Variable:**
    * Temporarily `delete process.env.NEXT_PUBLIC_API_URL`.
    * Expect calling `getClimatePlan` to throw an Error ("NEXT_PUBLIC_API_URL is not set").
    * (Remember to restore the env variable in an `afterEach` or `finally` block).
* **Test Case: 404 City Not Found:**
    * Mock `fetch` to return `ok: false`, `status: 404`, and a JSON body with `{ detail: "City not found locally" }`.
    * Expect it to throw `CityNotFoundError` with that specific message.
* **Test Case: 502 External Service Error:**
    * Mock `fetch` to return `ok: false`, `status: 502`, and a JSON body `{ detail: "Gemini API down" }`.
    * Expect it to throw `ExternalServiceError`.
* **Test Case: 500 Internal Server Error (Security Masking):**
    * Mock `fetch` to return `ok: false`, `status: 500`, and a JSON body `{ detail: "Secret DB connection string failed" }`.
    * Expect it to throw `ApiError` with the generic masked message ("An unexpected system error occurred..."), completely ignoring the sensitive detail.
* **Test Case: JSON Parse Failure (safeParseErrorDetail fallback):**
    * Mock `fetch` to return `ok: false`, `status: 400`, but with `headers` indicating `application/json` and an invalid JSON body (or make `.json()` reject).
    * Expect it to fallback gracefully and throw an `ApiError`.

## 3. Application Tests (`src/application/__tests__/useTravelPlan.test.ts`)
Add tests to cover the `catch` block in the hook.
* **Test Case: Known Error (`err instanceof Error`):**
    * Mock the `getClimatePlan` API to reject with `new Error("API Timeout")`.
    * Call `generatePlan`.
    * Verify the hook's `error` state is updated to exactly "API Timeout".
* **Test Case: Unknown Error (Fallback):**
    * Mock the `getClimatePlan` API to reject with a raw string: `Promise.reject("Something weird happened")`.
    * Call `generatePlan`.
    * Verify the hook's `error` state is updated to the `FALLBACK_ERROR_MESSAGE` ("An unexpected internal application error occurred.").

## Execution Instructions for Cursor
1. Read the specification carefully.
2. Update the existing test files in `src/domain/`, `src/infrastructure/`, and `src/application/` to append these specific test cases.
3. Ensure you are using `vi.mock` and `vi.spyOn(global, 'fetch')` appropriately to simulate the HTTP responses.