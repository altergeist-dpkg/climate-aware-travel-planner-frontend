# Specification: Refactor - Optimized Dynamic Icons

## Overview
The current implementation of `DynamicIcon.tsx` imports the entire `lucide-react` library, which negatively impacts bundle size and performance. This refactor implements the native Lucide dynamic component, allowing for lazy-loading icons by name while maintaining our design system's safety fallbacks.

## 1. Implementation Details (`src/components/DynamicIcon.tsx`)
* **Import:** Use `DynamicIcon` from `lucide-react/dynamic`.
* **Props:** Keep the existing interface (`name: string`, `className?: string`, `style?: React.CSSProperties`).
* **Core Logic:**
    * The backend sends icon names in **kebab-case** (e.g., `sun`, `cloud-rain`). 
    * Lucide's `DynamicIcon` component expects these kebab-case names directly in its `name` prop.
* **Loading & Fallback:**
    * Use the `fallback` prop of the dynamic component to show a `MapPin` (statically imported) while the real icon is loading or if it's not found.
* **Optimization:** Ensure we are not importing `* as icons` anywhere in the project to allow tree-shaking to work correctly.

## 2. Refactor Instructions for Cursor
1. Replace the entire content of `src/components/DynamicIcon.tsx`.
2. Use the following structure:
   ```tsx
   import { DynamicIcon as LucideDynamicIcon } from 'lucide-react/dynamic';
   import { MapPin } from 'lucide-react'; // Static import for fallback

   // ... props interface
   
   // Implementation using <LucideDynamicIcon name={name} fallback={<MapPin ... />} />

3. Remove the `toPascalCase` utility function as it's no longer needed (Lucide dynamic uses kebab-case names).
