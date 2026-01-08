import { InMemoryCache } from '@apollo/client';
import * as apollo from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import { typePolicies } from '@/graphql/typePolicies';
import {
  mockChangeLogResponse,
  mockChangeLogs,
  mockPaginatedChangeLogResponse,
  mockPaginatedChangeLogs,
  mockSystemChangeLog,
} from '@/mocks/changeLogMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import { useGetChangeLogs } from '@/modules/change-log/hooks/useGetChangeLogs';
import { ChangeLogState } from '@/modules/change-log/types';
import { removeTypeNamesFromArray } from '@/shared/utils';

describe('useGetChangeLogs', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (mocks: MockedResponse[] = []): RenderHookResult<unknown, ChangeLogState> => {
    const cache = new InMemoryCache({
      addTypename: false,
      typePolicies,
    });

    return renderHook(() => useGetChangeLogs(), {
      wrapper: ({ children }) => (
        <MockProviderHook cache={cache} mocks={mocks}>
          {children}
        </MockProviderHook>
      ),
    });
  };

  it('should return change log data', async () => {
    const { result, waitForNextUpdate } = hook([mockChangeLogs]);

    expect(result.current.isInitialLoading).toBe(true);
    expect(result.current.isChangeLogEmpty).toBe(false);
    expect(result.current.error).toBeUndefined();
    expect(result.current.changeLogs).toEqual([]);

    await waitForNextUpdate();

    expect(result.current.changeLogs).toEqual(removeTypeNamesFromArray([mockSystemChangeLog]));
    expect(result.current.isInitialLoading).toBe(false);
    expect(result.current.isChangeLogEmpty).toBe(false);
    expect(result.current.totalChangeLogsLength).toEqual(1);
  });

  it('should fetch next page when onNext is triggered', async () => {
    const fetchMoreMock = jest.fn(() => mockPaginatedChangeLogResponse);

    jest.spyOn(apollo, 'useQuery').mockImplementation(
      () =>
        ({
          data: mockChangeLogResponse.data,
          loading: false,
          error: undefined,
          fetchMore: fetchMoreMock,
        } as unknown as apollo.QueryResult)
    );

    const { result } = hook(mockPaginatedChangeLogs);

    await act(async () => await result.current.onNext());

    expect(fetchMoreMock).toHaveBeenCalledWith({
      variables: { paginationOptions: { limit: 20, offset: 1 }, filterOptions: {} },
    });
  });

  it('should log an error if fetchMore throws', async () => {
    const error = new Error('fetch failed');

    const fetchMoreMock = jest.fn().mockRejectedValue(error);

    const consoleErrorSpy = jest.spyOn(console, 'error');

    jest.spyOn(apollo, 'useQuery').mockImplementation(
      () =>
        ({
          data: mockChangeLogResponse.data,
          loading: false,
          error: undefined,
          fetchMore: fetchMoreMock,
        } as unknown as apollo.QueryResult)
    );

    const { result } = hook(mockPaginatedChangeLogs);

    await act(async () => {
      await result.current.onNext();
    });

    expect(fetchMoreMock).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
  });
});
