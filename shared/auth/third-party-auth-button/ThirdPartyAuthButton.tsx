import { memo, useCallback, useMemo } from 'react';

import { FaGithub, FaGooglePlusG } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { OAuthProvider } from '@/graphql/types/client/generated_types';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';

import { useAuthMutation } from '../hooks';
import { ThirdPartyAuthButtonConfig } from '../types';

const ThirdPartyAuthButton = () => {
  const { onError } = useMutationResultToasts();

  const { onAuthMutation } = useAuthMutation<'SIGN_IN_WITH_OAUTH'>({
    action: 'SIGN_IN_WITH_OAUTH',
    onError,
  });

  const onHandleSignInWithOauth = useCallback(
    async (provider: OAuthProvider) => {
      const response = await onAuthMutation({
        input: {
          provider,
        },
      });

      if (response?.data?.signInWithOAuth) {
        window.location.href = response?.data.signInWithOAuth;
      }
    },
    [onAuthMutation]
  );

  const THIRD_PARTY_AUTH_BUTTON_CONFIG: ThirdPartyAuthButtonConfig[] = useMemo(() => {
    const commonIconWrapperStyles = 'w-fit h-auto p-2 rounded-full border-2 border-blue-700 shadow-md mr-2 last:mr-0';
    const commonIconStales = 'w-5 h-5';

    return [
      {
        id: 1,
        icon: <FaGooglePlusG className={commonIconStales} />,
        className: commonIconWrapperStyles,
        onClick: () => onHandleSignInWithOauth(OAuthProvider.Google),
      },
      {
        id: 2,
        icon: <FaGithub className={commonIconStales} />,
        className: commonIconWrapperStyles,
        onClick: () => onHandleSignInWithOauth(OAuthProvider.Github),
      },
    ];
  }, [onHandleSignInWithOauth]);

  return (
    <section className='flex justify-center'>
      {THIRD_PARTY_AUTH_BUTTON_CONFIG.map(({ id, icon, className, onClick }) => (
        <Button key={id} className={className} type='button' onClick={onClick}>
          {icon}
        </Button>
      ))}
    </section>
  );
};

export default memo(ThirdPartyAuthButton);
