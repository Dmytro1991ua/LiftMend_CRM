import * as apollo from '@apollo/client';
import { ApolloError, QueryResult } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';
import { endOfMonth, startOfMonth, startOfToday, subMonths } from 'date-fns';

import {
  getDashboardMetricsErrorMock,
  getDashboardMetricsResponseMock,
  mockExpectedDashboardMetricsData,
} from '@/mocks/dashboardMetrics';
import { MockProviderHook } from '@/mocks/testMocks';
import { UseFetchDashboardMetrics, useFetchDashboardMetrics } from '@/modules/dashboard/hooks';
import { DashboardDateFilter } from '@/modules/dashboard/types';

describe('useFetchDashboardMetrics', () => {
  const mockExpectedDateRanges = { from: startOfToday(), to: startOfToday() };

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (
    dateRange: DashboardDateFilter,
    mocks: MockedResponse[] = []
  ): RenderHookResult<unknown, UseFetchDashboardMetrics> => {
    return renderHook(() => useFetchDashboardMetrics({ dateRange }), {
      wrapper: ({ children }) => <MockProviderHook mocks={mocks}>{children}</MockProviderHook>,
    });
  };

  it('should return fetched dashboard metrics', async () => {
    const { result, waitForNextUpdate } = hook(mockExpectedDateRanges, [
      getDashboardMetricsResponseMock(mockExpectedDateRanges),
    ]);

    expect(result.current.loading).toEqual(true);

    await waitForNextUpdate();

    expect(result.current.dashboardMetrics).toEqual(mockExpectedDashboardMetricsData);
    expect(result.current.error).toBeUndefined();
  });

  it('should refetch dashboard metrics when onRefetchDashboardMetrics is triggered with new dateRange', async () => {
    const mockRefetch = jest.fn(() =>
      Promise.resolve({
        data: {
          getDashboardMetrics: [],
        },
      })
    );

    jest.spyOn(apollo, 'useQuery').mockReturnValue({
      data: { getDashboardMetrics: [] },
      loading: false,
      error: undefined,
      refetch: mockRefetch,
    } as unknown as QueryResult);

    const mockInitialDateRange: DashboardDateFilter = {
      from: startOfToday(),
      to: startOfToday(),
    };

    const mockNewDateRanges = {
      from: startOfMonth(subMonths(new Date(), 1)),
      to: endOfMonth(subMonths(new Date(), 1)),
    };

    const { result } = hook(mockInitialDateRange, [getDashboardMetricsResponseMock(mockInitialDateRange)]);

    act(() => {
      result.current.onRefetchDashboardMetrics(mockNewDateRanges);
    });

    expect(mockRefetch).toHaveBeenCalledTimes(1);

    expect(mockRefetch).toHaveBeenCalledWith({
      startDate: mockNewDateRanges.from.toISOString(),
      endDate: mockNewDateRanges.to.toISOString(),
    });
  });

  it('should return error if the dashboard metrics were failed to fetch', async () => {
    const errorMock = { message: 'Failed to fetch data' } as ApolloError;

    jest.spyOn(apollo, 'useQuery').mockImplementation(
      () =>
        ({
          ...getDashboardMetricsErrorMock(mockExpectedDateRanges),
          error: errorMock,
          loading: false,
        } as unknown as QueryResult)
    );

    const { result } = hook(mockExpectedDateRanges, [getDashboardMetricsErrorMock(mockExpectedDateRanges)]);

    expect(result.current.error).toBe('Failed to fetch data');
    expect(result.current.dashboardMetrics).toEqual([]);
  });

  it('should return empty dashboardMetrics if getDashboardMetrics is undefined', () => {
    jest.spyOn(apollo, 'useQuery').mockReturnValue({
      data: { getDashboardMetrics: undefined },
      loading: false,
      error: undefined,
      refetch: jest.fn(),
    } as unknown as QueryResult);

    const { result } = hook(mockExpectedDateRanges, [getDashboardMetricsErrorMock(mockExpectedDateRanges)]);

    expect(result.current.dashboardMetrics).toEqual([]);
  });
});
