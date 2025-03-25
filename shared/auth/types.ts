import { AppUser } from '@/graphql/types/client/generated_types';

export type AuthAction = 'SIGN_UP' | 'LOGIN' | 'SIGN_IN_WITH_OAUTH' | 'SIGN_OUT' | 'FORGOT_PASSWORD' | 'RESET_PASSWORD';

export type AuthHookProps = {
  action: AuthAction;
  onSuccess?: (message: string) => void;
  onError?: (errorMessage: string, errorDescription: string) => void;
  onRedirect?: () => void;
  onReset?: () => void;
};

export type ThirdPartyAuthButtonConfig = {
  id: number;
  icon: JSX.Element;
  className: string;
  onClick: () => Promise<void> | void;
};

export type UserNameProps = {
  user: AppUser | null;
  isLoading: boolean;
  className?: string;
  additionalMessage?: string;
};
