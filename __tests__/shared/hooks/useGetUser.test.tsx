import * as apollo from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { useSession } from '@supabase/auth-helpers-react';
import { renderHook } from '@testing-library/react-hooks';

import { MockProviderHook } from '@/mocks/testMocks';
import { mockUser, mockUserNetworkErrorResponse, mockUserResponse } from '@/mocks/userMocks';
import { useGetUser } from '@/shared/hooks';

jest.mock('@supabase/auth-helpers-react', () => {
  return {
    __esModule: true,
    useSession: jest.fn(),
  };
});

describe('useGetUser', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (mocks: MockedResponse[]) =>
    renderHook(() => useGetUser(), {
      wrapper: ({ children }) => <MockProviderHook mocks={mocks}>{children}</MockProviderHook>,
    });

  it('should not trigger query if user has no ID in the storage', () => {
    (useSession as jest.Mock).mockReturnValue({
      user: { id: null },
    });

    const { result } = hook([mockUserResponse]);

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(undefined);
    expect(result.current.user).toBe(null);
  });

  it('should fetch user data when session is available', async () => {
    (useSession as jest.Mock).mockReturnValue({
      user: mockUser,
    });

    const { result, waitForNextUpdate } = hook([mockUserResponse]);

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(undefined);
    expect(result.current.user).toEqual(mockUser);
  });

  it('should return error if the user data was failed to fetch', async () => {
    const errorMock = { message: 'Failed to fetch data' } as apollo.ApolloError;

    jest.spyOn(apollo, 'useQuery').mockImplementation(
      () =>
        ({
          data: undefined,
          error: errorMock,
          loading: false,
        } as unknown as apollo.QueryResult)
    );

    const { result } = hook([mockUserNetworkErrorResponse]);

    expect(result.current.error).toBe('Failed to fetch data');
    expect(result.current.user).toEqual(null);
  });
});
