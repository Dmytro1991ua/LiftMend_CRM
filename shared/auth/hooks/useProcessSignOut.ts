import { useEffect } from 'react';

import { supabaseClient } from '@/lib/supabase-client';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import { AppRoutes } from '@/types/enums';

import { CALLBACK_PAGE_REDIRECT_DELAY } from '../constants';

export const DEFAULT_SIGN_OUT_FAILED_MESSAGE = 'Failed to sign-out';
export const DEFAULT_SIGN_OUT_SUCCESS_MESSAGE = 'Signed out successfully';

export const useProcessSignOut = () => {
  const { onSuccess, onError } = useMutationResultToasts();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const processSignOut = async () => {
      try {
        // Clear Supabase session
        await supabaseClient.auth.signOut();
        await supabaseClient.auth.refreshSession();
      } catch (err) {
        console.error(DEFAULT_SIGN_OUT_FAILED_MESSAGE, err);
        onError?.(DEFAULT_SIGN_OUT_FAILED_MESSAGE, (err as Error).message);
      }

      timeoutId = setTimeout(() => {
        window.location.href = AppRoutes.SignIn;
        onSuccess?.(DEFAULT_SIGN_OUT_SUCCESS_MESSAGE);
      }, CALLBACK_PAGE_REDIRECT_DELAY);
    };

    processSignOut();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [onError, onSuccess]);
};
