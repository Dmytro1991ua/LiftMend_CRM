import { useCallback } from 'react';

import { useRouter } from 'next/router';

import { AppRoutes } from '@/types/enums';

import { useAuthMutation } from './useAuthMutation';

type UseSignOut = {
  onSignOut: (route?: AppRoutes) => Promise<void>;
};

export const useSignOut = (): UseSignOut => {
  const router = useRouter();

  const { onAuthMutation } = useAuthMutation({
    action: 'SIGN_OUT',
  });

  const onSignOut = useCallback(
    async (route: AppRoutes = AppRoutes.SignIn): Promise<void> => {
      await onAuthMutation({});

      await router.push(route);
    },
    [onAuthMutation]
  );

  return {
    onSignOut,
  };
};
