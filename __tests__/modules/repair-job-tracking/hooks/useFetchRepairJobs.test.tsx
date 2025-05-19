import { InMemoryCache } from '@apollo/client';
import * as apollo from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { act } from '@testing-library/react';
import { RenderHookResult, renderHook } from '@testing-library/react-hooks';

import { typePolicies } from '@/graphql/typePolicies';
import {
  mockMastLiftRepairJob,
  mockPaginatedRepairJobs,
  mockPassengerElevatorRepairJob,
  mockRepairJobs,
  mockRepairJobsPaginatedResponse,
  mockRepairJobsResponse,
} from '@/mocks/repairJobTrackingMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import useFetchRepairJobs, { UseFetchRepairJobs } from '@/modules/repair-job-tracking/hooks/useFetchRepairJobs';
import { RepairJob } from '@/shared/types';

describe('useFetchRepairJobs', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (mocks: MockedResponse[] = []): RenderHookResult<unknown, UseFetchRepairJobs<RepairJob>> => {
    const cache = new InMemoryCache({
      addTypename: false,
      typePolicies,
    });

    return renderHook(() => useFetchRepairJobs(), {
      wrapper: ({ children }) => (
        <MockProviderHook cache={cache} mocks={mocks}>
          {children}
        </MockProviderHook>
      ),
    });
  };

  it('should return correct repair jobs', async () => {
    const { result, waitForNextUpdate } = hook([mockRepairJobs]);

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeUndefined();
    expect(result.current.repairJobs).toEqual([]);
    expect(result.current.hasMore).toBe(false);

    await waitForNextUpdate();

    expect(result.current.repairJobs).toEqual([mockPassengerElevatorRepairJob.node, mockMastLiftRepairJob.node]);
    expect(result.current.loading).toBe(false);
  });

  it('should fetch next page when onNext is triggered', async () => {
    const fetchMoreMock = jest.fn(() => mockRepairJobsPaginatedResponse);

    jest.spyOn(apollo, 'useQuery').mockImplementation(
      () =>
        ({
          data: mockRepairJobsResponse.data,
          loading: false,
          error: undefined,
          fetchMore: fetchMoreMock,
        } as unknown as apollo.QueryResult)
    );

    const { result } = hook(mockPaginatedRepairJobs);

    await act(async () => await result.current.onNext());

    expect(fetchMoreMock).toHaveBeenCalledWith({
      variables: { filterOptions: { searchTerm: '' }, paginationOptions: { limit: 20, offset: 2 } },
    });
  });

  it('should log an error if fetchMore throws', async () => {
    const error = new Error('fetch failed');

    const fetchMoreMock = jest.fn().mockRejectedValue(error);

    const consoleErrorSpy = jest.spyOn(console, 'error');

    jest.spyOn(apollo, 'useQuery').mockImplementation(
      () =>
        ({
          data: mockRepairJobsResponse.data,
          loading: false,
          error: undefined,
          fetchMore: fetchMoreMock,
        } as unknown as apollo.QueryResult)
    );

    const { result } = hook(mockPaginatedRepairJobs);

    await act(async () => {
      await result.current.onNext();
    });

    expect(fetchMoreMock).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
  });
});
