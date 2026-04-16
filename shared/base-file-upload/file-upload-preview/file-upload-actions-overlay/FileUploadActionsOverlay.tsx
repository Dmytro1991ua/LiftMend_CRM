import BaseButton from '@/shared/base-button';

import { FileUploadPreviewProps } from '../types';

const FileUploadActionsOverlay = ({ onRemove }: Pick<FileUploadPreviewProps, 'onRemove'>) => {
  return (
    <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2'>
      <span className='text-white text-sm font-medium'>Change Photo</span>
      <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
        <BaseButton
          className='hover:bg-destructive px-3 [&_span]:ml-0'
          label='Remove'
          variant='destructive'
          onClick={onRemove}
        />
      </div>
    </div>
  );
};

export default FileUploadActionsOverlay;
