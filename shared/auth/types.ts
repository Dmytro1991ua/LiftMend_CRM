export type AuthAction = 'SIGN_UP' | 'LOGIN' | 'SIGN_OUT' | 'FORGOT_PASSWORD' | 'RESET_PASSWORD';

export type AuthHookProps = {
  action: AuthAction;
  onSuccess?: (message: string) => void;
  onError?: (errorMessage: string, errorDescription: string) => void;
  onRedirect?: () => void;
  onReset?: () => void;
};
