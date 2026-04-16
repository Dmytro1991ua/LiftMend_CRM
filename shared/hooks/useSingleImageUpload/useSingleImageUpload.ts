import { useState } from 'react';

import { ApolloError } from '@apollo/client';

import { onHandleMutationErrors } from '../../utils';
import useMutationResultToasts from '../useMutationResultToasts';

import { UseSingleImageUpload, UseSingleImageUploadParams } from './types';
import { handleImageDrop } from './utils';

export const useSingleImageUpload = <TVariables>({
  mutationFn,
  successMessage,
  gqlErrorMessage,
  apolloErrorMessage,
}: UseSingleImageUploadParams<TVariables>): UseSingleImageUpload<TVariables> => {
  const { onError, onSuccess } = useMutationResultToasts();

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const onFileUpload = async (files: File[], getVariables: (file: File) => TVariables) => {
    try {
      const file = await handleImageDrop({
        files,
        onSetPreviewImage: setPreviewImage,
        onError,
      });

      if (!file) return;

      const result = await mutationFn({
        variables: getVariables(file),
      });

      const hasErrors = !!result.errors?.length;

      if (hasErrors) {
        onHandleMutationErrors({
          message: gqlErrorMessage,
          errors: result.errors,
          onFailure: onError,
        });
      } else {
        onSuccess(successMessage);
      }
    } catch (e) {
      onHandleMutationErrors({
        message: apolloErrorMessage,
        error: e as ApolloError,
        onFailure: onError,
      });
    }
  };

  return {
    previewImage,
    onFileUpload,
  };
};
