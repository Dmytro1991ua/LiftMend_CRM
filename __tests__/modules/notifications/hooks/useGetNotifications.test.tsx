import { InMemoryCache } from '@apollo/client';
import * as apollo from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { act } from '@testing-library/react';
import { RenderHookResult, renderHook } from '@testing-library/react-hooks';

import { typePolicies } from '@/graphql/typePolicies';
import {
  mockNotifications,
  mockNotificationsPaginatedResponse,
  mockNotificationsResponse,
  mockPaginatedNotifications,
  mockUpcomingNotification,
} from '@/mocks/notificationMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import { UseGetNotifications, useGetNotifications } from '@/modules/notifications/hooks';

describe('useGetNotifications', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (mocks: MockedResponse[] = []): RenderHookResult<unknown, UseGetNotifications> => {
    const cache = new InMemoryCache({
      addTypename: false,
      typePolicies,
    });

    return renderHook(() => useGetNotifications(), {
      wrapper: ({ children }) => (
        <MockProviderHook cache={cache} mocks={mocks}>
          {children}
        </MockProviderHook>
      ),
    });
  };

  it('should return notifications data', async () => {
    const { result, waitForNextUpdate } = hook([mockNotifications]);

    expect(result.current.isInitialLoading).toBe(true);
    expect(result.current.isNotificationsEmpty).toBe(false);
    expect(result.current.error).toBeUndefined();
    expect(result.current.notifications).toEqual([]);

    await waitForNextUpdate();

    expect(result.current.notifications).toEqual([{ items: [mockUpcomingNotification], label: '10 December' }]);
    expect(result.current.isInitialLoading).toBe(false);
    expect(result.current.isNotificationsEmpty).toBe(false);
    expect(result.current.totalNotificationsLength).toEqual(1);
    expect(result.current.areAllNotificationsRead).toBe(false);
  });

  it('should fetch next page when onNext is triggered', async () => {
    const fetchMoreMock = jest.fn(() => mockNotificationsPaginatedResponse);

    jest.spyOn(apollo, 'useQuery').mockImplementation(
      () =>
        ({
          data: mockNotificationsResponse.data,
          loading: false,
          error: undefined,
          fetchMore: fetchMoreMock,
        } as unknown as apollo.QueryResult)
    );

    const { result } = hook(mockPaginatedNotifications);

    await act(async () => await result.current.onNext());

    expect(fetchMoreMock).toHaveBeenCalledWith({
      variables: { paginationOptions: { limit: 20, offset: 1 } },
    });
  });

  it('should log an error if fetchMore throws', async () => {
    const error = new Error('fetch failed');

    const fetchMoreMock = jest.fn().mockRejectedValue(error);

    const consoleErrorSpy = jest.spyOn(console, 'error');

    jest.spyOn(apollo, 'useQuery').mockImplementation(
      () =>
        ({
          data: mockNotificationsResponse.data,
          loading: false,
          error: undefined,
          fetchMore: fetchMoreMock,
        } as unknown as apollo.QueryResult)
    );

    const { result } = hook(mockPaginatedNotifications);

    await act(async () => {
      await result.current.onNext();
    });

    expect(fetchMoreMock).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
  });
});
