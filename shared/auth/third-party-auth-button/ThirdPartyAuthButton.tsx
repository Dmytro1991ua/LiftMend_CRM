import { memo, useCallback, useMemo } from 'react';

import { FaGithub, FaGooglePlusG } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { OAuthProvider } from '@/graphql/types/client/generated_types';

import { useAuthMutation } from '../hooks';
import { ThirdPartyAuthButtonConfig } from '../types';

const ThirdPartyAuthButton = () => {
  const { onAuthMutation } = useAuthMutation<'SIGN_IN_WITH_OAUTH'>({
    action: 'SIGN_IN_WITH_OAUTH',
    showSuccessToast: false,
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
        ariaLabel: 'google-auth-button',
        onClick: () => onHandleSignInWithOauth(OAuthProvider.Google),
      },
      {
        id: 2,
        icon: <FaGithub className={commonIconStales} />,
        className: commonIconWrapperStyles,
        ariaLabel: 'github-auth-button',
        onClick: () => onHandleSignInWithOauth(OAuthProvider.Github),
      },
    ];
  }, [onHandleSignInWithOauth]);

  return (
    <section className='flex justify-center' data-testid='third-party-auth-buttons'>
      {THIRD_PARTY_AUTH_BUTTON_CONFIG.map(({ id, icon, ariaLabel, className, onClick }) => (
        <Button key={id} aria-label={ariaLabel} className={className} type='button' onClick={onClick}>
          {icon}
        </Button>
      ))}
    </section>
  );
};

export default memo(ThirdPartyAuthButton);
