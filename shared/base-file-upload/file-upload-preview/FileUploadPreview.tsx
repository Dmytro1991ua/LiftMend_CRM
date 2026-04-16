import React from 'react';

import FileUploadActionsOverlay from './file-upload-actions-overlay';
import FileUploadPlaceholder from './file-upload-placeholder';
import { FileUploadPreviewProps } from './types';

const FileUploadPreview = ({ previewImage, onRemove }: FileUploadPreviewProps) => {
  if (!previewImage) {
    return <FileUploadPlaceholder />;
  }

  return (
    <div className='relative group w-full h-80 border rounded-lg overflow-hidden'>
      <img alt='Preview' className='w-full h-full object-contain' src={previewImage} />
      <FileUploadActionsOverlay onRemove={onRemove} />
    </div>
  );
};

export default FileUploadPreview;
