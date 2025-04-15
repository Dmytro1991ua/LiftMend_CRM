import { ApolloError, useMutation } from '@apollo/client';

import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';

import { UPDATE_PROFILE } from '../../../graphql/schemas/updateProfile';
import { UpdateProfileMutation, UpdateProfileMutationVariables } from '../../../graphql/types/client/generated_types';
import { onHandleMutationErrors } from '../../../graphql/utils';
import { DEFAULT_UPDATE_PROFILE_FAIL_MESSAGE, DEFAULT_UPDATE_PROFILE_SUCCESS_MESSAGE } from '../constants';
import { ProfileContentFormFields } from '../validation';

type UseUpdateProfileResult = {
  isLoading: boolean;
  onUpdateProfile: (formFields: ProfileContentFormFields, userId?: string) => Promise<void>;
};

export const useUpdateProfile = (): UseUpdateProfileResult => {
  const { onError, onSuccess } = useMutationResultToasts();

  const [updateProfile, { loading }] = useMutation<UpdateProfileMutation, UpdateProfileMutationVariables>(
    UPDATE_PROFILE,
    {
      update(cache, { data }) {
        if (!data) return;

        const { id, firstName, lastName, phone } = data.updateUserProfile;

        cache.modify({
          id: cache.identify({ __typename: 'AppUser', id }),
          fields: {
            firstName: () => firstName,
            lastName: () => lastName,
            phone: () => phone,
          },
        });
      },
    }
  );

  const onUpdateProfile = async (formFields: ProfileContentFormFields, userId?: string) => {
    const { firstName, lastName, phoneNumber, newPassword } = formFields;

    try {
      const result = await updateProfile({
        variables: {
          input: {
            id: userId ?? '',
            firstName,
            lastName,
            phone: phoneNumber,
            password: newPassword,
          },
        },
      });

      const hasErrors = !!result.errors?.length;
      if (hasErrors) {
        onHandleMutationErrors({
          message: DEFAULT_UPDATE_PROFILE_FAIL_MESSAGE,
          errors: result.errors,
          onFailure: onError,
        });
      } else {
        onSuccess(DEFAULT_UPDATE_PROFILE_SUCCESS_MESSAGE);
      }
    } catch (error) {
      onHandleMutationErrors({
        message: DEFAULT_UPDATE_PROFILE_FAIL_MESSAGE,
        error: error as ApolloError,
        onFailure: onError,
      });
    }
  };

  return {
    isLoading: loading,
    onUpdateProfile,
  };
};
