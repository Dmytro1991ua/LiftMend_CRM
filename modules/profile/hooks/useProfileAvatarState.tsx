import { useState } from 'react';

import { ApolloError, ApolloQueryResult, useMutation } from '@apollo/client';

import { UPLOAD_PROFILE_PICTURE } from '@/graphql/schemas';
import {
  GetUserQuery,
  GetUserQueryVariables,
  UploadProfilePictureMutation,
  UploadProfilePictureMutationVariables,
} from '@/graphql/types/client/generated_types';
import { onHandleMutationErrors } from '@/graphql/utils';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';

import {
  UPLOAD_PROFILE_PICTURE_FAILED_APOLLO_MESSAGE,
  UPLOAD_PROFILE_PICTURE_FAILED_GQL_MESSAGE,
  UPLOAD_PROFILE_PICTURE_SUCCESS_MESSAGE,
} from '../constants';
import { handleImageDrop } from '../utils';

type UseProfileAvatarStateProps = {
  refetch: (variables?: Partial<GetUserQueryVariables>) => Promise<ApolloQueryResult<GetUserQuery>>;
};

type UseProfileAvatarState = {
  previewImage: string | null;
  onImageUpload: (files: File[]) => Promise<void>;
  loading: boolean;
};

export const useProfileAvatarState = ({ refetch }: UseProfileAvatarStateProps): UseProfileAvatarState => {
  const { onError, onSuccess } = useMutationResultToasts();

  const [uploadProfilePicture, { loading }] = useMutation<
    UploadProfilePictureMutation,
    UploadProfilePictureMutationVariables
  >(UPLOAD_PROFILE_PICTURE);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const onImageUpload = async (files: File[]) => {
    try {
      const file = await handleImageDrop({ files, onSetPreviewImage: setPreviewImage, onError });

      if (!file) return;

      const result = await uploadProfilePicture({ variables: { file } });

      await refetch();

      const hasErrors = !!result.errors?.length;

      if (hasErrors) {
        onHandleMutationErrors({
          message: UPLOAD_PROFILE_PICTURE_FAILED_GQL_MESSAGE,
          errors: result.errors,
          onFailure: onError,
        });
      } else {
        onSuccess(UPLOAD_PROFILE_PICTURE_SUCCESS_MESSAGE);
      }
    } catch (e) {
      onHandleMutationErrors({
        message: UPLOAD_PROFILE_PICTURE_FAILED_APOLLO_MESSAGE,
        error: e as ApolloError,
        onFailure: onError,
      });
    }
  };

  return {
    previewImage,
    onImageUpload,
    loading,
  };
};
