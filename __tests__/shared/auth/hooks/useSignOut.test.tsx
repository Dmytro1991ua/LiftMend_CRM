import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useRouter } from 'next/router';

import { mockSignOutResponse } from '@/mocks/authMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import { useAuthMutation, useSignOut } from '@/shared/auth/hooks';
import { AppRoutes } from '@/types/enums';

jest.mock('@/shared/auth/hooks/useAuthMutation');
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('useSignOut', () => {
  const mockWindowReload = jest.fn();
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: mockWindowReload },
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });

    (useAuthMutation as jest.Mock).mockImplementation(() => ({
      onAuthMutation: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = () =>
    renderHook(() => useSignOut(), {
      wrapper: ({ children }) => <MockProviderHook mocks={[mockSignOutResponse]}>{children}</MockProviderHook>,
    });

  it('should trigger onSignOut and reload page after signout', async () => {
    const { result } = hook();

    await act(() => result.current.onSignOut());

    expect(mockRouterPush).toHaveBeenCalledWith(AppRoutes.SignIn);
  });
});
