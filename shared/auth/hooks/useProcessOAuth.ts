import { useEffect, useMemo } from 'react';

import { useSession } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';

import { supabaseClient } from '@/lib/supabase-client';
import { useBaseToast } from '@/shared/hooks';
import { BaseToastVariant } from '@/shared/hooks/useBaseToast/types';
import { AppRoutes } from '@/types/enums';

import { OAUTH_CALLBACK_REDIRECT_DELAY } from '../constants';
import { getUserName } from '../utils';

export const useProcessAuth = () => {
  const router = useRouter();
  const session = useSession();

  const { baseToast: successToast } = useBaseToast(BaseToastVariant.Success);
  const { baseToast: errorToast } = useBaseToast(BaseToastVariant.Error);

  const welcomeMessage = useMemo(() => {
    return `${getUserName(session)} Signing you in..`;
  }, [session]);

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
