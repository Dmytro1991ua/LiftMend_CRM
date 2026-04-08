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
  getVariables: (file: File) => TVariables;
  successMessage: string;
  gqlErrorMessage: string;
  apolloErrorMessage: string;
};

export type UseSingleImageUpload = {
  previewImage: string | null;
  onImageUpload: (files: File[]) => Promise<void>;
  loading?: boolean;
};
