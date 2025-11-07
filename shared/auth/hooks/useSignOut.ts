import { useCallback } from 'react';

import { AppRoutes } from '@/types/enums';

import { useAuthMutation } from './useAuthMutation';

type UseSignOut = {
  onSignOut: (route?: AppRoutes) => Promise<void>;
};

export const useSignOut = (): UseSignOut => {
  const { onAuthMutation } = useAuthMutation({
    action: 'SIGN_OUT',
    showSuccessToast: false,
  });

  const onSignOut = useCallback(
    async (route: AppRoutes = AppRoutes.SignIn): Promise<void> => {
      await onAuthMutation({});

      window.location.href = route;
    },
    [onAuthMutation]
  );

  return {
    onSignOut,
  };
};
