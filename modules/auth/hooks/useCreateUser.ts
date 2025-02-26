import { ApolloError, useMutation } from '@apollo/client';

import { onHandleMutationErrors } from '@/graphql';
import { CREATE_USER } from '@/graphql/schemas/createUser';
import { CreateUserMutation, CreateUserMutationVariables } from '@/graphql/types/client/generated_types';
import { AppRoutes } from '@/types/enums';

import { DEFAULT_USER_CREATION_FAIL_MESSAGE, DEFAULT_USER_CREATION_SUCCESS_MESSAGE } from '../constants';
import { SignUpFromFields } from '../sign-up-form/validation';

type UseCreateUserProps = {
  onSuccess?: (message: string) => void;
  onError?: (errorMessage: string, errorDescription: string) => void;
};

type UseCreateUser = {
  isLoading: boolean;
  onCreateUser: (formFields: SignUpFromFields) => Promise<void>;
};

export const useCreateUser = ({ onError, onSuccess }: UseCreateUserProps): UseCreateUser => {
  const [createUser, { loading }] = useMutation<CreateUserMutation, CreateUserMutationVariables>(CREATE_USER);

  const onCreateUser = async (formFields: SignUpFromFields): Promise<void> => {
    try {
      const { email, password, phoneNumber, firstName, lastName } = formFields;

      const newUserPayload = {
        email,
        password,
        firstName,
        lastName,
        phone: phoneNumber,
      };

      const result = await createUser({
        variables: {
          input: { ...newUserPayload, redirectTo: `${process.env.NEXT_PUBLIC_GRAPHQL_API_URL}${AppRoutes.SignIn}` },
        },
      });

      const hasErrors = !!result.errors?.length;

      if (hasErrors) {
        onHandleMutationErrors({
          message: DEFAULT_USER_CREATION_FAIL_MESSAGE,
          errors: result.errors,
          onFailure: onError,
        });
      } else {
        onSuccess?.(DEFAULT_USER_CREATION_SUCCESS_MESSAGE);
      }
    } catch (e) {
      onHandleMutationErrors({
        message: DEFAULT_USER_CREATION_FAIL_MESSAGE,
        error: e as ApolloError,
        onFailure: onError,
      });
    }
  };

  return {
    onCreateUser,
    isLoading: loading,
  };
};
