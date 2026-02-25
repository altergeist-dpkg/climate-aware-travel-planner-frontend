# Specification: Presentation Layer (UI Components & Page)

## Overview
This specification defines the Presentation layer. It is responsible purely for rendering the UI using Tailwind CSS, handling user inputs, and displaying the data. It will consume the `useTravelPlan` hook from the Application layer.

**Design System:**
* **Theme:** Modern SaaS, "Glassmorphism" effect.
* **Styling:** Tailwind CSS utility classes (e.g., `bg-white/10 backdrop-blur-md border border-white/20 shadow-xl`).
* **Icons:** `lucide-react`.

## 1. Search Form Component (`src/components/SearchForm.tsx`)
Create a client component for the input form.
* **Props:** `onSubmit: (city: string, month: Month, language: SupportedLanguage) => void`, `isLoading: boolean`.
* **State:** Local state for `city` (string), `month` (Month, default: 'January'), and `language` (SupportedLanguage, default: 'en').
* **UI Elements:**
    * Text input for City.
    * Select dropdown for Month (use the `MONTHS` constant from `src/domain/constants`).
    * Select dropdown for Language (En/Es).
    * Submit Button (disable and show a spinner/loading state when `isLoading` is true).
* **Styling:** Apply a subtle glassmorphism card style to the form container.

## 2. Dynamic Icon Helper (`src/components/DynamicIcon.tsx`)
Create a helper component to safely render Lucide icons from a string name.
* **Imports:** `icons` from `lucide-react`.
* **Props:** `name: string`, `className?: string`.
* **Logic:** Dynamically select the icon from the `icons` object based on the `name` prop (PascalCase conversion might be needed, e.g., 'sun' -> 'Sun').
* **Fallback:** If the icon doesn't exist (e.g., LLM hallucination), render a default icon like `MapPin`.

## 3. Climate Card Component (`src/components/ClimateCard.tsx`)
Create a component to display the `ClimatePlan` data.
* **Props:** `plan: ClimatePlan`.
* **Dynamic Theming:**
    * Use the `plan.hex_code` to apply a dynamic border color or a very faint background tint to the card. (e.g., `style={{ borderColor: plan.hex_code }}`).
* **UI Elements:**
    * Header: City, Month, and the `DynamicIcon` using `plan.icon_name` (tinted with `plan.hex_code`).
    * Weather Section: Display temperature, real feel, and condition.
    * Packing List Section: Map through `plan.packing_list` and display the item `name` and `justification`.
    * Footer/Badge: Display the `confidence_score` as a percentage.
* **Styling:** Strong glassmorphism (translucency, blur, subtle shadows).

## 4. Main Page (`app/page.tsx`)
Orchestrate the application.
* **Directive:** `"use client"` (since it consumes the `useTravelPlan` hook).
* **State/Hooks:** Call `const { data, isLoading, error, generatePlan } = useTravelPlan();`.
* **Layout:**
    * A full-screen background (e.g., a subtle animated gradient or a nice solid dark/light aesthetic to make the glassmorphism pop).
    * Header title: "Climate-Aware Travel Planner".
    * Render the `SearchForm`.
    * Render Error messages nicely if `error` is not null.
    * Render the `ClimateCard` if `data` is not null.

## Execution Instructions for Cursor
1. Create the `src/components/` directory.
2. Implement `SearchForm.tsx`, `DynamicIcon.tsx`, and `ClimateCard.tsx` strictly following the UI/UX rules.
3. Overwrite `app/page.tsx` to orchestrate the components and the hook.
4. Ensure the dynamic styling (`hex_code` and `icon_name`) gracefully handles missing or invalid data.