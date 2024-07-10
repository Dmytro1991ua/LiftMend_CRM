import { Hourglass } from 'react-loader-spinner';

import BaseAlert from '../base-alert/BaseAlert';

import { DEFAULT_EMPTY_TABLE_MESSAGE, DEFAULT_TABLE_ERROR_TITLE, TableState, TableStatus } from './types';

export const getTableStatusMod = (empty: boolean, loading?: boolean, errorMessage?: string): TableState => {
  if (loading) return TableStatus.Loading;
  if (errorMessage) return TableStatus.Error;
  if (empty) return TableStatus.Empty;

  return null;
};

export const getTableStatusContent = (
  emptyTableMessage?: string,
  errorMessage?: string
): Record<TableStatus, React.JSX.Element> => {
  return {
    [TableStatus.Loading]: (
      <div className='flex items-center justify-center'>
        <Hourglass
          ariaLabel='hourglass-loading'
          colors={['#306cce', '#72a1ed']}
          height='50'
          visible={true}
          width='50'
        />
      </div>
    ),
    [TableStatus.Error]: (
      <BaseAlert
        className='flex gap-2 w-[40rem] mx-auto'
        description={errorMessage}
        title={DEFAULT_TABLE_ERROR_TITLE}
        variant='destructive'
      />
    ),
    [TableStatus.Empty]: <h3 className='text-link'>{emptyTableMessage || DEFAULT_EMPTY_TABLE_MESSAGE}</h3>,
  };
};
