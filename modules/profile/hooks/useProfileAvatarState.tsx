import { useState } from 'react';

import { ApolloError, useMutation } from '@apollo/client';

import { UPLOAD_PROFILE_PICTURE } from '@/graphql/schemas';
import {
  UploadProfilePictureMutation,
  UploadProfilePictureMutationVariables,
} from '@/graphql/types/client/generated_types';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';

import {
  UPLOAD_PROFILE_PICTURE_FAILED_APOLLO_MESSAGE,
  UPLOAD_PROFILE_PICTURE_FAILED_GQL_MESSAGE,
  UPLOAD_PROFILE_PICTURE_SUCCESS_MESSAGE,
} from '../constants';
import { handleImageDrop } from '../utils';
import { onHandleMutationErrors } from '@/shared/utils';

type UseProfileAvatarState = {
  previewImage: string | null;
  onImageUpload: (files: File[]) => Promise<void>;
  loading: boolean;
};

export const useProfileAvatarState = (): UseProfileAvatarState => {
  const { onError, onSuccess } = useMutationResultToasts();

  const [uploadProfilePicture, { loading }] = useMutation<
    UploadProfilePictureMutation,
    UploadProfilePictureMutationVariables
  >(UPLOAD_PROFILE_PICTURE, {
    update(cache, { data }) {
      if (!data) return;

      const { id, avatarUrl } = data.uploadProfilePicture;

      cache.modify({
        id: cache.identify({ __typename: 'AppUser', id }),
        fields: {
          avatarUrl: () => avatarUrl,
        },
      });
    },
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const onImageUpload = async (files: File[]) => {
    try {
      const file = await handleImageDrop({ files, onSetPreviewImage: setPreviewImage, onError });

      if (!file) return;

      const result = await uploadProfilePicture({ variables: { file } });

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
