import * as apollo from '@apollo/client';
import { ApolloError } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { RenderHookResult, renderHook } from '@testing-library/react-hooks';

import { mockRecentRepairJobsResponse, mockRepairJob } from '@/mocks/repairJobScheduling';
import { MockProviderHook } from '@/mocks/testMocks';
import { UseFetchRecentRepairJobs, useFetchRecentRepairJobs } from '@/modules/dashboard/hooks';

describe('useFetchRecentRepairJobs', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (mocks: MockedResponse[] = []): RenderHookResult<unknown, UseFetchRecentRepairJobs> =>
    renderHook(() => useFetchRecentRepairJobs(), {
      wrapper: ({ children }) => <MockProviderHook mocks={mocks}>{children}</MockProviderHook>,
    });

  it('should return recent repair jobs', async () => {
    const { result, waitForNextUpdate } = hook([mockRecentRepairJobsResponse]);

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeUndefined();
    expect(result.current.recentRepairJobs).toEqual([]);

    await waitForNextUpdate();

    expect(result.current.recentRepairJobs).toEqual([{ ...mockRepairJob, status: 'Scheduled' }]);
  });

  it('should return error if the recent repair jobs were failed to fetch', async () => {
    const errorMock = { message: 'Failed to fetch data' } as ApolloError;

    jest.spyOn(apollo, 'useQuery').mockImplementation(
      () =>
        ({
          data: mockRecentRepairJobsResponse,
          error: errorMock,
          loading: false,
        } as unknown as apollo.QueryResult)
    );

    const { result } = hook([mockRecentRepairJobsResponse]);

    expect(result.current.error).toBe('Failed to fetch data');
    expect(result.current.recentRepairJobs).toEqual([]);
  });
});
