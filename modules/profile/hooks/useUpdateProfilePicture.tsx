import { useMutation } from '@apollo/client';

import { UPLOAD_PROFILE_PICTURE } from '@/graphql/schemas';
import {
  UploadProfilePictureMutation,
  UploadProfilePictureMutationVariables,
} from '@/graphql/types/client/generated_types';
import { useSingleImageUpload } from '@/shared/hooks/useSingleImageUpload';
import { UseSingleImageUpload } from '@/shared/hooks/useSingleImageUpload/types';

import {
  UPLOAD_PROFILE_PICTURE_FAILED_APOLLO_MESSAGE,
  UPLOAD_PROFILE_PICTURE_FAILED_GQL_MESSAGE,
  UPLOAD_PROFILE_PICTURE_SUCCESS_MESSAGE,
} from '../constants';

export const useUpdateProfilePicture = (): UseSingleImageUpload => {
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

  const { previewImage, onImageUpload } = useSingleImageUpload<UploadProfilePictureMutationVariables>({
    mutationFn: uploadProfilePicture,
    getVariables: (file) => ({ file }),
    successMessage: UPLOAD_PROFILE_PICTURE_SUCCESS_MESSAGE,
    gqlErrorMessage: UPLOAD_PROFILE_PICTURE_FAILED_GQL_MESSAGE,
    apolloErrorMessage: UPLOAD_PROFILE_PICTURE_FAILED_APOLLO_MESSAGE,
  });

  return {
    previewImage,
    onImageUpload,
    loading,
  };
};
