import { act, render, screen } from '@testing-library/react';
import { RenderHookResult, renderHook } from '@testing-library/react-hooks';
import { useRouter } from 'next/router';

import { supabaseClient } from '@/lib/supabase-client';
import { mockUser } from '@/mocks/userMocks';
import { CALLBACK_PAGE_REDIRECT_DELAY } from '@/shared/auth/constants';
import {
  DEFAULT_OAUTH_FAILED_MESSAGE,
  DEFAULT_OAUTH_SUCCESS_MESSAGE,
  UseProcessAuth,
  useProcessAuth,
} from '@/shared/auth/hooks';
import { useUser } from '@/shared/contexts/UserContext';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import { AppRoutes } from '@/types/enums';

jest.mock('@/shared/contexts/UserContext');
jest.mock('@/lib/supabase-client', () => ({
  supabaseClient: {
    auth: {
      getSession: jest.fn(),
    },
  },
}));
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/shared/hooks/useMutationResultToasts', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    onSuccess: jest.fn(),
    onError: jest.fn(),
  })),
}));

describe('useProcessAuth', () => {
  const mockReplace = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({
      user: { ...mockUser },
      loading: false,
    });

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: '', assign: jest.fn() },
    });

    (useMutationResultToasts as jest.Mock).mockReturnValue({ onSuccess: mockOnSuccess, onError: mockOnError });
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
    });

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  const hook = (): RenderHookResult<unknown, UseProcessAuth> => renderHook(() => useProcessAuth());

  it('should return welcome message from getUserName', () => {
    const { result } = hook();

    render(result.current.welcomeMessage);

    expect(screen.getByText('Welcome back, Alex Smith signing you in...')).toBeInTheDocument();
  });

  it('should call getSession and redirect after delay, then show success toast', async () => {
    hook();

    await act(async () => {
      await Promise.resolve();
      jest.advanceTimersByTime(CALLBACK_PAGE_REDIRECT_DELAY);
    });

    expect(supabaseClient.auth.getSession).toHaveBeenCalled();
    expect(mockOnSuccess).toHaveBeenCalledWith(DEFAULT_OAUTH_SUCCESS_MESSAGE);
    expect(window.location.href).toBe(AppRoutes.Dashboard);
  });

  it('should handle getSession failure and call onError', async () => {
    (supabaseClient.auth.getSession as jest.Mock).mockRejectedValueOnce(new Error(DEFAULT_OAUTH_FAILED_MESSAGE));

    hook();

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockOnError).toHaveBeenCalledWith(DEFAULT_OAUTH_FAILED_MESSAGE, DEFAULT_OAUTH_FAILED_MESSAGE);
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('should clear timeout on unmount', async () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    const { unmount } = hook();

    await act(async () => {
      unmount();
    });

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
