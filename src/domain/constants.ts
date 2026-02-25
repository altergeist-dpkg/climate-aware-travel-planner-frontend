/**
 * Domain constants: business constraints and options.
 * Pure TypeScript — no React or external libraries.
 */

/** Twelve months in English (matches backend expected input). */
export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export type Month = (typeof MONTHS)[number];

/** Supported language codes. */
export const SUPPORTED_LANGUAGES = ['en', 'es'] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
