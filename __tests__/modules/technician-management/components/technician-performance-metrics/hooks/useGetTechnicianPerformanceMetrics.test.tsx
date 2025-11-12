import * as apollo from '@apollo/client';
import { QueryResult } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { RenderHookResult, renderHook } from '@testing-library/react-hooks';

import {
  mockBenjaminHallPerformanceMetrics,
  mockBenjaminHallRecord,
  mockTechnicianPerformanceMetricsErrorResponse,
  mockTechnicianPerformanceMetricsResponse,
} from '@/mocks/technicianManagementMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import {
  UseGetTechnicianPerformanceMetrics,
  useGetTechnicianPerformanceMetrics,
} from '@/modules/technician-management/components/technician-performance-metrics/hooks';

describe('useGetTechnicianPerformanceMetrics', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = ({
    technicianName = mockBenjaminHallRecord.name,
    mocks = [],
  }: {
    technicianName?: string;
    mocks?: MockedResponse[];
  }): RenderHookResult<unknown, UseGetTechnicianPerformanceMetrics> => {
    return renderHook(() => useGetTechnicianPerformanceMetrics(technicianName!), {
      wrapper: ({ children }) => <MockProviderHook mocks={mocks}>{children}</MockProviderHook>,
    });
  };

  it('should return fetched technician performance metrics', async () => {
    const { result, waitForNextUpdate } = hook({ mocks: [mockTechnicianPerformanceMetricsResponse] });

    expect(result.current.loading).toEqual(true);

    await waitForNextUpdate();

    expect(result.current.technicianPerformanceMetrics).toEqual(mockBenjaminHallPerformanceMetrics);
    expect(result.current.error).toBeUndefined();
  });

  it('should return error if the technician performance metrics were failed to fetch', async () => {
    const errorMock = { message: 'Failed to fetch data' } as apollo.ApolloError;

    jest.spyOn(apollo, 'useQuery').mockImplementation(
      () =>
        ({
          data: undefined,
          error: errorMock,
          loading: false,
        } as unknown as QueryResult)
    );

    const { result } = hook({ mocks: [mockTechnicianPerformanceMetricsErrorResponse] });

    expect(result.current.error).toBe('Failed to fetch data');
    expect(result.current.technicianPerformanceMetrics).toEqual([]);
  });

  it('should return empty technicianPerformanceMetrics if technicianPerformanceMetrics is undefined', () => {
    jest.spyOn(apollo, 'useQuery').mockReturnValue({
      data: { getTechnicianPerformance: undefined },
      loading: false,
      error: undefined,
      refetch: jest.fn(),
    } as unknown as QueryResult);

    const { result } = hook({ mocks: [mockTechnicianPerformanceMetricsErrorResponse] });

    expect(result.current.technicianPerformanceMetrics).toEqual([]);
  });
});
