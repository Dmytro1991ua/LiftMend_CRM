import { useMutation } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import {
  mockDeleteUserAccountGqlErrorResponse,
  mockDeleteUserAccountNetworkErrorResponse,
  mockDeleteUserAccountResponse,
} from '@/mocks/profileMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import { UseDeleteAccount, useDeleteAccount } from '@/modules/profile/hooks';
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
    onSuccess: jest.fn(),
    onError: jest.fn(),
  })),
}));

jest.mock('@/shared/utils', () => ({
  onHandleMutationErrors: jest.fn(),
}));

describe('useDeleteAccount', () => {
  const mockUseMutation = jest.fn();
  const mockGqlError = [{ message: 'Simulated GQL error in result' }];
  const mockNetworkError = { message: 'Test network Error' };
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();
  const mockDeleteAccountResponse = {
    id: 'test-user-id-1',
    __typename: 'RemoveAccountResponse',
  };

  beforeEach(() => {
    (useMutationResultToasts as jest.Mock).mockReturnValue({ onSuccess: mockOnSuccess, onError: mockOnError });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (mocks: MockedResponse[] = []): RenderHookResult<unknown, UseDeleteAccount> =>
    renderHook(() => useDeleteAccount(), {
      wrapper: ({ children }) => <MockProviderHook mocks={mocks}>{children}</MockProviderHook>,
    });

  it('should return correct initial data', () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: { removeAccount: mockDeleteAccountResponse } }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockDeleteUserAccountResponse]);

    expect(result.current.error).toBeUndefined();
    expect(result.current.loading).toBeFalsy();
  });

  it('should trigger onDeleteAccount with success if mutation succeeds without errors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: { removeAccount: mockDeleteAccountResponse } }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockDeleteUserAccountResponse]);

    await act(async () => {
      await result.current.onDeleteAccount('test-user-id-1');
    });

    expect(mockOnSuccess).toHaveBeenCalledWith('Successfully deleted account');
    expect(onHandleMutationErrors).not.toHaveBeenCalled();
  });

  it('should handle GraphQL errors and trigger onHandleMutationErrors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: { removeAccount: mockDeleteAccountResponse }, errors: mockGqlError }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockDeleteUserAccountGqlErrorResponse]);

    await act(async () => {
      await result.current.onDeleteAccount('test-user-id-1');
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      errors: [{ message: 'Simulated GQL error in result' }],
      message: 'Fail to delete account',
      onFailure: expect.any(Function),
    });
  });

  it('should handle network error and call onHandleMutationErrors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockRejectedValue(new Error('Network Error')),
      { loading: false, error: mockNetworkError },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockDeleteUserAccountNetworkErrorResponse]);

    await act(async () => {
      await result.current.onDeleteAccount('test-user-id-1');
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      error: expect.objectContaining({ message: 'Network Error' }),
      message: 'Delete Account Fail',
      onFailure: expect.any(Function),
    });
  });
});
