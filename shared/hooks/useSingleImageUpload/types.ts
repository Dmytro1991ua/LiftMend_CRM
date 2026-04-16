import { GraphQLError } from 'graphql';

export type Dimensions = {
  width: number;
  height: number;
};

export type ResizeImageParams = {
  file: File;
  width: number;
  height: number;
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
};

type MutationResult = {
  errors?: readonly GraphQLError[];
};

export type UseSingleImageUploadParams<TVariables> = {
  mutationFn: (options: { variables: TVariables }) => Promise<MutationResult>;
  successMessage: string;
  gqlErrorMessage: string;
  apolloErrorMessage: string;
};

export type UseSingleImageUpload<T> = {
  previewImage: string | null;
  onFileUpload: (files: File[], getVariables: (file: File) => T) => Promise<void>;
  loading?: boolean;
};
