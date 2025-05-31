import { act, render, screen } from '@testing-library/react';
import { RenderHookResult, renderHook } from '@testing-library/react-hooks';
import { useRouter } from 'next/router';

import { useToast } from '@/components/ui/use-toast';
import { mockUser } from '@/mocks/userMocks';
import { OAUTH_CALLBACK_REDIRECT_DELAY } from '@/shared/auth/constants';
import { UseProcessAuth, useProcessAuth } from '@/shared/auth/hooks';
import { useUser } from '@/shared/contexts/UserContext';
import { AppRoutes } from '@/types/enums';

jest.mock('@/shared/contexts/UserContext');
jest.mock('@/components/ui/use-toast');
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

describe('useProcessAuth', () => {
  const mockToast = jest.fn();
  const mockReplace = jest.fn();

  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({
      user: { ...mockUser },
      loading: false,
    });

    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
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

  it('should redirect to dashboard after OAuth callback delay', async () => {
    hook();

    await act(async () => {
      // wait for getSession to resolve
      await Promise.resolve();

      // then advance timers by the redirect delay
      jest.advanceTimersByTime(OAUTH_CALLBACK_REDIRECT_DELAY);
    });

    expect(mockReplace).toHaveBeenCalledWith(AppRoutes.Dashboard);
  });
});
