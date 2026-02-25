# Specification: Project Documentation (README.md)

## Overview
This specification defines the structure and content for the repository's `README.md` file. It must clearly explain the project's purpose, its strict Clean Architecture implementation, testing strategies, the AI-assisted development workflow using Cursor, and provide clear instructions for local development and Docker deployment.

## 1. File Structure and Content
Generate a comprehensive `README.md` in the root of the project with the following sections:

* **Header:**
    * Project Title: "Climate-Aware Travel Planner (Frontend)"
    * A brief, engaging description of what the app does (Next.js frontend that consumes a FastAPI backend to generate AI-driven travel plans based on weather data).
* **Screenshots (UI Showcase):**
    * Add placeholders for local images. Assume the user will place images in a `docs/` folder. Example: `![App UI](./docs/ui-screenshot-1.png)`
* **Tech Stack:**
    * List the core technologies: Next.js (App Router), React, TypeScript, Tailwind CSS, Lucide React, Vitest, React Testing Library.
* **AI-Assisted Development & The `specs/` Directory:**
    * Explicitly mention that this project was developed using the **Cursor IDE** and its AI Composer.
    * Explain that the `specs/` folder contains the exact Markdown specifications (prompts) used to instruct the AI agent. This directory acts as a reproducible prompt library and a living architectural decision record (ADR), detailing how each layer, test, and refactor was systematically generated.
* **Clean Architecture:**
    * Briefly explain how the project is divided into 4 strict layers:
        1.  **Domain:** Pure TypeScript. Models (`ClimatePlan`), specific errors, constants. No React, no external libraries.
        2.  **Infrastructure:** API Client (`travelApi.ts`), DTOs, and Mappers. Handles native `fetch`, security-first error masking, and translates backend data to Domain models.
        3.  **Application:** Custom Hooks (`useTravelPlan`). Manages state (`data`, `isLoading`, `error`) and safe exception handling.
        4.  **Presentation:** React Components (`SearchForm`, `DynamicIcon`, `ClimateCard`). Pure UI with Tailwind and Glassmorphism.
* **Getting Started (Local Development):**
    * Prerequisites (Node.js).
    * Installation (`npm install`).
    * Environment Variables requirement (`.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`).
    * Running the dev server (`npm run dev`).
* **Docker Deployment:**
    * Explain how to build the multi-stage image, emphasizing the need to pass the build argument.
    * Example: `docker build --build-arg NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1 -t travel-planner-frontend .`
    * Example run: `docker run -p 3000:3000 travel-planner-frontend`
* **Testing:**
    * Mention the testing strategy (Vitest) and how to run tests with coverage (`npm run test:cov`). Highlight the high branch coverage for "Sad Paths".

## Execution Instructions for Cursor
1. Read the specification.
2. Generate the `README.md` file in the root directory following this exact structure and tone.
3. Use professional markdown formatting (badges, code blocks, bold text for emphasis).