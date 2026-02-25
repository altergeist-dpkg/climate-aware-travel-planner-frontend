# Specification: Frontend Testing Strategy

## Overview
This specification defines the testing environment and the test cases for the Domain, Infrastructure, and Application layers. We aim for high coverage in business logic and data transformation.

## 1. Environment Setup
* **Framework:** Vitest.
* **Library:** React Testing Library (for hooks and components).
* **Mocking:** `vi` (Vitest mock) for API calls.

## 2. Infrastructure Tests (`src/infrastructure/__tests__/travelApi.test.ts`)
Focus on validating the API client and the Mappers.
* **Test Case: Success Mapping**
    * Mock a successful `fetch` with `weather_data` (snake_case).
    * Verify that `getClimatePlan` returns a domain object with `weather` (camelCase).
* **Test Case: Security Masking**
    * Mock a 500 Internal Server Error.
    * Verify that the thrown error message is the generic one: "An unexpected system error occurred...".
* **Test Case: Specific Errors**
    * Mock a 404 response.
    * Verify that it throws an instance of `CityNotFoundError`.

## 3. Application Tests (`src/application/__tests__/useTravelPlan.test.ts`)
Focus on the Custom Hook's behavior.
* **Test Case: Initial State**
    * Verify `data` is null, `isLoading` is false, and `error` is null.
* **Test Case: Loading Lifecycle**
    * Call `generatePlan`.
    * Verify `isLoading` becomes true during the call and false after completion.
* **Test Case: Data Update**
    * Mock a successful API call.
    * Verify `data` state is updated correctly with the mapped domain object.

## 4. Domain Tests (`src/domain/__tests__/errors.test.ts`)
* **Test Case: Custom Errors**
    * Verify that `CityNotFoundError` correctly captures the message and status code.

## Execution Instructions for Cursor
1. Create the `__tests__` directories in each layer.
2. Implement the test files following the cases described above.
3. Use `vi.mock` to intercept calls to the infrastructure.
4. DO NOT test UI components yet; focus on logic and data integrity.