import { Audio } from 'react-loader-spinner';

import BaseAlert from '@/shared/base-alert/BaseAlert';
import { DataLoadStatus } from '@/shared/types';

import { DEFAULT_EMPTY_NOTIFICATION_PAGE_MESSAGE, DEFAULT_ERROR_RESPONSE_MESSAGE } from './constants';

export const getNotificationsLoadStatusView = ({
  errorMessage,
}: {
  errorMessage?: string;
}): Record<DataLoadStatus, JSX.Element> => ({
  [DataLoadStatus.Loading]: (
    <div className='h-dvh flex items-center justify-center'>
      <Audio visible ariaLabel='bars-loading' color='#2563eb' height={80} width={80} />
    </div>
  ),
  [DataLoadStatus.Error]: (
    <div className='h-dvh flex items-center justify-center'>
      <BaseAlert
        className='w-[80rem] mx-auto'
        description={errorMessage}
        title={DEFAULT_ERROR_RESPONSE_MESSAGE}
        variant='destructive'
      />
    </div>
  ),

  [DataLoadStatus.Empty]: (
    <p className='flex flex-col items-center justify-center h-dvh text-center text-gray-500 text-xl font-bold'>
      {DEFAULT_EMPTY_NOTIFICATION_PAGE_MESSAGE}
    </p>
  ),
});
