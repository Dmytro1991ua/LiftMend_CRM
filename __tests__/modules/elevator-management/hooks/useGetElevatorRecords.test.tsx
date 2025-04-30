import { InMemoryCache } from '@apollo/client';
import * as apollo from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { act } from '@testing-library/react';
import { RenderHookResult, renderHook } from '@testing-library/react-hooks';

import { typePolicies } from '@/graphql/typePolicies';
import {
  mockElevatorRecords,
  mockElevatorRecordsPaginatedResponse,
  mockElevatorRecordsResponse,
  mockGlassElevatorElevatorRecord,
  mockPaginatedElevatorRecords,
  mockServiceElevatorElevatorRecord,
} from '@/mocks/elevatorManagementMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import { UseGetElevatorRecords, useGetElevatorRecords } from '@/modules/elevator-management/hooks';
import { ElevatorRecord } from '@/shared/types';

describe('useGetElevatorRecords', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (mocks: MockedResponse[] = []): RenderHookResult<unknown, UseGetElevatorRecords<ElevatorRecord>> => {
    const cache = new InMemoryCache({
      addTypename: false,
      typePolicies,
    });

    return renderHook(() => useGetElevatorRecords(), {
      wrapper: ({ children }) => (
        <MockProviderHook cache={cache} mocks={mocks}>
          {children}
        </MockProviderHook>
      ),
    });
  };

  it('should return correct elevator records', async () => {
    const { result, waitForNextUpdate } = hook([mockElevatorRecords]);

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeUndefined();
    expect(result.current.elevatorRecords).toEqual([]);

    await waitForNextUpdate();

    expect(result.current.elevatorRecords).toEqual([
      mockGlassElevatorElevatorRecord.node,
      mockServiceElevatorElevatorRecord.node,
    ]);
  });

  it('should fetch next page when onNext is triggered', async () => {
    const fetchMoreMock = jest.fn(() => mockElevatorRecordsPaginatedResponse);

    jest.spyOn(apollo, 'useQuery').mockImplementation(
      () =>
        ({
          data: mockElevatorRecordsResponse.data,
          loading: false,
          error: undefined,
          fetchMore: fetchMoreMock,
        } as unknown as apollo.QueryResult)
    );

    const { result } = hook(mockPaginatedElevatorRecords);

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
          data: mockElevatorRecordsResponse.data,
          loading: false,
          error: undefined,
          fetchMore: fetchMoreMock,
        } as unknown as apollo.QueryResult)
    );

    const { result } = hook(mockPaginatedElevatorRecords);

    await act(async () => {
      await result.current.onNext();
    });

    expect(fetchMoreMock).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
  });
});
