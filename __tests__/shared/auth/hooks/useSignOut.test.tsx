import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { mockSignOutResponse } from '@/mocks/authMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import { useAuthMutation, useSignOut } from '@/shared/auth/hooks';
import { AppRoutes } from '@/types/enums';

jest.mock('@/shared/auth/hooks/useAuthMutation');

describe('useSignOut', () => {
  const mockOnAuthMutation = jest.fn();

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: '' },
    });

    (useAuthMutation as jest.Mock).mockImplementation(() => ({
      onAuthMutation: mockOnAuthMutation,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = () =>
    renderHook(() => useSignOut(), {
      wrapper: ({ children }) => <MockProviderHook mocks={[mockSignOutResponse]}>{children}</MockProviderHook>,
    });

  it('should call onAuthMutation and redirect to sign-in by default', async () => {
    const { result } = hook();

    await act(async () => {
      await result.current.onSignOut();
    });

    expect(mockOnAuthMutation).toHaveBeenCalledWith({});
    expect(window.location.href).toBe(AppRoutes.SignIn);
  });

  it('should redirect to a custom route if provided', async () => {
    const { result } = hook();

    await act(async () => {
      await result.current.onSignOut(AppRoutes.SignOut);
    });

    expect(mockOnAuthMutation).toHaveBeenCalledWith({});
    expect(window.location.href).toBe(AppRoutes.SignOut);
  });
});
