# Specification: Application Layer (Frontend Hooks)

## Overview
This specification defines the Application layer of the Clean Architecture for the Next.js frontend. This layer bridges the Infrastructure and Presentation layers using Custom React Hooks. These hooks act as the Application Use Cases, managing local state (`data`, `isLoading`, `error`) and orchestrating calls to the Infrastructure API clients.

## 1. The Use Case Hook (`src/application/useTravelPlan.ts`)
Create a custom React hook to manage the state of the climate plan generation.
* **Directive:** This file MUST start with `"use client"` because it uses React hooks (`useState`, `useCallback`).
* **Imports:** * Import React hooks (`useState`, `useCallback`).
  * Import `ClimatePlan`, `Month`, `SupportedLanguage` from `src/domain/constants` and `src/domain/models`.
  * Import custom errors (`ApiError`) from `src/domain/errors`.
  * Import `getClimatePlan` from `src/infrastructure/travelApi`.
* **State Management:**
  * `data`: `ClimatePlan | null` (default: `null`)
  * `isLoading`: `boolean` (default: `false`)
  * `error`: `string | null` (default: `null`)
* **Core Function: `generatePlan`**
  * An asynchronous function wrapped in `useCallback` that takes `city: string`, `month: Month`, and `language: SupportedLanguage`.
  * **Flow:**
    1. Set `isLoading` to `true` and clear any previous `error` or `data`.
    2. Try to await `getClimatePlan(city, month, language)`.
    3. If successful, set `data` with the response.
    4. **Catch Block (TypeScript Safe Handling):**
       * In TypeScript, caught errors are of type `unknown`. You MUST type-check the error.
       * If `err instanceof Error` (which covers our custom `ApiError`, `CityNotFoundError`, etc.), set the `error` state to `err.message`. This maps the infrastructure errors cleanly.
       * If it is not an instance of `Error` (e.g., a thrown string or primitive), set the `error` state to a fallback UI message to distinguish it from API errors: `"An unexpected internal application error occurred."`
    5. Finally, set `isLoading` to `false` (ensure this happens in a `finally` block).
* **Return Value:**
  * Return an object containing: `{ data, isLoading, error, generatePlan }`.

## Execution Instructions for Cursor
1. Create the `src/application/` directory.
2. Implement `useTravelPlan.ts` exactly as described.
3. Ensure the `"use client"` directive is at the very top of the file.
4. Strictly implement the TypeScript-safe catch block for `unknown` errors.