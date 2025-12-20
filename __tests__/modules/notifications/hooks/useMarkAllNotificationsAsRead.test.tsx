import { InMemoryCache, useMutation } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import { typePolicies } from '@/graphql/typePolicies';
import {
  mockMarkAllNotificationsAsReadGQLErrorResponse,
  mockMarkAllNotificationsAsReadNetworkErrorResponse,
  mockMarkAllNotificationsAsReadResponse,
  mockUpcomingNotificationId,
  mockUrgentNotificationId,
} from '@/mocks/notificationMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import { MARK_ALL_NOTIFICATIONS_AS_READ_ERROR_MESSAGE } from '@/modules/notifications/constants';
import { UseMarkAllNotificationsAsRead, useMarkAllNotificationsAsRead } from '@/modules/notifications/hooks';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import { onHandleMutationErrors } from '@/shared/utils';

jest.mock('@apollo/client', () => {
  const originalModule = jest.requireActual('@apollo/client');

  return {
    ...originalModule,
    useMutation: jest.fn(),
  };
});

jest.mock('@/shared/hooks/useMutationResultToasts', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    onError: jest.fn(),
  })),
}));

jest.mock('@/shared/utils', () => ({
  ...jest.requireActual('@/shared/utils'),
  onHandleMutationErrors: jest.fn(),
}));

describe('useMarkAllNotificationsAsRead', () => {
  const mockUseMutation = jest.fn();
  const mockGqlError = [{ message: 'Simulated GQL error in result' }];
  const mockNetworkError = { message: 'Test network Error' };
  const mockOnError = jest.fn();
  const mockCacheModify = jest.fn();
  const mockCacheIdentify = jest.fn().mockImplementation(() => `Notification:${mockUrgentNotificationId}`);
  const mockMarkedAllNotificationsResponse = {
    updatedNotificationIds: [mockUrgentNotificationId, mockUpcomingNotificationId],
    __typename: 'MarkAllNotificationsAsReadResult',
  };

  beforeEach(() => {
    (useMutationResultToasts as jest.Mock).mockReturnValue({ onError: mockOnError });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (mocks: MockedResponse[] = []): RenderHookResult<unknown, UseMarkAllNotificationsAsRead> => {
    const cache = new InMemoryCache({
      addTypename: false,
      typePolicies,
    });

    return renderHook(() => useMarkAllNotificationsAsRead(), {
      wrapper: ({ children }) => (
        <MockProviderHook cache={cache} mocks={mocks}>
          {children}
        </MockProviderHook>
      ),
    });
  };

  it('should return correct initial data', () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: { markAllAllNotificationsAsRead: mockMarkedAllNotificationsResponse } }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockMarkAllNotificationsAsReadResponse]);

    expect(result.current.loading).toBeFalsy();
  });

  it('should update cache when marking all unread notification as read', async () => {
    const mockMutateFn = jest.fn().mockImplementation(({ update }) => {
      update?.(
        { modify: mockCacheModify, identify: mockCacheIdentify },
        {
          data: { markAllNotificationsAsRead: mockMarkedAllNotificationsResponse },
        }
      );
      return Promise.resolve({ data: { markAllNotificationsAsRead: mockMarkedAllNotificationsResponse } });
    });

    (useMutation as jest.Mock).mockReturnValue([mockMutateFn, { loading: false }]);

    const { result } = hook([mockMarkAllNotificationsAsReadResponse]);

    await act(async () => {
      await result.current.onMarkAllNotificationsAsRead();
    });

    expect(mockMutateFn).toHaveBeenCalled();

    const notificationModifyCalls = mockCacheModify.mock.calls.filter(([arg]) => arg.id?.startsWith('Notification:'));

    expect(notificationModifyCalls).toHaveLength(mockMarkedAllNotificationsResponse.updatedNotificationIds.length);

    notificationModifyCalls.forEach(([arg]) => {
      const { status, readAt } = arg.fields;

      expect(status()).toBe('Read');

      const isoDate = readAt();

      expect(typeof isoDate).toBe('string');
      expect(new Date(isoDate).toISOString()).toBe(isoDate);
    });

    const unreadCountCall = mockCacheModify.mock.calls.find(([arg]) => arg.fields?.getUnreadNotificationCount);

    expect(unreadCountCall).toBeDefined();

    const unreadCountFn = unreadCountCall![0].fields.getUnreadNotificationCount;
    expect(unreadCountFn()).toBe(0);
  });

  it('should not modify the cache if data is undefined or null', async () => {
    mockUseMutation.mockImplementationOnce(() => [jest.fn().mockResolvedValue({ data: null }), { loading: false }]);

    (useMutation as jest.Mock).mockImplementationOnce(mockUseMutation);

    const { result } = hook([mockMarkAllNotificationsAsReadResponse]);

    await act(async () => {
      await result.current.onMarkAllNotificationsAsRead();
    });

    expect(mockCacheModify).not.toHaveBeenCalled();
  });

  it('should handle GraphQL errors and trigger onHandleMutationErrors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: undefined, errors: mockGqlError }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockMarkAllNotificationsAsReadGQLErrorResponse]);

    await act(async () => {
      await result.current.onMarkAllNotificationsAsRead();
    });

    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      errors: [{ message: 'Simulated GQL error in result' }],
      message: MARK_ALL_NOTIFICATIONS_AS_READ_ERROR_MESSAGE,
      onFailure: expect.any(Function),
    });
  });

  it('should handle network error and call onHandleMutationErrors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockRejectedValue({ message: 'Network Error' }),
      { loading: false, error: mockNetworkError },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockMarkAllNotificationsAsReadNetworkErrorResponse]);

    await act(async () => {
      await result.current.onMarkAllNotificationsAsRead();
    });

    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      error: expect.objectContaining({ message: 'Network Error' }),
      message: MARK_ALL_NOTIFICATIONS_AS_READ_ERROR_MESSAGE,
      onFailure: expect.any(Function),
    });
  });
});
