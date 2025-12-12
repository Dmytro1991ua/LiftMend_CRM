import * as apollo from '@apollo/client';
import { ApolloError } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { RenderHookResult, renderHook } from '@testing-library/react-hooks';

import { mockUnreadNotificationsCount, mockUnreadNotificationsCountResponse } from '@/mocks/notificationMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import { UseGetUnreadNotificationsCount, useGetUnreadNotificationsCount } from '@/modules/header/hooks';

describe('useGetUnreadNotificationsCount', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (mocks: MockedResponse[] = []): RenderHookResult<unknown, UseGetUnreadNotificationsCount> =>
    renderHook(() => useGetUnreadNotificationsCount(), {
      wrapper: ({ children }) => <MockProviderHook mocks={mocks}>{children}</MockProviderHook>,
    });

  it('should return correct unread notifications count', async () => {
    const { result, waitForNextUpdate } = hook([mockUnreadNotificationsCountResponse]);

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeUndefined();
    expect(result.current.unreadNotificationCount).toEqual(0);

    await waitForNextUpdate();

    expect(result.current.unreadNotificationCount).toEqual(mockUnreadNotificationsCount);
  });

  it('should return error if the unread notification count was failed to fetch', async () => {
    const errorMock = { message: 'Failed to fetch data' } as ApolloError;

    jest.spyOn(apollo, 'useQuery').mockImplementation(
      () =>
        ({
          data: mockUnreadNotificationsCountResponse,
          error: errorMock,
          loading: false,
        } as unknown as apollo.QueryResult)
    );

    const { result } = hook([mockUnreadNotificationsCountResponse]);

    expect(result.current.error).toBe('Failed to fetch data');
    expect(result.current.unreadNotificationCount).toEqual(0);
  });
});
