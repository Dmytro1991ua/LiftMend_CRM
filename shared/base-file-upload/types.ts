import { ReactNode } from 'react';

import { Accept } from 'react-dropzone/.';

export type BaseFileUploadProps = {
  onFileUpload: (files: File[]) => Promise<void> | void;
  children?: ReactNode;
  className?: string;
  tooltip?: string;
  testId?: string;
  acceptTypes?: Accept;
  isMultipleUpload?: boolean;
  isUploadDisabled?: boolean;
};
