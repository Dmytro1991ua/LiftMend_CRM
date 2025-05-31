import { InMemoryCache, useMutation } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import { typePolicies } from '@/graphql/typePolicies';
import {
  mockLoginUserData,
  mockSignedInUserResponse,
  mockUserLoginGQLErrorResponse,
  mockUserLoginNetworkErrorResponse,
  mockUserLoginResponse,
} from '@/mocks/authMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import { DEFAULT_USER_LOGIN_FAIL_MESSAGE, DEFAULT_USER_LOGIN_SUCCESS_MESSAGE } from '@/shared/auth/constants';
import { UseAuthMutation, useAuthMutation } from '@/shared/auth/hooks';
import { AuthAction, AuthHookProps } from '@/shared/auth/types';
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
  ...jest.requireActual('@/shared/utils'),
  onHandleMutationErrors: jest.fn(),
}));

describe('useAuthMutation', () => {
  const mockUseMutation = jest.fn();
  const mockGqlError = [{ message: 'Simulated GQL error in result' }];
  const mockNetworkError = { message: 'Test network Error' };
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();
  const mockOnRedirect = jest.fn();
  const mockOnReset = jest.fn();

  beforeEach(() => {
    (useMutationResultToasts as jest.Mock).mockReturnValue({ onSuccess: mockOnSuccess, onError: mockOnError });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = { action: 'LOGIN' as AuthAction, onRedirect: mockOnRedirect, onReset: mockOnReset };

  const hook = (
    props?: Partial<AuthHookProps>,
    mocks: MockedResponse[] = []
  ): RenderHookResult<unknown, UseAuthMutation<'LOGIN'>> => {
    const cache = new InMemoryCache({
      addTypename: false,
      typePolicies,
    });

    return renderHook(() => useAuthMutation({ ...defaultProps, ...props }), {
      wrapper: ({ children }) => (
        <MockProviderHook cache={cache} mocks={mocks}>
          {children}
        </MockProviderHook>
      ),
    });
  };

  it('should return correct initial data', () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({
        data: {
          signIn: {
            ...mockSignedInUserResponse,
            __typename: 'AuthResponse',
          },
        },
      }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook({}, [mockUserLoginResponse]);

    expect(result.current.isLoading).toBe(false);
  });

  it('should trigger onAuthMutation with success, redirect and form reset when the mutation succeeds without errors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({
        data: {
          signIn: {
            ...mockSignedInUserResponse,
            __typename: 'AuthResponse',
          },
        },
      }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook({}, [mockUserLoginResponse]);

    await act(async () => {
      await result.current.onAuthMutation({ input: { ...mockLoginUserData } });
    });

    expect(mockOnSuccess).toHaveBeenCalledWith(DEFAULT_USER_LOGIN_SUCCESS_MESSAGE);
    expect(mockOnRedirect).toHaveBeenCalled();
    expect(mockOnReset).toHaveBeenCalled();
    expect(onHandleMutationErrors).not.toHaveBeenCalledWith();
  });

  it('should handle GraphQL errors and trigger onHandleMutationErrors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: undefined, errors: mockGqlError }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook({}, [mockUserLoginGQLErrorResponse]);

    await act(async () => {
      await result.current.onAuthMutation({ input: { ...mockLoginUserData } });
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      errors: [{ message: 'Simulated GQL error in result' }],
      message: DEFAULT_USER_LOGIN_FAIL_MESSAGE,
      onFailure: expect.any(Function),
    });
  });

  it('should handle network error and call onHandleMutationErrors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockRejectedValue({ message: 'Network Error' }),
      { loading: false, error: mockNetworkError },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook({}, [mockUserLoginNetworkErrorResponse]);

    await act(async () => {
      await result.current.onAuthMutation({ input: { ...mockLoginUserData } });
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      error: expect.objectContaining({ message: 'Network Error' }),
      message: DEFAULT_USER_LOGIN_FAIL_MESSAGE,
      onFailure: expect.any(Function),
    });
  });
});
