import { useCallback } from 'react';

import { useRouter } from 'next/router';

import { AppRoutes } from '@/types/enums';

import { useAuthMutation } from './useAuthMutation';

type UseSignOut = {
  onSignOut: () => Promise<void>;
};

export const useSignOut = (): UseSignOut => {
  const router = useRouter();

  const { onAuthMutation } = useAuthMutation({
    action: 'SIGN_OUT',
    onRedirect: () => router.push(AppRoutes.SignIn),
  });

  const onSignOut = useCallback(async (): Promise<void> => {
    await onAuthMutation({});

    // Reload to clear Supabase's stale in-memory session (which doesn't update immediately on sign-out).
    window.location.reload();
  }, [onAuthMutation]);

  return {
    onSignOut,
  };
};
