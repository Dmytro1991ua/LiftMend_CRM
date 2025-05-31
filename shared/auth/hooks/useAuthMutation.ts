import { ApolloError, FetchResult, useMutation } from '@apollo/client';

import { FORGOT_PASSWORD } from '@/graphql/schemas/forgotPassword';
import { RESET_PASSWORD } from '@/graphql/schemas/resetPassword';
import { SIGN_IN_WITH_OAUTH } from '@/graphql/schemas/signInWithOAuth';
import { SIGN_OUT_USER } from '@/graphql/schemas/signOutUser';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import { onHandleMutationErrors } from '@/shared/utils';

import {
  DEFAULT_FORGOT_PASSWORD_FAIL_MESSAGE,
  DEFAULT_FORGOT_PASSWORD_SUCCESS_MESSAGE,
  DEFAULT_RESET_PASSWORD_FAIL_MESSAGE,
  DEFAULT_RESET_PASSWORD_SUCCESS_MESSAGE,
  DEFAULT_USER_CREATION_FAIL_MESSAGE,
  DEFAULT_USER_CREATION_SUCCESS_MESSAGE,
  DEFAULT_USER_LOGIN_FAIL_MESSAGE,
  DEFAULT_USER_LOGIN_SUCCESS_MESSAGE,
  DEFAULT_USER_LOGOUT_FAIL_MESSAGE,
  DEFAULT_USER_LOGOUT_SUCCESS_MESSAGE,
} from '../constants';
import { AuthHookProps } from '../types';

import { CREATE_USER } from './../../../graphql/schemas/createUser';
import { LOGIN_USER } from './../../../graphql/schemas/loginUser';
import {
  CreateUserMutation,
  CreateUserMutationVariables,
  ForgotPasswordMutation,
  ForgotPasswordMutationVariables,
  LoginUserMutation,
  LoginUserMutationVariables,
  ResetPasswordMutation,
  ResetPasswordMutationVariables,
  SignInWithOAuthMutation,
  SignInWithOAuthMutationVariables,
  SignOutUserMutation,
  SignOutUserMutationVariables,
} from './../../../graphql/types/client/generated_types';

export type AuthMutations = {
  SIGN_UP: {
    schema: typeof CREATE_USER;
    response: CreateUserMutation;
    variables: CreateUserMutationVariables;
    successMessage: string;
    failureMessage: string;
  };
  LOGIN: {
    schema: typeof LOGIN_USER;
    response: LoginUserMutation;
    variables: LoginUserMutationVariables;
    successMessage: string;
    failureMessage: string;
  };
  SIGN_IN_WITH_OAUTH: {
    schema: typeof SIGN_IN_WITH_OAUTH;
    variables: SignInWithOAuthMutationVariables;
    response: SignInWithOAuthMutation;
    successMessage: string;
    failureMessage: string;
  };
  SIGN_OUT: {
    schema: typeof SIGN_OUT_USER;
    response: SignOutUserMutation;
    variables: SignOutUserMutationVariables;
    successMessage: string;
    failureMessage: string;
  };
  FORGOT_PASSWORD: {
    schema: typeof FORGOT_PASSWORD;
    variables: ForgotPasswordMutationVariables;
    response: ForgotPasswordMutation;
    successMessage: string;
    failureMessage: string;
  };
  RESET_PASSWORD: {
    schema: typeof RESET_PASSWORD;
    variables: ResetPasswordMutationVariables;
    response: ResetPasswordMutation;
    successMessage: string;
    failureMessage: string;
  };
};

const authMutations: AuthMutations = {
  SIGN_UP: {
    schema: CREATE_USER,
    variables: {} as CreateUserMutationVariables,
    response: {} as CreateUserMutation,
    successMessage: DEFAULT_USER_CREATION_SUCCESS_MESSAGE,
    failureMessage: DEFAULT_USER_CREATION_FAIL_MESSAGE,
  },
  LOGIN: {
    schema: LOGIN_USER,
    variables: {} as LoginUserMutationVariables,
    response: {} as LoginUserMutation,
    successMessage: DEFAULT_USER_LOGIN_SUCCESS_MESSAGE,
    failureMessage: DEFAULT_USER_LOGIN_FAIL_MESSAGE,
  },
  SIGN_IN_WITH_OAUTH: {
    schema: SIGN_IN_WITH_OAUTH,
    variables: {} as SignInWithOAuthMutationVariables,
    response: {} as SignInWithOAuthMutation,
    successMessage: DEFAULT_USER_LOGIN_SUCCESS_MESSAGE,
    failureMessage: DEFAULT_USER_LOGIN_FAIL_MESSAGE,
  },
  SIGN_OUT: {
    schema: SIGN_OUT_USER,
    variables: {} as SignOutUserMutationVariables,
    response: {} as SignOutUserMutation,
    successMessage: DEFAULT_USER_LOGOUT_SUCCESS_MESSAGE,
    failureMessage: DEFAULT_USER_LOGOUT_FAIL_MESSAGE,
  },
  FORGOT_PASSWORD: {
    schema: FORGOT_PASSWORD,
    variables: {} as ForgotPasswordMutationVariables,
    response: {} as ForgotPasswordMutation,
    successMessage: DEFAULT_FORGOT_PASSWORD_SUCCESS_MESSAGE,
    failureMessage: DEFAULT_FORGOT_PASSWORD_FAIL_MESSAGE,
  },
  RESET_PASSWORD: {
    schema: RESET_PASSWORD,
    variables: {} as ResetPasswordMutationVariables,
    response: {} as ResetPasswordMutation,
    successMessage: DEFAULT_RESET_PASSWORD_SUCCESS_MESSAGE,
    failureMessage: DEFAULT_RESET_PASSWORD_FAIL_MESSAGE,
  },
};

export type UseAuthMutation<T extends keyof AuthMutations> = {
  isLoading: boolean;
  onAuthMutation: (
    variables: AuthMutations[T]['variables']
  ) => Promise<FetchResult<AuthMutations[T]['response']> | undefined>;
};

export const useAuthMutation = <T extends keyof AuthMutations>({
  action,
  onRedirect,
  onReset,
}: AuthHookProps): UseAuthMutation<T> => {
  const { schema, successMessage, failureMessage } = authMutations[action];

  const { onError, onSuccess } = useMutationResultToasts();

  const [mutation, { loading }] = useMutation<AuthMutations[T]['response'], AuthMutations[T]['variables']>(schema);

  const onAuthMutation = async (variables: AuthMutations[T]['variables']) => {
    try {
      const result = await mutation({ variables });

      const hasErrors = !!result.errors?.length;

      if (hasErrors) {
        onHandleMutationErrors({
          message: failureMessage,
          errors: result.errors,
          onFailure: onError,
        });
      } else {
        onSuccess?.(successMessage);
        onRedirect?.();
        onReset?.();
      }

      return result;
    } catch (e) {
      onHandleMutationErrors({
        message: failureMessage,
        error: e as ApolloError,
        onFailure: onError,
      });
    }
  };

  return {
    onAuthMutation,
    isLoading: loading,
  };
};
