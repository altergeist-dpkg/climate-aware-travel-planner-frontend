import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ClimatePlan } from '../../domain/models';
import { useTravelPlan } from '../useTravelPlan';
import { getClimatePlan } from '../../infrastructure/travelApi';

vi.mock('../../infrastructure/travelApi', () => ({
  getClimatePlan: vi.fn(),
}));

const getClimatePlanMock = vi.mocked(getClimatePlan);

describe('useTravelPlan', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('data is null, isLoading is false, and error is null', () => {
      const { result } = renderHook(() => useTravelPlan());

      expect(result.current.data).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Loading Lifecycle', () => {
    it('isLoading becomes true during generatePlan and false after completion', async () => {
      let resolvePromise: (value: ClimatePlan) => void;
      getClimatePlanMock.mockImplementationOnce(
        () =>
          new Promise<ClimatePlan>((resolve) => {
            resolvePromise = resolve;
          })
      );

      const { result } = renderHook(() => useTravelPlan());

      expect(result.current.isLoading).toBe(false);

      act(() => {
        result.current.generatePlan('London', 'January', 'en');
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolvePromise!({
          city: 'London',
          month: 'January',
          weather: { temperature: 5, real_feel: 2, condition: 'Cloudy' },
          packing_list: [],
          hex_code: '#000',
          icon_name: 'sun',
          confidence_score: 1,
        });
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Data Update', () => {
    it('updates data state with mapped domain object on successful API call', async () => {
      const mockPlan = {
        city: 'London',
        month: 'January',
        weather: { temperature: 5, real_feel: 2, condition: 'Cloudy' },
        packing_list: [{ name: 'Coat', justification: 'Cold' }],
        hex_code: '#4A90D9',
        icon_name: 'cloud',
        confidence_score: 0.9,
      };

      getClimatePlanMock.mockResolvedValueOnce(mockPlan);

      const { result } = renderHook(() => useTravelPlan());

      await act(async () => {
        await result.current.generatePlan('London', 'January', 'en');
      });

      expect(result.current.data).toEqual(mockPlan);
      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Error handling (catch block)', () => {
    it('Known Error (err instanceof Error): updates error state to the error message', async () => {
      getClimatePlanMock.mockRejectedValueOnce(new Error('API Timeout'));

      const { result } = renderHook(() => useTravelPlan());

      await act(async () => {
        await result.current.generatePlan('London', 'January', 'en');
      });

      expect(result.current.error).toBe('API Timeout');
      expect(result.current.data).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it('Unknown Error (fallback): updates error state to FALLBACK_ERROR_MESSAGE', async () => {
      getClimatePlanMock.mockRejectedValueOnce('Something weird happened');

      const { result } = renderHook(() => useTravelPlan());

      await act(async () => {
        await result.current.generatePlan('London', 'January', 'en');
      });

      expect(result.current.error).toBe(
        'An unexpected internal application error occurred.'
      );
      expect(result.current.data).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });
  });
});
