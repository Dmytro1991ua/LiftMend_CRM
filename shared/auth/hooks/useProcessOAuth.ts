import { useEffect, useMemo } from 'react';

import { useRouter } from 'next/router';

import { supabaseClient } from '@/lib/supabase-client';
import { useUser } from '@/shared/contexts/UserContext';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import { AppRoutes } from '@/types/enums';

import { CALLBACK_PAGE_REDIRECT_DELAY } from '../constants';
import { getUserName } from '../utils';

export type UseProcessAuth = {
  welcomeMessage: JSX.Element;
};

export const DEFAULT_OAUTH_FAILED_MESSAGE = 'Failed to sign-in';
export const DEFAULT_OAUTH_SUCCESS_MESSAGE = 'Signed in successfully';

export const useProcessAuth = (): UseProcessAuth => {
  const { user, loading } = useUser();
  const { onSuccess, onError } = useMutationResultToasts();

  const welcomeMessage = useMemo(
    () =>
      getUserName({
        user,
        isLoading: loading,
        className: 'h-6 w-72 mx-1',
        additionalMessage: 'signing you in...',
      }),
    [user, loading]
  );

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const processAuth = async () => {
      try {
        await supabaseClient.auth.getSession();

        timeoutId = setTimeout(() => {
          // Use full page reload instead of router.replace to avoid double success toast in Strict Mode
          window.location.href = AppRoutes.Dashboard;
          onSuccess?.(DEFAULT_OAUTH_SUCCESS_MESSAGE);
        }, CALLBACK_PAGE_REDIRECT_DELAY);
      } catch (err) {
        console.error('Sign-in processing failed', err);
        onError?.(DEFAULT_OAUTH_FAILED_MESSAGE, (err as Error).message);
      }
    };

    processAuth();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [onSuccess, onError]);

  return { welcomeMessage };
};
