import { InMemoryCache } from '@apollo/client';
import * as apollo from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import { typePolicies } from '@/graphql/typePolicies';
import {
  mockBuildingName,
  mockElevatorLocation,
  mockElevatorMaintenanceHistory,
  mockElevatorMentainanceHistoryPaginatedResponse,
  mockElevatorMentainanceHistoryResponse,
  mockPaginatedElevatorMentainanceHistoryData,
} from '@/mocks/elevatorManagementMocks';
import { mockPassengerElevatorRepairJob } from '@/mocks/repairJobTrackingMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import {
  UseElevatorMentainanceHistoryTable,
  useElevatorMentainanceHistory,
} from '@/modules/elevator-management/components/elevator-mentainance-history-table/hooks';

describe('useElevatorMentainanceHistory', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (mocks: MockedResponse[] = []): RenderHookResult<unknown, UseElevatorMentainanceHistoryTable> => {
    const cache = new InMemoryCache({
      addTypename: false,
      typePolicies,
    });

    return renderHook(() => useElevatorMentainanceHistory(mockBuildingName, mockElevatorLocation), {
      wrapper: ({ children }) => (
        <MockProviderHook cache={cache} mocks={mocks}>
          {children}
        </MockProviderHook>
      ),
    });
  };

  it('should return correct elevator maintenance history', async () => {
    const { result, waitForNextUpdate } = hook([mockElevatorMaintenanceHistory]);

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeUndefined();
    expect(result.current.elevatorMentainanceHistory).toEqual([]);
    expect(result.current.hasMore).toBe(false);

    await waitForNextUpdate();

    expect(result.current.elevatorMentainanceHistory).toEqual([mockPassengerElevatorRepairJob.node]);
    expect(result.current.loading).toBe(false);
  });

  it('should fetch next page when onNext is triggered', async () => {
    const fetchMoreMock = jest.fn(() => mockElevatorMentainanceHistoryPaginatedResponse);

    jest.spyOn(apollo, 'useQuery').mockImplementation(
      () =>
        ({
          data: mockElevatorMentainanceHistoryResponse.data,
          loading: false,
          error: undefined,
          fetchMore: fetchMoreMock,
        } as unknown as apollo.QueryResult)
    );

    const { result } = hook(mockPaginatedElevatorMentainanceHistoryData);

    await act(async () => await result.current.onNext());

    expect(fetchMoreMock).toHaveBeenCalledWith({ variables: { paginationOptions: { limit: 20, offset: 1 } } });
  });

  it('should log an error if fetchMore throws', async () => {
    const error = new Error('fetch failed');

    const fetchMoreMock = jest.fn().mockRejectedValue(error);

    const consoleErrorSpy = jest.spyOn(console, 'error');

    jest.spyOn(apollo, 'useQuery').mockImplementation(
      () =>
        ({
          data: mockElevatorMentainanceHistoryResponse.data,
          loading: false,
          error: undefined,
          fetchMore: fetchMoreMock,
        } as unknown as apollo.QueryResult)
    );

    const { result } = hook(mockPaginatedElevatorMentainanceHistoryData);

    await act(async () => {
      await result.current.onNext();
    });

    expect(fetchMoreMock).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
  });

  it('should return error if the elevator mentainance history data were failed to fetch', async () => {
    const errorMock = { message: 'Failed to fetch data' } as apollo.ApolloError;

    jest.spyOn(apollo, 'useQuery').mockImplementation(
      () =>
        ({
          data: undefined,
          error: errorMock,
          loading: false,
        } as unknown as apollo.QueryResult)
    );

    const { result } = hook([mockElevatorMaintenanceHistory]);

    expect(result.current.error).toBe('Failed to fetch data');
    expect(result.current.elevatorMentainanceHistory).toEqual([]);
  });
});
