import { ReactNode } from 'react';

import { Accept, useDropzone } from 'react-dropzone';

import { cn } from '@/lib/utils';

import { ACCEPTABLE_FILE_IMAGE_TYPES } from '../hooks/useSingleImageUpload/constants';

export type FileDropzoneProps = {
  onFileUpload: (files: File[]) => Promise<void> | void;
  children?: ReactNode;
  className?: string;
  tooltip?: string;
  testId?: string;
  acceptTypes?: Accept;
  isMultipleUpload?: boolean;
  isUploadDisabled?: boolean;
};

const FileDropzone = ({
  children,
  className,
  tooltip,
  testId = 'file-dropzone',
  acceptTypes = ACCEPTABLE_FILE_IMAGE_TYPES,
  isMultipleUpload = false,
  isUploadDisabled = false,
  onFileUpload,
}: FileDropzoneProps) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onFileUpload,
    multiple: isMultipleUpload,
    accept: acceptTypes,
    disabled: isUploadDisabled,
  });

  return (
    <div
      {...getRootProps()}
      className={cn('cursor-pointer outline-none', className)}
      data-testid={testId}
      title={tooltip}
    >
      <input data-testid='file-dropzone-input' {...getInputProps()} />
      {children}
    </div>
  );
};

export default FileDropzone;
