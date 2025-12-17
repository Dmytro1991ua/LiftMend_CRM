import { InMemoryCache, useMutation } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import { typePolicies } from '@/graphql/typePolicies';
import {
  mockMarkNotificationAsReadGQLErrorResponse,
  mockMarkNotificationAsReadNetworkErrorResponse,
  mockMarkNotificationAsReadResponse,
  mockUrgentNotification,
  mockUrgentNotificationId,
} from '@/mocks/notificationMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import { MARK_NOTIFICATION_AS_READ_ERROR_MESSAGE } from '@/modules/notifications/constants';
import {
  UseMarkNotificationAsRead,
  useMarkNotificationAsRead,
} from '@/modules/notifications/hooks/useMarkNotificationAsRead';
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

describe('useMarkNotificationAsRead', () => {
  const mockUseMutation = jest.fn();
  const mockGqlError = [{ message: 'Simulated GQL error in result' }];
  const mockNetworkError = { message: 'Test network Error' };
  const mockOnError = jest.fn();
  const mockCacheModify = jest.fn();
  const mockUpdatedMarkNotificationAsRead = { ...mockUrgentNotification, status: 'Read' };

  beforeEach(() => {
    (useMutationResultToasts as jest.Mock).mockReturnValue({ onError: mockOnError });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (mocks: MockedResponse[] = []): RenderHookResult<unknown, UseMarkNotificationAsRead> => {
    const cache = new InMemoryCache({
      addTypename: false,
      typePolicies,
    });

    return renderHook(() => useMarkNotificationAsRead(), {
      wrapper: ({ children }) => (
        <MockProviderHook cache={cache} mocks={mocks}>
          {children}
        </MockProviderHook>
      ),
    });
  };

  it('should return correct initial data', () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: { markNotificationAsRead: mockUpdatedMarkNotificationAsRead } }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockMarkNotificationAsReadResponse]);

    expect(result.current.loading).toBeFalsy();
  });

  it('should update cache when marking an unread notification as read', async () => {
    const mockMutateFn = jest.fn().mockImplementation(({ update }) => {
      update?.({ modify: mockCacheModify } as any, {
        data: { markNotificationAsRead: mockUpdatedMarkNotificationAsRead },
      });
      return Promise.resolve({ data: { markNotificationAsRead: mockUpdatedMarkNotificationAsRead } });
    });

    (useMutation as jest.Mock).mockReturnValue([mockMutateFn, { loading: false }]);

    const { result } = hook([mockMarkNotificationAsReadResponse]);

    await act(async () => {
      await result.current.onMarkNotificationAsRead(mockUrgentNotification.id, true);
    });

    expect(mockCacheModify).toHaveBeenCalledWith({
      fields: {
        getUnreadNotificationCount: expect.any(Function),
      },
    });

    const modifyFn = mockCacheModify.mock.calls[0][0].fields.getUnreadNotificationCount;

    expect(modifyFn(5)).toBe(4);
  });

  it('should not modify the cache if notification is not Unread', async () => {
    mockUseMutation.mockImplementationOnce(() => [jest.fn().mockResolvedValue({ data: null }), { loading: false }]);

    (useMutation as jest.Mock).mockImplementationOnce(mockUseMutation);

    const { result } = hook([mockMarkNotificationAsReadResponse]);

    await act(async () => {
      await result.current.onMarkNotificationAsRead(mockUrgentNotification.id, false);
    });

    expect(mockCacheModify).not.toHaveBeenCalled();
  });

  it('should handle GraphQL errors and trigger onHandleMutationErrors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: undefined, errors: mockGqlError }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockMarkNotificationAsReadGQLErrorResponse]);

    await act(async () => {
      await result.current.onMarkNotificationAsRead(mockUrgentNotificationId, true);
    });

    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      errors: [{ message: 'Simulated GQL error in result' }],
      message: MARK_NOTIFICATION_AS_READ_ERROR_MESSAGE,
      onFailure: expect.any(Function),
    });
  });

  it('should handle network error and call onHandleMutationErrors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockRejectedValue({ message: 'Network Error' }),
      { loading: false, error: mockNetworkError },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockMarkNotificationAsReadNetworkErrorResponse]);

    await act(async () => {
      await result.current.onMarkNotificationAsRead(mockUrgentNotificationId, true);
    });

    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      error: expect.objectContaining({ message: 'Network Error' }),
      message: MARK_NOTIFICATION_AS_READ_ERROR_MESSAGE,
      onFailure: expect.any(Function),
    });
  });
});
