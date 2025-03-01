import { CREATE_USER } from '@/graphql/schemas/createUser';
import { LOGIN_USER } from '@/graphql/schemas/loginUser';
import {
  CreateUserMutation,
  CreateUserMutationVariables,
  LoginUserMutation,
  LoginUserMutationVariables,
} from '@/graphql/types/client/generated_types';
import {
  DEFAULT_USER_CREATION_FAIL_MESSAGE,
  DEFAULT_USER_CREATION_SUCCESS_MESSAGE,
  DEFAULT_USER_LOGIN_FAIL_MESSAGE,
  DEFAULT_USER_LOGIN_SUCCESS_MESSAGE,
} from '../constants';
import { AuthHookProps } from '../types';
import { ApolloError, useMutation } from '@apollo/client';
import { onHandleMutationErrors } from '@/graphql';

// TODO: Extend with | 'FORGOT_PASSWORD' | 'RESET_PASSWORD'; when it is ready
/**
 *   FORGOT_PASSWORD: {
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
 */
type AuthMutations = {
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
};

// TODO: Extend with | 'FORGOT_PASSWORD' | 'RESET_PASSWORD'; when it is ready
/**
 *  FORGOT_PASSWORD: {
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
 */
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
};

type UseAuthMutation<T extends keyof AuthMutations> = {
  isLoading: boolean;
  onAuthMutation: (variables: AuthMutations[T]['variables']) => Promise<void>;
};

export const useAuthMutation = <T extends keyof AuthMutations>({
  action,
  onError,
  onSuccess,
  onRedirect,
}: AuthHookProps): UseAuthMutation<T> => {
  const { schema, successMessage, failureMessage } = authMutations[action];

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
      }
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
