import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import { supabaseClient } from '@/lib/supabase-client';
import { CALLBACK_PAGE_REDIRECT_DELAY } from '@/shared/auth/constants';
import {
  DEFAULT_SIGN_OUT_FAILED_MESSAGE,
  DEFAULT_SIGN_OUT_SUCCESS_MESSAGE,
  useProcessSignOut,
} from '@/shared/auth/hooks/useProcessSignOut';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import { AppRoutes } from '@/types/enums';

jest.mock('@/lib/supabase-client', () => ({
  supabaseClient: {
    auth: {
      signOut: jest.fn(),
      refreshSession: jest.fn(),
    },
  },
}));

jest.mock('@/shared/hooks/useMutationResultToasts', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    onSuccess: jest.fn(),
    onError: jest.fn(),
  })),
}));

describe('useProcessSignOut', () => {
  const mockSignOut = supabaseClient.auth.signOut as jest.Mock;
  const mockRefreshSession = supabaseClient.auth.refreshSession as jest.Mock;
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: '', assign: jest.fn() },
    });

    (useMutationResultToasts as jest.Mock).mockReturnValue({ onSuccess: mockOnSuccess, onError: mockOnError });

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  const hook = (): RenderHookResult<unknown, void> => renderHook(() => useProcessSignOut());

  it('should sign out, refresh session, and redirect after delay', async () => {
    hook();

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(mockRefreshSession).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(CALLBACK_PAGE_REDIRECT_DELAY);
    });

    expect(supabaseClient.auth.signOut).toHaveBeenCalled();
    expect(supabaseClient.auth.refreshSession).toHaveBeenCalled();
    expect(mockOnSuccess).toHaveBeenCalledWith(DEFAULT_SIGN_OUT_SUCCESS_MESSAGE);
    expect(window.location.href).toBe(AppRoutes.SignIn);
  });

  it('should clear timeout on unmount', async () => {
    const { unmount } = hook();

    await act(async () => {
      await Promise.resolve();
    });

    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('should handle sign-out error and call onError', async () => {
    const error = new Error('Sign-out failed');
    (supabaseClient.auth.signOut as jest.Mock).mockRejectedValueOnce(error);

    hook();

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockOnError).toHaveBeenCalledWith(DEFAULT_SIGN_OUT_FAILED_MESSAGE, 'Sign-out failed');
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});
