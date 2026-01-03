import { Audio } from 'react-loader-spinner';

import BaseAlert from './base-alert/BaseAlert';
import { DataLoadStatus } from './types';

export const getDataLoadStatusView = ({
  errorMessage,
  errorTitle,
  emptyStateMessage,
}: {
  errorTitle: string;
  emptyStateMessage: string;
  errorMessage?: string;
}): Record<DataLoadStatus, JSX.Element> => ({
  [DataLoadStatus.Loading]: (
    <div className='h-dvh flex items-center justify-center'>
      <Audio visible ariaLabel='bars-loading' color='#2563eb' height={80} width={80} />
    </div>
  ),
  [DataLoadStatus.Error]: (
    <div className='h-dvh flex items-center justify-center'>
      <BaseAlert className='w-[80rem] mx-auto' description={errorMessage} title={errorTitle} variant='destructive' />
    </div>
  ),
  [DataLoadStatus.Empty]: (
    <p className='flex flex-col items-center justify-center h-dvh text-center text-gray-500 text-xl font-bold'>
      {emptyStateMessage}
    </p>
  ),
});
