import { useEffect, useMemo } from 'react';

import { useRouter } from 'next/router';

import { supabaseClient } from '@/lib/supabase-client';
import { useUser } from '@/shared/contexts/UserContext';
import { useBaseToast } from '@/shared/hooks';
import { BaseToastVariant } from '@/shared/hooks/useBaseToast/types';
import { AppRoutes } from '@/types/enums';

import { OAUTH_CALLBACK_REDIRECT_DELAY } from '../constants';
import { getUserName } from '../utils';

export type UseProcessAuth = {
  welcomeMessage: JSX.Element;
};

export const useProcessAuth = (): UseProcessAuth => {
  const router = useRouter();

  const { user, loading } = useUser();

  const { baseToast: successToast } = useBaseToast(BaseToastVariant.Success);
  const { baseToast: errorToast } = useBaseToast(BaseToastVariant.Error);

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
      await supabaseClient.auth.getSession();

      timeoutId = setTimeout(() => {
        router.replace(AppRoutes.Dashboard);
      }, OAUTH_CALLBACK_REDIRECT_DELAY);
    };

    processAuth();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [router, successToast, errorToast]);

  return { welcomeMessage };
};
