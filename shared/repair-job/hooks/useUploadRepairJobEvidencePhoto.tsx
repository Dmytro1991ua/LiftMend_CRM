import { useMutation } from '@apollo/client';

import { UPLOAD_REPAIR_JOB_EVIDENCE_PHOTO } from '@/graphql/schemas/uploadRepairJobEvidencePhoto';
import {
  UploadRepairJobEvidencePhotoMutation,
  UploadRepairJobEvidencePhotoMutationVariables,
} from '@/graphql/types/client/generated_types';
import { useSingleImageUpload } from '@/shared/hooks/useSingleImageUpload';
import { UseSingleImageUpload } from '@/shared/hooks/useSingleImageUpload/types';

import {
  UPLOAD_REPAIR_JOB_EVIDENCE_PHOTO_FAILED_APOLLO_MESSAGE,
  UPLOAD_REPAIR_JOB_EVIDENCE_PHOTO_FAILED_GQL_MESSAGE,
  UPLOAD_REPAIR_JOB_EVIDENCE_PHOTO_SUCCESS_MESSAGE,
} from '../constants';

export const useUploadRepairJobEvidencePhoto =
  (): UseSingleImageUpload<UploadRepairJobEvidencePhotoMutationVariables> => {
    const [uploadRepairJobEvidencePhoto, { loading }] = useMutation<
      UploadRepairJobEvidencePhotoMutation,
      UploadRepairJobEvidencePhotoMutationVariables
    >(UPLOAD_REPAIR_JOB_EVIDENCE_PHOTO, {
      update(cache, { data }) {
        if (!data) return;

        const { id, afterPhotoUrl, beforePhotoUrl } = data.uploadRepairJobEvidencePhoto;

        cache.modify({
          id: cache.identify({ __typename: 'RepairJob', id }),
          fields: {
            afterPhotoUrl: () => afterPhotoUrl,
            beforePhotoUrl: () => beforePhotoUrl,
          },
        });
      },
    });

    const { previewImage, onFileUpload } = useSingleImageUpload<UploadRepairJobEvidencePhotoMutationVariables>({
      mutationFn: uploadRepairJobEvidencePhoto,
      successMessage: UPLOAD_REPAIR_JOB_EVIDENCE_PHOTO_SUCCESS_MESSAGE,
      gqlErrorMessage: UPLOAD_REPAIR_JOB_EVIDENCE_PHOTO_FAILED_GQL_MESSAGE,
      apolloErrorMessage: UPLOAD_REPAIR_JOB_EVIDENCE_PHOTO_FAILED_APOLLO_MESSAGE,
    });

    return {
      previewImage,
      onFileUpload,
      loading,
    };
  };
