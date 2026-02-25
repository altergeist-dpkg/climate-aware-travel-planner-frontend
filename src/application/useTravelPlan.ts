"use client";

import { useState, useCallback } from 'react';
import type { ClimatePlan } from '../domain/models';
import type { Month, SupportedLanguage } from '../domain/constants';
import { getClimatePlan } from '../infrastructure/travelApi';

const FALLBACK_ERROR_MESSAGE =
  'An unexpected internal application error occurred.';

export function useTravelPlan() {
  const [data, setData] = useState<ClimatePlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePlan = useCallback(
    async (city: string, month: Month, language: SupportedLanguage) => {
      setIsLoading(true);
      setError(null);
      setData(null);

      try {
        const result = await getClimatePlan(city, month, language);
        setData(result);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(FALLBACK_ERROR_MESSAGE);
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { data, isLoading, error, generatePlan };
}
