// TODO: Extend with | 'FORGOT_PASSWORD' | 'RESET_PASSWORD'; when it is ready
export type AuthAction = 'SIGN_UP' | 'LOGIN' | 'SIGN_OUT';

export type AuthHookProps = {
  action: AuthAction;
  onSuccess?: (message: string) => void;
  onError?: (errorMessage: string, errorDescription: string) => void;
  onRedirect?: () => void;
};
